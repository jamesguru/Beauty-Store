import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setErrors({});
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
      newErrors.email = 'Email is invalid';
    }
    
    if (!userData.skinType) {
      newErrors.skinType = 'Skin type is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setUserData({ ...userData, concerns: [...userData.concerns, value] });
    } else {
      setUserData({ 
        ...userData, 
        concerns: userData.concerns.filter(concern => concern !== value) 
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setIsLoading(false);
      
      // Simulate sending email
      setTimeout(() => {
        alert(`Your personalized skincare timetable has been sent to ${userData.email}`);
      }, 1500);
    }, 2000);
  };

  const downloadPDF = () => {
    alert("Downloading your personalized skincare timetable PDF!");
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Luxury Skincare Collection
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Elevate your skincare routine with our exclusive gold-standard regimens
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sample Timetable Section with Slant Effect */}
          <div className="lg:w-1/2 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 transform -skew-x-6 rounded-2xl"></div>
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500/30 rounded-2xl p-6 shadow-2xl shadow-purple-500/10 h-full overflow-hidden">
              <div className="text-center mb-8">
                <div className="inline-block bg-purple-500/10 text-purple-300 px-5 py-2 rounded-full text-md mb-6 border border-purple-500/30">
                  ✨ Sample Regimen
                </div>
                <h2 className="text-3xl font-bold mb-2 text-purple-300">7-Day Luxury Skincare Timetable</h2>
                <p className="text-gray-400">A preview of our expertly crafted routines</p>
              </div>
              
              <div className="overflow-x-auto transform skew-x-6">
                <table className="w-full text-white border-collapse">
                  <thead>
                    <tr className="bg-purple-900/20">
                      <th className="p-3 text-left border border-purple-500/30">Day</th>
                      <th className="p-3 text-left border border-purple-500/30">AM Routine</th>
                      <th className="p-3 text-left border border-purple-500/30">PM Routine</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { day: 'Monday', am: 'Cleanser, Vitamin C Serum, Moisturizer, SPF 50', pm: 'Double Cleanse, Retinol, Moisturizer' },
                      { day: 'Tuesday', am: 'Cleanser, Hyaluronic Acid, Moisturizer, SPF 50', pm: 'Double Cleanse, Hyaluronic Acid, Moisturizer' },
                      { day: 'Wednesday', am: 'Cleanser, Niacinamide, Moisturizer, SPF 50', pm: 'Double Cleanse, AHA Treatment, Moisturizer' },
                      { day: 'Thursday', am: 'Cleanser, Antioxidant Serum, Moisturizer, SPF 50', pm: 'Double Cleanse, Peptide Serum, Moisturizer' },
                      { day: 'Friday', am: 'Cleanser, Vitamin C Serum, Moisturizer, SPF 50', pm: 'Double Cleanse, Retinol, Moisturizer' },
                      { day: 'Saturday', am: 'Cleanser, Exfoliating Toner, Moisturizer, SPF 50', pm: 'Double Cleanse, Clay Mask, Recovery Serum' },
                      { day: 'Sunday', am: 'Cleanser, Soothing Serum, Moisturizer, SPF 30', pm: 'Double Cleanse, Hydrating Mask, Facial Oil' }
                    ].map((routine, index) => (
                      <tr key={routine.day} className={index % 2 === 1 ? 'bg-purple-900/10' : ''}>
                        <td className="p-3 border border-purple-500/30 font-medium">{routine.day}</td>
                        <td className="p-3 border border-purple-500/30">{routine.am}</td>
                        <td className="p-3 border border-purple-500/30">{routine.pm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-8 p-5 bg-purple-900/10 rounded-lg border border-purple-500/30 transform -skew-x-6">
                <h4 className="text-xl font-bold mb-3 text-purple-300">Recommended Products</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {['Luxury Ceramide Cleanser', 'Golden Vitamin C Serum', '24K Gold Night Repair Cream', 'Diamond Dust Exfoliator', 'Caviar Eye Complex'].map(product => (
                    <li key={product}>{product}</li>
                  ))}
                </ul>
              </div>

              <button
                onClick={downloadPDF}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/30 flex items-center justify-center"
                aria-label="Download sample timetable as PDF"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Sample PDF
              </button>
            </div>
          </div>

          {/* CTA & Form Section */}
          <div className="lg:w-1/2">
            {!showForm && !submitted ? (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500/30 rounded-2xl p-8 h-full flex flex-col justify-center items-center text-center shadow-2xl shadow-purple-500/10">
                <div className="inline-block bg-purple-500/10 text-purple-300 px-5 py-2 rounded-full text-md mb-6 border border-purple-500/30">
                  ✨ Personalized Solution
                </div>
                <h2 className="text-3xl font-bold mb-4 text-purple-300">Get Your Custom Skincare Timetable</h2>
                <p className="text-gray-400 mb-8 max-w-md">
                  Answer a few questions about your skin and receive a customized luxury skincare routine designed just for you, delivered to your inbox.
                </p>
                <button 
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/30"
                  aria-label="Create my personalized timetable"
                >
                  Create My Timetable
                </button>
              </div>
            ) : submitted ? (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500/30 rounded-2xl p-8 h-full flex flex-col justify-center items-center text-center shadow-2xl shadow-purple-500/10 animate-pulse">
                <div className="text-6xl mb-6 animate-bounce">✨</div>
                <h2 className="text-3xl font-bold mb-4 text-purple-300">Thank You, {userData.name}!</h2>
                <p className="text-gray-300 mb-2">Your personalized skincare timetable is being generated.</p>
                <p className="text-gray-300 mb-6">We're sending it to <span className="text-purple-300">{userData.email}</span></p>
                
                {isLoading ? (
                  <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-500 mb-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-300 mb-6">Check your inbox for your personalized timetable!</p>
                    <button 
                      onClick={resetForm}
                      className="mt-4 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full transition-all duration-300"
                    >
                      Create Another Timetable
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500/30 rounded-2xl p-6 shadow-2xl shadow-purple-500/10 h-full animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2 text-purple-300">Personal Skin Assessment</h2>
                    <p className="text-gray-400">Help us create your perfect routine</p>
                  </div>
                  <button 
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Close form"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-md mb-2">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      className={`w-full bg-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                      required
                    />
                    {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-md mb-2">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      className={`w-full bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                      required
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="skinType" className="block text-md mb-2">Skin Type</label>
                    <select
                      id="skinType"
                      name="skinType"
                      value={userData.skinType}
                      onChange={handleInputChange}
                      className={`w-full bg-gray-700 border ${errors.skinType ? 'border-red-500' : 'border-gray-600'} rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                      required
                    >
                      <option value="">Select your skin type</option>
                      <option value="dry">Dry</option>
                      <option value="oily">Oily</option>
                      <option value="combination">Combination</option>
                      <option value="normal">Normal</option>
                      <option value="sensitive">Sensitive</option>
                    </select>
                    {errors.skinType && <p className="text-red-400 text-sm mt-1">{errors.skinType}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-md mb-2">Skin Concerns (select all that apply)</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'acne', label: 'Acne' },
                        { value: 'aging', label: 'Aging' },
                        { value: 'darkSpots', label: 'Dark Spots' },
                        { value: 'redness', label: 'Redness' },
                        { value: 'dryness', label: 'Dryness' },
                        { value: 'oiliness', label: 'Oiliness' }
                      ].map(concern => (
                        <label key={concern.value} className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            value={concern.value} 
                            checked={userData.concerns.includes(concern.value)}
                            onChange={handleCheckboxChange} 
                            className="w-4 h-4 text-purple-500 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 transition-all" 
                          />
                          <span className="text-sm">{concern.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="morningTime" className="block text-md mb-2">Preferred AM Routine Time</label>
                      <select
                        id="morningTime"
                        name="morningTime"
                        value={userData.morningTime}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      >
                        <option value="6:00 AM">6:00 AM</option>
                        <option value="7:00 AM">7:00 AM</option>
                        <option value="8:00 AM">8:00 AM</option>
                        <option value="9:00 AM">9:00 AM</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="eveningTime" className="block text-md mb-2">Preferred PM Routine Time</label>
                      <select
                        id="eveningTime"
                        name="eveningTime"
                        value={userData.eveningTime}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      >
                        <option value="8:00 PM">8:00 PM</option>
                        <option value="9:00 PM">9:00 PM</option>
                        <option value="10:00 PM">10:00 PM</option>
                        <option value="11:00 PM">11:00 PM</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-purple-700 disabled:to-pink-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/30 flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Generate My Routine'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .skew-table {
          transform: perspective(1000px) rotateX(5deg) rotateY(-5deg) rotateZ(-1deg);
          transition: transform 0.5s ease;
        }
        
        .skew-table:hover {
          transform: perspective(1000px) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
        }
      `}</style>
    </div>
  );
};

export default Timetable;