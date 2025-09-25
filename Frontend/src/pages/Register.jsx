import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userRequest } from "../requestMethods"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaArrowLeft, FaPhone, FaStar, FaGem, FaHeart } from 'react-icons/fa';
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/userRedux";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get user's IP address and referrer
  const getUserData = async () => {
    try {
      // Get IP address
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      
      // Get referrer
      const referrer = document.referrer || 'Direct';
      
      return {
        ipAddress: ipData.ip,
        referrer: referrer
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return {
        ipAddress: 'Unknown',
        referrer: document.referrer || 'Direct'
      };
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  }

  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format as 254XXXXXXXXX
    if (cleaned.startsWith('0')) {
      return '254' + cleaned.slice(1);
    }
    
    if (cleaned.startsWith('+254')) {
      return cleaned.slice(1);
    }
    
    if (cleaned.startsWith('254')) {
      return cleaned;
    }
    
    if (cleaned.length <= 9) {
      return '254' + cleaned;
    }
    
    return cleaned;
  }

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    // Sweet validation messages
    if (!name || !email || !password || !confirmPassword) {
      toast.error(
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <FaHeart className="text-rose-400 mr-2" />
            <span className="font-medium">Almost there!</span>
          </div>
          <p className="text-sm">Please fill in all the required fields to continue your beauty journey.</p>
        </div>
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error(
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <FaHeart className="text-rose-400 mr-2" />
            <span className="font-medium">Oops! Passwords don't match</span>
          </div>
          <p className="text-sm">Please make sure both passwords are identical.</p>
        </div>
      );
      return;
    }

    if (password.length < 6) {
      toast.error(
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <FaHeart className="text-rose-400 mr-2" />
            <span className="font-medium">Stronger password needed</span>
          </div>
          <p className="text-sm">Your password should be at least 6 characters long for security.</p>
        </div>
      );
      return;
    }

    if (!agreeToTerms) {
      toast.error(
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <FaHeart className="text-rose-400 mr-2" />
            <span className="font-medium">One more step!</span>
          </div>
          <p className="text-sm">Please agree to our Terms and Conditions to continue.</p>
        </div>
      );
      return;
    }

    try {
      setLoading(true);
      
      // Get user data (IP and referrer)
      const userData = await getUserData();
      
      // Prepare registration data
      const registrationData = {
        name,
        email,
        password,
        phone: phone || undefined, // Optional field
        ipAddress: userData.ipAddress,
        referrer: userData.referrer,
        registrationSource: 'website'
      };

      const response = await userRequest.post("/auth/register", registrationData);
      
      // Sweet success message
      toast.success(
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <FaStar className="text-rose-500 mr-2" />
            <span className="font-serif font-bold">Welcome to Dubois Beauty!</span>
          </div>
          <p className="text-sm">Your beauty journey begins now! ✨</p>
        </div>
      );

      // Auto-login the user after successful registration
      if (response.data) {
        // Dispatch login success to Redux store
        dispatch(loginSuccess(response.data));
        
        // Store user data in localStorage for persistence
        localStorage.setItem('currentUser', JSON.stringify(response.data));
        if (response.data.accessToken) {
          localStorage.setItem('token', response.data.accessToken);
        }
        
        // Start smooth transition
        setIsTransitioning(true);
        
        // Sweet welcome message with delay
        setTimeout(() => {
          toast.success(
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <FaGem className="text-rose-500 mr-2" />
                <span className="font-medium">You're all set! 🎉</span>
              </div>
              <p className="text-sm">Taking you to your beauty dashboard in 3 seconds...</p>
            </div>
          );
        }, 500);
        
        // 3-second delay before navigation
        setTimeout(() => {
          // Navigate to home after 3 seconds
          navigate("/");
          // Optional: Refresh the page to ensure clean state
          window.location.reload();
        }, 3000);
      }
      
    } catch (error) {
      // Sweet error messages
      if (error.response && error.response.data.message) {
        toast.error(
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <FaHeart className="text-rose-400 mr-2" />
              <span className="font-medium">Let's try that again</span>
            </div>
            <p className="text-sm">{error.response.data.message}</p>
          </div>
        );
      } else {
        toast.error(
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <FaHeart className="text-rose-400 mr-2" />
              <span className="font-medium">Something went wrong</span>
            </div>
            <p className="text-sm">Please try again in a moment. Your beauty journey is worth it! 💫</p>
          </div>
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center transition-all duration-700 ease-in-out ${isTransitioning ? 'opacity-0 transform scale-105' : 'opacity-100'}`}>
      <div className="max-w-5xl w-full">
        <ToastContainer
          position="top-right"
          autoClose={4000}
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
                alt="Join Dubois Beauty"
                className="object-cover h-full w-full transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                <div className="p-8 text-white">
                  <h2 className="text-2xl font-serif font-bold mb-2">Begin Your Beauty Journey</h2>
                  <p className="text-rose-100">Join DB for a personalized beauty experience</p>
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
              <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">Create Your DB Account</h1>
              <p className="text-gray-600">Start your sweet beauty journey with us today! 🌸</p>
            </div>

            <form className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-colors duration-300"
                    placeholder="Your beautiful name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                  Email Address <span className="text-rose-500">*</span>
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
                <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-2">
                  Phone Number <span className="text-gray-400">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-colors duration-300"
                    placeholder="254727632051"
                    value={phone}
                    onChange={handlePhoneChange}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Example: 254727632051 (We'll format it for you!)</p>
              </div>

              <div>
                <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-colors duration-300"
                    placeholder="Create a secure password"
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
                <p className="text-xs text-gray-500 mt-1">✨ Must be at least 6 characters for your security</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-2">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-colors duration-300"
                    placeholder="Confirm your beautiful password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="text-gray-400 hover:text-rose-600 transition-colors duration-300" />
                    ) : (
                      <FaEye className="text-gray-400 hover:text-rose-600 transition-colors duration-300" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-700">
                    I agree to the{" "}
                    <Link to="/terms" className="text-rose-600 hover:text-rose-500 transition-colors duration-300">
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-rose-600 hover:text-rose-500 transition-colors duration-300">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                onClick={handleRegister}
                disabled={loading || isTransitioning}
                className="w-full bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-700 hover:to-pink-600 text-white py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isTransitioning ? "Welcome to DB!" : "Creating Your Beauty Account..."}
                  </>
                ) : (
                  "Begin My Beauty Journey"
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already part of our beauty family?{" "}
                <Link to="/login" className="font-medium text-rose-600 hover:text-rose-500 transition-colors duration-300">
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Sweet Benefits Section */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 text-center">🌸 Your DB Membership Benefits</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center mr-2">
                    <FaGem className="w-3 h-3 text-rose-600" />
                  </div>
                  <span className="text-xs text-gray-600">Exclusive offers</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center mr-2">
                    <FaStar className="w-3 h-3 text-rose-600" />
                  </div>
                  <span className="text-xs text-gray-600">Fast checkout</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center mr-2">
                    <FaHeart className="w-3 h-3 text-rose-600" />
                  </div>
                  <span className="text-xs text-gray-600">Order history</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center mr-2">
                    <FaEnvelope className="w-3 h-3 text-rose-600" />
                  </div>
                  <span className="text-xs text-gray-600">Wishlist</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register