import { useEffect, useState, useRef } from "react";
import { userRequest } from "../requestMethods";
import { useNavigate } from "react-router-dom";

const ContinuousSpinWheel = () => {
  const [rotation, setRotation] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSpinning, setIsSpinning] = useState(true);
  const [showDescription, setShowDescription] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const websiteFeatures = [
    { name: "Skincare", description: "Discover radiant skin with natural care", color: "from-pink-200 via-rose-300 to-pink-400", icon: "🌸", path: "/skincare", searchTerm: "skincare products" },
    { name: "Makeup", description: "Premium cosmetics for flawless beauty", color: "from-fuchsia-300 via-rose-400 to-amber-300", icon: "💄", path: "/makeup", searchTerm: "makeup collection" },
    { name: "Haircare", description: "Transform your hair with care", color: "from-violet-300 via-purple-400 to-indigo-300", icon: "💇‍♀️", path: "/haircare", searchTerm: "hair care products" },
    { name: "Fragrance", description: "Exquisite perfumes with lasting scents", color: "from-amber-200 via-yellow-300 to-pink-200", icon: "✨", path: "/fragrance", searchTerm: "perfumes" },
    { name: "Packages", description: "Curated bundles for complete routines", color: "from-rose-200 via-fuchsia-300 to-purple-300", icon: "🎁", path: "/packages", searchTerm: "beauty bundles" },
    { name: "New Arrivals", description: "Innovative beauty solutions", color: "from-blue-200 via-cyan-300 to-emerald-200", icon: "🆕", path: "/new", searchTerm: "new products" },
    { name: "Best Sellers", description: "Loved by thousands of beauty lovers", color: "from-emerald-200 via-teal-300 to-lime-200", icon: "⭐", path: "/bestsellers", searchTerm: "best sellers" },
    { name: "Special Offers", description: "Exclusive deals & discounts", color: "from-red-200 via-pink-300 to-rose-400", icon: "🔥", path: "/offers", searchTerm: "special offers" },
  ];

  // Continuous spinning animation
  useEffect(() => {
    let animationId;
    const spin = () => {
      setRotation((prev) => (prev + 0.4) % 360);
      animationId = requestAnimationFrame(spin);
    };
    if (isSpinning) animationId = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(animationId);
  }, [isSpinning]);

  // Auto-select random item for display only (no redirect)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isSpinning && !isSearching) {
        const randomIndex = Math.floor(Math.random() * websiteFeatures.length);
        setSelectedItem(websiteFeatures[randomIndex]);
        setShowDescription(true);
        setTimeout(() => setShowDescription(false), 4000);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isSpinning, isSearching]);

  const handleSpinToSearch = () => {
    // Stop the continuous spinning
    setIsSpinning(false);
    setIsSearching(true);
    
    // Select a random item for search
    const randomIndex = Math.floor(Math.random() * websiteFeatures.length);
    const selected = websiteFeatures[randomIndex];
    setSelectedItem(selected);
    setShowDescription(true);
    
    // Add some spinning animation before redirecting
    let spinCount = 0;
    const maxSpins = 3; // Number of full rotations before stopping
    
    const spinAnimation = () => {
      setRotation((prev) => {
        const newRotation = (prev + 20) % 360;
        
        // Check if we've completed the desired number of spins
        if (newRotation < prev && spinCount < maxSpins) {
          spinCount++;
        }
        
        if (spinCount >= maxSpins) {
          // Stop spinning and redirect after a brief pause
          setTimeout(() => {
            navigate(`/products/${encodeURIComponent(selected.searchTerm)}`);
          }, 1000);
          return prev; // Stop animation
        }
        
        return newRotation;
      });
      
      if (spinCount < maxSpins) {
        requestAnimationFrame(spinAnimation);
      }
    };
    
    // Start the spin animation
    requestAnimationFrame(spinAnimation);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Floating sparkle particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white/70 rounded-full animate-ping"
          style={{
            top: `${30 + Math.random() * 60}%`,
            left: `${30 + Math.random() * 60}%`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}

      {/* Description */}
      {showDescription && selectedItem && (
        <div className="absolute -top-28 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl max-w-xs z-30 animate-fadeIn">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">{selectedItem.icon}</span>
            <h3 className="font-bold text-slate-800">{selectedItem.name}</h3>
          </div>
          <p className="text-slate-600 text-sm mb-3">{selectedItem.description}</p>
          {isSearching && (
            <div className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-2 rounded-lg font-medium text-sm flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Searching for "{selectedItem.searchTerm}"
            </div>
          )}
        </div>
      )}

      {/* Wheel */}
      <div
        className="relative w-80 h-80 rounded-full shadow-[0_0_60px_rgba(255,192,203,0.5)] border-8 border-white/60 cursor-pointer overflow-hidden"
        style={{ background: "radial-gradient(circle, #fff 10%, transparent 70%)" }}
        onClick={handleSpinToSearch}
      >
        <div
          className="absolute w-full h-full rounded-full transition-transform duration-1000"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {websiteFeatures.map((feature, index) => {
            const angle = 360 / websiteFeatures.length;
            const segmentAngle = angle * index;
            return (
              <div
                key={index}
                className={`absolute w-full h-full bg-gradient-to-br ${feature.color} opacity-90`}
                style={{
                  clipPath: `polygon(50% 50%, 
                    ${50 + 50 * Math.cos(((segmentAngle - 90) * Math.PI) / 180)}% 
                    ${50 + 50 * Math.sin(((segmentAngle - 90) * Math.PI) / 180)}%, 
                    ${50 + 50 * Math.cos(((segmentAngle + angle - 90) * Math.PI) / 180)}% 
                    ${50 + 50 * Math.sin(((segmentAngle + angle - 90) * Math.PI) / 180)}%)`,
                  transform: `rotate(${segmentAngle}deg)`,
                  backgroundSize: "200% 200%",
                  animation: "shimmer 3s infinite linear",
                }}
              >
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xs w-28 text-center font-semibold"
                  style={{
                    transform: `rotate(${-segmentAngle}deg) translateY(-40px)`,
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  <div className="text-xl mb-1">{feature.icon}</div>
                  {feature.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* Glowing jewel center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-white via-pink-100 to-rose-200 rounded-full border-4 border-white shadow-[0_0_40px_rgba(255,182,193,0.8)] flex items-center justify-center animate-pulse">
          <span className="text-slate-700 font-bold text-lg">DB</span>
        </div>
        
        {/* Spin to search text */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-white font-bold text-sm bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
            Click to Spin & Search
          </div>
        </div>
      </div>

      {/* Extra shimmer CSS */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

const Banner = () => {
  const [banner, setBanner] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const fetchRandomBanner = async () => {
      try {
        const res = await userRequest.get("/banners/random");
        setBanner(res.data);
        
        // Slight delay to allow background image to load
        setTimeout(() => {
          setIsLoading(false);
          setShowContent(true);
        }, 300);
      } catch (error) {
        console.error("Failed to fetch random banner", error);
        setIsLoading(false);
        setShowContent(true);
      }
    };
    fetchRandomBanner();
  }, []);

  // Custom CSS for animations
  const styles = `
    @keyframes fadeIn {
      0% { opacity: 0; transform: translateY(10px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-8px) rotate(1deg); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.5s ease-out forwards;
    }
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    .text-shadow { 
      text-shadow: 0 2px 4px rgba(0,0,0,0.3); 
    }
  `;

  if (isLoading) {
    return (
      <div className="relative h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-white/50"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="h-12 w-72 bg-gradient-to-r from-rose-100 to-purple-100 rounded-full mb-6 animate-pulse"></div>
          <div className="h-4 w-80 bg-gradient-to-r from-rose-50 to-purple-50 rounded-full mb-4 animate-pulse delay-300"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div
        className="relative bg-cover bg-center bg-no-repeat h-[70vh] min-h-[600px] flex items-center justify-center px-6 lg:px-20 overflow-hidden"
        style={{
          backgroundImage: banner.img
            ? `url(${banner.img})`
            : "linear-gradient(135deg, #f5f7fa 0%, #e0c3fc 100%)",
        }}
      >
        {/* Elegant overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 to-rose-900/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>

        {/* Animated floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/40 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${15 + Math.random() * 10}s`,
                width: `${1 + Math.random() * 3}px`,
                height: `${1 + Math.random() * 3}px`,
              }}
            />
          ))}
        </div>

        {/* Content wrapper */}
        <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-16 max-w-6xl mx-auto">
          {/* Text Content */}
          <div className={`text-white max-w-2xl transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="text-slate-200 font-light tracking-widest text-sm mb-4 block opacity-0 animate-fadeIn">
              {banner.subtitle?.toUpperCase() || "DISCOVER BEAUTY"}
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-normal mb-6 leading-tight opacity-0 animate-fadeIn delay-100 text-shadow">
              {banner.title || "Explore Our Beauty Universe"}
            </h1>
            
            <p className="text-slate-200 mb-10 text-lg max-w-md opacity-0 animate-fadeIn delay-200 text-shadow">
              {banner.desc || "Click the wheel to spin and discover our luxurious products."}
            </p>
          </div>

          {/* Spin Wheel */}
          <div className={`transition-all duration-1000 delay-500 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <ContinuousSpinWheel />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 animate-fadeIn delay-700">
          <div className="flex flex-col items-center">
            <span className="text-white text-sm mb-2 text-shadow">Scroll to see more</span>
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-1">
              <div className="w-1 h-2 bg-white/70 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;