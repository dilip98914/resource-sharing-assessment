import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();
const DATABASE = process.env.DATABASE!;
const USERNAME = process.env.USERNAME!;
const PASSWORD = process.env.PASSWORD!;

const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

async function connectToDB() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  } finally {
    await sequelize.close();
  }
}

connectToDB();

export default sequelize;
