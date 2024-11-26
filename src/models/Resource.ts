import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/db";
import { User } from "./User";

export class Resource extends Model {}

Resource.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    resource_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiration_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    access_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_expired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Resource",
    timestamps: false,
    indexes: [
      {
        name: "idx_user_expiration",
        fields: ["user_id", "expiration_time"], // Index on user_id and expiration_time to optimize query resources based
      },
    ],
  }
);
