import { useState, useEffect } from "react";

const Packages = () => {
  const packages = [
    {
      name: "3-Month Glow Up Package",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2tpbmNhcmUlMjBwcm9kdWN0c3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=80",
      description: "Complete 90-day transformation for radiant skin",
      price: "Ksh 199",
      originalPrice: "Ksh 249",
      includes: ["Cleanser", "Toner", "Serum", "Moisturizer", "Sunscreen"],
      badge: "BEST VALUE"
    },
    {
      name: "Acne Control Package",
      image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YWNuZSUyMHRyZWF0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=80",
      description: "Targeted solutions for clear, blemish-free skin",
      price: "Ksh 149",
      originalPrice: "Ksh 179",
      includes: ["Acne Cleanser", "Treatment Serum", "Spot Treatment", "Oil-Free Moisturizer"],
      badge: "POPULAR"
    },
    {
      name: "Complete Makeup Kit",
      image: "https://images.unsplash.com/photo-1595877244574-e90ce41ce089?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG1ha2V1cCUyMGtpdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=80",
      description: "Everything you need for a flawless makeup routine",
      price: "Ksh 229",
      originalPrice: "Ksh 279",
      includes: ["Foundation", "Concealer", "Mascara", "Lipstick", "Blush", "Eyeshadow Palette"],
      badge: "NEW"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Rotate featured package
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % packages.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isHovered, packages.length]);

  return (
    <div className="relative px-4 py-16 bg-gradient-to-b from-rose-50/70 via-white to-rose-50/70 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-rose-200/20 rounded-full"></div>
        <div className="absolute top-1/3 right-0 w-64 h-64 bg-lavender-300/15 rounded-full"></div>
        <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-amber-200/10 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm text-rose-700 px-4 py-2 rounded-full text-sm font-medium mb-4 shadow-sm border border-rose-100">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
            </svg>
            Premium Bundles
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
            Curated Beauty Packages
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover our expertly crafted bundles designed to transform your beauty routine with perfectly paired products
          </p>
        </div>
        
        {/* Animated Showcase Area */}
        <div className="relative h-96 mb-16 rounded-2xl overflow-hidden shadow-xl"
             onMouseEnter={() => setIsHovered(true)}
             onMouseLeave={() => setIsHovered(false)}>
          {packages.map((pkg, index) => (
            <div
              key={pkg.name}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out bg-cover bg-center
                ${index === activeIndex 
                  ? 'opacity-100 scale-100 z-10' 
                  : 'opacity-0 scale-110 z-0'}`}
              style={{ 
                backgroundImage: `url(${pkg.image})`,
                transitionProperty: 'transform, opacity',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              <div className={`absolute bottom-0 left-0 right-0 p-8 text-white transition-all duration-700
                ${index === activeIndex ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="max-w-2xl mx-auto">
                  {pkg.badge && (
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${
                      pkg.badge === "BEST VALUE" ? "bg-rose-600/90" :
                      pkg.badge === "POPULAR" ? "bg-purple-600/90" :
                      pkg.badge === "NEW" ? "bg-emerald-600/90" :
                      "bg-amber-600/90"
                    }`}>
                      {pkg.badge}
                    </span>
                  )}
                  
                  <h3 className="text-3xl md:text-4xl font-serif font-bold mb-3">
                    {pkg.name}
                  </h3>
                  
                  <p className="text-lg text-gray-200 mb-6 max-w-xl">
                    {pkg.description}
                  </p>
                  
                  <div className="flex items-center mb-6">
                    <span className="text-3xl font-bold">{pkg.price}</span>
                    {pkg.originalPrice && (
                      <span className="text-gray-300 line-through ml-4 text-lg">
                        {pkg.originalPrice}
                      </span>
                    )}
                  </div>
                  
                  <button className="bg-white/20 hover:bg-white/30 text-white py-3 px-8 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center backdrop-blur-sm border border-white/20 hover:border-white/40">
                    <span>Explore This Package</span>
                    <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Package Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
            {packages.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'bg-white scale-125' : 'bg-white/50'
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`View package ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {packages.map((pkg, index) => (
            <div 
              key={pkg.name}
              className="group relative h-80 rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-2"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${pkg.image})` }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              
              {/* Content Container */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                {/* Badge */}
                {pkg.badge && (
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${
                    pkg.badge === "BEST VALUE" ? "bg-rose-600/90" :
                    pkg.badge === "POPULAR" ? "bg-purple-600/90" :
                    pkg.badge === "NEW" ? "bg-emerald-600/90" :
                    "bg-amber-600/90"
                  }`}>
                    {pkg.badge}
                  </span>
                )}
                
                <h3 className="text-xl font-serif font-bold mb-2">
                  {pkg.name}
                </h3>
                
                <div className="flex items-center mb-4">
                  <span className="text-xl font-bold">{pkg.price}</span>
                  {pkg.originalPrice && (
                    <span className="text-gray-300 line-through ml-3 text-sm">
                      {pkg.originalPrice}
                    </span>
                  )}
                </div>
                
                {/* Action Button */}
                <button className="w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center backdrop-blur-sm border border-white/20 group-hover:border-white/40">
                  <span>View Details</span>
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-8 shadow-lg border border-rose-100 max-w-2xl mx-auto">
            <h3 className="text-2xl font-serif font-bold text-gray-800 mb-4">
              Can't Find Your Perfect Package?
            </h3>
            <p className="text-gray-600 mb-6">
              Our beauty experts can create a custom bundle tailored to your specific skin needs and preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-rose-200">
                Create Custom Package
              </button>
              <button className="border border-rose-200 text-rose-600 hover:bg-rose-50 px-6 py-3 rounded-lg font-medium transition-colors duration-300">
                Contact Beauty Expert
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          33% {
            transform: translateY(-8px) rotate(0.3deg);
          }
          66% {
            transform: translateY(4px) rotate(-0.3deg);
          }
        }
        
        .grid > div {
          animation: float 6s ease-in-out infinite;
        }
        
        .grid > div:nth-child(2) {
          animation-delay: 1.5s;
        }
        
        .grid > div:nth-child(3) {
          animation-delay: 3s;
        }
      `}</style>
    </div>
  );
};

export default Packages;