import { db } from "../config";
import { ARRAY, BOOLEAN, DataTypes, Model } from "sequelize";

export interface PostAttribute {
  id: string;
  editor?: string;
  content?: string;
  club: string;
  description: string;
  userId: string;
  adminId: string;
  category?: string;
  image: string;
  likes: string[];
  comments: boolean[];
}

export class PostInstance extends Model<PostAttribute> {}

PostInstance.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    editor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    club: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    likes: {
      type: ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    adminId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    comments: {
      type: ARRAY(DataTypes.BOOLEAN),
      allowNull: true,
      defaultValue: [],
    },
  },
  {
    sequelize: db,
    tableName: "sport",
  }
);