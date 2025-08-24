import { useEffect, useState } from "react";
import Product from "./Product";
import PropTypes from "prop-types";
import { userRequest } from "../requestMethods";
import { Link } from "react-router-dom";

const Products = ({ filters, sort, query }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      setIsLoading(true);
      try {
        let res;
        if (query) {
          res = await userRequest.get(`/products?search=${query}`);
        } else {
          res = await userRequest.get("/products");
        }
        setProducts(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getProducts();
  }, [query]);

  useEffect(() => {
    let tempProducts = [...products];

    // apply filters
    if (filters) {
      tempProducts = tempProducts.filter((item) =>
        Object.entries(filters).every(([key, value]) => {
          if (!value) return true;
          return item[key].includes(value);
        })
      );
    }

    // Apply sorting
    if (sort === "newest") {
      tempProducts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sort === "asc") {
      tempProducts.sort((a, b) => a.originalPrice - b.originalPrice);
    } else if (sort === "desc") {
      tempProducts.sort((a, b) => b.originalPrice - a.originalPrice);
    }

    setFilteredProducts(tempProducts);
  }, [products, filters, sort]);

  if (isLoading) {
    return (
      <div className="px-4 py-12 bg-gradient-to-b from-rose-50 via-white to-rose-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Animated header */}
          <div className="text-center mb-12">
            <div className="inline-block bg-gradient-to-r from-rose-400 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4 animate-pulse">
              ✨ Discover Our Collection
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {query ? `Searching for "${query}"` : "Curated Beauty Selection"}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 animate-pulse">
                <div className="h-80 bg-gradient-to-br from-rose-100 to-pink-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gradient-to-r from-rose-100 to-pink-200 rounded-full mb-3"></div>
                  <div className="h-4 bg-gradient-to-r from-rose-100 to-pink-200 rounded-full w-3/4 mb-4"></div>
                  <div className="h-4 bg-gradient-to-r from-rose-100 to-pink-200 rounded-full w-1/2 mb-5"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gradient-to-r from-rose-100 to-pink-200 rounded-full w-1/3"></div>
                    <div className="h-10 w-10 bg-gradient-to-r from-rose-100 to-pink-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-12 bg-gradient-to-b from-rose-50 via-white to-rose-50 min-h-screen">
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-5 w-16 h-16 bg-rose-200/30 rounded-full animate-float1"></div>
      <div className="absolute top-1/3 right-10 w-12 h-12 bg-pink-300/20 rounded-full animate-float2"></div>
      <div className="absolute bottom-1/4 left-20 w-10 h-10 bg-rose-400/10 rounded-full animate-float3"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Results Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-rose-400 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            ✨ {query ? "Search Results" : "Premium Collection"}
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
            {query ? `Results for "${query}"` : "Our Beauty Products"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our expertly curated selection of premium beauty products
          </p>
          
          <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 inline-flex items-center shadow-sm border border-rose-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-700">
              Showing <span className="font-semibold text-rose-600">{filteredProducts.length}</span> products
            </span>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-12 max-w-md mx-auto shadow-lg border border-white">
              <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">No products found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or search terms to find what you're looking for</p>
              <button className="bg-gradient-to-r from-rose-400 to-pink-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <Link 
                to={`/product/${product._id}`} 
                key={product._id}
                className="block transition-all duration-500 hover:-translate-y-2 group"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-white group-hover:border-rose-100 h-full flex flex-col">
                  <Product product={product} />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {filteredProducts.length > 0 && filteredProducts.length >= 12 && (
          <div className="text-center mt-16">
            <button className="bg-gradient-to-r from-rose-400 to-pink-500 text-white px-8 py-4 rounded-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 font-medium flex items-center justify-center mx-auto group">
              <span>Load More Products</span>
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-15px) translateX(10px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(10px) translateX(-15px); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-8px) translateX(-8px); }
        }
        .animate-float1 {
          animation: float1 8s ease-in-out infinite;
        }
        .animate-float2 {
          animation: float2 10s ease-in-out infinite;
        }
        .animate-float3 {
          animation: float3 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

Products.propTypes = {
  cat: PropTypes.string,
  filters: PropTypes.object,
  sort: PropTypes.string,
  query: PropTypes.string
};

export default Products;