import express from "express";
import dotenv from "dotenv";
import dbConnection from "./utils/db.js";
import cron from "node-cron";
import sendWelcomeEmail from "./EmailServices/sendWelcomeEmail.js";
import sendPendingOrderEmail from "./EmailServices/sendPendingOrderEmail.js";
import sendDeliveredOrderEmail from "./EmailServices/sendDeliveredOrderEmail.js";
import sendPromotionEmail from "./EmailServices/sendPromotionemail.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

// SCHEDULE SERVICES

const services = () => {
  cron.schedule("* * * * * *", () => {
    sendWelcomeEmail();
    sendPendingOrderEmail();
    sendDeliveredOrderEmail();
  });
};

const promotion = () => {
  cron.schedule("30 5 * * 5", () => {
    // sending promotion email
    sendPromotionEmail();
  });
};

services();
promotion();

app.listen(PORT, () => {
  console.log(`Backgroundservices is running on port ${PORT}`);
  dbConnection();
});
