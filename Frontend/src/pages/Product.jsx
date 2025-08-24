import StarRatings from 'react-star-ratings';
import { FaMinus, FaPlus, FaHeart, FaShare, FaCheck } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { userRequest } from "../requestMethods";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addProduct } from '../redux/cartRedux';
import { showAverageRating } from "../components/Ratings"

const Product = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2]
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart)

  let price;

  const handleQuantity = (action) => {
    if (action === "dec") {
      setQuantity(quantity === 1 ? 1 : quantity - 1)
    }

    if (action === "inc") {
      setQuantity(quantity + 1)
    }
  }

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await userRequest.get("/products/find/" + id);
        setProduct(res.data);
        // Set the first image as selected by default
        if (res.data.img) {
          setSelectedImage(0);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getProduct();
  }, [id]);

  const handlePrice = (
    originalPrice,
    discountedPrice,
    wholePrice,
    minimumQuantity,
    quantity
  ) => {
    if (quantity > minimumQuantity && discountedPrice) {
      discountedPrice = wholePrice;
      price = discountedPrice;
      return price;
    } else if (quantity > minimumQuantity && originalPrice) {
      originalPrice = wholePrice;
      price = originalPrice;
      return price;
    } else if (discountedPrice) {
      price = discountedPrice;
      return price;
    } else {
      price = originalPrice;
      return price;
    }
  };

  const handleAddToCart = () => {
    dispatch(addProduct({ ...product, quantity, price, email: 'johndoe@gmail.com' }))
    toast.success("Product added to cart successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  }

  // Sample gallery images (in a real app, you'd get these from your product data)
  const galleryImages = product.img ? [product.img, product.img, product.img] : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Product Images */}
          <div className="flex-1">
            <div className="sticky top-28">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="relative h-96 mb-4 rounded-xl overflow-hidden">
                  <img
                    src={galleryImages[selectedImage] || product.img}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <button 
                    onClick={toggleWishlist}
                    className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-md hover:bg-rose-50 transition-colors duration-300"
                  >
                    <FaHeart className={isWishlisted ? "text-rose-600" : "text-gray-400"} />
                  </button>
                </div>
                
                {galleryImages.length > 1 && (
                  <div className="flex gap-3 mt-4">
                    {galleryImages.map((img, index) => (
                      <div 
                        key={index} 
                        className={`w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 Ksh{selectedImage === index ? 'border-rose-400' : 'border-gray-200'}`}
                        onClick={() => setSelectedImage(index)}
                      >
                        <img src={img} alt={`Thumbnail Ksh{index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h1 className="text-3xl font-serif font-bold text-gray-800 mb-4">
                {product.title}
              </h1>
              
              <div className="flex items-center mb-6">
                <div className="mr-4">
                  {showAverageRating(product)}
                </div>
                <span className="text-gray-500 text-sm">
                  ({product.ratings?.length || 0} reviews)
                </span>
              </div>

              <p className="text-gray-600 mb-8 leading-relaxed">
                {product.desc}
              </p>

              {/* Pricing */}
              <div className="mb-8">
                <div className="flex items-center mb-2">
                  <span className="text-3xl font-bold text-rose-700 mr-3">
                    Ksh
                    {handlePrice(
                      product.originalPrice,
                      product.discountedPrice,
                      product.wholesalePrice,
                      product?.wholesaleMinimumQuantity,
                      quantity
                    )}
                  </span>
                  {product.discountedPrice && product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      Ksh{product.originalPrice}
                    </span>
                  )}
                </div>
                
                {product.discountedPrice && (
                  <span className="inline-block bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-medium">
                    Save Ksh{(product.originalPrice - product.discountedPrice).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Wholesale Notice */}
              {product.wholesalePrice && (
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 mb-8">
                  <div className="flex items-center">
                    <FaCheck className="text-rose-600 mr-2" />
                    <span className="font-medium text-rose-700">
                      Wholesale Available: Ksh{product.wholesalePrice} for {product.wholesaleMinimumQuantity}+ items
                    </span>
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-3">Quantity</label>
                <div className="flex items-center">
                  <button 
                    onClick={() => handleQuantity("dec")}
                    className="w-12 h-12 flex items-center justify-center bg-rose-100 text-rose-600 rounded-l-full hover:bg-rose-200 transition-colors duration-300"
                  >
                    <FaMinus />
                  </button>
                  <span className="w-16 h-12 flex items-center justify-center bg-white border-t border-b border-gray-200 text-lg font-medium">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => handleQuantity("inc")}
                    className="w-12 h-12 flex items-center justify-center bg-rose-100 text-rose-600 rounded-r-full hover:bg-rose-200 transition-colors duration-300"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button 
                onClick={handleAddToCart}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg mb-4"
              >
                Add to Cart
              </button>

              {/* Additional Actions */}
              <div className="flex gap-4">
                <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-full text-gray-700 hover:bg-gray-50 transition-colors duration-300">
                  <FaShare />
                  Share
                </button>
              </div>

              {/* Product Details */}
              <div className="mt-10 pt-8 border-t border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Product Details</h3>
                
                <div className="bg-rose-50 rounded-xl p-5 mb-6">
                  <h4 className="font-medium text-rose-800 mb-3 flex items-center">
                    <FaCheck className="mr-2" />
                    What's Included
                  </h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{product.title}</li>
                    <li>User manual</li>
                    <li>30-day satisfaction guarantee</li>
                  </ul>
                </div>

                {/* Features/Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-gray-700">100% Natural Ingredients</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-gray-700">Cruelty Free</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-gray-700">Dermatologist Tested</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-gray-700">Vegan Formula</span>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              {product.ratings && product.ratings.length > 0 && (
                <div className="mt-10 pt-8 border-t border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Customer Reviews</h3>
                  
                  <div className="space-y-6">
                    {product.ratings.map((rating, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-5">
                        <div className="flex items-center mb-3">
                          <StarRatings
                            rating={parseInt(rating.star)}
                            starDimension="18px"
                            starRatedColor="#fbbf24"
                            starSpacing="2px"
                          />
                          <span className="font-medium text-gray-800 ml-3">{rating.postedBy}</span>
                        </div>
                        <p className="text-gray-600">{rating.comment || "No comment provided"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;