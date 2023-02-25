import {Request,Response} from 'express'
import { adminSchema, GeneratePassword, GenerateSalt, GenerateSignature, option} from '../utils/validation';
import {GenerateOTP} from '../utils/notification'
import { AdminAttribute, AdminInstance,PostAttribute, PostInstance  } from '../Model';
import {v4 as uuidv4}from 'uuid'
import { JwtPayload } from 'jsonwebtoken';








/** =============== Super Admin =============== **/
export const  superAdmin = async(req:Request,res:Response)=>{
    try{
       
        const {email, phone, password, userName, address,image} = req.body;
        const uuidadmin = uuidv4()
    
        const validateResult = adminSchema.validate(req.body,option)
        if(validateResult.error){
          return res.status(400).json({
            Error:validateResult.error.details[0].message
          })
        }
    
        //Generate Salt
        const salt = await GenerateSalt()
        const adminPassword = await GeneratePassword(password,salt)
     
    
      //Generate OTP
      const {otp,expiry} = GenerateOTP()
    
      //check if admin exist
      const Admin = await AdminInstance.findOne({where:{email:email}}) as unknown as AdminAttribute
   

      //Create Admin
      if(!Admin){
       await AdminInstance.create({
        id:uuidadmin,
        email,
        password:adminPassword,
        userName,
        salt,
        address,
        postId:"",
        phone,
        otp,
        otp_expiry:expiry,
        image:"",
        verified:true,
        role:"superadmin"
        })
    
        
        //check if admin exists(where you give the admin identity)
        const Admin = await AdminInstance.findOne({where:{email:email}}) as unknown as AdminAttribute
          
        //Generate Signature for user
       let signature= await GenerateSignature({
          id:Admin.id,
          email:Admin.email,
          verified:Admin.verified
    
        })
    
         return res.status(201).json({
          message:'Admin created successfully', 
          signature,
          verified:Admin.verified
        })
      }
      return res.status(400).json({
        message:'Admin already exists'
      }) 
        
     }catch(err){
      console.log(err)
      res.status(500).json({
        Error:"Internal server Error",
        route:"/admins/create-super-admin"
      })
     }
}

 
/** ============== Create Post ============== **/
export const createPost = async(req:JwtPayload,res:Response)=>{
  try{
    const id = req.admin.id
    const {club,content,category,editor,description, image} = req.body
    const uuidpost = uuidv4()

    //check if admin exist
    const Post = await PostInstance.findOne({where:{category: category}}) as unknown as PostAttribute
  
    
    const Admin = await AdminInstance.findOne({where:{id:id}}) as unknown as AdminAttribute
     
    if(Admin.role === 'admin'|| Admin.role ==='superadmin')  {
        //Create Admin
    if(!Post){
      const createPost= await PostInstance.create({
         id:uuidpost,
         editor,
         club,
         description,
         userId:"",
         content,
         adminId:"",
         category,
         likes:[],
         comments:[],
         image:req.file.path
       })
        return res.status(201).json({
         message:'Post created successfully', 
         createPost
       })
     }
     return res.status(400).json({
      message:'Post already exists'
    }) 
      }  

    return res.status(400).json({
      message:'Unauthorized'
    }) 

  }catch(err){
    res.status(500).json({
      Error:"Internal server Error",
      route:"/admins/create-post"
    })
  }
}


/** ==============  Admin  Delete Post ============== **/
export const deletePost = async(req:JwtPayload,res:Response)=>{
    try{
      const id = req.admin.id;
      const postid = req.params.postid
      const Admin = await AdminInstance.findOne({where:{id:id}}) as unknown as AdminAttribute
  if(Admin){
   
     const deletedPost = await PostInstance.destroy({where:{id:postid}}) 
     return res.status(201).json({
      message:'Post deleted successfully', 
     deletedPost
    })
  
  }
    }catch(err){
      res.status(500).json({
        Error:"Internal server Error",
        route:"/admins/delete-post/postid"
      });
    }
  }



  /** ==============  Admin Update Post ============== **/
export const updatePost = async(req:JwtPayload,res:Response)=>{
    try{
      const id = req.admin.id;
      const postid = req.params.postid
       const {club,content,category,editor,description, image} = req.body
      const Admin = await AdminInstance.findOne({where:{id:id}}) as unknown as AdminAttribute
  if(Admin){
   const Post = await PostInstance.findOne({where:{id:postid}}) as unknown as PostAttribute
   if(Post){
    const updatePost = await PostInstance.update({club,content,category,editor,description, image:req.file.path
    },{where:{id:postid}}) 
    return res.status(201).json({
     message:'Post update successfully.', 
    updatePost
   })
   }
   return res.status(400).json({
    message:'Post not found.'
  }) 
  
  }
    }catch(err){
      res.status(500).json({
        Error:"Internal server Error",
        route:"/admins/update-post/:postid"
      });
    }
  }



  export const getFeedPosts = async(req:Request,res:Response)=>{
    try{
        const post = await PostInstance.findAll() as unknown as PostAttribute
        res.status(200).json({
            message:"Feeds was retrieved successfully",
           post})
    }catch(err){
        res.status(404).json({
            Error:"Internal server Error",
            route:"/admins/post"
        })
    }
}

 export const getAdminPosts =async(req:Request,res:Response)=>{
    try{
        const {postId}= req.params
        const Admin =await AdminInstance.findAll({where:{id:postId}}) as unknown as AdminAttribute
        res.status(200).json({
            message:"Feeds was retrieved successfully",
           Admin})
    }catch(err){
        res.status(404).json({
            Error:"Internal server Error",
            route:"/admins/:postId/posts"
        })
    }
 }


  
