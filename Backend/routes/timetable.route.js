// routes/timetable.routes.js
import express from "express";
import Timetable from "../models/timetable.model.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, skinType, concerns, morningTime, eveningTime } = req.body;

    const timetableRequest = new Timetable({
      name,
      email,
      skinType,
      concerns: concerns || [],
      morningTime,
      eveningTime
    });

    await timetableRequest.save();

    res.status(201).json({
      success: true,
      message: "Timetable request received! Your personalized skincare routine will be sent to your email shortly.",
      data: timetableRequest
    });
  } catch (error) {
    console.error("Error creating timetable request:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create timetable request"
    });
  }
});

export default router;