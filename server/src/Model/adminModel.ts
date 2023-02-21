import { db } from "../config";
import { DataTypes,Model } from "sequelize";
import { PostInstance } from "./postModel";


export interface AdminAttribute{
    id:string;
    phone:string;
    userName: string;
    password:string;
    address:string;
    postId:string;
    email:string;
    salt:string;
    otp: number;
    otp_expiry:Date;
    verified:boolean;
    image:string;
    role:string;

}

export class AdminInstance extends Model<AdminAttribute>{}

AdminInstance.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      postId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userName:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      role:{
        type: DataTypes.STRING,
        allowNull: true,
      },
     
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please input phone number",
          },
        },
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: "Email address is required",
          },
          isEmail: {
            msg: "Please provide a valid email",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please input password",
          },
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      otp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "otp required",
          },
        },
      },
      otp_expiry: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
              msg: "Otp expired"
          },
          notEmpty: {
              msg: "provide an Otp"
          },
        }
      },
      verified:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        validate:{
            notNull:{
                msg:"user must be verified"
            },
            notEmpty:{
                msg:"User not verified"
            }
        }
    },
},{
    sequelize:db,
    tableName:"admin"
})

AdminInstance.hasMany(PostInstance, {foreignKey:'adminId', as:'post'});
PostInstance.belongsTo(AdminInstance, {foreignKey:'adminId', as:'admin' } );