import { useNavigate } from "react-router-dom";

const Category = () => {
  const navigate = useNavigate();

  const categories = [
  

    { 
      id: 5, 
      name: "Cleansers", 
      bg: "bg-indigo-100", 
      icon: "✨" 
    },
    { 
      id: 6, 
      name: "Moisturizers", 
      bg: "bg-teal-100", 
      icon: "💫" 
    },
    { 
      id: 7, 
      name: "Masks", 
      tag: "popular", 
      tagColor: "bg-orange-400", 
      bg: "bg-violet-100", 
      icon: "🧖‍♀️" 
    },
    { 
      id: 8, 
      name: "Sunscreen", 
      bg: "bg-yellow-100", 
      icon: "☀️" 
    }
  ];

  const handleCategoryClick = (categoryName) => {
    navigate(`/products/${categoryName.toLowerCase()}`);
  };

  const CategoryCard = ({ name, tag, tagColor, bg, icon }) => {
    return (
      <div
        onClick={() => handleCategoryClick(name)}
        className={`relative w-60 h-[50vh] rounded-xl shadow-md flex flex-col items-center justify-center ${bg} cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-2`}
      >
        {tag && (
          <span
            className={`absolute -top-3 left-3 px-3 py-1 text-sm text-white rounded-full ${tagColor}`}
          >
            {tag}
          </span>
        )}
        <div className="text-8xl mb-6">{icon}</div>
        <div className="text-lg font-semibold text-gray-800">{name}</div>
      </div>
    );
  };

  return (
    <div className="px-4 py-16 bg-gradient-to-b from-white to-rose-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center bg-white/80 backdrop-blur-md text-gray-700 px-6 py-3 rounded-full text-sm font-medium mb-6 shadow-lg border border-gray-200">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            ✨ Premium Skincare Collection
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Shop By Category
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            Discover our carefully curated collection of beauty products designed to enhance your natural beauty
          </p>
        </div>
        
        <div className="flex gap-8 justify-center flex-wrap">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} {...cat} />
          ))}
        </div>
        

      </div>
    </div>
  );
};

export default Category;