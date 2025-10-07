import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { userRequest } from "../requestMethods";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../redux/cartRedux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showAverageRating } from "../components/Ratings";

const BundleDetail = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [bundle, setBundle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Fetch bundle details
  useEffect(() => {
    const getBundle = async () => {
      setIsLoading(true);
      try {
        const res = await userRequest.get(`/bundles/${id}`);
        setBundle(res.data);
      } catch (error) {
        console.log("Error fetching bundle:", error);
        toast.error("Failed to load bundle details");
      } finally {
        setIsLoading(false);
      }
    };
    getBundle();
  }, [id]);

  const handleAddToCart = () => {
    if (!bundle) return;

    // Add all products from bundle to cart
    bundle.products.forEach((product) => {
      dispatch(
        addProduct({
          ...product,
          _id: product.productId || product._id,
          title: product.title,
          desc: product.desc,
          img: product.img?.[0],
          originalPrice: product.originalPrice,
          discountedPrice: product.discountedPrice,
          quantity: quantity,
          price: getProductPrice(product),
        })
      );
    });

    toast.success(`${bundle.name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => {
      navigate("/cart");
    }, 1000);
  };

  const getProductPrice = (product) => {
    return product.discountedPrice || product.originalPrice;
  };

  const getBundleSavings = () => {
    if (!bundle) return 0;
    return bundle.originalPrice - bundle.discountedPrice;
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case "BEST VALUE":
        return "bg-green-500";
      case "POPULAR":
        return "bg-blue-500";
      case "PREMIUM":
        return "bg-purple-500";
      case "NEW":
        return "bg-pink-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatPrice = (price) => {
    return `KES ${price}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-300 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-12 bg-gray-300 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Bundle Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The bundle you're looking for doesn't exist.
          </p>
          <Link
            to="/packages"
            className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors"
          >
            Back to Packages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-rose-600">
              Home
            </Link>
            <span>/</span>
            <Link to="/packages" className="hover:text-rose-600">
              Packages
            </Link>
            <span>/</span>
            <span className="text-gray-900">{bundle.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <img
                src={bundle.image}
                alt={bundle.name}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Bundle Badge */}
            {bundle.badge && (
              <div
                className={`inline-flex px-4 py-2 rounded-full text-white font-bold ${getBadgeColor(
                  bundle.badge
                )}`}
              >
                {bundle.badge}
              </div>
            )}

            {/* Bundle Type */}
            <div
              className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ml-3 ${
                bundle.isPrebuilt
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {bundle.isPrebuilt ? "Prebuilt Package" : "Custom Bundle"}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {bundle.name}
              </h1>
              <p className="text-lg text-gray-600 mb-6">{bundle.description}</p>

              {/* Rating */}
              <div className="flex items-center mb-6">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-5 h-5 text-amber-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  4.8 (124 reviews)
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-rose-50 rounded-2xl p-6">
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-rose-600">
                  {formatPrice(bundle.discountedPrice)}
                </span>
                {bundle.originalPrice > bundle.discountedPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(bundle.originalPrice)}
                    </span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Save {formatPrice(getBundleSavings())}
                    </span>
                  </>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-rose-500 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <span className="w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-rose-500 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-white border border-rose-600 text-rose-600 py-3 px-6 rounded-xl hover:bg-rose-50 transition-colors font-semibold flex items-center justify-center space-x-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-rose-600 text-white py-3 px-6 rounded-xl hover:bg-rose-700 transition-colors font-semibold flex items-center justify-center space-x-2"
                >
                  <span>Buy Now</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Quick Features */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>30-Day Returns</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Authentic Products</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Expert Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {["overview", "products", "benefits", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? "border-rose-500 text-rose-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="prose max-w-none">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Package Overview
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  {bundle.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">
                      What's Included
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                        <span>Complete routine products</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                        <span>Step-by-step usage guide</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                        <span>Expert skincare consultation</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Best For
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {bundle.concern?.map((concern, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {concern}
                        </span>
                      ))}
                      {bundle.skintype?.map((type, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === "products" && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Included Products
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bundle.products.map((product, index) => (
                    <div
                      key={product.productId || index}
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="h-48 overflow-hidden">
                        <img
                          src={product.img?.[0] || product.img}
                          alt={product.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {product.title}
                        </h4>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {product.desc}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-rose-600 font-bold">
                            {formatPrice(getProductPrice(product))}
                          </span>
                          {product.originalPrice > getProductPrice(product) && (
                            <span className="text-gray-500 line-through text-sm">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits Tab */}
            {activeTab === "benefits" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">
                    Key Benefits
                  </h4>
                  <ul className="space-y-4">
                    <li className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg
                          className="w-3 h-3 text-rose-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">
                          Complete Routine
                        </h5>
                        <p className="text-gray-600 text-sm">
                          Everything you need in one package
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg
                          className="w-3 h-3 text-rose-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">
                          Cost Effective
                        </h5>
                        <p className="text-gray-600 text-sm">
                          Save money compared to buying individually
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg
                          className="w-3 h-3 text-rose-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">
                          Expert Curated
                        </h5>
                        <p className="text-gray-600 text-sm">
                          Products selected by skincare specialists
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">
                    How to Use
                  </h4>
                  <ol className="space-y-3 list-decimal list-inside">
                    <li className="text-gray-700">
                      Start with the cleanser to remove impurities
                    </li>
                    <li className="text-gray-700">
                      Apply toner to balance skin pH
                    </li>
                    <li className="text-gray-700">
                      Use serum for targeted treatment
                    </li>
                    <li className="text-gray-700">
                      Finish with moisturizer to hydrate
                    </li>
                    <li className="text-gray-700">
                      Apply sunscreen in the morning routine
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Customer Reviews
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Review Stats */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        4.8
                      </div>
                      <div className="flex justify-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className="w-5 h-5 text-amber-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <div className="text-gray-600">Based on 124 reviews</div>
                    </div>
                  </div>

                  {/* Sample Reviews */}
                  <div className="space-y-6">
                    {[1, 2, 3].map((review) => (
                      <div
                        key={review}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                              <span className="text-rose-600 font-semibold">
                                U{review}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                User {review}
                              </div>
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <svg
                                    key={star}
                                    className="w-4 h-4 text-amber-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            2 weeks ago
                          </div>
                        </div>
                        <p className="text-gray-700">
                          This package completely transformed my skincare
                          routine! The products work perfectly together and my
                          skin has never looked better.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Bundles */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            You Might Also Like
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* You can fetch related bundles here */}
            <div className="text-center py-12">
              <p className="text-gray-600">More bundles coming soon!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleDetail;
