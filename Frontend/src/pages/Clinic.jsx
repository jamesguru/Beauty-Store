import React, { useState, useRef, useEffect } from 'react';
import { 
  FaUpload, FaCamera, FaUser, FaCheckCircle, FaArrowRight, 
  FaImages, FaPhone, FaClock, FaEnvelope 
} from 'react-icons/fa';
import axios from "axios";
import { userRequest } from '../requestMethods';

const SkinClinic = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploading, setUploading] = useState("Ready to upload");
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

  // Options data
  const skinTypes = ['Dry', 'Oily', 'Combination', 'Normal', 'Sensitive', 'Hyperpigmentation-prone'];
  const skinConcerns = [
    'Hyperpigmentation', 'Dark Spots', 'Acne & Breakouts', 'Aging & Wrinkles', 
    'Uneven Skin Tone', 'Ashy/Dry Patches', 'Keloid Formation', 'Razor Bumps', 
    'Melasma', 'Skin Brightening', 'Large Pores', 'Dark Circles'
  ];
  const environments = ['Urban/Polluted', 'Rural', 'Coastal/Humid', 'Dry/Desert', 'Seasonal Changes'];
  const stressLevels = ['Low', 'Moderate', 'High', 'Very High'];
  const diets = ['Balanced', 'Vegetarian', 'Vegan', 'Traditional African', 'High Sugar', 'High Dairy', 'Low Fat', 'Mediterranean'];

  // Image compression function
  const compressImageToWebP = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        try {
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            const ratio = maxWidth / width;
            width = maxWidth;
            height = height * ratio;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(resolve, 'image/webp', quality);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const imageChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files).slice(0, 4 - selectedImages.length);
      
      if (files.length === 0) {
        alert('You can only upload up to 4 images');
        return;
      }

      setUploading("Compressing images to WebP...");
      
      try {
        const compressedImages = await Promise.all(
          files.map(async (file) => {
            const compressedBlob = await compressImageToWebP(file);
            return {
              originalFile: file,
              compressedBlob: compressedBlob,
              preview: URL.createObjectURL(compressedBlob),
              name: file.name.replace(/\.[^/.]+$/, ".webp")
            };
          })
        );

        setSelectedImages(prev => [...prev, ...compressedImages]);
        setUploading(`Added ${files.length} WebP image(s). Ready to upload.`);
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error compressing images:', error);
        setUploading("Error compressing images");
      }
    }
  };

  const removeImage = (index) => {
    setSelectedImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // Upload images to Cloudinary
  const uploadImagesToCloudinary = async () => {
    const uploadedUrls = [];
    
    for (let i = 0; i < selectedImages.length; i++) {
      const image = selectedImages[i];
      const data = new FormData();
      
      const webpFile = new File([image.compressedBlob], `skin_assessment_${Date.now()}_${i}.webp`, {
        type: 'image/webp',
      });
      
      data.append("file", webpFile);
      data.append("upload_preset", "uploads");
      
      setUploading(`Uploading WebP image ${i + 1} of ${selectedImages.length}...`);
      
      try {
        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dkjenslgr/image/upload",
          data,
          {
            onUploadProgress: (progressEvent) => {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploading(`Uploading image ${i + 1}: ${progress}%`);
            }
          }
        );

        uploadedUrls.push(uploadRes.data.secure_url);
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload images to Cloudinary');
      }
    }

    setUploading("Images uploaded successfully!");
    return uploadedUrls;
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
    setUploading("Starting image upload...");

    try {
      const uploadedUrls = await uploadImagesToCloudinary();
      setUploading("Submitting assessment...");

      const assessmentData = {
        ...formData,
        images: uploadedUrls,
        age: formData.age ? parseInt(formData.age) : undefined
      };

      const response = await userRequest.post("/clinic", assessmentData);

      if (response.data.success) {
        setAnalysisData({
          ...response.data.data,
          expertDetails: {
            name: 'Dr. Amina Johnson',
            specialty: 'Dermatology & African Skin Specialist',
            experience: '12 years',
            verified: true
          },
          processingTime: '7-14 days'
        });
        setCurrentStep(4);
        setUploading("Assessment submitted successfully!");
      } else {
        throw new Error(response.data.message || 'Failed to submit assessment');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setUploading("Upload failed. Please try again.");
      alert(error.response?.data?.message || 'Failed to submit assessment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImages([]);
    setAnalysisData(null);
    setCurrentStep(1);
    setUploading("Ready to upload");
    setFormData({
      name: '', email: '', phone: '', age: '', skinType: '', concerns: [],
      currentRoutine: '', allergies: '', goals: '', environment: '',
      stressLevel: '', diet: ''
    });
  };

  // Calculate size savings
  const calculateSizeSavings = () => {
    if (selectedImages.length === 0) return null;
    
    let originalSize = 0;
    let compressedSize = 0;
    
    selectedImages.forEach(image => {
      originalSize += image.originalFile.size;
      compressedSize += image.compressedBlob.size;
    });
    
    const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
    return { originalSize, compressedSize, savings };
  };

  const sizeInfo = calculateSizeSavings();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
            Dubois Beauty Skin Clinic
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional Skin Analysis for Melanin-Rich Skin
          </p>
          <div className="mt-4 bg-gradient-to-r from-pink-100 to-rose-100 inline-block px-6 py-3 rounded-full border border-pink-200">
            <span className="text-pink-800 font-semibold text-sm flex items-center justify-center">
              <FaUser className="mr-2" />
              Real Dermatologist Analysis - Not AI
            </span>
          </div>
        </div>

        {/* Progress Steps */}
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

        {/* Step 1: Image Upload */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-pink-100">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <FaCamera className="text-pink-600 text-4xl" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-fuchsia-500 rounded-full animate-ping"></div>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-pink-800 mb-2">
                Upload Your Skin Photos
              </h2>
              <p className="text-gray-600">
                For best results, upload clear photos from different angles (max 4 images)
              </p>
            </div>

            {/* Image Upload Area */}
            <div className="border-2 border-dashed border-pink-200 rounded-2xl p-8 mb-6 bg-gradient-to-br from-pink-25 to-rose-25">
              
              {/* Selected Images Preview */}
              {selectedImages.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-pink-700 mb-4 flex items-center">
                    <FaImages className="mr-2" />
                    Selected Images ({selectedImages.length}/4)
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={image.preview}
                          alt={`Skin view ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg shadow-sm"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-fuchsia-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-fuchsia-600 transition-colors shadow-lg"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent text-white text-xs p-1 rounded-b-lg text-center">
                          View {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Size Savings */}
                  {sizeInfo && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-sm text-green-700 font-medium">
                        Size Optimization: {sizeInfo.savings}% smaller
                      </div>
                      <div className="text-xs text-green-600">
                        Original: {(sizeInfo.originalSize / 1024 / 1024).toFixed(2)}MB → 
                        Compressed: {(sizeInfo.compressedSize / 1024 / 1024).toFixed(2)}MB
                      </div>
                    </div>
                  )}

                  {/* Upload Status */}
                  <div className={`text-sm font-medium mt-3 text-center ${
                    uploading.includes('success') ? 'text-green-600' : 
                    uploading.includes('fail') || uploading.includes('error') ? 'text-red-600' : 
                    'text-blue-600'
                  }`}>
                    {uploading}
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={selectedImages.length >= 4}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center group shadow-lg mb-4"
              >
                <FaUpload className="mr-2 group-hover:scale-110 transition-transform duration-300" />
                {selectedImages.length === 0 
                  ? 'Upload Your Photos' 
                  : `Add More Photos (${4 - selectedImages.length} remaining)`}
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={imageChange}
                accept="image/*"
                multiple
                className="hidden"
              />

              <p className="text-xs text-gray-500 text-center">
                Supported formats: JPG, PNG • Max 4 images • 10MB per image
              </p>
            </div>

            {/* Guidelines */}
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200 mb-6">
              <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                <FaCamera className="mr-2" />
                Photo Guidelines:
              </h4>
              <ul className="text-sm text-purple-700 space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Front face view (no makeup)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Left and right profile views
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Close-up of specific concerns
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Good natural lighting
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Clear, in-focus images
                </li>
              </ul>
            </div>

            {/* Continue Button */}
            {selectedImages.length > 0 && (
              <button
                onClick={() => setCurrentStep(2)}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-300 flex items-center justify-center group shadow-lg hover:shadow-xl"
              >
                Continue to Profile
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            )}
          </div>
        )}

        {/* Step 2: Basic Information */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-pink-100">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              
              {/* Image Preview */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-pink-800 mb-4">Your Photos</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={image.preview}
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

              {/* Form */}
              <div>
                <h2 className="text-2xl font-semibold text-pink-800 mb-6">
                  Personal Information
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
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors"
                        required
                      />
                    </div>
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

              {/* Additional Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Environment
                  </label>
                  <select
                    name="environment"
                    value={formData.environment}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors"
                  >
                    <option value="">Select environment</option>
                    {environments.map(env => (
                      <option key={env} value={env}>{env}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stress Level
                  </label>
                  <select
                    name="stressLevel"
                    value={formData.stressLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors"
                  >
                    <option value="">Select stress level</option>
                    {stressLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diet
                </label>
                <select
                  name="diet"
                  value={formData.diet}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors"
                >
                  <option value="">Select diet</option>
                  {diets.map(diet => (
                    <option key={diet} value={diet}>{diet}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Skincare Routine
                </label>
                <textarea
                  name="currentRoutine"
                  value={formData.currentRoutine}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors"
                  placeholder="Describe your current skincare products and routine..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skin Goals
                </label>
                <textarea
                  name="goals"
                  value={formData.goals}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors"
                  placeholder="What are your main skin goals?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allergies or Sensitivities
                </label>
                <input
                  type="text"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors"
                  placeholder="List any allergies or sensitivities..."
                />
              </div>

              {/* Processing Time Notice */}
              <div className="bg-gradient-to-r from-fuchsia-50 to-purple-50 rounded-lg p-6 border border-fuchsia-200">
                <div className="flex items-center space-x-4">
                  <div className="bg-fuchsia-500 text-white p-3 rounded-full">
                    <FaClock className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-fuchsia-800 mb-2">
                      Expert Review Timeline: 7-14 Days
                    </h3>
                    <p className="text-fuchsia-700 text-sm">
                      Your assessment will be personally reviewed by certified dermatologists. 
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
                      {uploading}
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
              <FaCheckCircle className="text-4xl mx-auto mb-4" />
              <h2 className="text-3xl font-semibold mb-2">Analysis Submitted Successfully!</h2>
              <p className="text-pink-100 text-lg">
                Your photos have been sent to our expert dermatologists
              </p>
            </div>

            <div className="p-8">
              
              {/* Processing Time Notice */}
              <div className="bg-gradient-to-r from-fuchsia-50 to-purple-50 rounded-xl p-6 mb-8 border border-fuchsia-200">
                <div className="flex items-center space-x-4">
                  <div className="bg-fuchsia-500 text-white p-3 rounded-full">
                    <FaClock className="text-2xl" />
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
                    <FaUser className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-pink-800">
                      {analysisData.expertDetails.name}
                    </h3>
                    <p className="text-pink-600">{analysisData.expertDetails.specialty}</p>
                    <p className="text-pink-500 text-sm">Experience: {analysisData.expertDetails.experience}</p>
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

              {/* Trust Indicators */}
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-pink-100">
                  <div className="text-3xl mb-3">👩‍⚕️</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Real Experts</h3>
                  <p className="text-sm text-gray-600">Certified dermatologists, not AI</p>
                </div>
                <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-pink-100">
                  <div className="text-3xl mb-3">⏰</div>
                  <h3 className="font-semibold text-gray-800 mb-2">7-14 Day Review</h3>
                  <p className="text-sm text-gray-600">Thorough personal analysis</p>
                </div>
                <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-pink-100">
                  <div className="text-3xl mb-3">💬</div>
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
    </div>
  );
};

export default SkinClinic;