import { useState, useEffect } from "react";
import { userRequest } from "../requestMethods";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../redux/cartRedux";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { showAverageRating } from "../components/Ratings";

const Packages = () => {
  const [step, setStep] = useState(1); // 1: Select products, 2: Confirm package, 3: Order
  const [products, setProducts] = useState([]);
  const [bundles, setBundles] = useState([]); // Prebuilt bundles from database
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [bundlesLoading, setBundlesLoading] = useState(true);
  const [showAddAnimation, setShowAddAnimation] = useState(false);
  const [animatingProduct, setAnimatingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("prebuilt"); // "prebuilt" or "custom"

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  // Fetch prebuilt bundles from database
  useEffect(() => {
    const getBundles = async () => {
      setBundlesLoading(true);
      try {
        const res = await userRequest.get("/bundles");
        // Filter for prebuilt bundles only
        const prebuiltBundles = res.data.filter(bundle => bundle.isPrebuilt);
        setBundles(prebuiltBundles);
      } catch (error) {
        console.log("Error fetching bundles:", error);
        toast.error("Failed to load packages");
      } finally {
        setBundlesLoading(false);
      }
    };
    getBundles();
  }, []);

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
        toast.error("Failed to load products");
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

  const handleAddToPackage = (product) => {
    setAnimatingProduct(product);
    setShowAddAnimation(true);

    // Add product after animation
    setTimeout(() => {
      setSelectedProducts(prev => {
        const exists = prev.find(p => p._id === product._id);
        if (!exists) {
          return [...prev, { ...product, quantity: 1 }];
        }
        return prev;
      });
      setShowAddAnimation(false);
      toast.success(`${product.title} added to package!`);
    }, 2000);
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(prev => prev.filter(p => p._id !== productId));
    toast.info("Product removed from package");
  };

  const handleAddPrebuiltPackageToCart = (bundle) => {
    // Add all products from prebuilt bundle to cart
    bundle.products.forEach(product => {
      dispatch(addProduct({ 
        ...product,
        _id: product.productId || product._id,
        title: product.title,
        desc: product.desc,
        img: product.img,
        originalPrice: product.originalPrice,
        discountedPrice: product.discountedPrice,
        quantity: 1,
        price: getProductPrice(product)
      }));
    });

    toast.success(`${bundle.name} added to cart!`);
    
    // Redirect to cart page
    setTimeout(() => {
      window.location.href = '/cart';
    }, 1500);
  };

  const getProductPrice = (product) => {
    return product.discountedPrice || product.originalPrice;
  };

  const getPackageTotal = () => {
    return selectedProducts.reduce((total, product) => {
      return total + (getProductPrice(product) * product.quantity);
    }, 0);
  };

  const getPackageSavings = () => {
    const individualTotal = selectedProducts.reduce((total, product) => {
      return total + (product.originalPrice * product.quantity);
    }, 0);
    return individualTotal - getPackageTotal();
  };

  const handleProceedToStep2 = () => {
    if (selectedProducts.length === 0) {
      toast.error("Please add at least one product to your package");
      return;
    }
    setStep(2);
  };

  const handleProceedToStep3 = () => {
    setStep(3);
  };

  const handlePlaceOrder = () => {
    // Add all selected products to cart
    selectedProducts.forEach(product => {
      dispatch(addProduct({ 
        ...product, 
        quantity: 1,
        price: getProductPrice(product)
      }));
    });

    toast.success("Package added to cart! Redirecting to checkout...");
    
    // Redirect to cart page
    setTimeout(() => {
      window.location.href = '/cart';
    }, 1500);
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'BEST VALUE': return "bg-rose-600";
      case 'POPULAR': return "bg-purple-600";
      case 'PREMIUM': return "bg-amber-600";
      case 'NEW': return "bg-emerald-600";
      default: return "bg-blue-600";
    }
  };

  // Add to Package Animation Component
  const AddToPackageAnimation = () => {
    if (!animatingProduct) return null;

    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center pointer-events-none">
        <div className="relative">
          {/* Dubois Beauty Bag */}
          <div className="w-32 h-40 bg-gradient-to-b from-rose-400 to-pink-500 rounded-2xl relative shadow-2xl border-2 border-white">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-24 h-6 bg-rose-300 rounded-t-2xl border-2 border-white"></div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm font-bold text-center">
              DUBOIS<br />BEAUTY
            </div>
          </div>
          
          {/* Flying Product */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-20 animate-fly-to-bag">
            <div className="bg-white rounded-xl shadow-2xl border-2 border-rose-200 p-3 transform rotate-12">
              <img 
                src={animatingProduct.img?.[0]} 
                alt={animatingProduct.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">+</span>
              </div>
            </div>
          </div>

          {/* Sparkle Effects */}
          <div className="absolute top-10 left-10 animate-sparkle-1">✨</div>
          <div className="absolute top-5 right-10 animate-sparkle-2">✨</div>
          <div className="absolute bottom-20 left-20 animate-sparkle-3">✨</div>
        </div>
      </div>
    );
  };

  // Prebuilt Packages Section
  const renderPrebuiltPackages = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4">
          Curated Beauty Packages
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Save time and money with our expertly crafted bundles
        </p>
      </div>

      {bundlesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : bundles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bundles.map(bundle => (
            <div key={bundle._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
              <div className="relative h-48">
                <img 
                  src={bundle.image} 
                  alt={bundle.name}
                  className="w-full h-full object-cover"
                />
                {bundle.badge && (
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white ${getBadgeColor(bundle.badge)}`}>
                    {bundle.badge}
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{bundle.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{bundle.description}</p>
                
                <div className="space-y-2 mb-4">
                  <h4 className="font-semibold text-gray-700 text-sm">Includes:</h4>
                  {bundle.products.slice(0, 3).map((product, index) => (
                    <div key={product.productId || index} className="flex items-center text-xs text-gray-600">
                      <div className="w-1 h-1 bg-rose-400 rounded-full mr-2"></div>
                      {product.title}
                    </div>
                  ))}
                  {bundle.products.length > 3 && (
                    <div className="text-xs text-rose-600 font-medium">
                      +{bundle.products.length - 3} more products
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-rose-600">KES {bundle.discountedPrice}</span>
                    {bundle.originalPrice > bundle.discountedPrice && (
                      <span className="text-gray-500 line-through text-lg">KES {bundle.originalPrice}</span>
                    )}
                  </div>
                  {bundle.originalPrice > bundle.discountedPrice && (
                    <div className="text-green-600 text-sm font-semibold">
                      Save KES {bundle.originalPrice - bundle.discountedPrice}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleAddPrebuiltPackageToCart(bundle)}
                  className="w-full bg-rose-600 text-white py-3 rounded-xl hover:bg-rose-700 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Add to Cart & Checkout
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Packages Available</h3>
            <p className="text-gray-600 mb-4">Check back soon for our curated beauty packages</p>
          </div>
        </div>
      )}
    </div>
  );

  // Step 1: Product Selection
  const renderStep1 = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-serif font-bold text-gray-800 mb-4">
          Create Your Beauty Package
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose from our curated packages or build your own personalized collection
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("prebuilt")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "prebuilt" 
                  ? "bg-rose-600 text-white shadow-md" 
                  : "text-gray-600 hover:text-rose-600 hover:bg-rose-50"
              }`}
            >
              Prebuilt Packages
            </button>
            <button
              onClick={() => setActiveTab("custom")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 relative overflow-hidden group ${
                activeTab === "custom" 
                  ? "bg-rose-600 text-white shadow-md" 
                  : "bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-lg animate-pulse-slow"
              }`}
            >
              {/* Animated border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              
              {/* Main button content */}
              <div className="flex items-center space-x-2 relative z-10">
                <span className="font-semibold">Create Your Personalized Package</span>
                
                {/* Animated arrows */}
                <div className="flex items-center space-x-1">
                  <svg 
                    className={`w-4 h-4 transform transition-all duration-300 ${
                      activeTab === "custom" 
                        ? "translate-x-0" 
                        : "group-hover:translate-x-1"
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <svg 
                    className={`w-4 h-4 transform transition-all duration-300 ${
                      activeTab === "custom" 
                        ? "translate-x-0" 
                        : "group-hover:translate-x-2 opacity-0 group-hover:opacity-100"
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>

              {/* Sparkle effect */}
              <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "prebuilt" ? renderPrebuiltPackages() : (
        <>
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search products by name, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pl-14 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-transparent text-lg shadow-sm"
            />
            <svg className="absolute left-5 top-4 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product._id} className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100">
                <div className="relative mb-4">
                  <img 
                    src={product.img?.[0]} 
                    alt={product.title}
                    className="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.discountedPrice && product.originalPrice > product.discountedPrice && (
                    <div className="absolute top-2 right-2 bg-rose-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                      -{Math.round((1 - product.discountedPrice / product.originalPrice) * 100)}%
                    </div>
                  )}
                </div>
                
                <h4 className="font-semibold text-gray-800 mb-2 line-clamp-1">{product.title}</h4>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.desc}</p>
                
                {/* Rating */}
                {product.ratings && product.ratings.length > 0 && (
                  <div className="flex items-center mb-3">
                    {showAverageRating(product)}
                    <span className="text-xs text-gray-500 ml-1">
                      ({product.ratings.length})
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-rose-600 font-bold">KES {getProductPrice(product)}</span>
                    {product.discountedPrice && product.originalPrice > product.discountedPrice && (
                      <span className="text-gray-500 line-through text-sm">KES {product.originalPrice}</span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => handleAddToPackage(product)}
                  className="w-full bg-rose-600 text-white py-3 rounded-xl hover:bg-rose-700 transition-colors font-medium flex items-center justify-center group-hover:scale-105 transition-transform animate-pulse-slow"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add to Package
                </button>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search terms</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Continue Button */}
      {selectedProducts.length > 0 && activeTab === "custom" && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <button
            onClick={handleProceedToStep2}
            className="bg-gradient-to-r from-rose-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 flex items-center space-x-3 animate-bounce-gentle"
          >
            <span>Continue to Package Review ({selectedProducts.length} items)</span>
            <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );

  // Step 2: Package Confirmation
  const renderStep2 = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-serif font-bold text-gray-800 mb-4">
          Review Your Package
        </h2>
        <p className="text-lg text-gray-600">
          Confirm your selected products and proceed to checkout
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Your Dubois Beauty Package</h3>
            <p className="text-gray-600">{selectedProducts.length} products selected</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-rose-600">KES {getPackageTotal()}</p>
            {getPackageSavings() > 0 && (
              <p className="text-sm text-green-600">You save KES {getPackageSavings()}</p>
            )}
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {selectedProducts.map(product => (
            <div key={product._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-rose-200 transition-colors">
              <div className="flex items-center space-x-4">
                <img 
                  src={product.img?.[0]} 
                  alt={product.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{product.title}</h4>
                  <p className="text-rose-600 font-bold">KES {getProductPrice(product)}</p>
                  {product.originalPrice > getProductPrice(product) && (
                    <p className="text-gray-500 line-through text-sm">KES {product.originalPrice}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleRemoveProduct(product._id)}
                className="text-gray-400 hover:text-rose-600 transition-colors p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="flex space-x-4 justify-end">
          <button
            onClick={() => setStep(1)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Back to Products
          </button>
          <button
            onClick={handleProceedToStep3}
            className="px-6 py-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );

  // Step 3: Order Confirmation
  const renderStep3 = () => (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-serif font-bold text-gray-800 mb-4">
          Complete Your Order
        </h2>
        <p className="text-lg text-gray-600">
          Your package is ready! Add it to cart to proceed with payment.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        {/* Order Summary */}
        <div className="bg-rose-50 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Products ({selectedProducts.length})</span>
              <span>KES {getPackageTotal()}</span>
            </div>
            {getPackageSavings() > 0 && (
              <div className="flex justify-between">
                <span>Package Discount</span>
                <span className="text-green-600">-KES {getPackageSavings()}</span>
            </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-3 border-t border-rose-200">
              <span>Total Amount</span>
              <span className="text-rose-600">KES {getPackageTotal()}</span>
            </div>
          </div>
        </div>

        {/* Package Contents */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-4">Package Contents:</h4>
          <div className="space-y-2">
            {selectedProducts.map(product => (
              <div key={product._id} className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
                <span>{product.title}</span>
                <span className="text-rose-600 font-medium">KES {getProductPrice(product)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => setStep(2)}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Back to Review
          </button>
          <button
            onClick={handlePlaceOrder}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl hover:from-rose-700 hover:to-pink-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 animate-pulse-slow"
          >
            Add to Cart & Checkout
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            You'll be able to choose payment options (Pay Now or Pay Later) in the cart
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative px-4 py-16 bg-gradient-to-b from-rose-50/70 via-white to-rose-50/70 overflow-hidden min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Add to Package Animation */}
      {showAddAnimation && <AddToPackageAnimation />}

      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-rose-200/20 rounded-full"></div>
        <div className="absolute top-1/3 right-0 w-64 h-64 bg-purple-200/15 rounded-full"></div>
        <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-amber-200/10 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Progress Steps */}
        {activeTab === "custom" && (
          <>
            <div className="flex justify-center mb-12">
              <div className="flex items-center space-x-8">
                {[1, 2, 3].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      step >= stepNumber 
                        ? 'bg-rose-600 text-white shadow-lg' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {stepNumber}
                    </div>
                    {stepNumber < 3 && (
                      <div className={`w-16 h-1 transition-all duration-300 ${
                        step > stepNumber ? 'bg-rose-600' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Labels */}
            <div className="flex justify-center mb-8">
              <div className="flex space-x-24 text-sm font-medium text-gray-600">
                <span className={step >= 1 ? 'text-rose-600' : ''}>Select Products</span>
                <span className={step >= 2 ? 'text-rose-600' : ''}>Review Package</span>
                <span className={step >= 3 ? 'text-rose-600' : ''}>Checkout</span>
              </div>
            </div>
          </>
        )}

        {/* Step Content */}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>

      <style jsx>{`
        @keyframes fly-to-bag {
          0% {
            transform: translate(-50%, -80px) scale(1) rotate(12deg);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, 20px) scale(1.1) rotate(-8deg);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, 60px) scale(0.8) rotate(0deg);
            opacity: 0;
          }
        }

        @keyframes sparkle-1 {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }

        @keyframes sparkle-2 {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(-180deg); }
        }

        @keyframes sparkle-3 {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(90deg); }
        }

        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        @keyframes bounce-gentle {
          0%, 100% { transform: translate(-50%, 0) scale(1); }
          50% { transform: translate(-50%, -5px) scale(1.02); }
        }

        .animate-fly-to-bag {
          animation: fly-to-bag 2s ease-in-out forwards;
        }

        .animate-sparkle-1 {
          animation: sparkle-1 2s ease-in-out;
        }

        .animate-sparkle-2 {
          animation: sparkle-2 2s ease-in-out 0.3s;
        }

        .animate-sparkle-3 {
          animation: sparkle-3 2s ease-in-out 0.6s;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Packages;