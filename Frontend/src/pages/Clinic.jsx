import { useState, useRef, useEffect } from 'react';
import { FaUpload, FaCamera, FaUser, FaStar, FaShieldAlt, FaLock, FaCheckCircle, FaArrowRight, FaImages, FaPhone, FaClock } from 'react-icons/fa';

const SkinClinic = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(true);
  const [revealProgress, setRevealProgress] = useState(0);
  const [scanCycle, setScanCycle] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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
  const revealIntervalRef = useRef(null);
  const pauseTimeoutRef = useRef(null);

  // Pinkish color scheme
  const skinTypes = ['Dry', 'Oily', 'Combination', 'Normal', 'Sensitive', 'Hyperpigmentation-prone'];
  const skinConcerns = [
    'Hyperpigmentation',
    'Dark Spots',
    'Acne & Breakouts',
    'Aging & Wrinkles',
    'Uneven Skin Tone',
    'Ashy/Dry Patches',
    'Keloid Formation',
    'Razor Bumps',
    'Melasma',
    'Skin Brightening',
    'Large Pores',
    'Dark Circles'
  ];
  const environments = ['Urban/Polluted', 'Rural', 'Coastal/Humid', 'Dry/Desert', 'Seasonal Changes'];
  const stressLevels = ['Low', 'Moderate', 'High', 'Very High'];
  const diets = ['Balanced', 'Vegetarian', 'Vegan', 'Traditional African', 'High Sugar', 'High Dairy', 'Low Fat', 'Mediterranean'];

  // Continuous scanning animation
  useEffect(() => {
    if (currentStep === 1) {
      const startScanningCycle = () => {
        setIsScanning(true);
        setScanProgress(0);
        setRevealProgress(0);
        
        scanIntervalRef.current = setInterval(() => {
          setScanProgress(prev => {
            if (prev >= 100) {
              clearInterval(scanIntervalRef.current);
              
              setRevealProgress(0);
              revealIntervalRef.current = setInterval(() => {
                setRevealProgress(prev => {
                  if (prev >= 100) {
                    clearInterval(revealIntervalRef.current);
                    
                    setScanCycle(prev => prev + 1);
                    pauseTimeoutRef.current = setTimeout(() => {
                      startScanningCycle();
                    }, 10000);
                    
                    return 100;
                  }
                  return prev + 2;
                });
              }, 60);
              
              return 100;
            }
            return prev + 2;
          });
        }, 100);
      };

      startScanningCycle();
    }

    return () => {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
      if (revealIntervalRef.current) clearInterval(revealIntervalRef.current);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, [currentStep]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.slice(0, 4 - selectedImages.length);
    
    if (newImages.length > 0) {
      const readers = newImages.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then(imageDataUrls => {
        setSelectedImages(prev => [...prev, ...imageDataUrls]);
      });
    }
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
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

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.startsWith('0')) {
      value = '254' + value.slice(1);
    }
    if (!value.startsWith('254')) {
      value = '254' + value;
    }
    if (value.length > 12) {
      value = value.slice(0, 12);
    }
    setFormData(prev => ({ ...prev, phone: value }));
  };

  const submitAnalysis = async (e) => {
    e.preventDefault();
    if (selectedImages.length === 0) {
      alert('Please upload at least one image for analysis');
      return;
    }
    if (!formData.phone.startsWith('254') || formData.phone.length !== 12) {
      alert('Please enter a valid Kenyan phone number starting with 254');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      setAnalysisData({
        skinType: 'Combination with Hyperpigmentation Tendency',
        concerns: ['Hyperpigmentation', 'Uneven Skin Tone', 'Dark Spots'],
        skinToneAnalysis: 'Rich Melanin-Rich Skin (Fitzpatrick V)',
        melaninProtection: 'High natural UV protection (SPF ~13)',
        identifiedIssues: [
          'Moderate hyperpigmentation on cheeks',
          'Mild uneven skin texture',
          'Early signs of melasma',
          'Good skin elasticity'
        ],
        improvements: [
          'Hyperpigmentation reduced by 65%',
          'Skin tone evenness improved by 80%',
          'Texture smoothness increased by 45%',
          'Overall radiance boosted by 70%'
        ],
        recommendations: [
          {
            product: 'Gentle Brightening Cleanser',
            category: 'Cleanser',
            reason: 'Gentle cleansing without stripping natural oils, helps even skin tone',
            keyIngredients: ['Niacinamide', 'Licorice Root Extract', 'Willow Bark']
          },
          {
            product: 'Vitamin C + Niacinamide Serum',
            category: 'Treatment',
            reason: 'Targets hyperpigmentation and regulates oil production',
            keyIngredients: ['15% Vitamin C', '5% Niacinamide', 'Zinc PCA']
          },
          {
            product: 'Shea Butter Moisturizer',
            category: 'Moisturizer',
            reason: 'Rich hydration to prevent ashy appearance',
            keyIngredients: ['Organic Shea Butter', 'Hyaluronic Acid', 'Ceramides']
          },
          {
            product: 'Mineral Sunscreen SPF 50',
            category: 'Sun Protection',
            reason: 'Essential for preventing dark spots from worsening',
            keyIngredients: ['Zinc Oxide', 'Titanium Dioxide', 'Antioxidant Complex']
          }
        ],
        culturalConsiderations: [
          'Natural oils help maintain skin barrier function',
          'Higher collagen density provides natural aging resistance',
          'Require specific ingredients to address hyperpigmentation'
        ],
        expertNotes: 'Based on our analysis of your uploaded images, our skin specialists have identified excellent potential for improvement. Your melanin-rich skin shows good natural sun protection but requires careful management of hyperpigmentation.',
        severity: 'Moderate',
        timeline: '6-8 weeks for visible improvement in skin tone evenness',
        specialTips: [
          'Always use sunscreen to prevent dark spots from darkening',
          'Avoid harsh bleaching products',
          'Consider professional treatments for stubborn hyperpigmentation',
          'Use gentle exfoliation 2-3 times weekly'
        ],
        expertDetails: {
          name: 'Dr. Amina Johnson',
          specialty: 'Dermatology & African Skin Specialist',
          experience: '12 years',
          verified: true
        },
        processingTime: '7-14 days'
      });
      setCurrentStep(4);
      setIsLoading(false);
    }, 3000);
  };

  const resetAnalysis = () => {
    setSelectedImages([]);
    setAnalysisData(null);
    setCurrentStep(1);
    setScanProgress(0);
    setRevealProgress(0);
    setScanCycle(0);
    setIsScanning(true);
    setFormData({
      name: '', email: '', phone: '', age: '', skinType: '', concerns: [],
      currentRoutine: '', allergies: '', goals: '', environment: '',
      stressLevel: '', diet: ''
    });
  };

  // Enhanced Face scanning animation with pinkish colors
  const FaceScanAnimation = () => {
    const imageUrl = "https://cdn.pixabay.com/photo/2024/06/18/17/43/ai-generated-8838478_640.png";
    
    return (
      <div className="relative w-full max-w-md mx-auto mb-8">
        <div className="relative bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 shadow-lg border border-pink-100">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-pink-800 mb-2">
              {isScanning ? 'Demo Analysis in Progress' : 'Analysis Complete'}
            </h3>
            <p className="text-sm text-pink-600">
              {isScanning ? 'Continuous scanning demonstration...' : 'Ready for your actual analysis'}
            </p>
            <div className="text-xs text-pink-500 mt-1">
              Cycle: {scanCycle + 1} • {isScanning ? 'Scanning' : revealProgress < 100 ? 'Revealing' : 'Paused'}
            </div>
          </div>

          <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-pink-100 to-rose-100 p-4 shadow-inner mb-6">
            <div className="relative">
              <img 
                src={imageUrl}
                alt="African woman skin analysis demo"
                className="w-full h-64 object-cover rounded-lg transition-all duration-1000"
                style={{
                  filter: `blur(${Math.max(0, 8 - (revealProgress / 100) * 8)}px) brightness(${1 + (revealProgress / 100) * 0.3})`,
                  transform: `scale(${1 + (revealProgress / 100) * 0.1})`
                }}
              />
              
              <div 
                className="absolute inset-0 rounded-lg overflow-hidden"
                style={{
                  clipPath: `inset(0 ${100 - revealProgress}% 0 0)`
                }}
              >
                <img 
                  src={imageUrl}
                  alt="African woman skin analysis - cleared"
                  className="w-full h-64 object-cover rounded-lg"
                  style={{
                    filter: 'brightness(1.1) contrast(1.1)',
                  }}
                />
                
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/10 to-purple-400/5 rounded-lg"
                  style={{
                    opacity: revealProgress / 100
                  }}
                />
              </div>

              {isScanning && (
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-pink-400 to-rose-400 rounded-full shadow-lg animate-scan-beam z-10"
                  style={{
                    left: `${scanProgress}%`,
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div className="absolute inset-0 bg-pink-300 rounded-full animate-ping"></div>
                </div>
              )}

              <div className="absolute bottom-4 left-4 bg-pink-600/90 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                Demo
              </div>
              <div 
                className="absolute bottom-4 right-4 bg-fuchsia-500/90 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm transition-all duration-500"
                style={{
                  opacity: revealProgress > 10 ? 1 : 0,
                  transform: `translateX(${revealProgress > 10 ? 0 : 20}px)`
                }}
              >
                Preview
              </div>
            </div>

            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-1000"
              style={{
                opacity: revealProgress >= 100 && !isScanning ? 1 : 0
              }}
            >
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                <div className="text-center text-white drop-shadow-lg">
                  <div className="text-lg font-bold mb-1">⏸️ Analysis Paused</div>
                  <div className="text-sm opacity-90">Next scan in {10 - (scanCycle % 10)}s</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm text-pink-700 mb-2">
              <span>Demo Mode</span>
              <span className="font-semibold">
                {isScanning 
                  ? `Scanning... ${scanProgress}%` 
                  : revealProgress < 100 
                    ? `Revealing... ${revealProgress}%` 
                    : 'Paused (10s)'}
              </span>
            </div>
            <div className="w-full bg-pink-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-pink-500 to-rose-500 h-3 rounded-full transition-all duration-300 ease-out shadow-inner"
                style={{ width: `${isScanning ? scanProgress : revealProgress}%` }}
              >
                <div className="w-full h-full bg-gradient-to-r from-transparent to-white/30 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section with Pink Colors */}
        <div className="text-center mb-12">
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
            Dubois Beauty Skin Clinic
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional Skin Analysis for Melanin-Rich Skin
          </p>
          <div className="mt-4 bg-gradient-to-r from-pink-100 to-rose-100 inline-block px-6 py-3 rounded-full border border-pink-200">
            <span className="text-pink-800 font-semibold text-sm flex items-center">
              <FaUser className="mr-2" />
              Real Dermatologist Analysis - Not AI
            </span>
          </div>
        </div>

        {/* Progress Steps with Pink Colors */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-8 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-pink-100">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  currentStep >= step 
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 border-transparent text-white shadow-lg' 
                    : 'border-pink-200 text-pink-300 bg-white'
                }`}>
                  {currentStep > step ? <FaCheckCircle /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 rounded-full transition-all duration-300 ${
                    currentStep > step 
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500' 
                      : 'bg-pink-100'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Upload Section */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-pink-100">
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-2xl mb-8 border border-pink-200">
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <FaCamera className="text-pink-600 text-3xl" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-fuchsia-500 rounded-full animate-ping"></div>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-pink-800 mb-4">
                Expert Skin Analysis
              </h2>
              <p className="text-gray-600 mb-6">
                Get personalized recommendations from certified dermatologists specializing in African skin
              </p>
              
              <FaceScanAnimation />

              <div className="grid md:grid-cols-3 gap-4 mb-6 max-w-2xl mx-auto">
                {[
                  { icon: '👩‍⚕️', text: 'Real Experts', subtext: 'Not AI' },
                  { icon: '📸', text: 'Multi-Angle', subtext: '4 Images Max' },
                  { icon: '💬', text: 'Personalized', subtext: 'Custom Routine' }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-white p-3 rounded-lg shadow-sm mb-2 border border-pink-200">
                      <span className="text-xl">{item.icon}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800">{item.text}</p>
                    <p className="text-xs text-gray-600">{item.subtext}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Multiple Image Upload Section */}
            <div className="border-2 border-dashed border-pink-200 rounded-2xl p-8 mb-6 bg-gradient-to-br from-pink-25 to-rose-25">
              <div className="relative">
                <FaImages className="text-pink-400 text-4xl mx-auto mb-4" />
                <div className="absolute top-0 right-1/3 w-4 h-4 bg-pink-500 rounded-full animate-ping"></div>
              </div>
              
              <h3 className="text-lg font-semibold text-pink-700 mb-2">
                Upload Your Skin Photos
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                For best results, upload clear photos from different angles (max 4 images)
              </p>

              {/* Processing Time Notice */}
              <div className="bg-gradient-to-r from-fuchsia-50 to-purple-50 rounded-lg p-4 mb-6 border border-fuchsia-200">
                <div className="flex items-center justify-center space-x-2 text-fuchsia-800">
                  <FaClock className="text-fuchsia-600" />
                  <span className="font-semibold">Please Note:</span>
                  <span>Results take 7-14 days for expert review</span>
                </div>
              </div>

              {/* Image Upload Guidelines */}
              <div className="bg-purple-50 rounded-lg p-4 mb-6 text-left border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                  <FaCamera className="mr-2" />
                  Photo Guidelines:
                </h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Front face view (no makeup)</li>
                  <li>• Left and right profile views</li>
                  <li>• Close-up of specific concerns</li>
                  <li>• Good natural lighting</li>
                  <li>• Clear, in-focus images</li>
                </ul>
              </div>

              {/* Selected Images Preview */}
              {selectedImages.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-pink-700 mb-3 flex items-center">
                    <FaImages className="mr-2" />
                    Selected Images ({selectedImages.length}/4)
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={image} 
                          alt={`Skin view ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg shadow-sm"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-fuchsia-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-fuchsia-600 transition-colors shadow-lg"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent text-white text-xs p-1 rounded-b-lg">
                          View {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={selectedImages.length >= 4}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center group shadow-lg"
              >
                <FaUpload className="mr-2 group-hover:scale-110 transition-transform duration-300" />
                {selectedImages.length === 0 
                  ? 'Upload Your Photos' 
                  : `Add More Photos (${4 - selectedImages.length} remaining)`}
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                className="hidden"
              />

              <p className="text-xs text-gray-500 mt-3">
                Supported formats: JPG, PNG • Max 4 images • 10MB per image
              </p>
            </div>

            {/* Expert Analysis Notice */}
            <div className="bg-gradient-to-r from-pink-50 to-fuchsia-50 rounded-lg p-4 text-left max-w-2xl mx-auto border border-pink-200">
              <div className="flex items-start">
                <div className="relative">
                  <FaUser className="text-pink-600 mt-1 mr-3 flex-shrink-0" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full"></div>
                </div>
                <div>
                  <p className="font-semibold text-pink-800 flex items-center">
                    <FaUser className="mr-2" />
                    Real Expert Analysis - Not AI
                  </p>
                  <p className="text-sm text-pink-700 mt-1">
                    Your photos will be personally reviewed by certified dermatologists specializing in melanin-rich skin. 
                    This is not an AI analysis - you'll receive personalized recommendations from real skin experts.
                    <strong> Please allow 7-14 days for thorough expert review.</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            {selectedImages.length > 0 && (
              <button
                onClick={() => setCurrentStep(2)}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-300 mt-6 flex items-center justify-center group shadow-lg hover:shadow-xl"
              >
                Continue to Profile
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            )}
          </div>
        )}

        {/* Step 2: Basic Information with Phone Field */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-pink-100">
            <div className="grid md:grid-cols-2">
              {/* Image Preview */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-8">
                <h3 className="text-lg font-semibold text-pink-800 mb-4">Your Uploaded Photos</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={image} 
                        alt={`Skin view ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg shadow-sm"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent text-white text-xs p-1 rounded-b-lg text-center">
                        View {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setCurrentStep(1)}
                  className="text-pink-600 hover:text-pink-700 text-sm font-medium mt-4 flex items-center"
                >
                  <FaArrowRight className="mr-1 rotate-180" />
                  Change photos
                </button>
              </div>

              {/* Basic Information Form */}
              <div className="p-8">
                <h2 className="text-2xl font-semibold text-pink-800 mb-6">
                  Tell Us About Yourself
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number (Kenyan) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaPhone className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        placeholder="254..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Must start with 254 (Kenyan number format)
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors"
                      >
                        <option value="">Select skin type</option>
                        {skinTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 mt-8">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 py-4 px-6 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-colors duration-300 flex items-center justify-center group shadow-lg"
                  >
                    Continue
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Detailed Questionnaire */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-pink-100">
            <h2 className="text-2xl font-semibold text-pink-800 mb-2">
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
                    <label key={concern} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-pink-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        name="concerns"
                        value={concern}
                        checked={formData.concerns.includes(concern)}
                        onChange={handleInputChange}
                        className="text-pink-600 focus:ring-pink-200"
                      />
                      <span className="text-gray-700">{concern}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Processing Time Reminder */}
              <div className="bg-gradient-to-r from-fuchsia-50 to-purple-50 rounded-lg p-4 border border-fuchsia-200">
                <div className="flex items-center space-x-3">
                  <FaClock className="text-fuchsia-600 text-xl" />
                  <div>
                    <p className="font-semibold text-fuchsia-800">Expert Review Timeline</p>
                    <p className="text-sm text-fuchsia-700">
                      Your analysis will be personally reviewed by our dermatologists within 7-14 days. 
                      This ensures thorough, personalized recommendations for your skin.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-start">
                  <div className="relative">
                    <FaUser className="text-purple-600 mt-1 mr-3 flex-shrink-0" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-semibold text-purple-800">Real Expert Review Process</p>
                    <p className="text-sm text-purple-700">
                      Your information and photos will be personally reviewed within 7-14 days by our team of dermatologists. 
                      This is not an AI analysis - you'll receive personalized recommendations from real skin experts.
                    </p>
                  </div>
                </div>
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
                  className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 transition-colors duration-300 flex items-center justify-center shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending to Experts...
                    </>
                  ) : (
                    'Submit for Expert Analysis'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 4: Results */}
        {currentStep === 4 && analysisData && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-pink-100">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-8 text-center">
              <FaCheckCircle className="text-3xl mx-auto mb-4" />
              <h2 className="text-3xl font-semibold mb-2">Analysis Submitted Successfully!</h2>
              <p className="text-pink-100">
                Your photos have been sent to our expert dermatologists
              </p>
            </div>

            <div className="p-8">
              {/* Processing Time Notice */}
              <div className="bg-gradient-to-r from-fuchsia-50 to-purple-50 rounded-xl p-6 mb-8 border border-fuchsia-200">
                <div className="flex items-center space-x-4">
                  <div className="bg-fuchsia-500 text-white p-3 rounded-full">
                    <FaClock className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-fuchsia-800 mb-2">
                      Expected Review Time: 7-14 Days
                    </h3>
                    <p className="text-fuchsia-700">
                      Our dermatologists are personally reviewing your case. You'll receive your personalized 
                      skincare plan via email and SMS to {formData.phone} within 7-14 days.
                    </p>
                  </div>
                </div>
              </div>

              {/* Expert Details */}
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6 mb-8 border border-pink-200">
                <div className="flex items-center space-x-4">
                  <div className="bg-pink-500 text-white p-3 rounded-full">
                    <FaUser className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-pink-800">
                      {analysisData.expertDetails.name}
                    </h3>
                    <p className="text-pink-600 text-sm">{analysisData.expertDetails.specialty}</p>
                    <p className="text-pink-500 text-xs">Experience: {analysisData.expertDetails.experience}</p>
                  </div>
                  <div className="ml-auto bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    ✅ Verified Expert
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-purple-50 rounded-xl p-6 mb-8 border border-purple-200">
                <h3 className="text-xl font-semibold text-purple-800 mb-4">What Happens Next?</h3>
                <div className="space-y-3 text-purple-700">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span>Our dermatologists will personally review your photos and information</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span>You'll receive a comprehensive skincare plan via email and SMS</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span>Follow-up consultation available if needed</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Trust Indicators */}
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-pink-100">
                  <div className="text-2xl mb-3">👩‍⚕️</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Real Experts</h3>
                  <p className="text-sm text-gray-600">Certified dermatologists, not AI</p>
                </div>
                <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-pink-100">
                  <div className="text-2xl mb-3">⏰</div>
                  <h3 className="font-semibold text-gray-800 mb-2">7-14 Day Review</h3>
                  <p className="text-sm text-gray-600">Thorough personal analysis</p>
                </div>
                <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-pink-100">
                  <div className="text-2xl mb-3">💬</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Follow-up Support</h3>
                  <p className="text-sm text-gray-600">Continued expert guidance</p>
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={resetAnalysis}
                  className="flex-1 py-4 px-6 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-300"
                >
                  New Analysis
                </button>
                <button className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-colors duration-300 shadow-lg">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes scan-beam {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
        .animate-scan-beam {
          animation: scan-beam 1s ease-in-out infinite;
        }
        
        .bg-pink-25 {
          background-color: #fdf2f8;
        }
        .bg-rose-25 {
          background-color: #fff1f2;
        }
      `}</style>
    </div>
  );
};

export default SkinClinic;