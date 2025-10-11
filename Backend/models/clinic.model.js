import mongoose from "mongoose";

const ClinicSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false // Change from true to false
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    age: {
      type: Number
    },
    skinType: {
      type: String
    },
    concerns: [{
      type: String
    }],
    currentRoutine: {
      type: String
    },
    allergies: {
      type: String
    },
    goals: {
      type: String
    },
    environment: {
      type: String
    },
    stressLevel: {
      type: String
    },
    diet: {
      type: String
    },
    images: [{
      type: String,
      required: true
    }],
    status: {
      type: String,
      enum: ['pending', 'under_review', 'completed', 'cancelled'],
      default: 'pending'
    },
    expertNotes: {
      type: String
    },
    recommendations: [{
      product: String,
      category: String,
      reason: String,
      keyIngredients: [String]
    }],
    assignedExpert: {
      name: String,
      specialty: String,
      experience: String
    },
    analysisResults: {
      skinType: String,
      skinToneAnalysis: String,
      melaninProtection: String,
      identifiedIssues: [String],
      improvements: [String],
      culturalConsiderations: [String],
      severity: String,
      timeline: String,
      specialTips: [String]
    },
    processingTime: {
      type: String,
      default: '7-14 days'
    }
  },
  {
    timestamps: true
  }
);

const Clinic = mongoose.model("Clinic", ClinicSchema);
export default Clinic;