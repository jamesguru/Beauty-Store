import { userRequest } from "../requestMethods";

// Generate a unique session ID
const generateSessionId = () => {
  let sessionId = localStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Detect device type
const detectDeviceType = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
    return 'mobile';
  } else if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    return 'tablet';
  } else {
    return 'desktop';
  }
};

// Get browser information
const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  let browser = 'unknown';
  let os = 'unknown';

  // Detect browser
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
  else if (userAgent.includes('Edg')) browser = 'Edge';

  // Detect OS
  if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Mac')) os = 'macOS';
  else if (userAgent.includes('Linux')) os = 'Linux';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';

  return { browser, os };
};

// Get screen resolution
const getScreenResolution = () => {
  return `${window.screen.width}x${window.screen.height}`;
};

// Get user location (approximate)
const getUserLocation = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return {
      country: data.country_name,
      city: data.city,
      region: data.region,
      timezone: data.timezone
    };
  } catch (error) {
    console.error('Error fetching location:', error);
    return {
      country: 'unknown',
      city: 'unknown',
      region: 'unknown',
      timezone: 'unknown'
    };
  }
};

// Main analytics tracking function
export const trackUserAction = async (action, actionType = 'page_view', additionalData = {}) => {
  try {
    // Get current user from localStorage (if logged in)
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    // Get current page information
    const currentPage = window.location.pathname + window.location.search;
    const pageTitle = document.title;
    const referrer = document.referrer || 'direct';

    // Collect all analytics data
    const analyticsData = {
      // User information
      userId: user?._id || null,
      userEmail: user?.email || null,
      userName: user?.name || null,
      
      // Device and browser information
      userAgent: navigator.userAgent,
      deviceType: detectDeviceType(),
      ...getBrowserInfo(),
      screenResolution: getScreenResolution(),
      language: navigator.language,
      
      // Page information
      pageUrl: currentPage,
      pageTitle: pageTitle,
      referrer: referrer,
      
      // Action information
      action: action,
      actionType: actionType,
      
      // Session information
      sessionId: generateSessionId(),
      
      // Additional data
      ...additionalData
    };

    // Get location data (this is async but we don't wait for it)
    getUserLocation().then(locationData => {
      analyticsData.country = locationData.country;
      analyticsData.city = locationData.city;
      analyticsData.region = locationData.region;
      analyticsData.timezone = locationData.timezone;
      
      // Send to backend
      userRequest.post("/analytics", analyticsData)
        .catch(error => {
          console.error('Error sending analytics:', error);
          // You can implement fallback storage here (localStorage, etc.)
        });
    }).catch(() => {
      // Send without location data if location fetch fails
      userRequest.post("/analytics", analyticsData)
        .catch(error => {
          console.error('Error sending analytics:', error);
        });
    });

  } catch (error) {
    console.error('Error in trackUserAction:', error);
    // Fail silently - we don't want analytics errors to break the app
  }
};

// Specialized tracking functions
export const trackPageView = (pageName = null) => {
  const action = pageName || window.location.pathname;
  trackUserAction(action, 'page_view');
};

export const trackButtonClick = (buttonName, additionalData = {}) => {
  trackUserAction(`click_${buttonName}`, 'button_click', additionalData);
};

export const trackFormSubmit = (formName, additionalData = {}) => {
  trackUserAction(`submit_${formName}`, 'form_submit', additionalData);
};

export const trackLogin = (method = 'email') => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  trackUserAction(`login_${method}`, 'login', {
    loginMethod: method,
    userId: user?._id,
    userEmail: user?.email
  });
};

export const trackLogout = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  trackUserAction('logout', 'logout', {
    userId: user?._id,
    userEmail: user?.email
  });
};

export const trackPurchase = (orderData) => {
  trackUserAction('purchase', 'purchase', orderData);
};

export const trackSearch = (searchQuery, resultsCount = 0) => {
  trackUserAction('search', 'search', {
    searchQuery,
    resultsCount
  });
};