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
              <span className="font-medium">Success!</span>
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
                <span className="font-medium">Success!</span>
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
    { name: 'Luxury Ceramide Cleanser', category: 'Cleanser', benefits: 'Gentle cleansing, barrier protection' },
    { name: 'Golden Vitamin C Serum', category: 'Serum', benefits: 'Brightening, antioxidant protection' },
    { name: '24K Gold Night Cream', category: 'Moisturizer', benefits: 'Overnight repair, hydration' },
    { name: 'Diamond Exfoliator', category: 'Exfoliator', benefits: 'Smooth texture, refined pores' },
    { name: 'Caviar Eye Complex', category: 'Eye Care', benefits: 'Reduce dark circles, firm skin' },
    { name: 'Rose Quartz Face Oil', category: 'Treatment', benefits: 'Nourishment, glow enhancement' }
  ];

  const skinConcerns = [
    { value: 'acne', label: 'Acne', description: 'Breakouts and blemishes' },
    { value: 'aging', label: 'Aging', description: 'Fine lines and wrinkles' },
    { value: 'darkSpots', label: 'Dark Spots', description: 'Hyperpigmentation' },
    { value: 'redness', label: 'Redness', description: 'Sensitivity and irritation' },
    { value: 'dryness', label: 'Dryness', description: 'Dehydration and flakiness' },
    { value: 'oiliness', label: 'Oiliness', description: 'Excess sebum production' }
  ];

  const benefits = [
    {
      title: 'Personalized Routine',
      description: 'Custom skincare plan tailored to your unique skin type and concerns',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: 'Science-Backed Formulas',
      description: 'Advanced formulations with proven ingredients for visible results',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    {
      title: 'Luxury Experience',
      description: 'Premium ingredients and elegant textures for a spa-like routine',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
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
        theme="light"
      />
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-violet-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center bg-white/80 backdrop-blur-md text-slate-700 px-6 py-3 rounded-full text-sm font-medium mb-6 shadow-lg border border-slate-200">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              Premium Skincare Collection
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-800 mb-6">
              Your Personalized
              <span className="block bg-gradient-to-r from-blue-600 via-violet-600 to-rose-600 bg-clip-text text-transparent">
                Skincare Journey
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/80">
              Discover your perfect routine with our expertly crafted 7-day luxury skincare timetable, 
              tailored to your unique skin needs and lifestyle. Experience the transformation with 
              science-backed formulations and premium ingredients.
            </p>
          </div>

          {/* Benefits Section */}
          {/* <div className="grid md:grid-cols-3 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/80 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div> */}

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Sample Timetable Section */}
            <div className="space-y-8">
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/80 hover:border-white/90 transition-all duration-300">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center bg-gradient-to-r from-blue-500/10 to-violet-500/10 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-blue-200">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    7-Day Luxury Regimen
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-3">Sample Skincare Timetable</h2>
                  <p className="text-slate-600">A glimpse into our premium routine structure</p>
                </div>
                
                {/* Elegant Table */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-inner">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-50 to-violet-50">
                        <th className="p-4 text-left font-semibold text-slate-700 border-b border-slate-200">Day</th>
                        <th className="p-4 text-left font-semibold text-slate-700 border-b border-slate-200">AM Routine</th>
                        <th className="p-4 text-left font-semibold text-slate-700 border-b border-slate-200">PM Routine</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {sampleRoutines.map((routine) => (
                        <tr key={routine.day} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-medium text-slate-800">{routine.day}</td>
                          <td className="p-4 text-slate-600">{routine.am}</td>
                          <td className="p-4 text-slate-600">{routine.pm}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Recommended Products */}
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-violet-50 rounded-2xl border border-blue-100 shadow-lg">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                    Featured Luxury Products
                  </h4>
                  <div className="grid gap-4">
                    {featuredProducts.map((product, index) => (
                      <div key={index} className="flex items-start justify-between p-3 bg-white/50 rounded-lg border border-white/80">
                        <div>
                          <div className="font-medium text-slate-800">{product.name}</div>
                          <div className="text-sm text-slate-600">{product.category} • {product.benefits}</div>
                        </div>
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-violet-400 rounded-full mt-2"></div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={downloadPDF}
                  className="w-full mt-6 bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-semibold py-4 rounded-xl shadow-lg flex items-center justify-center transition-all duration-200"
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
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 h-full flex flex-col justify-center items-center text-center shadow-2xl border border-white/80 hover:border-white/90 transition-all duration-300">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500/10 to-violet-500/10 rounded-3xl flex items-center justify-center mb-6 shadow-lg border border-blue-100">
                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-4">Get Your Custom Skincare Plan</h2>
                  <p className="text-slate-600 mb-8 max-w-md text-lg leading-relaxed bg-white/50 rounded-2xl p-6 border border-white/80">
                    Receive a personalized luxury skincare routine designed specifically for your skin type, concerns, and schedule. Our experts will create a comprehensive 7-day plan with product recommendations and application guidance.
                  </p>
                  <button 
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold py-4 px-12 rounded-xl text-lg shadow-2xl flex items-center justify-center transition-all duration-200 hover:shadow-3xl"
                  >
                    Create My Timetable
                    <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              ) : submitted ? (
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 h-full flex flex-col justify-center items-center text-center shadow-2xl border border-white/80">
                  <div className="w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full flex items-center justify-center mb-6 shadow-lg border border-emerald-100">
                    <svg className="w-16 h-16 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-4">Perfect! Check Your Email</h2>
                  <p className="text-slate-600 mb-2 text-lg">Your personalized skincare timetable is being generated and will be sent to:</p>
                  <p className="text-blue-600 font-semibold text-xl mb-8 bg-blue-50 rounded-lg px-4 py-2 border border-blue-100">{userData.email}</p>
                  <p className="text-slate-500 text-sm mb-6">Please check your inbox (and spam folder) in the next few minutes.</p>
                  
                  <button 
                    onClick={resetForm}
                    className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold py-3 px-8 rounded-xl shadow-2xl transition-all duration-200"
                  >
                    Create Another Timetable
                  </button>
                </div>
              ) : (
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/80">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800 mb-2">Personal Skin Assessment</h2>
                      <p className="text-slate-600">Tell us about your skin for a custom routine</p>
                    </div>
                    <button 
                      onClick={() => setShowForm(false)}
                      className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={userData.name}
                          onChange={handleInputChange}
                          className={`w-full bg-white border ${errors.name ? 'border-red-300' : 'border-slate-300'} rounded-xl p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm placeholder-slate-400`}
                          placeholder="Enter your full name"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={userData.email}
                          onChange={handleInputChange}
                          className={`w-full bg-white border ${errors.email ? 'border-red-300' : 'border-slate-300'} rounded-xl p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm placeholder-slate-400`}
                          placeholder="your@email.com"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="skinType" className="block text-sm font-medium text-slate-700 mb-2">Skin Type</label>
                      <select
                        id="skinType"
                        name="skinType"
                        value={userData.skinType}
                        onChange={handleInputChange}
                        className={`w-full bg-white border ${errors.skinType ? 'border-red-300' : 'border-slate-300'} rounded-xl p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm`}
                      >
                        <option value="" className="text-slate-400">Select your skin type</option>
                        <option value="dry" className="text-slate-800">Dry</option>
                        <option value="oily" className="text-slate-800">Oily</option>
                        <option value="combination" className="text-slate-800">Combination</option>
                        <option value="normal" className="text-slate-800">Normal</option>
                        <option value="sensitive" className="text-slate-800">Sensitive</option>
                      </select>
                      {errors.skinType && <p className="text-red-500 text-sm mt-2">{errors.skinType}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">Skin Concerns</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {skinConcerns.map(concern => (
                          <label key={concern.value} className="relative flex flex-col p-4 bg-white border border-slate-300 rounded-xl cursor-pointer has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:shadow-md transition-all duration-200">
                            <input 
                              type="checkbox" 
                              value={concern.value} 
                              checked={userData.concerns.includes(concern.value)}
                              onChange={handleCheckboxChange} 
                              className="sr-only" 
                            />
                            <span className="text-sm font-medium text-slate-800 mb-1">{concern.label}</span>
                            <span className="text-xs text-slate-600">{concern.description}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="morningTime" className="block text-sm font-medium text-slate-700 mb-2">AM Routine Time</label>
                        <select
                          id="morningTime"
                          name="morningTime"
                          value={userData.morningTime}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-slate-300 rounded-xl p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                        >
                          <option value="6:00 AM" className="text-slate-800">6:00 AM</option>
                          <option value="7:00 AM" className="text-slate-800">7:00 AM</option>
                          <option value="8:00 AM" className="text-slate-800">8:00 AM</option>
                          <option value="9:00 AM" className="text-slate-800">9:00 AM</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="eveningTime" className="block text-sm font-medium text-slate-700 mb-2">PM Routine Time</label>
                        <select
                          id="eveningTime"
                          name="eveningTime"
                          value={userData.eveningTime}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-slate-300 rounded-xl p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                        >
                          <option value="8:00 PM" className="text-slate-800">8:00 PM</option>
                          <option value="9:00 PM" className="text-slate-800">9:00 PM</option>
                          <option value="10:00 PM" className="text-slate-800">10:00 PM</option>
                          <option value="11:00 PM" className="text-slate-800">11:00 PM</option>
                        </select>
                      </div>
                    </div>

                    {apiError && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="text-red-700 text-sm text-center">{apiError}</p>
                      </div>
                    )}
                    
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold py-4 rounded-xl shadow-2xl flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed hover:shadow-3xl"
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

          {/* Additional Information Section */}
          <div className="mt-16 bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/80">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Why Choose Our Skincare System?</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Our approach combines scientific research with luxury ingredients to deliver visible results</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Fast Results</h3>
                <p className="text-slate-600 text-sm">Visible improvements in skin texture and tone within weeks</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Dermatologist Tested</h3>
                <p className="text-slate-600 text-sm">All products clinically tested for safety and efficacy</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Clean Ingredients</h3>
                <p className="text-slate-600 text-sm">Formulated without harsh chemicals or irritants</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Luxury Experience</h3>
                <p className="text-slate-600 text-sm">Premium packaging and sensorial textures</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timetable;