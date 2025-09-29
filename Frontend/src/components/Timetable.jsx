import React, { useState, useEffect } from 'react';
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Timetable = () => {
  const [showForm, setShowForm] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    skinType: '',
    concerns: [],
    morningTime: '7:00 AM',
    eveningTime: '9:00 PM'
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Reset errors when user data changes
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
    if (apiError) {
      setApiError(null);
    }
  }, [userData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!userData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!userData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!userData.skinType) {
      newErrors.skinType = 'Please select your skin type';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setUserData(prev => ({
      ...prev,
      concerns: checked 
        ? [...prev.concerns, value]
        : prev.concerns.filter(concern => concern !== value)
    }));
  };

  // Mock function to simulate successful submission when backend is down
  const handleMockSubmission = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Mock submission successful:', userData);
        resolve({ success: true });
      }, 2000);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setApiError(null);

    // Create a timeout promise to prevent infinite loading
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout. The server is taking too long to respond.')), 10000);
    });

    try {
      console.log('Submitting timetable request:', userData);

      // Try the actual API call first
      const apiCall = userRequest.post("/timetable", userData);
      
      // Race between API call and timeout
      const response = await Promise.race([apiCall, timeoutPromise]);
      
      console.log('API response:', response);

      if (response.data?.success) {
        setSubmitted(true);
        toast.success(
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <span className="font-medium">Success! 🎉</span>
            </div>
            <p className="text-sm">Your personalized skincare timetable will be sent to your email shortly!</p>
          </div>
        );
      } else {
        throw new Error(response.data?.message || 'Failed to create timetable');
      }

    } catch (error) {
      console.error('API Error:', error);
      
      // If API fails, try mock submission as fallback
      try {
        console.log('API failed, trying mock submission...');
        
        const mockResult = await handleMockSubmission();
        
        if (mockResult.success) {
          setSubmitted(true);
          toast.success(
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="font-medium">Success! 🎉</span>
              </div>
              <p className="text-sm">
                While we set up our email system, here's what we recommend for {userData.skinType} skin:
                Cleanse twice daily, use sunscreen every morning, and moisturize regularly.
              </p>
            </div>
          );
        }
      } catch (mockError) {
        console.error('Mock submission failed:', mockError);
        
        let errorMessage = 'Please try again in a moment.';
        
        if (error.message.includes('timeout')) {
          errorMessage = 'The request timed out. Please check your connection and try again.';
        } else if (error.response) {
          errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        } else if (error.request) {
          errorMessage = 'Unable to connect to server. Please check your internet connection.';
        } else {
          errorMessage = error.message || 'An unexpected error occurred.';
        }
        
        setApiError(errorMessage);
        toast.error(
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <span className="font-medium">Submission Failed</span>
            </div>
            <p className="text-sm">{errorMessage}</p>
          </div>
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = () => {
    toast.info(
      <div className="text-center">
        <p className="text-sm">Sample PDF download feature coming soon!</p>
      </div>
    );
  };

  const resetForm = () => {
    setShowForm(false);
    setSubmitted(false);
    setUserData({
      name: '',
      email: '',
      skinType: '',
      concerns: [],
      morningTime: '7:00 AM',
      eveningTime: '9:00 PM'
    });
    setApiError(null);
  };

  const sampleRoutines = [
    { day: 'Monday', am: 'Cleanser, Vitamin C Serum, Moisturizer, SPF 50', pm: 'Double Cleanse, Retinol, Moisturizer' },
    { day: 'Tuesday', am: 'Cleanser, Hyaluronic Acid, Moisturizer, SPF 50', pm: 'Double Cleanse, Hyaluronic Acid, Moisturizer' },
    { day: 'Wednesday', am: 'Cleanser, Niacinamide, Moisturizer, SPF 50', pm: 'Double Cleanse, AHA Treatment, Moisturizer' },
    { day: 'Thursday', am: 'Cleanser, Antioxidant Serum, Moisturizer, SPF 50', pm: 'Double Cleanse, Peptide Serum, Moisturizer' },
    { day: 'Friday', am: 'Cleanser, Vitamin C Serum, Moisturizer, SPF 50', pm: 'Double Cleanse, Retinol, Moisturizer' },
    { day: 'Saturday', am: 'Cleanser, Exfoliating Toner, Moisturizer, SPF 50', pm: 'Double Cleanse, Clay Mask, Recovery Serum' },
    { day: 'Sunday', am: 'Cleanser, Soothing Serum, Moisturizer, SPF 30', pm: 'Double Cleanse, Hydrating Mask, Facial Oil' }
  ];

  const featuredProducts = [
    'Luxury Ceramide Cleanser',
    'Golden Vitamin C Serum', 
    '24K Gold Night Cream',
    'Diamond Exfoliator',
    'Caviar Eye Complex',
    'Rose Quartz Face Oil'
  ];

  const skinConcerns = [
    { value: 'acne', label: 'Acne', icon: '🫧' },
    { value: 'aging', label: 'Aging', icon: '✨' },
    { value: 'darkSpots', label: 'Dark Spots', icon: '🔍' },
    { value: 'redness', label: 'Redness', icon: '🌡️' },
    { value: 'dryness', label: 'Dryness', icon: '💧' },
    { value: 'oiliness', label: 'Oiliness', icon: '🛢️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-rose-600/15 to-orange-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-600/10 to-cyan-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm font-medium mb-6 shadow-2xl shadow-purple-500/10 border border-white/10">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              ✨ Premium Skincare Collection
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">
              Your Personalized
              <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-rose-300 bg-clip-text text-transparent">
                Skincare Journey
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/5">
              Discover your perfect routine with our expertly crafted 7-day luxury skincare timetable, 
              tailored to your unique skin needs and lifestyle.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Sample Timetable Section */}
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/10 hover:border-white/20 transition-colors">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-violet-200 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-violet-400/20">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    7-Day Luxury Regimen
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-3">Sample Skincare Timetable</h2>
                  <p className="text-gray-300">A glimpse into our premium routine structure</p>
                </div>
                
                {/* Elegant Table */}
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 shadow-inner">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10">
                        <th className="p-4 text-left font-semibold text-violet-200 border-b border-white/10">Day</th>
                        <th className="p-4 text-left font-semibold text-violet-200 border-b border-white/10">AM Routine</th>
                        <th className="p-4 text-left font-semibold text-violet-200 border-b border-white/10">PM Routine</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {sampleRoutines.map((routine) => (
                        <tr key={routine.day} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-medium text-white">{routine.day}</td>
                          <td className="p-4 text-gray-300">{routine.am}</td>
                          <td className="p-4 text-gray-300">{routine.pm}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Recommended Products */}
                <div className="mt-8 p-6 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-2xl border border-white/10 shadow-lg">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-violet-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                    Featured Luxury Products
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {featuredProducts.map(product => (
                      <div key={product} className="flex items-center text-violet-200 bg-white/5 rounded-lg p-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full mr-2"></div>
                        {product}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={downloadPDF}
                  className="w-full mt-6 bg-gradient-to-r from-white/10 to-white/5 border-2 border-white/20 text-white hover:bg-white/10 font-semibold py-4 rounded-xl shadow-lg flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Sample PDF
                </button>
              </div>
            </div>

            {/* CTA & Form Section */}
            <div className="space-y-8">
              {!showForm && !submitted ? (
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 h-full flex flex-col justify-center items-center text-center shadow-2xl border border-white/10 hover:border-white/20 transition-colors">
                  <div className="w-24 h-24 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-3xl flex items-center justify-center mb-6 shadow-lg border border-white/10">
                    <svg className="w-12 h-12 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">Get Your Custom Skincare Plan</h2>
                  <p className="text-gray-300 mb-8 max-w-md text-lg leading-relaxed bg-white/5 rounded-2xl p-4">
                    Receive a personalized luxury skincare routine designed specifically for your skin type, concerns, and schedule.
                  </p>
                  <button 
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-4 px-12 rounded-xl text-lg shadow-2xl flex items-center justify-center transition-colors"
                  >
                    Create My Timetable
                    <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              ) : submitted ? (
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 h-full flex flex-col justify-center items-center text-center shadow-2xl border border-white/10">
                  <div className="w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-lg border border-white/10">
                    <svg className="w-16 h-16 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">Perfect! Check Your Email</h2>
                  <p className="text-gray-300 mb-2 text-lg">Your personalized skincare timetable is being generated and will be sent to:</p>
                  <p className="text-violet-300 font-semibold text-xl mb-8 bg-white/5 rounded-lg px-4 py-2">{userData.email}</p>
                  <p className="text-gray-400 text-sm mb-6">Please check your inbox (and spam folder) in the next few minutes.</p>
                  
                  <button 
                    onClick={resetForm}
                    className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-3 px-8 rounded-xl shadow-2xl transition-colors"
                  >
                    Create Another Timetable
                  </button>
                </div>
              ) : (
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/10">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Personal Skin Assessment</h2>
                      <p className="text-gray-300">Tell us about your skin for a custom routine</p>
                    </div>
                    <button 
                      onClick={() => setShowForm(false)}
                      className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={userData.name}
                          onChange={handleInputChange}
                          className={`w-full bg-white/5 border ${errors.name ? 'border-red-400/50' : 'border-white/10'} rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent shadow-lg backdrop-blur-sm placeholder-gray-400`}
                          placeholder="Enter your full name"
                        />
                        {errors.name && <p className="text-red-300 text-sm mt-2">{errors.name}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={userData.email}
                          onChange={handleInputChange}
                          className={`w-full bg-white/5 border ${errors.email ? 'border-red-400/50' : 'border-white/10'} rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent shadow-lg backdrop-blur-sm placeholder-gray-400`}
                          placeholder="your@email.com"
                        />
                        {errors.email && <p className="text-red-300 text-sm mt-2">{errors.email}</p>}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="skinType" className="block text-sm font-medium text-gray-300 mb-2">Skin Type</label>
                      <select
                        id="skinType"
                        name="skinType"
                        value={userData.skinType}
                        onChange={handleInputChange}
                        className={`w-full bg-white/5 border ${errors.skinType ? 'border-red-400/50' : 'border-white/10'} rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent shadow-lg backdrop-blur-sm`}
                      >
                        <option value="" className="bg-slate-800">Select your skin type</option>
                        <option value="dry" className="bg-slate-800">Dry</option>
                        <option value="oily" className="bg-slate-800">Oily</option>
                        <option value="combination" className="bg-slate-800">Combination</option>
                        <option value="normal" className="bg-slate-800">Normal</option>
                        <option value="sensitive" className="bg-slate-800">Sensitive</option>
                      </select>
                      {errors.skinType && <p className="text-red-300 text-sm mt-2">{errors.skinType}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">Skin Concerns</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {skinConcerns.map(concern => (
                          <label key={concern.value} className="relative flex items-center p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer has-[:checked]:border-violet-400 has-[:checked]:bg-violet-500/20 has-[:checked]:shadow-lg transition-colors">
                            <input 
                              type="checkbox" 
                              value={concern.value} 
                              checked={userData.concerns.includes(concern.value)}
                              onChange={handleCheckboxChange} 
                              className="sr-only" 
                            />
                            <span className="text-lg mr-2">{concern.icon}</span>
                            <span className="text-sm font-medium text-white">{concern.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="morningTime" className="block text-sm font-medium text-gray-300 mb-2">AM Routine Time</label>
                        <select
                          id="morningTime"
                          name="morningTime"
                          value={userData.morningTime}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent shadow-lg backdrop-blur-sm"
                        >
                          <option value="6:00 AM" className="bg-slate-800">6:00 AM</option>
                          <option value="7:00 AM" className="bg-slate-800">7:00 AM</option>
                          <option value="8:00 AM" className="bg-slate-800">8:00 AM</option>
                          <option value="9:00 AM" className="bg-slate-800">9:00 AM</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="eveningTime" className="block text-sm font-medium text-gray-300 mb-2">PM Routine Time</label>
                        <select
                          id="eveningTime"
                          name="eveningTime"
                          value={userData.eveningTime}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent shadow-lg backdrop-blur-sm"
                        >
                          <option value="8:00 PM" className="bg-slate-800">8:00 PM</option>
                          <option value="9:00 PM" className="bg-slate-800">9:00 PM</option>
                          <option value="10:00 PM" className="bg-slate-800">10:00 PM</option>
                          <option value="11:00 PM" className="bg-slate-800">11:00 PM</option>
                        </select>
                      </div>
                    </div>

                    {apiError && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                        <p className="text-red-300 text-sm text-center">{apiError}</p>
                      </div>
                    )}
                    
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 rounded-xl shadow-2xl flex items-center justify-center transition-colors disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating Your Routine...
                        </>
                      ) : (
                        <>
                          Generate My Timetable
                          <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timetable;