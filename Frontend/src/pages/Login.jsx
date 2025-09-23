import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"
import { useState, useEffect } from "react";
import { login } from "../redux/apiCalls";
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaArrowLeft, FaHeart, FaStar, FaGem } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    if (user.currentUser) {
      navigate("/");
    }
  }, [user.currentUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    try {
      setLoading(true);
      // Attempt to login - this will throw an error if credentials are invalid
      await login(dispatch, { email, password });
      
      // If login is successful, the Redux state should update with currentUser
      // Give it a moment to update, then check if login was truly successful
      setTimeout(() => {
        if (user.currentUser) {
          // Start smooth transition only if we have a currentUser
          setIsTransitioning(true);
          toast.success(
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <FaStar className="text-rose-500 mr-2" />
                <span className="font-serif font-bold">Welcome to Dubois Beauty!</span>
              </div>
              <p className="text-sm">Your beauty journey continues...</p>
            </div>
          );
          
          // Wait for transition animation to complete before navigating
          setTimeout(() => {
            navigate("/");
          }, 800);
        } else {
          // If no user is set after login attempt, show invalid credentials
          toast.error(
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <FaHeart className="text-rose-400 mr-2" />
                <span className="font-medium">Oops! Let's try that again</span>
              </div>
              <p className="text-sm">The email or password doesn't match our DB records.</p>
              <p className="text-xs mt-1 italic">✨ Tip: Please check your credentials and try again</p>
            </div>,
            {
              autoClose: 6000,
              closeOnClick: true,
            }
          );
        }
      }, 1000); // Wait 1 second for Redux state to update
      
    } catch (error) {
      // If login API call throws an error, show invalid credentials
      toast.error(
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <FaHeart className="text-rose-400 mr-2" />
            <span className="font-medium">Oops! Let's try that again</span>
          </div>
          <p className="text-sm">The email or password doesn't match our DB records.</p>
          <p className="text-xs mt-1 italic">✨ Tip: Please check your credentials and try again</p>
        </div>,
        {
          autoClose: 6000,
          closeOnClick: true,
        }
      );
    } finally {
      setLoading(false);
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const handleSocialLogin = (provider) => {
    toast.info(
      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          <FaGem className="text-rose-400 mr-2" />
          <span className="font-medium">{provider} Login Coming Soon!</span>
        </div>
        <p className="text-sm mt-1">For now, please use your DB credentials to access your beauty account.</p>
      </div>,
      {
        autoClose: 5000,
        closeOnClick: true,
      }
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center transition-all duration-700 ease-in-out ${isTransitioning ? 'opacity-0 transform scale-105' : 'opacity-100'}`}>
      <div className="max-w-5xl w-full">
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

        {/* Back Button */}
        <Link 
          to="/" 
          className="flex items-center text-rose-600 hover:text-rose-700 mb-6 transition-colors duration-300"
        >
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row transition-all duration-500 ease-in-out">
          {/* Image Section - Hidden on mobile, visible on desktop */}
          <div className="hidden md:block md:w-1/2 relative transition-all duration-500 ease-in-out">
            <div className="h-full w-full">
              <img
                src="/lotion1.jpg"
                alt="Login to Dubois Beauty"
                className="object-cover h-full w-full transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                <div className="p-8 text-white">
                  <h2 className="text-2xl font-serif font-bold mb-2">Welcome Back to DB</h2>
                  <p className="text-rose-100">Your beauty sanctuary awaits</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full md:w-1/2 p-8 md:p-12 transition-all duration-500 ease-in-out">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-r from-rose-600 to-pink-500 h-12 w-12 rounded-full flex items-center justify-center mr-3 shadow-lg">
                  <span className="text-white font-bold text-xl">DB</span>
                </div>
                <span className="text-2xl font-serif font-bold bg-gradient-to-r from-rose-700 to-pink-600 bg-clip-text text-transparent">Dubois Beauty</span>
              </div>
              <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">Sign In to DB</h1>
              <p className="text-gray-600">Access your personalized beauty experience</p>
            </div>

            <form className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-colors duration-300"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-colors duration-300"
                    placeholder="Enter your DB password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-400 hover:text-rose-600 transition-colors duration-300" />
                    ) : (
                      <FaEye className="text-gray-400 hover:text-rose-600 transition-colors duration-300" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me on this device
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-rose-600 hover:text-rose-500 transition-colors duration-300">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                onClick={handleLogin}
                disabled={loading || isTransitioning}
                className="w-full bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-700 hover:to-pink-600 text-white py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isTransitioning ? "Welcome to DB! 🎉" : "Accessing DB..."}
                  </>
                ) : (
                  "Access My DB Account"
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                New to Dubois Beauty?{" "}
                <Link to="/create-account" className="font-medium text-rose-600 hover:text-rose-500 transition-colors duration-300">
                  Create your DB account
                </Link>
              </p>
            </div>

            {/* Social Login Options */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Future DB access options</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin("Google")}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-200 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-300 cursor-pointer"
                >
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  </svg>
                  <span className="ml-2">Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin("Facebook")}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-200 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-300 cursor-pointer"
                >
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="ml-2">Facebook</span>
                </button>
              </div>

              {/* Informational message about social login */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 italic">
                  💫 DB Tip: Use your email and password for instant access to your beauty account
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;