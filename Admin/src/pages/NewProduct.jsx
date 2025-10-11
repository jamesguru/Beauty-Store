import { FaPlus, FaTrash, FaSearch } from 'react-icons/fa';
import axios from "axios";
import { userRequest } from '../requestMethods';
import { useState, useRef, useEffect } from 'react';

const NewProduct = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [inputs, setInputs] = useState({});
  const [uploading, setUploading] = useState("Ready to upload");
  const [selectedOptions, setSelectedOptions] = useState({
    concern: [],
    skintype: [],
    categories: [],
  });
  const [searchTerms, setSearchTerms] = useState({
    concern: '',
    skintype: '',
    categories: '',
  });
  const fileInputRef = useRef(null);

  // Complete beauty and cosmetics data
  const beautyData = {
    categories: [
      "Skincare",
      "Makeup",
      "Hair Care",
      "Fragrance",
      "Bath & Body",
      "Tools & Accessories",
      "Men's Care",
      "Sun Care",
      "Oral Care",
      "Wellness & Supplements",
      "Toners",
      "Serums",
      "Foundations",
      "Lotions",
      "Cleansers",
      "Moisturizers",
      "Face Masks",
      "Eye Creams",
      "Lip Care",
      "Face Oils",
      "Exfoliators & Scrubs",
      "Sunscreen",
      "BB & CC Creams",
      "Concealers",
      "Powders",
      "Blush",
      "Bronzers",
      "Highlighters",
      "Eyeshadow",
      "Eyeliner",
      "Mascara",
      "Eyebrow Products",
      "Lipstick",
      "Lip Gloss",
      "Lip Liner",
      "Makeup Remover",
      "Setting Sprays",
      "Primers",
      "Shampoo",
      "Conditioner",
      "Hair Masks",
      "Hair Oils",
      "Hair Serums",
      "Hair Styling",
      "Hair Color",
      "Hair Treatment",
      "Perfume",
      "Cologne",
      "Body Spray",
      "Body Lotion",
      "Body Wash",
      "Body Scrubs",
      "Hand Cream",
      "Body Oil",
      "Makeup Brushes",
      "Beauty Blenders",
      "Hair Tools",
      "Skincare Tools",
      "Shaving Products",
      "Beard Care",
      "Aftershave",
      "Toothpaste",
      "Mouthwash",
      "Teeth Whitening",
      "Vitamins",
      "Supplements"
    ],
    concern: [
      "Dry Skin",
      "Pigmentation",
      "Oil Control",
      "Anti Acne",
      "Sunburn",
      "Skin Brightening",
      "Tan Removal",
      "Night Routine",
      "UV Protection",
      "Damaged Hair",
      "Frizzy Hair",
      "Stretch Marks",
      "Color Protection",
      "Dry Hair",
      "Soothing",
      "Dandruff",
      "Greying",
      "Hairfall",
      "Hair Color",
      "Well Being",
      "Acne",
      "Hair Growth",
      "Anti Aging",
      "Wrinkles",
      "Fine Lines",
      "Dark Spots",
      "Hyperpigmentation",
      "Redness",
      "Irritation",
      "Sensitivity",
      "Rosacea",
      "Eczema",
      "Psoriasis",
      "Dark Circles",
      "Puffy Eyes",
      "Large Pores",
      "Blackheads",
      "Whiteheads",
      "Clogged Pores",
      "Uneven Skin Tone",
      "Dull Skin",
      "Dehydrated Skin",
      "Combination Skin",
      "Oily Scalp",
      "Dry Scalp",
      "Hair Breakage",
      "Split Ends",
      "Thinning Hair",
      "Scalp Health",
      "Curly Hair",
      "Straight Hair",
      "Wavy Hair",
      "Color Treated Hair",
      "Chemical Damage",
      "Heat Damage",
      "Body Acne",
      "Back Acne",
      "Body Odor",
      "Dry Hands",
      "Cracked Heels",
      "Cellulite",
      "Sun Damage",
      "Pollution Protection",
      "Blue Light Protection",
      "Menstrual Care",
      "Stress Relief",
      "Sleep Aid",
      "Energy Boost",
      "Immune Support",
      "Gut Health"
    ],
    skintype: [
      "All",
      "Oily",
      "Dry",
      "Sensitive",
      "Normal",
      "Combination",
      "Acne-Prone",
      "Mature",
      "Dehydrated"
    ]
  };

  // Filtered options based on search
  const getFilteredOptions = (field) => {
    const searchTerm = searchTerms[field].toLowerCase();
    if (!searchTerm) return beautyData[field];
    
    return beautyData[field].filter(option => 
      option.toLowerCase().includes(searchTerm)
    );
  };

  // Function to compress image and convert to WebP
  const compressImageToWebP = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        try {
          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            const ratio = maxWidth / width;
            width = maxWidth;
            height = height * ratio;
          }
          
          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;
          
          // Improve image quality with smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          // Draw image on canvas
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to WebP with specified quality
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
              name: file.name.replace(/\.[^/.]+$/, ".webp") // Change extension to .webp
            };
          })
        );

        setSelectedImages(prev => [...prev, ...compressedImages]);
        setUploading(`Added ${files.length} WebP image(s). Ready to upload.`);
        
        // Reset file input
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
      URL.revokeObjectURL(newImages[index].preview); // Clean up memory
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleSelectChange = (field, value) => {
    if (value && !selectedOptions[field].includes(value)) {
      setSelectedOptions((prev) => ({
        ...prev,
        [field]: [...prev[field], value],
      }));
    }
    // Clear search after selection
    setSearchTerms(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  const handleRemoveOption = (name, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: prev[name].filter((option) => option !== value)
    }));
  };

  const handleSearchChange = (field, value) => {
    setSearchTerms(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (selectedImages.length === 0) {
      alert('Please select at least one image');
      return;
    }

    if (!inputs.title || !inputs.desc) {
      alert('Please fill in all required fields (Title and Description)');
      return;
    }

    setUploading("Starting upload...");
    
    try {
      const uploadedUrls = [];
      
      // Upload images sequentially to avoid overwhelming the server
      for (let i = 0; i < selectedImages.length; i++) {
        const image = selectedImages[i];
        const data = new FormData();
        
        // Create a WebP file from the compressed blob
        const webpFile = new File([image.compressedBlob], `product_${Date.now()}_${i}.webp`, {
          type: 'image/webp',
        });
        
        data.append("file", webpFile);
        data.append("upload_preset", "uploads");
        
        setUploading(`Uploading WebP image ${i + 1} of ${selectedImages.length}...`);
        
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

        uploadedUrls.push(uploadRes.data.secure_url || uploadRes.data.url);
      }

      setUploading("Finalizing product creation...");
      
      // Prepare the product data according to the updated schema
      const productData = {
        title: inputs.title,
        desc: inputs.desc,
        whatinbox: inputs.whatinbox || "",
        img: uploadedUrls, // This is now an array of WebP image URLs
        video: inputs.video || "",
        wholesalePrice: inputs.wholesalePrice ? Number(inputs.wholesalePrice) : undefined,
        wholesaleMinimumQuantity: inputs.wholesaleMinimumQuantity ? Number(inputs.wholesaleMinimumQuantity) : undefined,
        categories: selectedOptions.categories,
        concern: selectedOptions.concern,
        brand: inputs.brand || "",
        skintype: selectedOptions.skintype,
        originalPrice: inputs.originalPrice ? Number(inputs.originalPrice) : undefined,
        discountedPrice: inputs.discountedPrice ? Number(inputs.discountedPrice) : undefined,
        inStock: true // Default to true
      };
      
      await userRequest.post("/products", productData);
      
      setUploading("Product created successfully with WebP images!");
      
      // Reset form after successful upload
      setTimeout(() => {
        setSelectedImages([]);
        setInputs({});
        setSelectedOptions({
          concern: [],
          skintype: [],
          categories: [],
        });
        setSearchTerms({
          concern: '',
          skintype: '',
          categories: '',
        });
        setUploading("Ready to upload");
      }, 2000);
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploading("Upload failed. Please try again.");
    }
  };

  // Calculate total size savings
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create New Product</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <form className="p-6 md:p-8" onSubmit={handleUpload}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* LEFT COLUMN */}
              <div className="space-y-6">
                {/* Image Upload Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <label className="block text-lg font-semibold text-gray-700 mb-4">
                    Product Images ({selectedImages.length}/4) - WebP Optimized
                  </label>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                          WebP
                        </div>
                      </div>
                    ))}
                    
                    {selectedImages.length < 4 && (
                      <label 
                        htmlFor="file" 
                        className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors"
                      >
                        <FaPlus className="text-gray-400 text-xl mb-1" />
                        <span className="text-sm text-gray-500">Add Image</span>
                      </label>
                    )}
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="file"
                    multiple
                    accept="image/*"
                    onChange={imageChange}
                    className="hidden"
                  />
                  
                  {/* Size Savings Information */}
                  {sizeInfo && (
                    <div className="mb-3 p-3 bg-green-50 rounded-lg">
                      <div className="text-sm text-green-700">
                        <strong>Size Optimization:</strong> {sizeInfo.savings}% smaller
                      </div>
                      <div className="text-xs text-green-600">
                        Original: {(sizeInfo.originalSize / 1024 / 1024).toFixed(2)}MB → 
                        Compressed: {(sizeInfo.compressedSize / 1024 / 1024).toFixed(2)}MB
                      </div>
                    </div>
                  )}
                  
                  <div className={`text-sm font-medium ${
                    uploading.includes('success') ? 'text-green-600' : 
                    uploading.includes('fail') || uploading.includes('error') ? 'text-red-600' : 
                    'text-blue-600'
                  }`}>
                    {uploading}
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Maximum 4 images. Images are automatically converted to WebP format for optimal loading and performance.
                  </p>
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
                    Basic Information
                  </h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={inputs.title || ''}
                      onChange={handleChange}
                      placeholder="Enter product name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Product Description *
                    </label>
                    <textarea
                      name="desc"
                      required
                      rows={4}
                      value={inputs.desc || ''}
                      onChange={handleChange}
                      placeholder="Describe the product features and benefits"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      What's in the Box
                    </label>
                    <input
                      type="text"
                      name="whatinbox"
                      value={inputs.whatinbox || ''}
                      onChange={handleChange}
                      placeholder="e.g., Product, Manual, Accessories"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                {/* Pricing Information */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
                    Pricing Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Original Price ($)
                      </label>
                      <input
                        type="number"
                        name="originalPrice"
                        value={inputs.originalPrice || ''}
                        onChange={handleChange}
                        placeholder="100.00"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Discounted Price ($)
                      </label>
                      <input
                        type="number"
                        name="discountedPrice"
                        value={inputs.discountedPrice || ''}
                        onChange={handleChange}
                        placeholder="80.00"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Wholesale Price ($)
                      </label>
                      <input
                        type="number"
                        name="wholesalePrice"
                        value={inputs.wholesalePrice || ''}
                        onChange={handleChange}
                        placeholder="70.00"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Min. Quantity
                      </label>
                      <input
                        type="number"
                        name="wholesaleMinimumQuantity"
                        value={inputs.wholesaleMinimumQuantity || ''}
                        onChange={handleChange}
                        placeholder="10"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Brand and Categories */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
                    Product Details
                  </h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Brand
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={inputs.brand || ''}
                      onChange={handleChange}
                      placeholder="Brand name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Video URL (Optional)
                    </label>
                    <input
                      type="text"
                      name="video"
                      value={inputs.video || ''}
                      onChange={handleChange}
                      placeholder="https://example.com/video.mp4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Dynamic Select Fields with Search */}
                  {['categories', 'concern', 'skintype'].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-600 mb-2 capitalize">
                        {field === 'skintype' ? 'Skin Type' : field} 
                        <span className="text-xs text-gray-500 ml-1">
                          ({selectedOptions[field].length} selected)
                        </span>
                      </label>
                      
                      {/* Search Input */}
                      <div className="relative mb-2">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder={`Search ${field}...`}
                          value={searchTerms[field]}
                          onChange={(e) => handleSearchChange(field, e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Filtered Options List */}
                      <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg mb-2">
                        {getFilteredOptions(field).map((option) => (
                          <div
                            key={option}
                            onClick={() => handleSelectChange(field, option)}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            {option}
                          </div>
                        ))}
                        {getFilteredOptions(field).length === 0 && (
                          <div className="px-4 py-2 text-gray-500 text-center">
                            No {field} found
                          </div>
                        )}
                      </div>
                      
                      {/* Selected Options */}
                      <div className="flex flex-wrap gap-2">
                        {selectedOptions[field].map((option) => (
                          <span 
                            key={option} 
                            className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                          >
                            {option}
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(field, option)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={uploading.includes('Uploading') || uploading.includes('Finalizing')}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {uploading.includes('Uploading') || uploading.includes('Finalizing') ? 'Creating Product...' : 'Create Product with WebP Images'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;