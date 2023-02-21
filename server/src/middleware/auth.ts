import { Response, NextFunction } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { APP_SECRET } from "../config";
import { UserAttribute, UserInstance,AdminAttribute, AdminInstance } from "../Model";



export const auth = async (req: JwtPayload, res: Response, next:NextFunction) => {
    try {
      const authorization = req.headers.authorization;
      if(!authorization){
        return res.status(401).json({
          Error: "Kindly login"
        })
      }
      //Bearer token
      const token = authorization.slice(7, authorization.length);
    let verified = verify(token, APP_SECRET );
      if(!verified){
          return res.status(401).json({
              Error: "Unauthorized access"
          })
      }
   const {id} = verified as {[Key:string]: string};
   // find user by Id
   const user = await UserInstance.findOne({
      where: {id:id} 
  }) as unknown as UserAttribute;
  if(!user){
      return res.status(401).json({
          Error: "Unauthorized access"
      })
  }
  req.user = verified;
  next()
    } catch (err) {
      res.status(401).json({ msg: "Unauthorized" });
    }
  }


  export const authAdmin = async (req: JwtPayload, res: Response, next:NextFunction) => {
    try {
      const authorization = req.headers.authorization;
      if(!authorization){
        return res.status(401).json({
          Error: "Kindly login"
        })
      }
      //Bearer token
      const token = authorization.slice(7, authorization.length);
    let verified = verify(token, APP_SECRET );
      if(!verified){
          return res.status(401).json({
              Error: "Unauthorized access"
          })
      }
   const {id} = verified as {[Key:string]: string};
   // find user by Id
   const user = await AdminInstance.findOne({
      where: {id:id} 
  }) as unknown as AdminAttribute;
  if(!user){
      return res.status(401).json({
          Error: "Unauthorized access"
      })
  }
  req.admin = verified;
  next()
    } catch (err) {
      res.status(401).json({ msg: "Unauthorized" });
    }
  }