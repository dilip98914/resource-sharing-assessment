import cron from "node-cron";
import { Resource } from "../models/Resource";
import { Op } from "sequelize";

const markExpiredResources = async () => {
  await Resource.update(
    { is_expired: true },
    { where: { expiration_time: { [Op.lte]: new Date() }, is_expired: false } }
  );
};

cron.schedule("*/5 * * * *", markExpiredResources);
