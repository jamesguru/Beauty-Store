import express from "express";
const router = express.Router();
import {
  createClinicAssessment,
  getAllClinicAssessments,
  getClinicAssessmentById,
  updateAssessmentStatus,
  deleteAssessment,
  getUserAssessments
} from "../controller/clinic.controller.js";


// Public route - anyone can submit assessment (no authentication required)
router.post("/", createClinicAssessment);

// User routes (require authentication)
router.get("/my-assessments", getUserAssessments);

// Admin routes (require admin authentication)
router.get("/", getAllClinicAssessments);
router.get("/:id", getClinicAssessmentById);
router.put("/:id", updateAssessmentStatus);
router.delete("/:id", deleteAssessment);

export default router;