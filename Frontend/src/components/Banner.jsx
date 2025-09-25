import React, { useState, useRef, useEffect } from "react";
import { userRequest } from "../requestMethods";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [discovery, setDiscovery] = useState(null);
  const [showDiscovery, setShowDiscovery] = useState(false);
  const [bannerData, setBannerData] = useState(null);
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const wheelRef = useRef(null);
  const navigate = useNavigate();

  // Product categories for discovery wheel
  const productCategories = [
    { name: "SKINCARE", searchTerm: "skincare", description: "Nourish your skin" },
    { name: "MAKEUP", searchTerm: "cosmetics", description: "Express your beauty" },
    { name: "HAIR CARE", searchTerm: "hair care", description: "Luscious locks" },
    { name: "BODY CARE", searchTerm: "body care", description: "Pamper yourself" },
    { name: "FRAGRANCE", searchTerm: "fragrance", description: "Signature scents" },
    { name: "WELLNESS", searchTerm: "wellness", description: "Inner glow" },
    { name: "MEN'S CARE", searchTerm: "men's care", description: "Grooming essentials" },
    { name: "ORGANIC", searchTerm: "organic", description: "Natural beauty" }
  ];

  // Default title options if not provided from backend
  const defaultTitleOptions = [
    "GOOD FOR SKIN",
    "PREMIUM QUALITY",
    "NATURAL INGREDIENTS",
    "BEAUTIFUL RESULTS"
  ];

  // Show popup when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Fetch banner data from database
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await userRequest.get("/banner");
        const data = response.data;
        
        // Ensure we have proper banner data structure
        const bannerData = {
          gifUrl: data.gifUrl || "https://i.pinimg.com/originals/4f/05/f9/4f05f907a1486c47b69fac1d4ab1f3a4.gif",
          title: data.title || "GOOD FOR SKIN",
          subtitle: data.subtitle || "Experience the transformative power",
          description: data.description || "Experience the transformative power of our premium skincare and cosmetics, crafted with natural ingredients for visible results.",
          titleOptions: data.titleOptions || defaultTitleOptions
        };
        
        setBannerData(bannerData);
      } catch (error) {
        console.error("Failed to fetch banner data:", error);
        // Fallback data if fetch fails
        setBannerData({
          gifUrl: "https://i.pinimg.com/originals/4f/05/f9/4f05f907a1486c47b69fac1d4ab1f3a4.gif",
          title: "GOOD FOR SKIN",
          subtitle: "Experience the transformative power",
          description: "Experience the transformative power of our premium skincare and cosmetics, crafted with natural ingredients for visible results.",
          titleOptions: defaultTitleOptions
        });
      }
    };
    
    fetchBannerData();
  }, []);

  // Improved typing animation effect
  useEffect(() => {
    if (!bannerData) return;

    let timeout;
    let charIndex = 0;
    
    const currentTitles = bannerData.titleOptions || defaultTitleOptions;
    const currentTitle = currentTitles[currentTitleIndex];

    const typeText = () => {
      if (charIndex <= currentTitle.length) {
        setDisplayedTitle(currentTitle.substring(0, charIndex));
        charIndex++;
        timeout = setTimeout(typeText, 100);
      } else {
        setIsTyping(false);
        // Wait before starting to delete
        timeout = setTimeout(() => {
          deleteText();
        }, 1500);
      }
    };

    const deleteText = () => {
      if (charIndex >= 0) {
        setDisplayedTitle(currentTitle.substring(0, charIndex));
        charIndex--;
        timeout = setTimeout(deleteText, 50);
      } else {
        // Move to next title after deletion completes
        setCurrentTitleIndex((prev) => (prev + 1) % currentTitles.length);
        setIsTyping(true);
      }
    };

    // Start the animation
    if (isTyping) {
      typeText();
    } else {
      deleteText();
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [bannerData, currentTitleIndex, isTyping]);

  const startSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setShowDiscovery(false);
    
    const spinDegrees = 1800 + Math.floor(Math.random() * 360);
    const discoveryIndex = Math.floor(Math.random() * productCategories.length);
    const discoveredCategory = productCategories[discoveryIndex];
    
    if (wheelRef.current) {
      wheelRef.current.style.transition = "transform 4s cubic-bezier(0.2, 0.8, 0.2, 1)";
      wheelRef.current.style.transform = `rotate(${spinDegrees}deg)`;
    }
    
    setTimeout(() => {
      setIsSpinning(false);
      setDiscovery(discoveredCategory);
      setShowDiscovery(true);
      
      setTimeout(() => {
        navigate(`/products/${discoveredCategory.searchTerm}`);
      }, 2000);
    }, 4000);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleDiscoverProducts = () => {
    navigate("/products");
  };

  const handleLearnMore = () => {
    navigate("/about");
  };

  if (!bannerData) {
    return (
      <section className="bg-gradient-to-r from-pink-100 via-white to-pink-50 py-24 px-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading amazing offers...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Marketing Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-6">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden transform animate-scale-in">
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors shadow-lg border border-gray-200"
            >
              <span className="text-gray-700 text-xl font-bold">×</span>
            </button>
            
            {/* GIF Section - Using beauty product GIF */}
            <div className="relative h-64 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600">
              <img 
                src="https://i.pinimg.com/originals/4f/05/f9/4f05f907a1486c47b69fac1d4ab1f3a4.gif"
                alt="Discover Beauty Products"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://i.pinimg.com/originals/4f/05/f9/4f05f907a1486c47b69fac1d4ab1f3a4.gif";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="bg-white/90 backdrop-blur-sm text-pink-600 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  Discover Your Beauty Match
                </span>
              </div>
            </div>
            
            {/* Content Section */}
            <div className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-2 h-2 bg-pink-500 rounded-full mx-1"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full mx-1"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full mx-1"></div>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                Find Your Perfect Beauty Products
              </h3>
              
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                <strong>Let us guide your beauty journey!</strong> Spin our discovery wheel to explore 
                <span className="text-pink-600 font-bold"> personalized product categories</span> 
                tailored to your skincare and beauty needs.
              </p>
              
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-xl p-4 mb-6">
                <p className="text-pink-800 font-semibold text-md">
                  Discover products that match your unique beauty goals!
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-pink-100 rounded-lg p-3">
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-sm font-bold">P</span>
                  </div>
                  <p className="text-sm font-semibold text-pink-800">Personalized Discovery</p>
                </div>
                <div className="bg-purple-100 rounded-lg p-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-sm font-bold">B</span>
                  </div>
                  <p className="text-sm font-semibold text-purple-800">Beauty Experts</p>
                </div>
              </div>
              
              <button
                onClick={closePopup}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl mb-3"
              >
                Start Your Discovery
              </button>
              
              <p className="text-xs text-gray-500">
                Personalized recommendations based on your beauty preferences
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Banner Section */}
      <section className="bg-gradient-to-r from-pink-100 via-white to-pink-50 py-24 px-8 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center w-full">
          {/* Left side: Text */}
          <div className="space-y-6">
            <h3 className="uppercase tracking-widest text-sm font-semibold text-pink-600">
              {bannerData.subtitle}
            </h3>
            
            {/* Improved Animated title */}
            <div className="relative">
              <h1 className="text-6xl font-bold text-gray-900 leading-tight min-h-[120px] flex items-center">
                <span className="bg-gradient-to-r from-gray-900 to-pink-600 bg-clip-text text-transparent">
                  {displayedTitle}
                </span>
                <span className={`inline-block w-1 h-12 bg-pink-500 ml-2 align-middle ${
                  isTyping ? 'animate-pulse' : 'opacity-0'
                } transition-opacity`}></span>
              </h1>
              
              {/* Subtle background text effect */}
              <div className="absolute inset-0 flex items-center opacity-5 pointer-events-none">
                <span className="text-7xl font-black text-gray-900 whitespace-nowrap">
                  {bannerData.titleOptions?.[currentTitleIndex] || "BEAUTIFUL SKIN"}
                </span>
              </div>
            </div>
            
            {/* Static description text */}
            <div className="mt-8">
              <p className="text-xl text-gray-700 leading-relaxed">
                {bannerData.description}
              </p>
            </div>

            <div className="flex gap-4 mt-10">
              <button 
                onClick={handleDiscoverProducts}
                className="px-8 py-4 bg-pink-600 text-white rounded-2xl shadow-lg hover:bg-pink-700 transition transform hover:scale-105 font-semibold"
              >
                Discover Products
              </button>
              <button 
                onClick={handleLearnMore}
                className="px-8 py-4 bg-white text-pink-600 border border-pink-300 rounded-2xl shadow-lg hover:bg-pink-50 transition transform hover:scale-105 font-semibold"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right side: Discovery Wheel */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              {/* Wheel container */}
              <div className="relative w-80 h-80">
                {/* Wheel */}
                <div 
                  ref={wheelRef}
                  className="absolute inset-0 rounded-full overflow-hidden border-8 border-white shadow-2xl transition-transform duration-100"
                  style={{ transform: 'rotate(0deg)' }}
                >
                  {/* Wheel segments */}
                  <div className="absolute inset-0">
                    {productCategories.map((category, index) => {
                      const rotation = (index / productCategories.length) * 360;
                      const segmentRotation = rotation + (360 / productCategories.length / 2);
                      return (
                        <div
                          key={index}
                          className="absolute top-0 left-1/2 w-1/2 h-1/2 transform origin-bottom-left transition-all duration-300"
                          style={{
                            transform: `rotate(${rotation}deg)`,
                            background: index % 2 === 0 ? '#fce7f3' : '#fbcfe8'
                          }}
                        >
                          <div
                            className="absolute top-12 left-0 w-full text-center transform"
                            style={{ 
                              transform: `rotate(${segmentRotation}deg)`,
                              transformOrigin: 'bottom left'
                            }}
                          >
                            <span className="text-sm font-bold text-pink-900 px-2">
                              {category.name}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Center circle */}
                  <div className="absolute inset-12 bg-white rounded-full border-6 border-pink-400 flex items-center justify-center shadow-lg">
                    <span className="text-pink-600 font-bold text-sm text-center px-2">DISCOVER BEAUTY</span>
                  </div>
                </div>
                
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="w-8 h-12 bg-gradient-to-b from-pink-600 to-purple-600 clip-triangle shadow-lg"></div>
                </div>
              </div>
              
              {/* Spin button */}
              <button
                onClick={startSpin}
                disabled={isSpinning}
                className={`mt-12 px-10 py-4 rounded-2xl shadow-xl transition-all text-lg font-bold ${
                  isSpinning 
                    ? 'bg-gray-400 cursor-not-allowed transform scale-95' 
                    : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transform hover:scale-110 active:scale-105'
                } text-white disabled:opacity-70`}
              >
                {isSpinning ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Discovering...
                  </span>
                ) : (
                  'Spin to Discover'
                )}
              </button>
              
              {/* Discovery reveal */}
              {showDiscovery && discovery && (
                <div className="mt-8 p-6 bg-gradient-to-r from-pink-100 to-purple-100 border-2 border-pink-300 rounded-2xl text-center animate-bounce-in shadow-lg">
                  <h3 className="font-bold text-pink-700 text-lg mb-2">Perfect Match!</h3>
                  <p className="text-pink-900 font-semibold">Discover: {discovery.name}</p>
                  <p className="text-gray-600 text-sm mt-1">{discovery.description}</p>
                  <p className="text-gray-500 text-xs mt-2">Taking you to explore...</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <style jsx>{`
          .clip-triangle {
            clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          }
          
          @keyframes scale-in {
            0% {
              opacity: 0;
              transform: scale(0.8);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          @keyframes bounce-in {
            0% {
              opacity: 0;
              transform: translateY(-20px) scale(0.9);
            }
            50% {
              transform: translateY(5px) scale(1.02);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          .animate-scale-in {
            animation: scale-in 0.4s ease-out;
          }
          
          .animate-bounce-in {
            animation: bounce-in 0.6s ease-out;
          }
        `}</style>
      </section>
    </>
  );
};

export default Banner;