import { FaCheckCircle, FaShoppingBag, FaTruck, FaCreditCard, FaStar, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import StarRatings from 'react-star-ratings';
import { useEffect, useState } from "react";
import { userRequest } from "../requestMethods";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';

const Order = () => {
  const user = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [activeOrder, setActiveOrder] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    const getUserOrder = async () => {
      try {
        const res = await userRequest.get(
          `/orders/find/${user.currentUser._id}`
        );
        setOrders(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (user.currentUser) {
      getUserOrder();
    }
  }, [user]);

  const handleRating = async (productId) => {
    if (!rating) {
      alert("Please select a rating");
      return;
    }

    const singleRating = {
      star: rating,
      name: user.currentUser.name,
      postedBy: user.currentUser.name,
      comment: comment,
    };
    
    try {
      await userRequest.put(`/products/rating/${productId}`, singleRating);
      setComment("");
      setRating(0);
      setActiveProduct(null);
      alert("Thank you for your review!");
    } catch (error) {
      console.log(error);
      alert("Error submitting review. Please try again.");
    }
  }

  const calculateOrderTotal = (order) => {
    return order.products.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  }

  const toggleItemsExpansion = (orderId) => {
    setExpandedItems(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  }

  const getVisibleProducts = (order, orderId) => {
    const isExpanded = expandedItems[orderId];
    return isExpanded ? order.products : order.products.slice(0, 2);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-rose-600 text-4xl" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">Your Order History</h1>
          <p className="text-gray-600">Thank you for shopping with us! Here are your recent orders.</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingBag className="w-12 h-12 text-rose-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8">You haven't placed any orders yet. Start shopping to see your order history here.</p>
            <Link 
              to="/products" 
              className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg inline-block"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Order Header - Always Visible */}
                <div className="bg-rose-50 p-6 border-b border-rose-100">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-800">Order #{order._id.slice(-8).toUpperCase()}</h2>
                      <p className="text-gray-600 text-sm mt-1">Placed on {formatDate(order.createdAt)}</p>
                      <p className="text-gray-600 text-sm">
                        {order.products.length} item{order.products.length !== 1 ? 's' : ''} • Total: {formatCurrency(calculateOrderTotal(order) + 500)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-medium">
                        {order.status || "Completed"}
                      </span>
                      <button
                        onClick={() => toggleOrderExpansion(order._id)}
                        className="text-rose-600 hover:text-rose-700 transition-colors duration-300"
                      >
                        {expandedOrders[order._id] ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Collapsible Order Details */}
                {expandedOrders[order._id] && (
                  <>
                    {/* Order Items */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FaShoppingBag className="text-rose-600 mr-2" />
                        Items Ordered ({order.products.length})
                      </h3>
                      
                      <div className="space-y-6">
                        {getVisibleProducts(order, order._id).map((product, productIndex) => (
                          <div key={productIndex} className="border-b border-gray-100 pb-6 last:border-0">
                            <div className="flex flex-col sm:flex-row items-start gap-4">
                              <img
                                src={product.img}
                                alt={product.title}
                                className="w-20 h-20 rounded-lg object-cover shadow-sm"
                              />
                              
                              <div className="flex-1">
                                <h4 className="text-lg font-medium text-gray-800">{product.title}</h4>
                                <p className="text-gray-600">Quantity: {product.quantity}</p>
                                <p className="text-lg font-bold text-rose-700 mt-1">
                                  {formatCurrency(product.price * product.quantity)}
                                </p>
                                
                                {/* Rating Section */}
                                <div className="mt-4">
                                  <button
                                    onClick={() => {
                                      setActiveProduct(activeProduct === product._id ? null : product._id);
                                      setActiveOrder(order._id);
                                    }}
                                    className="text-rose-600 hover:text-rose-700 text-sm font-medium flex items-center"
                                  >
                                    <FaStar className="mr-1" />
                                    {activeProduct === product._id ? "Cancel Review" : "Rate this Product"}
                                  </button>
                                  
                                  {activeProduct === product._id && (
                                    <div className="mt-3 p-4 bg-rose-50 rounded-lg">
                                      <h5 className="font-medium text-gray-800 mb-2">How would you rate this product?</h5>
                                      <StarRatings
                                        numberOfStars={5}
                                        starDimension="25px"
                                        rating={rating}
                                        isSelectable={true}
                                        starRatedColor="#fbbf24"
                                        changeRating={(newRating) => setRating(newRating)}
                                      />
                                      <textarea
                                        placeholder="Share your experience with this product (optional)"
                                        className="w-full mt-3 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
                                        rows="3"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                      />
                                      <div className="flex gap-2 mt-3">
                                        <button
                                          onClick={() => handleRating(product._id)}
                                          className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
                                        >
                                          Submit Review
                                        </button>
                                        <button
                                          onClick={() => {
                                            setActiveProduct(null);
                                            setComment("");
                                            setRating(0);
                                          }}
                                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Show More/Less Items Toggle */}
                        {order.products.length > 2 && (
                          <div className="text-center pt-4">
                            <button
                              onClick={() => toggleItemsExpansion(order._id)}
                              className="text-rose-600 hover:text-rose-700 font-medium flex items-center justify-center gap-2 mx-auto"
                            >
                              {expandedItems[order._id] ? (
                                <>
                                  <FaChevronUp /> Show Less
                                </>
                              ) : (
                                <>
                                  <FaChevronDown /> Show All {order.products.length} Items
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 p-6 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                            <FaTruck className="text-rose-600 mr-2" />
                            Shipping Information
                          </h3>
                          <p className="text-gray-600">{user.currentUser?.email}</p>
                          <p className="text-gray-600">{user.currentUser?.name}</p>
                          {order.address && (
                            <div className="mt-2 text-sm text-gray-600">
                              <p>{order.address.street}</p>
                              <p>{order.address.city}, {order.address.postalCode}</p>
                              <p>{order.address.country}</p>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                            <FaCreditCard className="text-rose-600 mr-2" />
                            Payment Method
                          </h3>
                          <p className="text-gray-600 capitalize">{order.paymentMethod || 'Credit Card'}</p>
                          <p className="text-gray-600 text-sm mt-1">
                            Status: <span className="font-medium capitalize text-rose-600">{order.paymentStatus || 'Paid'}</span>
                          </p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Summary</h3>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-medium">{formatCurrency(calculateOrderTotal(order))}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Shipping:</span>
                            <span className="font-medium">{formatCurrency(500)}</span>
                          </div>
                          {order.discount > 0 && (
                            <div className="flex justify-between mb-2 text-green-600">
                              <span>Discount:</span>
                              <span className="font-medium">-{formatCurrency(order.discount)}</span>
                            </div>
                          )}
                          <div className="flex justify-between mb-2 pt-2 border-t border-gray-100">
                            <span className="text-lg font-semibold">Total:</span>
                            <span className="text-lg font-semibold text-rose-700">
                              {formatCurrency((calculateOrderTotal(order) + 500 - (order.discount || 0)))}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {orders.length > 0 && (
          <div className="text-center mt-10">
            <Link 
              to="/products" 
              className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg inline-block"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;