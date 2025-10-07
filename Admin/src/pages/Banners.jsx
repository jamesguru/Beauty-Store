import { useState, useEffect, useRef } from 'react';
import { FaPlus, FaTrash, FaUpload, FaImage } from 'react-icons/fa';
import axios from "axios";
import { userRequest } from '../requestMethods';

const Banners = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [banners, setBanners] = useState([]);
  const [uploading, setUploading] = useState("Ready to upload");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  

  // Function to compress image and convert to WebP
  const compressImageToWebP = (file, maxWidth = 1200, quality = 0.8) => {
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
      const file = e.target.files[0];
      
      setUploading("Compressing image to WebP...");
      
      try {
        const compressedBlob = await compressImageToWebP(file);
        const compressedImage = {
          originalFile: file,
          compressedBlob: compressedBlob,
          preview: URL.createObjectURL(compressedBlob),
          name: file.name.replace(/\.[^/.]+$/, ".webp")
        };

        setSelectedImage(compressedImage);
        setUploading("WebP image ready. Click upload to proceed.");
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error compressing image:', error);
        setUploading("Error compressing image");
      }
    }
  };

  const removeImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.preview); // Clean up memory
      setSelectedImage(null);
    }
    setUploading("Ready to upload");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!selectedImage) {
      alert('Please select an image');
      return;
    }

    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    setUploading("Starting upload...");
    setLoading(true);
    
    try {
      const data = new FormData();
      
      // Create a WebP file from the compressed blob
      const webpFile = new File([selectedImage.compressedBlob], `banner_${Date.now()}.webp`, {
        type: 'image/webp',
      });
      
      data.append("file", webpFile);
      data.append("upload_preset", "uploads");

      setUploading("Uploading WebP banner image...");
      
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dkjenslgr/image/upload",
        data,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploading(`Uploading: ${progress}%`);
          }
        }
      );

      const { url } = uploadRes.data;

      setUploading("Creating banner...");
      
      // Debug: Check if userRequest is properly configured
      console.log("Creating banner with data:", { 
        img: url, 
        title: title.trim(), 
        subtitle: subtitle.trim() 
      });

      // Try with explicit headers to ensure authentication
      const response = await userRequest.post("/banners", { 
        img: url, 
        title: title.trim(), 
        subtitle: subtitle.trim() 
      });

      console.log("Banner creation response:", response);

      setUploading("Banner created successfully with WebP image!");
      
      // Reset form after successful upload
      setTimeout(() => {
        removeImage();
        setTitle("");
        setSubtitle("");
        setUploading("Ready to upload");
        setLoading(false);
        
        // Reload the page after successful upload
        window.location.reload();
      }, 1500); // Reduced timeout for better UX
      
    } catch (error) {
      console.error('Upload error:', error);
      
      // More detailed error logging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        
        if (error.response.status === 401) {
          setUploading("Authentication failed. Please check your login.");
          alert("Authentication failed. Please check if you're properly logged in.");
        } else if (error.response.status === 403) {
          setUploading("Permission denied. You don't have access to create banners.");
          alert("Permission denied. Please check your user permissions.");
        } else {
          setUploading(`Server error: ${error.response.status}. Please try again.`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        setUploading("Network error. Please check your connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        setUploading("Upload failed. Please try again.");
      }
      
      setLoading(false);
    }
  };

  const getBanners = async () => {
    try {
      const res = await userRequest.get("/banners");
      setBanners(res.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
      if (error.response?.status === 401) {
        alert("Your session has expired. Please log in again.");
        // You might want to redirect to login here
        // window.location.href = '/login';
      }
    }
  };

  useEffect(() => {
    getBanners();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        setUploading("Deleting banner...");
        await userRequest.delete(`/banners/${id}`);
        
        // Show success message and reload
        setUploading("Banner deleted successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        
      } catch (error) {
        console.error('Delete error:', error);
        if (error.response?.status === 401) {
          alert("Your session has expired. Please log in again.");
        } else {
          alert("Failed to delete banner. Please try again.");
        }
        setUploading("Ready to upload");
      }
    }
  };

  // Calculate size savings
  const calculateSizeSavings = () => {
    if (!selectedImage) return null;
    
    const originalSize = selectedImage.originalFile.size;
    const compressedSize = selectedImage.compressedBlob.size;
    const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
    
    return { originalSize, compressedSize, savings };
  };

  const sizeInfo = calculateSizeSavings();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
 

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT - Active Banners */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Active Banners</h2>
              <p className="text-sm text-gray-600 mt-1">{banners.length} banner(s) active</p>
            </div>
            
            <div className="p-6">
              {banners.length === 0 ? (
                <div className="text-center py-12">
                  <FaImage className="mx-auto text-gray-300 text-4xl mb-3" />
                  <p className="text-gray-500">No active banners</p>
                  <p className="text-sm text-gray-400 mt-1">Create your first banner using the form</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {banners.map((banner, index) => (
                    <div 
                      key={banner._id} 
                      className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <img
                        src={banner.img}
                        alt={banner.title}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                          {banner.title}
                        </h3>
                        <p className="text-gray-600 mb-2 line-clamp-2">
                          {banner.subtitle}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Active
                          </span>
                          <span>•</span>
                          <span>WebP Optimized</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleDelete(banner._id)}
                        className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium flex-shrink-0"
                      >
                        <FaTrash size={12} />
                        <span>Delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT - Create New Banner */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Create New Banner</h2>
              <p className="text-sm text-gray-600 mt-1">Upload optimized WebP images for better performance</p>
            </div>
            
            <form className="p-6" onSubmit={handleUpload}>
              {/* Image Upload Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Banner Image - WebP Optimized
                </label>
                
                <div className="space-y-4">
                  {selectedImage ? (
                    <div className="relative group">
                      <img
                        src={selectedImage.preview}
                        alt="Banner preview"
                        className="w-full h-48 object-cover rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                      <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white text-sm px-2 py-1 rounded">
                        WebP - Optimized
                      </div>
                    </div>
                  ) : (
                    <label 
                      htmlFor="banner-file" 
                      className="border-2 border-dashed border-gray-300 rounded-lg h-48 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors bg-gray-50"
                    >
                      <FaPlus className="text-gray-400 text-2xl mb-2" />
                      <span className="text-gray-600 font-medium">Click to upload banner image</span>
                      <span className="text-sm text-gray-500 mt-1">Recommended: 1200x400px WebP format</span>
                    </label>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="banner-file"
                    accept="image/*"
                    onChange={imageChange}
                    className="hidden"
                  />
                  
                  {/* Size Savings Information */}
                  {sizeInfo && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-sm text-green-700 font-medium">
                        🎉 Size optimized: {sizeInfo.savings}% smaller
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        Original: {(sizeInfo.originalSize / 1024 / 1024).toFixed(2)}MB → 
                        Compressed: {(sizeInfo.compressedSize / 1024 / 1024).toFixed(2)}MB
                      </div>
                    </div>
                  )}
                  
                  <div className={`text-sm font-medium ${
                    uploading.includes('success') ? 'text-green-600' : 
                    uploading.includes('fail') || uploading.includes('error') || uploading.includes('Authentication') ? 'text-red-600' : 
                    'text-blue-600'
                  }`}>
                    {uploading}
                  </div>
                </div>
              </div>

              {/* Title Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter compelling banner title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  required
                />
              </div>

              {/* Subtitle Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Subtitle
                </label>
                <textarea
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Enter supporting text or call-to-action"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={loading || !selectedImage || !title.trim() || uploading.includes('Uploading')}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <FaUpload size={16} />
                <span>
                  {loading ? 'Creating Banner...' : 'Create Banner with WebP Image'}
                </span>
              </button>

              {/* Help Text */}
              <div className="mt-4 text-xs text-gray-500 text-center">
                <p>Images are automatically converted to WebP format for optimal loading and performance.</p>
                <p>Recommended banner size: 1200x400 pixels for best display.</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banners;