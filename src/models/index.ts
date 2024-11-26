import { User } from "./User";
import { Resource } from "./Resource";

User.hasMany(Resource, { foreignKey: "user_id" });
Resource.belongsTo(User, { foreignKey: "user_id" });

export { User, Resource };
