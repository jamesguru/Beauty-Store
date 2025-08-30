import React, { useState, useRef, useEffect } from "react";
import { userRequest } from "../requestMethods"; // Assuming you have this
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [prize, setPrize] = useState(null);
  const [showPrize, setShowPrize] = useState(false);
  const [bannerData, setBannerData] = useState(null);
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const wheelRef = useRef(null);
  const navigate = useNavigate();

  // Sample prizes for the wheel with search terms
  const prizes = [
    { name: "10% OFF", searchTerm: "discount" },
    { name: "FREE MASK", searchTerm: "face mask" },
    { name: "20% OFF", searchTerm: "premium" },
    { name: "LIP BALM", searchTerm: "lip care" },
    { name: "5% OFF", searchTerm: "skincare" },
    { name: "SERUM SAMPLE", searchTerm: "serum" },
    { name: "15% OFF", searchTerm: "cosmetics" },
    { name: "EYE CREAM", searchTerm: "eye care" }
  ];

  // Title options for typing animation
  const titleOptions = [
    "GOOD FOR SKIN",
    "PREMIUM QUALITY",
    "NATURAL INGREDIENTS",
    "BEAUTIFUL RESULTS"
  ];

  // Fetch banner data from database
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await userRequest.get("/banner");
        setBannerData(response.data);
      } catch (error) {
        console.error("Failed to fetch banner data:", error);
        // Fallback data if fetch fails
        setBannerData({
          title: "GOOD FOR SKIN",
          subtitle: "Experience the transformative power",
          description: "Experience the transformative power of our premium skincare and cosmetics, crafted with natural ingredients for visible results."
        });
      }
    };
    
    fetchBannerData();
  }, []);

  // Typing animation effect for title only
  useEffect(() => {
    if (!bannerData) return;
    
    const currentTitle = titleOptions[currentTitleIndex];
    let charIndex = 0;
    let timeout;
    
    const typeText = () => {
      if (charIndex <= currentTitle.length) {
        setDisplayedTitle(currentTitle.substring(0, charIndex));
        charIndex++;
        timeout = setTimeout(typeText, 100);
      } else {
        // Move to next title after a delay
        timeout = setTimeout(() => {
          setCurrentTitleIndex((prev) => (prev + 1) % titleOptions.length);
        }, 3000);
      }
    };
    
    typeText();
    
    return () => clearTimeout(timeout);
  }, [bannerData, currentTitleIndex]);

  const startSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setShowPrize(false);
    
    // Calculate a random spin result
    const spinDegrees = 1800 + Math.floor(Math.random() * 360);
    const winningIndex = Math.floor(Math.random() * prizes.length);
    const winningPrize = prizes[winningIndex];
    
    // Apply the spin animation
    if (wheelRef.current) {
      wheelRef.current.style.transition = "transform 4s cubic-bezier(0.2, 0.8, 0.2, 1)";
      wheelRef.current.style.transform = `rotate(${spinDegrees}deg)`;
    }
    
    // Show the prize after spinning, then navigate
    setTimeout(() => {
      setIsSpinning(false);
      setPrize(winningPrize);
      setShowPrize(true);
      
      // Navigate to search results after showing prize
      setTimeout(() => {
        navigate(`/products/${winningPrize.searchTerm}`);
      }, 2000);
    }, 4000);
  };

  return (
    <section className="bg-gradient-to-r from-pink-100 via-white to-pink-50 py-20 px-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left side: Text */}
        <div>
          <h3 className="uppercase tracking-wide text-sm font-semibold text-pink-600">
            {bannerData?.subtitle || "Experience the transformative power"}
          </h3>
          
          {/* Animated title only */}
          <h1 className="text-5xl font-bold text-gray-900 mt-2 leading-tight h-16">
            {displayedTitle}
            <span className="text-pink-600 inline-block w-1 h-8 bg-pink-500 ml-1 align-middle animate-pulse"></span>
          </h1>
          
          {/* Static description text */}
          <div className="mt-6">
            <p className="text-lg text-gray-700">
              {bannerData?.description || "Experience the transformative power of our premium skincare and cosmetics, crafted with natural ingredients for visible results."}
            </p>
          </div>

          <button className="mt-8 px-6 py-3 bg-pink-600 text-white rounded-2xl shadow-lg hover:bg-pink-700 transition">
            Discover Products
          </button>
        </div>

        {/* Right side: Wheel */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            {/* Wheel container */}
            <div className="relative w-64 h-64">
              {/* Wheel */}
              <div 
                ref={wheelRef}
                className="absolute inset-0 rounded-full overflow-hidden"
              >
                {/* Wheel segments */}
                <div className="absolute inset-0">
                  {prizes.map((prize, index) => {
                    const rotation = (index / prizes.length) * 360;
                    return (
                      <div
                        key={index}
                        className="absolute top-0 left-1/2 w-1/2 h-1/2 transform origin-bottom-left"
                        style={{
                          transform: `rotate(${rotation}deg)`,
                          background: index % 2 === 0 ? '#fce7f3' : '#fbcfe8'
                        }}
                      >
                        <div
                          className="absolute top-8 left-0 w-full text-center transform -rotate-45"
                          style={{ transformOrigin: 'bottom left' }}
                        >
                          <span className="text-xs font-semibold text-pink-900">
                            {prize.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Center circle */}
                <div className="absolute inset-8 bg-white rounded-full border-4 border-pink-300 flex items-center justify-center shadow-md">
                  <span className="text-pink-600 font-bold">SPIN</span>
                </div>
              </div>
              
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-6 h-8 bg-pink-600 clip-triangle"></div>
              </div>
            </div>
            
            {/* Spin button */}
            <button
              onClick={isSpinning ? null : startSpin}
              disabled={isSpinning}
              className={`mt-10 px-6 py-3 rounded-2xl shadow-lg transition ${
                isSpinning 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-pink-600 hover:bg-pink-700'
              } text-white font-semibold`}
            >
              {isSpinning ? 'Spinning...' : 'Spin & Discover'}
            </button>
            
            {/* Prize reveal */}
            {showPrize && (
              <div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 bg-pink-100 border border-pink-300 rounded-xl text-center"
              >
                <h3 className="font-bold text-pink-700">Taking you to:</h3>
                <p className="text-pink-900">{prize.searchTerm}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .clip-triangle {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
      `}</style>
    </section>
  );
};

export default Banner;
