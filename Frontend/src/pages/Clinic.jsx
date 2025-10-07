import { useState, useRef, useEffect } from 'react';
import { FaUpload, FaCamera, FaUser, FaStar, FaShieldAlt, FaLock, FaCheckCircle, FaArrowRight } from 'react-icons/fa';

const SkinClinic = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    skinType: '',
    concerns: [],
    currentRoutine: '',
    allergies: '',
    goals: '',
    environment: '',
    stressLevel: '',
    diet: ''
  });

  const fileInputRef = useRef(null);
  const scanIntervalRef = useRef(null);

  const skinTypes = ['Dry', 'Oily', 'Combination', 'Normal', 'Sensitive'];
  const skinConcerns = [
    'Acne & Breakouts',
    'Aging & Wrinkles',
    'Dark Spots',
    'Redness',
    'Dullness',
    'Large Pores',
    'Dark Circles',
    'Dehydration',
    'Oiliness',
    'Sensitivity'
  ];
  const environments = ['Urban/Polluted', 'Rural', 'Coastal/Humid', 'Dry/Desert', 'Seasonal Changes'];
  const stressLevels = ['Low', 'Moderate', 'High', 'Very High'];
  const diets = ['Balanced', 'Vegetarian', 'Vegan', 'High Sugar', 'High Dairy', 'Low Fat', 'Mediterranean'];

  // Face scanning animation
  useEffect(() => {
    if (currentStep === 1) {
      setIsScanning(true);
      setScanProgress(0);
      
      scanIntervalRef.current = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(scanIntervalRef.current);
            setIsScanning(false);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
    }

    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, [currentStep]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setCurrentStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        concerns: checked 
          ? [...prev.concerns, value]
          : prev.concerns.filter(concern => concern !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const submitAnalysis = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setAnalysisData({
        skinType: 'Combination with Oily T-Zone',
        concerns: ['Large Pores', 'Occasional Breakouts', 'Mild Dehydration'],
        recommendations: [
          {
            product: 'Hydra-Cleansing Gel',
            category: 'Cleanser',
            reason: 'Gentle cleansing without stripping natural oils'
          },
          {
            product: 'Niacinamide + Zinc Serum',
            category: 'Treatment',
            reason: 'Regulates oil production and minimizes pores'
          },
          {
            product: 'HA Moisture Lock Cream',
            category: 'Moisturizer',
            reason: 'Provides hydration without heaviness'
          }
        ],
        expertNotes: 'Your skin shows good overall health with some congestion in the T-zone. Focus on balancing hydration and oil control.',
        severity: 'Mild',
        timeline: '4-6 weeks for visible improvement'
      });
      setCurrentStep(4);
      setIsLoading(false);
    }, 3000);
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setAnalysisData(null);
    setCurrentStep(1);
    setFormData({
      name: '',
      email: '',
      age: '',
      skinType: '',
      concerns: [],
      currentRoutine: '',
      allergies: '',
      goals: '',
      environment: '',
      stressLevel: '',
      diet: ''
    });
  };

  // Face scanning animation component
  const FaceScanAnimation = () => (
    <div className="relative w-64 h-80 mx-auto mb-8">
      {/* Face Outline */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-48 h-64">
          {/* Face shape */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-100 to-rose-50 rounded-full shadow-lg"></div>
          
          {/* Scanning overlay - left side (scanned) */}
          <div 
            className="absolute top-0 left-0 h-full overflow-hidden"
            style={{ width: `${scanProgress}%` }}
          >
            <div className="relative w-48 h-64">
              {/* Scanned area with grid pattern */}
              <div className="absolute inset-0 bg-green-50 opacity-20 rounded-full"></div>
              <div 
                className="absolute inset-0 bg-gradient-to-r from-green-200/30 to-transparent rounded-full"
                style={{
                  backgroundImage: `
                    linear-gradient(90deg, transparent 95%, #10b981 100%),
                    linear-gradient(0deg, transparent 95%, #10b981 100%)
                  `,
                  backgroundSize: '20px 20px'
                }}
              ></div>
              
              {/* Scan completion indicators */}
              {scanProgress > 20 && (
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              )}
              {scanProgress > 40 && (
                <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              )}
              {scanProgress > 60 && (
                <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              )}
              {scanProgress > 80 && (
                <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
          
          {/* Scanning overlay - right side (unscanned) */}
          <div 
            className="absolute top-0 right-0 h-full overflow-hidden"
            style={{ width: `${100 - scanProgress}%` }}
          >
            <div className="relative w-48 h-64 ml-auto">
              {/* Unscanned area with pulsing effect */}
              <div className="absolute inset-0 bg-gray-100 opacity-30 rounded-full"></div>
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-200/40 rounded-full animate-pulse"
                style={{
                  backgroundImage: `
                    linear-gradient(90deg, transparent 95%, #6b7280 100%),
                    linear-gradient(0deg, transparent 95%, #6b7280 100%)
                  `,
                  backgroundSize: '20px 20px'
                }}
              ></div>
            </div>
          </div>

          {/* Scanning beam */}
          {isScanning && (
            <div 
              className="absolute top-0 left-0 h-full w-2 bg-gradient-to-b from-rose-500 to-rose-300 rounded-full shadow-lg animate-scan-beam"
              style={{ 
                left: `${scanProgress}%`,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="absolute inset-0 bg-rose-400 rounded-full animate-ping"></div>
            </div>
          )}

          {/* Facial features */}
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {/* Eyes */}
            <div className="flex space-x-8 mb-4">
              <div className={`w-6 h-3 rounded-full ${scanProgress > 30 ? 'bg-green-600' : 'bg-gray-400'} transition-colors duration-500`}></div>
              <div className={`w-6 h-3 rounded-full ${scanProgress > 30 ? 'bg-green-600' : 'bg-gray-400'} transition-colors duration-500`}></div>
            </div>
            
            {/* Nose */}
            <div className={`w-4 h-6 mx-auto rounded-b-full ${scanProgress > 50 ? 'bg-green-500' : 'bg-gray-500'} transition-colors duration-500`}></div>
            
            {/* Mouth */}
            <div className={`w-16 h-3 mt-4 mx-auto rounded-full ${scanProgress > 70 ? 'bg-green-600' : 'bg-gray-400'} transition-colors duration-500`}></div>
          </div>

          {/* Progress indicators on face */}
          <div className="absolute top-2 left-2 w-4 h-4">
            <div className={`w-full h-full rounded-full ${scanProgress > 10 ? 'bg-green-500 animate-pulse' : 'bg-gray-300'} transition-all duration-300`}></div>
          </div>
          <div className="absolute top-2 right-2 w-4 h-4">
            <div className={`w-full h-full rounded-full ${scanProgress > 90 ? 'bg-green-500 animate-pulse' : 'bg-gray-300'} transition-all duration-300`}></div>
          </div>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4">
            <div className={`w-full h-full rounded-full ${scanProgress > 50 ? 'bg-green-500 animate-pulse' : 'bg-gray-300'} transition-all duration-300`}></div>
          </div>
        </div>
      </div>

      {/* Scanning status text */}
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center w-64">
        <div className="text-sm font-semibold text-rose-700 mb-1">
          {isScanning ? 'Scanning in Progress...' : 'Scan Complete!'}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-rose-500 to-rose-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${scanProgress}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-600 mt-1">
          {isScanning ? `Analyzing skin structure... ${scanProgress}%` : 'Ready for detailed assessment'}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-rose-100 p-4 rounded-full">
              <FaStar className="text-rose-600 text-2xl" />
            </div>
          </div>
          <h1 className="text-4xl font-serif font-bold text-rose-800 mb-4">
            Dubois Skin Clinic
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced AI-powered skin analysis with expert dermatologist review
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                  currentStep >= step 
                    ? 'bg-rose-600 border-rose-600 text-white' 
                    : 'border-gray-300 text-gray-400'
                } transition-all duration-300`}>
                  {currentStep > step ? <FaCheckCircle /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 ${
                    currentStep > step ? 'bg-rose-600' : 'bg-gray-300'
                  } transition-all duration-300`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Face Scanning Animation & Upload */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="bg-rose-50 p-6 rounded-2xl mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <FaCamera className="text-rose-600 text-3xl" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-rose-800 mb-4">
                AI Skin Analysis
              </h2>
              <p className="text-gray-600 mb-6">
                Our advanced scanning technology analyzes 200+ skin parameters for personalized recommendations
              </p>
              
              {/* Face Scanning Animation */}
              <FaceScanAnimation />

              <div className="grid md:grid-cols-3 gap-4 mb-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="bg-white p-3 rounded-lg shadow-sm mb-2 border border-green-200">
                    <span className="text-green-600 font-semibold">✓</span>
                  </div>
                  <p className="text-sm text-gray-600">Pore Analysis</p>
                </div>
                <div className="text-center">
                  <div className="bg-white p-3 rounded-lg shadow-sm mb-2 border border-green-200">
                    <span className="text-green-600 font-semibold">✓</span>
                  </div>
                  <p className="text-sm text-gray-600">Texture Mapping</p>
                </div>
                <div className="text-center">
                  <div className="bg-white p-3 rounded-lg shadow-sm mb-2 border border-green-200">
                    <span className="text-green-600 font-semibold">✓</span>
                  </div>
                  <p className="text-sm text-gray-600">Hydration Levels</p>
                </div>
              </div>
            </div>

            <div className="border-2 border-dashed border-rose-200 rounded-2xl p-12 mb-6 bg-rose-25 cursor-pointer hover:border-rose-300 transition-colors group"
                 onClick={() => fileInputRef.current?.click()}>
              <div className="relative">
                <FaUpload className="text-rose-400 text-5xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute top-0 right-1/3 w-4 h-4 bg-rose-500 rounded-full animate-ping"></div>
              </div>
              <p className="text-lg font-semibold text-rose-700 mb-2">
                Upload Your Photo to Begin
              </p>
              <p className="text-gray-500 text-sm">
                For optimal analysis: Clear face photo • Good lighting • No makeup
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />

            <div className="bg-rose-50 rounded-lg p-4 text-left max-w-2xl mx-auto">
              <div className="flex items-start">
                <div className="relative">
                  <FaLock className="text-rose-600 mt-1 mr-3 flex-shrink-0" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <p className="font-semibold text-rose-800">Medical-Grade Security</p>
                  <p className="text-sm text-gray-600">
                    Your images are processed with HIPAA-compliant encryption and analyzed by certified dermatologists.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Image Preview & Basic Info */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Image Preview */}
              <div className="bg-gray-50 p-8 flex items-center justify-center">
                {selectedImage && (
                  <div className="text-center">
                    <div className="relative inline-block">
                      <img 
                        src={selectedImage} 
                        alt="Skin preview" 
                        className="max-w-full max-h-80 rounded-lg shadow-md mx-auto mb-4"
                      />
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold animate-pulse">
                        ANALYZED
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedImage(null)}
                      className="text-rose-600 hover:text-rose-700 text-sm font-medium"
                    >
                      Retake photo
                    </button>
                  </div>
                )}
              </div>

              {/* Basic Information Form */}
              <div className="p-8">
                <h2 className="text-2xl font-semibold text-rose-800 mb-6">
                  Complete Your Profile
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-colors"
                      placeholder="e.g., 28"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skin Type
                    </label>
                    <select
                      name="skinType"
                      value={formData.skinType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-colors"
                    >
                      <option value="">Select your skin type</option>
                      {skinTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentStep(3)}
                  className="w-full bg-rose-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-rose-700 transition-colors duration-300 mt-8 flex items-center justify-center group"
                >
                  Continue to Detailed Analysis
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Detailed Questionnaire */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-rose-800 mb-2">
              Detailed Skin Assessment
            </h2>
            <p className="text-gray-600 mb-8">
              Help our experts understand your skin better for personalized recommendations
            </p>

            <form onSubmit={submitAnalysis} className="space-y-8">
              {/* Skin Concerns */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-4">
                  What are your main skin concerns? (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {skinConcerns.map(concern => (
                    <label key={concern} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-rose-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        name="concerns"
                        value={concern}
                        checked={formData.concerns.includes(concern)}
                        onChange={handleInputChange}
                        className="text-rose-600 focus:ring-rose-200"
                      />
                      <span className="text-gray-700">{concern}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Current Routine */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Current Skincare Routine
                </label>
                <textarea
                  name="currentRoutine"
                  value={formData.currentRoutine}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe your current skincare products and routine (e.g., 'Morning: cleanser, vitamin C serum, moisturizer, sunscreen')"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-colors resize-none"
                />
              </div>

              {/* Lifestyle Factors */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    Living Environment
                  </label>
                  <select
                    name="environment"
                    value={formData.environment}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-colors"
                  >
                    <option value="">Select your environment</option>
                    {environments.map(env => (
                      <option key={env} value={env}>{env}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    Stress Level
                  </label>
                  <select
                    name="stressLevel"
                    value={formData.stressLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-colors"
                  >
                    <option value="">Select stress level</option>
                    {stressLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Diet & Nutrition
                </label>
                <select
                  name="diet"
                  value={formData.diet}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-colors"
                >
                  <option value="">Select your typical diet</option>
                  {diets.map(diet => (
                    <option key={diet} value={diet}>{diet}</option>
                  ))}
                </select>
              </div>

              {/* Skin Goals */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Skin Goals & Preferences
                </label>
                <textarea
                  name="goals"
                  value={formData.goals}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="What are your main skin goals? Any product preferences or sensitivities?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-colors resize-none"
                />
              </div>

              {/* Allergies */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Known Allergies or Sensitivities
                </label>
                <input
                  type="text"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  placeholder="e.g., fragrance, essential oils, specific ingredients"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-colors"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 py-4 px-6 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-300"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-rose-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-rose-700 disabled:opacity-50 transition-colors duration-300 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Analyzing Your Skin...
                    </>
                  ) : (
                    'Get Expert Analysis'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 4: Results */}
        {currentStep === 4 && analysisData && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-rose-600 text-white p-8 text-center">
              <FaCheckCircle className="text-3xl mx-auto mb-4" />
              <h2 className="text-3xl font-semibold mb-2">Analysis Complete!</h2>
              <p className="text-rose-100">
                Your personalized skin report is ready
              </p>
            </div>

            <div className="p-8">
              {/* Summary */}
              <div className="bg-rose-50 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-semibold text-rose-800 mb-4">Skin Summary</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Skin Type</p>
                    <p className="font-semibold text-gray-800">{analysisData.skinType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Main Concerns</p>
                    <p className="font-semibold text-gray-800">{analysisData.concerns.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Severity</p>
                    <p className="font-semibold text-gray-800">{analysisData.severity}</p>
                  </div>
                </div>
              </div>

              {/* Expert Notes */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-rose-800 mb-4">Expert Assessment</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed">{analysisData.expertNotes}</p>
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      <strong>Expected Timeline:</strong> {analysisData.timeline}
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Recommendations */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-rose-800 mb-6">Recommended Products</h3>
                <div className="space-y-4">
                  {analysisData.recommendations.map((product, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-rose-50 transition-colors">
                      <div className="bg-rose-100 text-rose-600 p-3 rounded-lg">
                        <FaStar className="text-lg" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{product.product}</h4>
                        <p className="text-sm text-gray-600 mb-1">{product.category}</p>
                        <p className="text-gray-700">{product.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">Next Steps</h3>
                <ul className="space-y-2 text-blue-700">
                  <li className="flex items-center">
                    <FaCheckCircle className="mr-3 text-blue-600" />
                    Your detailed report has been sent to {formData.email}
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="mr-3 text-blue-600" />
                    Our skincare expert will follow up in 24-48 hours
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="mr-3 text-blue-600" />
                    Recommended products have been saved to your account
                  </li>
                </ul>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={resetAnalysis}
                  className="flex-1 py-4 px-6 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-300"
                >
                  New Analysis
                </button>
                <button className="flex-1 bg-rose-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-rose-700 transition-colors duration-300">
                  Shop Recommended Products
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-rose-100">
            <div className="relative inline-block">
              <FaShieldAlt className="text-rose-600 text-2xl mx-auto mb-3" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">AI + Expert Review</h3>
            <p className="text-sm text-gray-600">Advanced analysis verified by dermatologists</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-rose-100">
            <div className="relative inline-block">
              <FaLock className="text-rose-600 text-2xl mx-auto mb-3" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">HIPAA Compliant</h3>
            <p className="text-sm text-gray-600">Medical-grade data protection</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-rose-100">
            <div className="relative inline-block">
              <FaUser className="text-rose-600 text-2xl mx-auto mb-3" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">200+ Parameters</h3>
            <p className="text-sm text-gray-600">Comprehensive skin health assessment</p>
          </div>
        </div>
      </div>

      {/* Custom CSS for scanning animation */}
      <style jsx>{`
        @keyframes scan-beam {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
        .animate-scan-beam {
          animation: scan-beam 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SkinClinic;