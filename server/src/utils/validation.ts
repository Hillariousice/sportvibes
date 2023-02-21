import Joi from "joi";
import {hash,genSalt} from "bcryptjs";
import {JwtPayload, sign,verify} from 'jsonwebtoken'
import dotenv from "dotenv";
import { APP_SECRET } from "../config";
import { AuthPayload } from "../interface/AuthPayload";
dotenv.config();

export const registerSchema = Joi.object().keys({
    interest: Joi.string(),
    email: Joi.string().required(),
    password: Joi.string().regex(/^[a-z0-9]{3,30}$/),
    phone: Joi.string(),
    confirm_password: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("Confirm password")
      .messages({ "any.only": "{{#label}} does not match" }),

  });
  export const editProfileSchema = Joi.object().keys({
    userName: Joi.string(),
    phone: Joi.string(),
    fullName: Joi.string(),
    address: Joi.string(),
    email: Joi.string(),
    image: Joi.string()
  });

export const loginSchema =Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().pattern(new RegExp('^[A-Za-z0-9]{3,30}$')),
  
})

  export const GenerateSalt = async()=>{
    return await genSalt()
  }

  export const GeneratePassword = async(password:string,salt:string)=>{
    return await hash(password, salt)
  }


export const GenerateSignature = async (payload: AuthPayload) => {
  return sign(payload, APP_SECRET, { expiresIn: "1d" });
};
//GENERATE TOKEN FOR A USER
export const verifySignature = async (signature: string) => {
  return verify(signature, APP_SECRET) as JwtPayload;
};

export const validatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};
export const forgotPasswordSchema = Joi.object().keys({
  email:Joi.string().required()
})
export const resetPasswordSchema = Joi.object().keys({
  password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/),
  //.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  confirm_password: Joi.any().equal(Joi.ref('password')).required().label('confirm password')
})

export const option = {
  abortEarly:false,
  errors:{
      wrap:{
          label:''
      }
  }

}

/**================Admin ===============**/
export const adminSchema =Joi.object().keys({
  phone: Joi.string().required(),
  image: Joi.string(),
  userName: Joi.string().required(),
  password: Joi.string().pattern(new RegExp('^[A-Za-z0-9]{3,30}$')),
  address: Joi.string(),
  email: Joi.string().required()
})