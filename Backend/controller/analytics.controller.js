import Analytics from "../models/analytics.model.js";
import asyncHandler from "express-async-handler";

// CREATE ANALYTICS RECORD
const createAnalyticsRecord = asyncHandler(async (req, res) => {
  try {
    const analyticsData = {
      ...req.body,
      // Get IP address from request
      ipAddress: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']
    };

    const newAnalytics = new Analytics(analyticsData);
    const savedAnalytics = await newAnalytics.save();

    res.status(201).json({
      success: true,
      data: savedAnalytics,
      message: "Analytics record created successfully"
    });
  } catch (error) {
    console.error("Error creating analytics record:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create analytics record",
      error: error.message
    });
  }
});

// GET ALL ANALYTICS RECORDS
const getAllAnalytics = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 50, userId, actionType, startDate, endDate } = req.query;
    
    const query = {};
    
    if (userId) query.userId = userId;
    if (actionType) query.actionType = actionType;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const analytics = await Analytics.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'name email');
    
    const total = await Analytics.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: analytics,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecords: total
      }
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics records",
      error: error.message
    });
  }
});

// GET ANALYTICS SUMMARY
const getAnalyticsSummary = asyncHandler(async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    // Total page views
    const totalPageViews = await Analytics.countDocuments({
      actionType: 'page_view',
      createdAt: { $gte: startDate }
    });
    
    // Unique visitors
    const uniqueVisitors = await Analytics.distinct('ipAddress', {
      actionType: 'page_view',
      createdAt: { $gte: startDate }
    });
    
    // Most visited pages
    const popularPages = await Analytics.aggregate([
      {
        $match: {
          actionType: 'page_view',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$pageUrl',
          visits: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$ipAddress' }
        }
      },
      {
        $project: {
          pageUrl: '$_id',
          visits: 1,
          uniqueVisitors: { $size: '$uniqueVisitors' }
        }
      },
      { $sort: { visits: -1 } },
      { $limit: 10 }
    ]);
    
    // Device breakdown
    const deviceBreakdown = await Analytics.aggregate([
      {
        $match: {
          actionType: 'page_view',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$deviceType',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalPageViews,
        uniqueVisitors: uniqueVisitors.length,
        popularPages,
        deviceBreakdown,
        timeRange: `${days} days`
      }
    });
  } catch (error) {
    console.error("Error fetching analytics summary:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics summary",
      error: error.message
    });
  }
});

// GET USER ACTIVITY
const getUserActivity = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20 } = req.query;
    
    const userActivity = await Analytics.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('userId', 'name email');
    
    res.status(200).json({
      success: true,
      data: userActivity
    });
  } catch (error) {
    console.error("Error fetching user activity:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user activity",
      error: error.message
    });
  }
});

export {
  createAnalyticsRecord,
  getAllAnalytics,
  getAnalyticsSummary,
  getUserActivity
};