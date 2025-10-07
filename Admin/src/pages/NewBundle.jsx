import { useState, useEffect, useRef } from 'react';
import { FaPlus, FaTrash, FaSearch, FaGift, FaArrowLeft, FaSave, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { userRequest } from '../requestMethods';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateBundle = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Image upload states
  const [bundleImage, setBundleImage] = useState(null);
  const [uploading, setUploading] = useState("Ready to upload");
  const fileInputRef = useRef(null);

  // Custom notification state
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Bundle form state
  const [bundleData, setBundleData] = useState({
    name: '',
    description: '',
    image: '',
    badge: undefined, // Change to undefined instead of empty string
    originalPrice: 0,
    discountedPrice: 0,
    categories: [],
    concern: [],
    skintype: [],
    isPrebuilt: true
  });

  // Show notification function
  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
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

  const handleBundleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      setUploading("Compressing image to WebP...");
      
      try {
        const compressedBlob = await compressImageToWebP(file);
        const previewUrl = URL.createObjectURL(compressedBlob);
        
        setBundleImage({
          originalFile: file,
          compressedBlob: compressedBlob,
          preview: previewUrl,
          name: file.name.replace(/\.[^/.]+$/, ".webp")
        });
        
        setUploading("WebP image ready for upload");
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error compressing image:', error);
        setUploading("Error compressing image");
        showNotification("Failed to process image", "error");
      }
    }
  };

  const removeBundleImage = () => {
    if (bundleImage) {
      URL.revokeObjectURL(bundleImage.preview); // Clean up memory
    }
    setBundleImage(null);
    setBundleData(prev => ({ ...prev, image: '' }));
    setUploading("Ready to upload");
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async () => {
    if (!bundleImage) return null;

    try {
      const data = new FormData();
      
      // Create a WebP file from the compressed blob
      const webpFile = new File([bundleImage.compressedBlob], `bundle_${Date.now()}.webp`, {
        type: 'image/webp',
      });
      
      data.append("file", webpFile);
      data.append("upload_preset", "uploads");
      
      setUploading("Uploading WebP image to Cloudinary...");
      
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dkjenslgr/image/upload",
        data,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploading(`Uploading image: ${progress}%`);
          }
        }
      );

      setUploading("Image uploaded successfully!");
      return uploadRes.data.secure_url || uploadRes.data.url;
      
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      setUploading("Image upload failed");
      throw new Error("Failed to upload image to Cloudinary");
    }
  };

  // Calculate size savings
  const calculateSizeSavings = () => {
    if (!bundleImage) return null;
    
    const originalSize = bundleImage.originalFile.size;
    const compressedSize = bundleImage.compressedBlob.size;
    const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
    
    return { originalSize, compressedSize, savings };
  };

  const sizeInfo = calculateSizeSavings();

  // Fetch products from database
  useEffect(() => {
    const getProducts = async () => {
      setIsLoading(true);
      try {
        const res = await userRequest.get("/products");
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (error) {
        console.log("Error fetching products:", error);
        showNotification("Failed to load products", "error");
      } finally {
        setIsLoading(false);
      }
    };
    getProducts();
  }, []);

  // Filter products based on search
  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product =>
        product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.desc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categories?.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  // Calculate bundle pricing automatically
  useEffect(() => {
    const originalPrice = selectedProducts.reduce((total, product) => 
      total + (product.originalPrice || 0), 0
    );
    
    const discountedPrice = selectedProducts.reduce((total, product) => 
      total + (product.discountedPrice || product.originalPrice || 0), 0
    );

    // Auto-generate categories, concerns, and skin types from selected products
    const allCategories = [...new Set(selectedProducts.flatMap(p => p.categories || []))];
    const allConcerns = [...new Set(selectedProducts.flatMap(p => p.concern || []))];
    const allSkinTypes = [...new Set(selectedProducts.flatMap(p => p.skintype || []))];

    setBundleData(prev => ({
      ...prev,
      originalPrice,
      discountedPrice,
      categories: allCategories,
      concern: allConcerns,
      skintype: allSkinTypes
    }));
  }, [selectedProducts]);

  const handleAddProduct = (product) => {
    setSelectedProducts(prev => {
      const exists = prev.find(p => p._id === product._id);
      if (!exists) {
        showNotification(`${product.title} added to bundle!`, "success");
        return [...prev, { ...product, quantity: 1 }];
      } else {
        showNotification('Product already in bundle', "info");
        return prev;
      }
    });
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(prev => prev.filter(p => p._id !== productId));
    showNotification("Product removed from bundle", "info");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // For badge, convert empty string to undefined, otherwise keep the value
    const processedValue = name === 'badge' ? (value === '' ? undefined : value) : value;
    
    setBundleData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const getProductPrice = (product) => {
    return product.discountedPrice || product.originalPrice;
  };

  const calculateSavings = () => {
    return bundleData.originalPrice - bundleData.discountedPrice;
  };

  const handleCreateBundle = async (e) => {
    e.preventDefault();
    
    if (selectedProducts.length === 0) {
      showNotification("Please add at least one product to the bundle", "error");
      return;
    }

    if (!bundleData.name || !bundleData.description) {
      showNotification("Please fill in bundle name and description", "error");
      return;
    }

    if (!bundleImage) {
      showNotification("Please select a bundle image", "error");
      return;
    }

    setSaving(true);

    try {
      // Upload image to Cloudinary first
      setUploading("Uploading bundle image...");
      const imageUrl = await uploadImageToCloudinary();
      
      if (!imageUrl) {
        throw new Error("Failed to upload bundle image");
      }

      // Prepare products data for the bundle
      const bundleProducts = selectedProducts.map(product => ({
        productId: product._id,
        title: product.title,
        desc: product.desc,
        img: product.img,
        originalPrice: product.originalPrice,
        discountedPrice: product.discountedPrice || product.originalPrice,
        quantity: 1
      }));

      // Create the payload - badge will be undefined if not selected
      const bundlePayload = {
        name: bundleData.name,
        description: bundleData.description,
        image: imageUrl,
        originalPrice: bundleData.originalPrice,
        discountedPrice: bundleData.discountedPrice,
        categories: bundleData.categories,
        concern: bundleData.concern,
        skintype: bundleData.skintype,
        isPrebuilt: true,
        products: bundleProducts
      };

      // Only add badge to payload if it has a value
      if (bundleData.badge) {
        bundlePayload.badge = bundleData.badge;
      }

      setUploading("Creating bundle...");
      const response = await userRequest.post("/bundles", bundlePayload);
      
      showNotification("Bundle created successfully!", "success");
      setUploading("Bundle created successfully!");
      
      // Redirect to bundles page after successful creation
      setTimeout(() => {
        navigate('/bundles');
      }, 2000);

    } catch (error) {
      console.error("Error creating bundle:", error);
      showNotification("Failed to create bundle", "error");
      setUploading("Failed to create bundle");
    } finally {
      setSaving(false);
    }
  };

  // Notification component
  const Notification = () => {
    if (!notification.show) return null;

    const bgColor = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      info: 'bg-blue-500',
      warning: 'bg-yellow-500'
    }[notification.type];

    const icon = {
      success: <FaCheck className="text-white" />,
      error: <FaExclamationTriangle className="text-white" />,
      info: <FaExclamationTriangle className="text-white" />,
      warning: <FaExclamationTriangle className="text-white" />
    }[notification.type];

    return (
      <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-slide-in`}>
        {icon}
        <span>{notification.message}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Notification />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/bundles')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FaArrowLeft className="text-lg" />
              <span>Back to Bundles</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Create New Bundle</h1>
              <p className="text-gray-600">Combine products into attractive packages</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
              {selectedProducts.length} Products Selected
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Product Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Add Products to Bundle</h2>
                <div className="relative w-64">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="animate-pulse bg-gray-200 rounded-xl p-4 h-32"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {filteredProducts.map(product => (
                    <div
                      key={product._id}
                      className="border border-gray-200 rounded-xl p-4 hover:border-pink-300 transition-colors group"
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={product.img?.[0]}
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 line-clamp-1">{product.title}</h3>
                          <p className="text-gray-600 text-sm line-clamp-2">{product.desc}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-pink-600 font-bold">KES {getProductPrice(product)}</span>
                              {product.discountedPrice && product.originalPrice > product.discountedPrice && (
                                <span className="text-gray-500 line-through text-sm">KES {product.originalPrice}</span>
                              )}
                            </div>
                            <button
                              onClick={() => handleAddProduct(product)}
                              disabled={selectedProducts.find(p => p._id === product._id)}
                              className="bg-pink-500 text-white p-2 rounded-lg hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                              <FaPlus className="text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredProducts.length === 0 && (
                    <div className="col-span-2 text-center py-8">
                      <FaSearch className="text-gray-400 text-4xl mx-auto mb-4" />
                      <p className="text-gray-600">No products found</p>
                      <p className="text-gray-500 text-sm">Try adjusting your search terms</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Products Preview */}
            {selectedProducts.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Selected Products</h3>
                <div className="space-y-3">
                  {selectedProducts.map(product => (
                    <div key={product._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.img?.[0]}
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <h4 className="font-medium text-gray-800">{product.title}</h4>
                          <p className="text-pink-600 font-bold">KES {getProductPrice(product)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveProduct(product._id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Bundle Configuration */}
          <div className="space-y-6">
            {/* Bundle Details Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Bundle Details</h2>
              
              <form onSubmit={handleCreateBundle} className="space-y-4">
                {/* Bundle Image Upload */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Bundle Image - WebP Optimized
                  </label>
                  
                  <div className="flex flex-col items-center space-y-4 mb-4">
                    {bundleImage ? (
                      <div className="relative group">
                        <img
                          src={bundleImage.preview}
                          alt="Bundle preview"
                          className="w-32 h-32 object-cover rounded-lg shadow-md"
                        />
                        <button
                          type="button"
                          onClick={removeBundleImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                          WebP
                        </div>
                      </div>
                    ) : (
                      <label 
                        htmlFor="bundle-image" 
                        className="border-2 border-dashed border-gray-300 rounded-lg w-32 h-32 flex flex-col items-center justify-center cursor-pointer hover:border-pink-400 transition-colors"
                      >
                        <FaGift className="text-gray-400 text-xl mb-1" />
                        <span className="text-sm text-gray-500">Add Image</span>
                      </label>
                    )}
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="bundle-image"
                    accept="image/*"
                    onChange={handleBundleImageChange}
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
                    Image will be automatically converted to WebP format for optimal loading and performance.
                  </p>
                </div>

                {/* Bundle Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bundle Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={bundleData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Complete Skincare Routine"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                {/* Bundle Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={bundleData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    placeholder="Describe the bundle and its benefits..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                {/* Badge Selection - NOW WORKING PROPERLY */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bundle Badge
                  </label>
                  <select
                    name="badge"
                    value={bundleData.badge || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">No Badge</option>
                    <option value="BEST VALUE">Best Value</option>
                    <option value="POPULAR">Popular</option>
                    <option value="PREMIUM">Premium</option>
                    <option value="NEW">New</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Current selection: {bundleData.badge || 'No badge selected'}
                  </p>
                </div>

                {/* Pricing Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Pricing Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Individual Product Prices:</span>
                      <span className="font-medium">KES {bundleData.originalPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bundle Discounted Price:</span>
                      <span className="font-medium text-pink-600">KES {bundleData.discountedPrice}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <span>Customer Savings:</span>
                      <span className="font-medium text-green-600">KES {calculateSavings()}</span>
                    </div>
                  </div>
                </div>

                {/* Auto-generated Tags */}
                {(bundleData.categories.length > 0 || bundleData.concern.length > 0 || bundleData.skintype.length > 0) && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Auto-generated Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {bundleData.categories.map(cat => (
                        <span key={cat} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {cat}
                        </span>
                      ))}
                      {bundleData.concern.map(concern => (
                        <span key={concern} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          {concern}
                        </span>
                      ))}
                      {bundleData.skintype.map(type => (
                        <span key={type} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Create Button */}
                <button
                  type="submit"
                  disabled={saving || selectedProducts.length === 0 || !bundleImage}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-3 rounded-xl hover:from-pink-600 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold flex items-center justify-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Bundle...</span>
                    </>
                  ) : (
                    <>
                      <FaSave className="text-sm" />
                      <span>Create Bundle with WebP Image</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Bundle Preview */}
            {selectedProducts.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Bundle Preview</h3>
                <div className="space-y-3">
                  <div className="text-center p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg">
                    <FaGift className="text-pink-500 text-2xl mx-auto mb-2" />
                    <h4 className="font-bold text-gray-800">{bundleData.name || "Your Bundle"}</h4>
                    <p className="text-gray-600 text-sm">{bundleData.description || "Bundle description"}</p>
                    {bundleData.badge && (
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${
                        bundleData.badge === "BEST VALUE" ? "bg-green-500" :
                        bundleData.badge === "POPULAR" ? "bg-blue-500" :
                        bundleData.badge === "PREMIUM" ? "bg-purple-500" :
                        "bg-pink-500"
                      }`}>
                        {bundleData.badge}
                      </div>
                    )}
                    <div className="mt-2">
                      <span className="text-2xl font-bold text-pink-600">KES {bundleData.discountedPrice}</span>
                      {bundleData.originalPrice > bundleData.discountedPrice && (
                        <span className="text-gray-500 line-through ml-2">KES {bundleData.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p>Includes {selectedProducts.length} products:</p>
                    <ul className="mt-2 space-y-1">
                      {selectedProducts.slice(0, 3).map(product => (
                        <li key={product._id} className="flex items-center space-x-2">
                          <div className="w-1 h-1 bg-pink-500 rounded-full"></div>
                          <span>{product.title}</span>
                        </li>
                      ))}
                      {selectedProducts.length > 3 && (
                        <li className="text-pink-600 font-medium">
                          +{selectedProducts.length - 3} more products
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CreateBundle;