"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resource = exports.User = void 0;
const User_1 = require("./User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
const Resource_1 = require("./Resource");
Object.defineProperty(exports, "Resource", { enumerable: true, get: function () { return Resource_1.Resource; } });
User_1.User.hasMany(Resource_1.Resource, { foreignKey: "user_id" });
Resource_1.Resource.belongsTo(User_1.User, { foreignKey: "user_id" });
