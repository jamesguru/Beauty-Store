import mongoose from "mongoose";

const AnalyticsSchema = mongoose.Schema(
  {
    // User information
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    userEmail: {
      type: String,
      required: false
    },
    userName: {
      type: String,
      required: false
    },
    
    // Device and browser information
    ipAddress: {
      type: String,
      required: false
    },
    userAgent: {
      type: String,
      required: false
    },
    deviceType: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet', 'unknown'],
      default: 'unknown'
    },
    browser: {
      type: String,
      required: false
    },
    os: {
      type: String,
      required: false
    },
    
    // Location information
    country: {
      type: String,
      required: false
    },
    city: {
      type: String,
      required: false
    },
    region: {
      type: String,
      required: false
    },
    timezone: {
      type: String,
      required: false
    },
    
    // Page information
    pageUrl: {
      type: String,
      required: true
    },
    pageTitle: {
      type: String,
      required: false
    },
    referrer: {
      type: String,
      required: false
    },
    
    // Action information
    action: {
      type: String,
      required: true
    },
    actionType: {
      type: String,
      default: 'page_view'
    },
    
    // Additional metadata
    sessionId: {
      type: String,
      required: false
    },
    screenResolution: {
      type: String,
      required: false
    },
    language: {
      type: String,
      required: false
    },
    
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
AnalyticsSchema.index({ createdAt: -1 });
AnalyticsSchema.index({ userId: 1 });
AnalyticsSchema.index({ pageUrl: 1 });

const Analytics = mongoose.model("Analytics", AnalyticsSchema);
export default Analytics;