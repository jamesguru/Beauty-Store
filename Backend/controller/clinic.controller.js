import Clinic from "../models/clinic.model.js";
import asyncHandler from "express-async-handler";

// CREATE CLINIC ASSESSMENT
const createClinicAssessment = asyncHandler(async (req, res) => {
  try {
    const { 
      name, email, phone, age, skinType, concerns, currentRoutine, 
      allergies, goals, environment, stressLevel, diet, images 
    } = req.body;

    // Create assessment without user field for non-logged-in users
    const newAssessment = new Clinic({
      // Only include user if available (logged-in users)
      user: req.user?._id || null,
      name,
      email,
      phone,
      age: age ? parseInt(age) : undefined,
      skinType,
      concerns: concerns || [],
      currentRoutine,
      allergies,
      goals,
      environment,
      stressLevel,
      diet,
      images: images || [], // Ensure images is always an array
      status: 'pending'
    });

    const savedAssessment = await newAssessment.save();

    res.status(201).json({
      success: true,
      message: 'Skin assessment submitted successfully',
      data: savedAssessment
    });
  } catch (error) {
    console.error('Assessment creation error:', error);
    res.status(500);
    throw new Error('Failed to create skin assessment: ' + error.message);
  }
});

// GET ALL CLINIC ASSESSMENTS (Admin)
const getAllClinicAssessments = asyncHandler(async (req, res) => {
  const assessments = await Clinic.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: assessments.length,
    data: assessments
  });
});

// GET ASSESSMENT BY ID
const getClinicAssessmentById = asyncHandler(async (req, res) => {
  const assessment = await Clinic.findById(req.params.id)
    .populate('user', 'name email');

  if (!assessment) {
    res.status(404);
    throw new Error('Assessment not found');
  }

  res.status(200).json({
    success: true,
    data: assessment
  });
});

// UPDATE ASSESSMENT STATUS (Admin)
const updateAssessmentStatus = asyncHandler(async (req, res) => {
  const { status, expertNotes, recommendations, assignedExpert, analysisResults } = req.body;
  
  const assessment = await Clinic.findById(req.params.id);
  
  if (!assessment) {
    res.status(404);
    throw new Error('Assessment not found');
  }

  const updateData = { status };
  if (expertNotes) updateData.expertNotes = expertNotes;
  if (recommendations) updateData.recommendations = recommendations;
  if (assignedExpert) updateData.assignedExpert = assignedExpert;
  if (analysisResults) updateData.analysisResults = analysisResults;

  const updatedAssessment = await Clinic.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  ).populate('user', 'name email');

  res.status(200).json({
    success: true,
    message: 'Assessment updated successfully',
    data: updatedAssessment
  });
});

// DELETE ASSESSMENT (Admin)
const deleteAssessment = asyncHandler(async (req, res) => {
  const assessment = await Clinic.findById(req.params.id);
  
  if (!assessment) {
    res.status(404);
    throw new Error('Assessment not found');
  }

  await Clinic.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Assessment deleted successfully'
  });
});

// GET USER'S ASSESSMENTS (for logged-in users)
const getUserAssessments = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const assessments = await Clinic.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: assessments.length,
    data: assessments
  });
});

export {
  createClinicAssessment,
  getAllClinicAssessments,
  getClinicAssessmentById,
  updateAssessmentStatus,
  deleteAssessment,
  getUserAssessments
};