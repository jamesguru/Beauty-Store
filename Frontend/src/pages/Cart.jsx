import { FaMinus, FaPlus, FaTrashAlt, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';
import { useDispatch, useSelector } from "react-redux";
import { clearCart, removeProduct, updateQuantity } from '../redux/cartRedux';
import { userRequest } from "../requestMethods";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

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

  const handleCheckout = async () => {
    if (user.currentUser) {
      try {
        const res = await userRequest.post("/stripe/create-checkout-session", {
          cart,
          userId: user.currentUser._id,
          email: user.currentUser.email,
          name: user.currentUser.name,
        });
        if (res.data.url) {
          window.location.href = res.data.url;
        }
      } catch (error) {
        console.log(error.message);
        toast.error('Checkout failed. Please try again.');
      }
    } else {
      toast.error("Please login to proceed to checkout.");
    }
  };

  // Calculate totals
  const subtotal = cart.total || 0;
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      {/* Added pt-24 to push content below the fixed navbar */}
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

        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to="/products" className="flex items-center text-rose-600 hover:text-rose-700 transition-colors duration-300 mr-4">
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
                      src={product.img}
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
                          <p className="text-lg font-bold text-rose-700">${(product.price * product.quantity).toFixed(2)}</p>
                          {product.quantity > 1 && (
                            <p className="text-xs text-gray-500">${product.price} each</p>
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
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-28"> {/* Changed top value to account for navbar */}
                <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b border-rose-100">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({cart.quantity} items)</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">${shipping.toFixed(2)}</span>
                  </div>
                  {subtotal > 0 && subtotal < 50 && (
                    <div className="text-sm text-rose-600 bg-rose-50 p-3 rounded-lg mt-2">
                      <span className="font-medium">You're ${(50 - subtotal).toFixed(2)} away from free shipping!</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-4 border-t border-rose-100">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-semibold text-rose-700">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg mb-4 flex items-center justify-center"
                >
                  Proceed to Checkout
                </button>
                
                {!user.currentUser && (
                  <p className="text-sm text-center text-gray-500 mt-4">
                    <Link to="/login" className="text-rose-600 hover:underline font-medium">Sign in</Link> to checkout
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

              {/* Security Note */}
              <div className="bg-rose-50 rounded-2xl p-4 mt-4 text-center">
                <p className="text-xs text-rose-700 flex items-center justify-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Secure checkout. Your information is protected.
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