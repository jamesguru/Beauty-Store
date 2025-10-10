import express from "express";
const router = express.Router();
import {
  createAnalyticsRecord,
  getAllAnalytics,
  getAnalyticsSummary,
  getUserActivity
} from "../controller/analytics.controller.js";

// CREATE ANALYTICS RECORD
router.post("/", createAnalyticsRecord);

// GET ALL ANALYTICS RECORDS
router.get("/", getAllAnalytics);

// GET ANALYTICS SUMMARY
router.get("/summary", getAnalyticsSummary);

// GET USER ACTIVITY
router.get("/user/:userId", getUserActivity);

export default router;