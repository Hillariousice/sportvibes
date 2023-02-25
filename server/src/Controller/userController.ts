import express ,{Request,Response} from 'express'
import { UserAttribute,UserInstance } from '../Model/userModel'
import { editProfileSchema, forgotPasswordSchema, GeneratePassword, GenerateSalt, GenerateSignature, loginSchema, option, registerSchema, resetPasswordSchema, validatePassword, verifySignature } from '../utils/validation';
import {v4 as uuidv4} from 'uuid'
import { emailHtml, emailHtml2, GenerateOTP, mailSent2, onRequestOTP } from '../utils/notification';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { APP_SECRET, Base_Url, FromAdminMail, userSubject } from '../config';
import { hash } from 'bcryptjs';
import { PostAttribute, PostInstance } from '../Model';


//Registry
  export const Register = async(req:Request,res:Response) =>{
    try{
      const {interest,email, phone, password, confirm_password} = req.body;
      const uuiduser = uuidv4()
  
      const validateResult = registerSchema.validate(req.body,option)
      if(validateResult.error){
        return res.status(400).json({
          Error:validateResult.error.details[0].message
        })
      }
      //Generate Salt
      const salt = await GenerateSalt()
      const userPassword = await GeneratePassword(password,salt)
      
      
      //Generate OTP
      const {otp,expiry} = GenerateOTP()
      
      //check if user exist
      const User = await UserInstance.findOne({where:{email:email}}) 
      
      //Create User
      if(!User){
        let user= await UserInstance.create({
          id: uuiduser,
          userName:"",
          phone,
          email,
          password: userPassword,
          salt: salt,
          address: "",
          otp,
          otp_expiry: expiry,
          interest,
          verified: false,
          image:'',
          role:'user'
        })
        
        
      //Send OTP to user
      // await onRequestOTP(otp,phone);
  
      // //Send Email 
      const html = emailHtml(otp)
      await mailSent2(FromAdminMail, email, userSubject, html)
      
      //check if user exists(where you give the user identity)
      const User = await UserInstance.findOne({where:{email:email}}) as unknown as UserAttribute
      
      //Generate Signature for user
      let signature= await GenerateSignature({
        id:User.id,
        email:User.email,
        verified:User.verified
  
      })
      console.log(signature)
  
       return res.status(201).json({
        message:'User created successfully check email or phone for OTP verification', 
        signature,
        verified:User.verified,
  
  
      })
    }
      return res.status(400).json({
       Error:'User already exists'
    })
  
   }catch(err){
    console.log(err)
    res.status(500).json({
      Error:"Internal server Error",
      route:"/users/signup"
    })
   }
  }

  /** =============== Verify Users =============== **/
export const verifyUser = async(req:Request,res:Response)=>{
  try{
  
    const token = req.params.signature

     const decode = await verifySignature(token)
     console.log(decode)
 
    //check if user exists(where you give the user identity)
    const User = await UserInstance.findOne({where:{email:decode.email}}) as unknown as UserAttribute
      
    if(User){
        const { otp } = req.body
        if(User.otp === parseInt(otp) && User.otp_expiry >= new Date()){
          const updatedUser = await UserInstance.update({
            verified:true,
          },{where:{email:decode.email}}) as unknown as UserAttribute
          console.log(updatedUser)
         
            //Regenerate a new signature
        let signature= await GenerateSignature({
          id:updatedUser.id,
          email:updatedUser.email,
          verified:updatedUser.verified
    
        })
        if(updatedUser){
          const User = await UserInstance.findOne({where:{email:decode.email}}) as unknown as UserAttribute
      
          return res.status(200).json({
            message:'You have successfully verified your account',
            signature,
            verified:User.verified
           })  
        }  
      }
    }
        return res.status(400).json({
          Error:'OTP is invalid or expired'
        })

  }catch(err){
    console.log(err)
    res.status(500).json({
      Error:"Internal server Error",
    route:"/users/verify-user"
    });
  }
}

/** =============== Resend OTP =============== **/
export const resendOTP = async(req:Request,res:Response)=>{
  try{
  
    const token = req.params.signature

     const decode = await verifySignature(token)
     
     
     const User = await UserInstance.findOne({where:{email:decode.email}}) as unknown as UserAttribute
     if(User){
       
       //Generate OTP
       const {otp,expiry} = GenerateOTP()
       console.log({otp,expiry})
       const updatedUser = await UserInstance.update({
         otp,
         otp_expiry:expiry
        },{where:{email:decode.email}}) as unknown as UserAttribute
      if(updatedUser){
        const User = await UserInstance.findOne({where:{email:decode.email}}) as unknown as UserAttribute
          //Send OTP to user
    // await onRequestOTP(otp,User.phone);
     //Send Email 
     const html = emailHtml(otp)
     await mailSent2(FromAdminMail, User.email, userSubject, html);

     return res.status(200).json({
      message:"OTP resend to registered phone number and email"
     })
      }
      }
      return res.status(400).json({
        Error:'Error sending OTP'
      })

  }catch(err){
   return res.status(500).json({
      Error:"Internal server Error",
    route:"/users/resend-otp/:signature"
    });
  }
}
  
//Login
  export const Login = async(req:Request,res:Response) =>{
    try{
      const { email, password } = req.body;
    
      // validate login
      const validateResult = loginSchema.validate(req.body,option)
      if(validateResult.error){
        return res.status(400).json({
          Error: validateResult.error.details[0].message,
        });
      }
  console.log(validateResult)
      //check if the user exist
      const User = await UserInstance.findOne({where:{email:email}}) as unknown as UserAttribute
      console.log(User)
      if(User.verified === true){
       const validation = await validatePassword(password,User.password,User.salt)
       if(validation) {
  
        //Generate signature for user
        let signature= await GenerateSignature({
          id:User.id,
          email:User.email,
          verified:User.verified
    
        })
        console.log(signature)
       return res.status(200).json({
        message:"You have successfully login",  
         signature,
          email:User.email,
          verified:User.verified,
        })
      }
      }
  
      return res.status(400).json({
        Error:'Wrong Username or Password or not a verified user'
      })
  
   }catch(err){
    console.log(err)
    res.status(500).json({
      Error:"Internal server Error",
      route:"/users/login"
    });
   }
  };
  /** =============== PROFILE =============== **/

export const getAllUsers = async(req:Request,res:Response) =>{
  try{
   const limit = req.query.limit as number | undefined
   const users = await UserInstance.findAndCountAll({
       limit:limit
   })
   return res.status(200).json({
     message:"You have successfully retrieved",
     Count:users.count,
     Users:users.rows
   })
 }catch(err){
  console.log(err)
  return res.status(500).json({
     Error:"Internal server Error",
   route:"/users/get-all-users"
   });
 }
 }

  //Update User Password
  export const UpdateUserProfile = async (req: JwtPayload, res: Response) => {
    try {
      const token = req.params.id
      const { id } = await verifySignature(token) 
      const { userName,image,address,interest, phone, email } = req.body;
      
      //validate profile
      console.log("This is the token", token)
      const validateResult = editProfileSchema.validate(req.body, option);
      if (validateResult.error) {
        return res.status(400).json({
          Error: validateResult.error.details[0].message,
        });
      }


      //find if user exist
      const User = (await UserInstance.findOne({
        where: { id: id },
      })) as unknown as UserAttribute;
      if (!User) {
        return res.status(400).json({
          Error: "You are not authorized to update user",
        });
      }
      const newUser = (await UserInstance.update(
        {
         userName,
         image:req.file.path,
         address,
         interest,
          phone,
          email,
        },
        { where: { id: id } }
      )) as unknown as UserAttribute;
      if (newUser) {
        const User = (await UserInstance.findOne({
          where: { id: id },
        })) as unknown as UserAttribute;
        return res.status(200).json({
          message: "Profile updated successfully",
          User,
        });
      }
      return res.status(400).json({
        Error: "User does not exist",
      });
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        Error: "Internal Server Error",
        route: "./users/update-profile/:id",
      });
    }
  };

  // ForgotPassword
  export const forgotPassword = async (req: Request, res: Response) => {
    try {
      console.log(req.body);
      const { email } = req.body;

      // validate forgotpassword
      const validateResult = forgotPasswordSchema.validate(req.body, option);
      if (validateResult.error) {
        return res.status(400).json({
          Error: validateResult.error.details[0].message,
        });
      }
      //check if the User exist
      const oldUser = (await UserInstance.findOne({
        where: { email: email },
      })) as unknown as UserAttribute;
  
    
      if (oldUser) {
        const secret = APP_SECRET + oldUser.password;
        const token = sign({ email: oldUser.email, id: oldUser.id }, secret, {
          expiresIn: "10m",
        });
       
        // creating link to send to the user
        const link = `${Base_Url}/users/resetpassword/${oldUser.id}`;
        if (token) {
          const html = emailHtml2(link);
          await mailSent2(FromAdminMail, oldUser.email, userSubject, html);
          return res.status(200).json({
            message: "password reset link sent to email",
            link,
          });
        }
        return res.status(400).json({
          Error: "Invalid credentials",
        });
      } 
      return res.status(400).json({
        message: "email not found",
      });
    } catch (err) {
      console.log(err)
      res.status(500).json({
        Error: "Internal server Error",
        route: "/users/forgotpasswordd",
      });
    }
  };


  // Reset Password
  export const resetPasswordGet = async (req: Request, res: Response) => {
    const { id, token } = req.params;

    //
    const oldUser = (await UserInstance.findOne({
      where: { id: id },
    })) as unknown as UserAttribute;
    if (!oldUser) {
      return res.status(400).json({
        message: "User Does Not Exist",
      });
    }
    const secret = APP_SECRET + oldUser.password;
    try {
      const verifyPass = verify(token, secret);
      return res.status(200).json({
        email: oldUser.email,
        verifyPass,
      });
    } catch (err) {
      console.log(err)
      res.send("Not Verified");
    }
  };
  export const resetPasswordPost = async (req: JwtPayload, res: Response) => {
    const { id } = req.params;
    const { password } = req.body;
    const oldUser = (await UserInstance.findOne({
      where: { id: id },
    })) as unknown as UserAttribute;
    const validateResult = resetPasswordSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }
    if (!oldUser) {
      return res.status(400).json({
        message: "user does not exist",
      });
    }
    const secret = APP_SECRET + oldUser.password;
    console.log("secret", secret);
    try {
     
      const encryptedPassword = await hash(password, oldUser.salt);
      console.log("password", password);
      const updatedPassword = (await UserInstance.update(
        {
          password: encryptedPassword,
        },
        { where: { id: id } }
      )) as unknown as UserAttribute;
  
      return res.status(200).json({
        message: "you have successfully changed your password",
        updatedPassword,
      });
    } catch (err) {
      console.log(err)
      res.status(500).json({
        Error: "Internal server Error",
        route: "/users/reset-password/:id/:token",
      });
    }
  };
  


 export const likePost = async(req:JwtPayload,res:Response)=>{
  try {
    const postId = req.params.id;
    const userId = req.body.userId;

    const post = await PostInstance.findOne({ where: { id: postId } }) as unknown as PostAttribute
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(userId)) {
      // If the user already liked the post, remove the like
      post.likes = post.likes.filter((id) => id !== userId);
    } else {
      // Otherwise, add the like
      post.likes.push(userId);
    }


    res.status(200).json({
      message: 'Post was updated successfully',
    
    });
 

  }catch(err){
    console.log(err)
      res.status(404).json({
          Error:"Internal server Error",
          route:"/users/:id/like"
      })
  }
}
  