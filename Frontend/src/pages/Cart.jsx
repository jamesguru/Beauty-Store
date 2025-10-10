import { FaMinus, FaPlus, FaTrashAlt, FaArrowLeft, FaShoppingBag, FaCreditCard, FaBox, FaInfoCircle, FaTimes, FaSpinner, FaStore, FaTruck } from 'react-icons/fa';
import { useDispatch, useSelector } from "react-redux";
import { clearCart, removeProduct, updateQuantity } from '../redux/cartRedux';
import { paymentRequest, userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [modalStep, setModalStep] = useState(1); // 1: Payment choice, 2: Details form
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showPaymentIframe, setShowPaymentIframe] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    payNow: false,
    pickupOption: '', // 'pickup' or 'delivery'
    locationType: '' // 'nairobi' or 'outside'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [phoneError, setPhoneError] = useState('');

  // Handle modal animation states
  useEffect(() => {
    if (showOrderModal) {
      requestAnimationFrame(() => {
        setIsModalVisible(true);
      });
    } else {
      setIsModalVisible(false);
    }
  }, [showOrderModal]);

  // Check payment status periodically if iframe is shown
  useEffect(() => {
    let intervalId;
    
    if (showPaymentIframe && currentOrderId) {
      intervalId = setInterval(async () => {
        try {
          const response = await userRequest.get(`/pesapal/status?trackingId=${currentOrderId}&reference=${currentOrderId}`);
          console.log('Payment status check:', response.data);
          
          if (response.data.status === 'COMPLETED') {
            // Payment successful
            clearInterval(intervalId);
            toast.success('🎉 Payment completed successfully!');
            dispatch(clearCart());
            setShowPaymentIframe(false);
            navigate('/myorders');
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
        }
      }, 3000); // Check every 3 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [showPaymentIframe, currentOrderId, navigate, dispatch]);

  const handleRemoveProduct = (product) => {
    dispatch(removeProduct(product));
    toast.success('Item removed from cart');
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.info('Cart cleared');
  };

  const handleQuantityChange = (product, change) => {
    const newQuantity = product.quantity + change;
    
    if (newQuantity < 1) {
      handleRemoveProduct(product);
      return;
    }
    
    dispatch(updateQuantity({ 
      _id: product._id, 
      quantity: newQuantity 
    }));
  };

  const validatePhoneNumber = (phone) => {
    // Remove any non-digit characters
    const cleanedPhone = phone.replace(/\D/g, '');
    
    // Check if it's a valid Kenyan phone number
    const kenyanRegex = /^(254|0)(7[0-9]|1[0-1])[0-9]{7}$/;
    
    if (!cleanedPhone) {
      return { isValid: false, message: 'Phone number is required' };
    }
    
    if (!kenyanRegex.test(cleanedPhone)) {
      return { isValid: false, message: 'Please enter a valid Kenyan phone number' };
    }
    
    // Convert to international format (254...)
    let formattedPhone = cleanedPhone;
    if (cleanedPhone.startsWith('0')) {
      formattedPhone = '254' + cleanedPhone.substring(1);
    }
    
    return { isValid: true, formatted: formattedPhone };
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'phone') {
      // Only allow numbers
      const numbersOnly = value.replace(/\D/g, '');
      
      // Validate phone number as user types
      const validation = validatePhoneNumber(numbersOnly);
      setPhoneError(validation.isValid ? '' : validation.message);
      
      setOrderDetails(prev => ({
        ...prev,
        [name]: numbersOnly
      }));
      return;
    }
    
    setOrderDetails(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePickupOptionChange = (option) => {
    setOrderDetails(prev => ({
      ...prev,
      pickupOption: option,
      // Reset location type if switching to pickup
      ...(option === 'pickup' && { locationType: '' })
    }));
  };

  const handleLocationTypeChange = (location) => {
    setOrderDetails(prev => ({
      ...prev,
      locationType: location
    }));
  };

  const handleProceedToCheckout = () => {
    if (!user.currentUser) {
      toast.error("Please login to place an order");
      return;
    }
    setModalStep(1);
    setShowOrderModal(true);
  };

  const handleCloseModal = () => {
    if (!isProcessing) {
      setIsModalVisible(false);
      setTimeout(() => {
        setShowOrderModal(false);
        setModalStep(1);
        setOrderDetails({
          name: '',
          phone: '',
          email: '',
          address: '',
          payNow: false,
          pickupOption: '',
          locationType: ''
        });
        setPhoneError('');
      }, 300);
    }
  };

  const handleClosePaymentIframe = () => {
    setShowPaymentIframe(false);
    setPaymentUrl('');
    setCurrentOrderId(null);
    setIsIframeLoading(true);
  };

  const handleIframeLoad = () => {
    setIsIframeLoading(false);
  };

  const handlePaymentChoice = (payNow) => {
    setOrderDetails(prev => ({ ...prev, payNow }));
    setModalStep(2);
  };

  // Calculate shipping fee based on user selection
  const calculateShippingFee = () => {
    if (orderDetails.pickupOption === 'pickup') {
      return 0; // Free for pickup
    } else if (orderDetails.locationType === 'nairobi') {
      return 200; // KES 200 for Nairobi delivery
    } else if (orderDetails.locationType === 'outside') {
      return 350; // KES 350 for outside Nairobi delivery
    }
    return 0; // Default to 0 if not selected
  };

  const handlePlaceOrder = async () => {
    // Validate pickup/delivery selection
    if (!orderDetails.pickupOption) {
      toast.error('Please choose whether you will pickup or need delivery');
      return;
    }

    if (orderDetails.pickupOption === 'delivery' && !orderDetails.locationType) {
      toast.error('Please specify your delivery location');
      return;
    }

    // Validate phone number before proceeding
    const phoneValidation = validatePhoneNumber(orderDetails.phone);
    if (!phoneValidation.isValid) {
      toast.error(phoneValidation.message);
      return;
    }

    if (!orderDetails.name || !orderDetails.phone || !orderDetails.address) {
      toast.error('Please fill in all required details (name, phone, address)');
      return;
    }

    setIsProcessing(true);

    try {
      // All amounts are in KES now
      const subtotal = cart.total;
      const shippingFee = calculateShippingFee();
      const totalInKES = subtotal + shippingFee;

      // Format phone number to international format
      const formattedPhone = validatePhoneNumber(orderDetails.phone).formatted;

      // Create order first
      const orderData = {
        userId: user.currentUser._id,
        name: orderDetails.name,
        phone: formattedPhone.toString(),
        email: orderDetails.email || user.currentUser.email,
        address: orderDetails.address,
        products: cart.products.map(product => ({
          productId: product._id,
          title: product.title,
          quantity: product.quantity,
          price: product.price,
          img: product.img[0]
        })),
        total: totalInKES,
        subtotal: subtotal,
        shippingFee: shippingFee,
        pickupOption: orderDetails.pickupOption,
        locationType: orderDetails.locationType,
        status: orderDetails.payNow ? 0 : 1, // 0 = pending payment, 1 = confirmed order
      };

      console.log('📦 Creating order with data:', orderData);
      const orderResponse = await userRequest.post("/orders", orderData);
      console.log('✅ Order created successfully:', orderResponse.data);
      
      if (orderDetails.payNow) {
        // Proceed with payment in KES
        const paymentData = {
          email: orderDetails.email || user.currentUser.email,
          reference: orderResponse.data._id,
          phone: formattedPhone.toString(),
          first_name: orderDetails.name.split(' ')[0],
          last_name: orderDetails.name.split(' ').slice(1).join(' ') || 'Customer',
          amount: totalInKES,
          description: `Order for ${orderDetails.name} - ${cart.products.length} items`
        };

        console.log('💳 Making payment request with data:', paymentData);
        const paymentResponse = await paymentRequest.post("/payment", paymentData);
        
        if (paymentResponse.data) {
          setCurrentOrderId(orderResponse.data._id);
          setPaymentUrl(paymentResponse.data);
          setShowPaymentIframe(true);
          setIsIframeLoading(true);
          handleCloseModal();
        } else {
          throw new Error('No redirect URL received from payment gateway');
        }
      } else {
        // Order placed without immediate payment
        let successMessage = '🎉 Order placed successfully! ';
        if (orderDetails.pickupOption === 'pickup') {
          successMessage += 'We look forward to seeing you at our shop!';
        } else {
          successMessage += 'We will contact you for payment when your order is ready.';
        }
        
        toast.success(successMessage);
        dispatch(clearCart());
        handleCloseModal();
        navigate('/myorders');
      }

    } catch (error) {
      console.error('❌ Order/Payment error:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      if (error.response?.status === 400) {
        toast.error('Failed to create order. Please try again.');
      } else if (error.message.includes('redirect URL')) {
        toast.error('Payment service temporarily unavailable. Your order has been placed - we will contact you for payment.');
        dispatch(clearCart());
        handleCloseModal();
      } else {
        toast.error('Something went wrong. Please try again or contact support.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate totals in KES
  const subtotal = cart.total || 0;
  const shippingFee = calculateShippingFee();
  const total = subtotal + shippingFee;

  const renderModalContent = () => {
    if (modalStep === 1) {
      return (
        <div className="text-center">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCreditCard className="w-8 h-8 text-rose-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Choose Payment Method</h3>
          <p className="text-gray-600 mb-6">
            How would you like to complete your order?
          </p>

          <div className="space-y-4">
            <button
              onClick={() => handlePaymentChoice(true)}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center"
            >
              <FaCreditCard className="mr-3" />
              Pay Now - Secure Payment (KES {total.toLocaleString()})
            </button>

            <button
              onClick={() => handlePaymentChoice(false)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] border-2 border-dashed border-gray-300 flex items-center justify-center"
            >
              <FaBox className="mr-3" />
              Pay Later - When Order is Ready (KES {total.toLocaleString()})
            </button>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start">
              <FaInfoCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm text-yellow-800 font-semibold mb-1">Important Notice</p>
                <p className="text-xs text-yellow-700">
                  If you choose "Pay Later", our team will contact you for payment confirmation 
                  before your order is dispatched. Your goods will be prepared but will only be 
                  shipped after payment is completed.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleCloseModal}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-colors duration-300 mt-4"
          >
            Cancel
          </button>
        </div>
      );
    }

    return (
      <>
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => setModalStep(1)}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
            disabled={isProcessing}
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          <h3 className="text-2xl font-bold text-gray-800">Complete Your Order</h3>
          <button 
            onClick={handleCloseModal}
            className="text-gray-400 hover:text-gray-600 text-xl transition-transform duration-200 hover:scale-110"
            disabled={isProcessing}
          >
            ×
          </button>
        </div>

        {/* Payment method reminder */}
        <div className={`mb-6 p-3 rounded-lg ${
          orderDetails.payNow ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-center">
            {orderDetails.payNow ? (
              <>
                <FaCreditCard className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm font-semibold text-green-800">Paying Now</span>
                <span className="text-sm text-green-700 ml-2">- Secure payment via Pesapal (KES {total.toLocaleString()})</span>
              </>
            ) : (
              <>
                <FaBox className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-semibold text-blue-800">Paying Later</span>
                <span className="text-sm text-blue-700 ml-2">- We'll contact you when order is ready (KES {total.toLocaleString()})</span>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Pickup/Delivery Option */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Would you like to pickup from our shop or need delivery? *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handlePickupOptionChange('pickup')}
                className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${
                  orderDetails.pickupOption === 'pickup'
                    ? 'border-rose-500 bg-rose-50 text-rose-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-rose-300'
                }`}
              >
                <FaStore className="w-6 h-6 mx-auto mb-2" />
                <span className="font-medium">Pickup from Shop</span>
                <p className="text-xs mt-1 text-green-600">Free - No shipping fee</p>
              </button>
              
              <button
                type="button"
                onClick={() => handlePickupOptionChange('delivery')}
                className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${
                  orderDetails.pickupOption === 'delivery'
                    ? 'border-rose-500 bg-rose-50 text-rose-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-rose-300'
                }`}
              >
                <FaTruck className="w-6 h-6 mx-auto mb-2" />
                <span className="font-medium">Home Delivery</span>
                <p className="text-xs mt-1">Shipping fee applies</p>
              </button>
            </div>
            
            {orderDetails.pickupOption === 'pickup' && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>📍 Our Shop Location:</strong><br />
                  Nairobi CBD, near Manchester Coach Bus Station<br />
                  <span className="text-xs">We'll contact you when your order is ready for pickup</span>
                </p>
              </div>
            )}
          </div>

          {/* Delivery Location Selection */}
          {orderDetails.pickupOption === 'delivery' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select your delivery area *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleLocationTypeChange('nairobi')}
                  className={`p-3 border-2 rounded-lg text-center transition-all duration-200 ${
                    orderDetails.locationType === 'nairobi'
                      ? 'border-rose-500 bg-rose-50 text-rose-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-rose-300'
                  }`}
                >
                  <span className="font-medium">Within Nairobi</span>
                  <p className="text-xs mt-1">KES 200</p>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleLocationTypeChange('outside')}
                  className={`p-3 border-2 rounded-lg text-center transition-all duration-200 ${
                    orderDetails.locationType === 'outside'
                      ? 'border-rose-500 bg-rose-50 text-rose-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-rose-300'
                  }`}
                >
                  <span className="font-medium">Outside Nairobi</span>
                  <p className="text-xs mt-1">KES 350</p>
                </button>
              </div>
            </div>
          )}

          {/* Form fields */}
          {[
            { label: 'Full Name *', name: 'name', type: 'text', placeholder: 'Enter your full name', required: true },
            { 
              label: 'Phone Number *', 
              name: 'phone', 
              type: 'tel', 
              placeholder: 'e.g., 254727632051', 
              required: true 
            },
            { label: 'Email Address', name: 'email', type: 'email', placeholder: 'Enter your email (optional)', required: false },
          ].map((field, index) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={orderDetails[field.name]}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 ${
                  field.name === 'phone' && phoneError ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder={field.placeholder}
                required={field.required}
                inputMode={field.name === 'phone' ? 'numeric' : 'text'}
                pattern={field.name === 'phone' ? '[0-9]*' : undefined}
              />
              {field.name === 'phone' && phoneError && (
                <p className="text-red-500 text-xs mt-1">{phoneError}</p>
              )}
              {field.name === 'phone' && !phoneError && orderDetails.phone && (
                <p className="text-green-500 text-xs mt-1">✓ Valid Kenyan number</p>
              )}
              {field.name === 'phone' && (
                <p className="text-gray-500 text-xs mt-1">
                  Format: 2547XXXXXXXX (numbers only)
                </p>
              )}
            </div>
          ))}

          {/* Address field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {orderDetails.pickupOption === 'pickup' ? 'Your Address (for contact purposes)' : 'Delivery Address *'}
            </label>
            <textarea
              name="address"
              value={orderDetails.address}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
              placeholder={orderDetails.pickupOption === 'pickup' ? 
                "Your address (optional, for contact purposes)" : 
                "e.g., 1st Avenue, Kinoo, Kiambu"
              }
              required={orderDetails.pickupOption === 'delivery'}
            />
            {orderDetails.pickupOption === 'delivery' && (
              <p className="text-gray-500 text-xs mt-1">
                Please provide your complete delivery address
              </p>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Order Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Items ({cart.quantity})</span>
                <span>KES {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>
                  {orderDetails.pickupOption === 'pickup' ? 'Pickup' : 'Shipping'}
                  {orderDetails.pickupOption === 'delivery' && orderDetails.locationType && 
                    ` (${orderDetails.locationType === 'nairobi' ? 'Nairobi' : 'Outside Nairobi'})`
                  }
                </span>
                <span>
                  {shippingFee === 0 ? 'FREE' : `KES ${shippingFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total</span>
                <span className="text-rose-700">KES {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing || phoneError || !orderDetails.pickupOption || 
                     (orderDetails.pickupOption === 'delivery' && !orderDetails.locationType)}
            className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center transform hover:scale-[1.02] disabled:scale-100"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Processing...
              </>
            ) : orderDetails.payNow ? (
              <>
                <FaCreditCard className="mr-2" />
                Pay Now - KES {total.toLocaleString()}
              </>
            ) : (
              <>
                <FaBox className="mr-2" />
                Place Order (Pay Later)
              </>
            )}
          </button>
          
          <button
            onClick={handleCloseModal}
            disabled={isProcessing}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100"
          >
            Cancel
          </button>
        </div>

        {/* Security note */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            🔒 Your information is secure. {orderDetails.payNow ? 
            'You will be redirected to secure payment.' : 
            'We will contact you for payment when your order is ready.'}
          </p>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 pb-8 px-4 sm:px-6 lg:px-8">
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

        {/* Payment Iframe Modal */}
        {showPaymentIframe && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800">Complete Your Payment</h3>
                <button 
                  onClick={handleClosePaymentIframe}
                  className="text-gray-400 hover:text-gray-600 text-xl transition-transform duration-200 hover:scale-110"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="flex-1 p-4 relative">
                {isIframeLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                    <div className="text-center">
                      <FaSpinner className="animate-spin text-rose-600 text-4xl mb-4 mx-auto" />
                      <p className="text-gray-600">Loading payment gateway...</p>
                    </div>
                  </div>
                )}
                <iframe
                  src={paymentUrl}
                  className="w-full h-full rounded-lg border border-gray-200"
                  title="Pesapal Payment"
                  sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
                  onLoad={handleIframeLoad}
                  style={{ display: isIframeLoading ? 'none' : 'block' }}
                />
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  🔒 Secure payment processed by Pesapal. Do not close this window until payment is complete.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Order Modal with Smooth Animations */}
        {showOrderModal && (
          <div className={`
            fixed inset-0 flex items-center justify-center z-40 p-4
            transition-all duration-300 ease-out
            ${isModalVisible ? 'opacity-100' : 'opacity-0'}
          `}>
            {/* Backdrop with fade animation */}
            <div 
              className={`
                absolute inset-0 bg-black transition-opacity duration-300
                ${isModalVisible ? 'opacity-50' : 'opacity-0'}
              `}
              onClick={handleCloseModal}
            />
            
            {/* Modal content with scale animation */}
            <div className={`
              relative bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto
              transform transition-all duration-300 ease-out
              ${isModalVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
              ${modalStep === 1 ? 'max-w-sm w-full' : 'max-w-md w-full'}
            `}>
              <div className="p-6">
                {/* Animation wrapper for step content */}
                <div key={modalStep} className={`
                  transform transition-all duration-500 ease-out
                  ${isModalVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                `}>
                  {renderModalContent()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rest of the cart component */}
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to="/" className="flex items-center text-rose-600 hover:text-rose-700 transition-colors duration-300 mr-4">
            <FaArrowLeft className="mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-serif font-bold text-gray-800">Your Shopping Bag</h1>
          {cart.products?.length > 0 && (
            <span className="ml-auto bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-medium">
              {cart.quantity} {cart.quantity === 1 ? 'Item' : 'Items'}
            </span>
          )}
        </div>

        {cart.products?.length === 0 ? (
          // Empty Cart State
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingBag className="w-12 h-12 text-rose-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your bag is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any beautiful products to your bag yet. Start exploring our collection!
            </p>
            <Link 
              to="/products" 
              className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg inline-block"
            >
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1 bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-rose-100">
                <h3 className="text-xl font-semibold text-gray-800">Your Items</h3>
                <button 
                  onClick={handleClearCart}
                  className="flex items-center text-rose-500 hover:text-rose-700 transition-colors duration-300 text-sm"
                >
                  <FaTrashAlt className="mr-2" />
                  Clear Bag
                </button>
              </div>

              <div className="space-y-6">
                {cart.products?.map((product, index) => (
                  <div className="flex flex-col sm:flex-row items-start gap-6 pb-6 border-b border-rose-50 last:border-0" key={index}>
                    <img
                      src={product.img[0]}
                      alt={product.title}
                      className="w-full sm:w-28 h-28 object-cover rounded-xl shadow-sm"
                    />

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {product.title}
                        </h3>
                        <button 
                          onClick={() => handleRemoveProduct(product)}
                          className="p-2 text-gray-400 hover:text-rose-600 transition-colors duration-300"
                          aria-label="Remove item"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.desc}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-rose-50 rounded-full p-1">
                          <button 
                            onClick={() => handleQuantityChange(product, -1)}
                            className="w-8 h-8 flex items-center justify-center text-rose-600 hover:bg-rose-100 rounded-full transition-colors duration-300"
                          >
                            <FaMinus className="text-xs" />
                          </button>
                          <span className="mx-3 font-medium w-6 text-center">{product.quantity}</span>
                          <button 
                            onClick={() => handleQuantityChange(product, 1)}
                            className="w-8 h-8 flex items-center justify-center text-rose-600 hover:bg-rose-100 rounded-full transition-colors duration-300"
                          >
                            <FaPlus className="text-xs" />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-lg font-bold text-rose-700">KES {(product.price * product.quantity).toLocaleString()}</p>
                          {product.quantity > 1 && (
                            <p className="text-xs text-gray-500">KES {product.price.toLocaleString()} each</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-96">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-28">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b border-rose-100">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({cart.quantity} items)</span>
                    <span className="font-medium">KES {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {subtotal > 0 ? 'Select option' : 'KES 0'}
                    </span>
                  </div>
                  <div className="text-sm text-rose-600 bg-rose-50 p-3 rounded-lg">
                    <span className="font-medium">💡 Shipping Options:</span>
                    <ul className="mt-1 text-xs space-y-1">
                      <li>• Pickup from shop: <strong>FREE</strong></li>
                      <li>• Delivery within Nairobi: <strong>KES 200</strong></li>
                      <li>• Delivery outside Nairobi: <strong>KES 350</strong></li>
                    </ul>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-rose-100">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-semibold text-rose-700">
                      {subtotal > 0 ? 'Select shipping' : 'KES 0'}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={handleProceedToCheckout}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg mb-4 flex items-center justify-center"
                >
                  <FaBox className="mr-2" />
                  Proceed to Checkout
                </button>
                
                {!user.currentUser && (
                  <p className="text-sm text-center text-gray-500 mt-4">
                    <Link to="/login" className="text-rose-600 hover:underline font-medium">Sign in</Link> to place your order
                  </p>
                )}

                <div className="mt-6 pt-6 border-t border-rose-100">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">We Accept</h3>
                  <div className="flex space-x-3">
                    <div className="bg-gray-100 p-2 rounded-lg flex items-center justify-center w-14 h-9">
                      <span className="text-xs font-semibold text-gray-600">VISA</span>
                    </div>
                    <div className="bg-gray-100 p-2 rounded-lg flex items-center justify-center w-14 h-9">
                      <span className="text-xs font-semibold text-gray-600">MC</span>
                    </div>
                    <div className="bg-gray-100 p-2 rounded-lg flex items-center justify-center w-14 h-9">
                      <span className="text-xs font-semibold text-gray-600">AMEX</span>
                    </div>
                    <div className="bg-gray-100 p-2 rounded-lg flex items-center justify-center w-14 h-9">
                      <span className="text-xs font-semibold text-gray-600">PP</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-blue-50 rounded-2xl p-4 mt-4">
                <p className="text-sm text-blue-700 flex items-start">
                  <FaInfoCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Free pickup</strong> available at our Nairobi CBD shop (near Manchester Coach Bus Station). 
                    Delivery options available for Nairobi (KES 200) and outside Nairobi (KES 350).
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;