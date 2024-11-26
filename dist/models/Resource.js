"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resource = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../utils/db"));
const User_1 = require("./User");
class Resource extends sequelize_1.Model {
}
exports.Resource = Resource;
Resource.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User_1.User,
            key: "id",
        },
    },
    resource_url: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    expiration_time: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    access_token: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    is_expired: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize: db_1.default,
    modelName: "Resource",
    timestamps: false,
    indexes: [
        {
            name: "idx_user_expiration",
            fields: ["user_id", "expiration_time"], // Index on user_id and expiration_time to optimize query resources based
        },
    ],
});
