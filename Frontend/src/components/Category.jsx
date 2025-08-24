const Category = () => {
  const categories = [
    {
      name: "Serums",
      image: "/serum.jpg",
      description: "Powerful formulations for targeted skincare solutions"
    },
    {
      name: "Toners",
      image: "/serum1.jpg",
      description: "Refresh and balance your skin's natural pH"
    },
    {
      name: "Lotions",
      image: "/lotion.jpg",
      description: "Hydrate and nourish your skin daily"
    },
    {
      name: "Foundation",
      image: "/foundation.jpg",
      description: "Flawless coverage with natural finish"
    }
  ];

  return (
    <div className="px-4 py-12 bg-gradient-to-b from-rose-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-4">Shop By Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated collection of beauty products designed to enhance your natural beauty
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-2"
            >
              <div 
                className="h-80 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${category.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transition-all duration-500 group-hover:bottom-4">
                  <h3 className="text-2xl font-serif font-bold mb-2">{category.name}</h3>
                  <p className="text-rose-100 opacity-0 transition-opacity duration-500 group-hover:opacity-100 mb-4">
                    {category.description}
                  </p>
                  <button className="bg-white text-rose-600 px-5 py-2 rounded-full font-medium text-sm opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-rose-50">
                    Shop Now
                  </button>
                </div>
                
                {/* Hover overlay effect */}
                <div className="absolute inset-0 bg-rose-900 opacity-0 transition-opacity duration-500 group-hover:opacity-20"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
            View All Categories
          </button>
        </div>
      </div>
    </div>
  );
};

export default Category;