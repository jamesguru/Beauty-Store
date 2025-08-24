import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userRequest } from "../requestMethods"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaArrowLeft } from 'react-icons/fa';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (!agreeToTerms) {
      toast.error("Please agree to the Terms and Conditions");
      return;
    }

    try {
      setLoading(true);
      await userRequest.post("/auth/register", { name, email, password });
      toast.success("Account created successfully! Please login.");
      navigate("/login")
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
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

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/2 relative">
            <div className="h-full w-full">
              <img
                src="/lotion1.jpg"
                alt="Join Bliss Cosmetics"
                className="object-cover h-full w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                <div className="p-8 text-white">
                  <h2 className="text-2xl font-serif font-bold mb-2">Join Our Community</h2>
                  <p className="text-rose-100">Create an account to unlock exclusive benefits and personalized recommendations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="md:w-1/2 p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-rose-600 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-xl">B</span>
                </div>
                <span className="text-2xl font-serif font-bold text-rose-700">Bliss</span>
              </div>
              <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">Create Account</h1>
              <p className="text-gray-600">Start your beauty journey with us</p>
            </div>

            <form className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-colors duration-300"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

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
                    placeholder="Create a password"
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
                <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-colors duration-300"
                    placeholder="Confirm your password"
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
                disabled={loading}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-rose-600 hover:text-rose-500 transition-colors duration-300">
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Benefits Section */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 text-center">Benefits of joining</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-xs text-gray-600">Exclusive offers</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-xs text-gray-600">Fast checkout</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-xs text-gray-600">Order history</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
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