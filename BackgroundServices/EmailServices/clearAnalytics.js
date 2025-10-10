// analyticsCleanup.js
import cron from 'node-cron';

import Analytics from '../models/analytics.model.js'; // Your analytics model

const cleanupOldAnalytics = async () => {
  try {
    console.log('Starting analytics cleanup...');
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 1);
    
    const result = await Analytics.deleteMany({
      createdAt: { $lt: sevenDaysAgo }
    });
    
    console.log(`✅ Analytics cleanup completed: Deleted ${result.deletedCount} records older than 7 days`);
    
  } catch (error) {
    console.error('❌ Analytics cleanup failed:', error);
  }
};

// Schedule to run daily at 2:00 AM new york time
const scheduleAnalyticsCleanup = () => {
  cron.schedule('0 2 * * *', cleanupOldAnalytics, {
    scheduled: true,
    timezone: "America/New_York"
  });
  
  console.log('📊 Analytics cleanup scheduled: Daily at 2:00 AM');
};

export { cleanupOldAnalytics, scheduleAnalyticsCleanup };