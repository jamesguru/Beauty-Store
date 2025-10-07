import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaShieldAlt } from 'react-icons/fa';
import { loginAPI } from "../apiCalls";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      navigate("/home");
    }
  }, [navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // Email validation
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Call login API directly
      const userData = await loginAPI({ email, password });
      
      // Login successful
      handleLoginSuccess(userData);
      
    } catch (error) {
      // Login failed
      handleLoginFailure(error);
    }
  };

  const handleLoginSuccess = (userData) => {
    // Save user to localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    
    // Save tokens if they exist
    if (userData.access_token) {
      localStorage.setItem("access_token", userData.access_token);
    }
    if (userData.refresh_token) {
      localStorage.setItem("refresh_token", userData.refresh_token);
    }
    
    setIsTransitioning(true);
    
    // Navigate after a brief delay for smooth transition
    setTimeout(() => {
      navigate("/home");
    }, 700);
  };

  const handleLoginFailure = (error) => {
    let errorMessage = "Invalid email or password";
    
    // Handle different error types
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 401) {
        errorMessage = "Invalid email or password";
      } else if (status === 400) {
        errorMessage = data.message || "Invalid request data";
      } else if (status === 404) {
        errorMessage = "User not found";
      } else if (status >= 500) {
        errorMessage = "Server error. Please try again later.";
      }
    } else if (error.request) {
      errorMessage = "Network error. Please check your connection.";
    }
    
    setError(errorMessage);
    setLoading(false);
    
    // Clear error after 5 seconds
    setTimeout(() => {
      setError("");
    }, 5000);
  };

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 transition-all duration-700 ease-in-out ${isTransitioning ? 'opacity-0 transform scale-105' : 'opacity-100'}`}>
      <div className="max-w-md w-full">
        {/* Login Card */}
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden transition-all duration-500 ease-in-out hover:shadow-3xl">
          
          {/* Header Section */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-center border-b border-slate-700/50">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 h-16 w-16 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <FaShieldAlt className="text-white text-2xl" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h1>
                <p className="text-slate-300 text-sm mt-1">Secure Management System</p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm backdrop-blur-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-slate-300 text-sm font-semibold uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300" />
                  </div>
                  <input
                    type="email"
                    className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-slate-400 transition-all duration-300 backdrop-blur-sm group-hover:border-slate-500"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-slate-300 text-sm font-semibold uppercase tracking-wider">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-12 pr-12 py-4 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-slate-400 transition-all duration-300 backdrop-blur-sm group-hover:border-slate-500"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors duration-300 hover:text-blue-400"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-slate-400" />
                    ) : (
                      <FaEye className="text-slate-400" />
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
                    className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-slate-600 bg-slate-700/50 rounded transition duration-300"
                  />
                  <label htmlFor="remember-me" className="ml-3 block text-sm text-slate-300">
                    Keep me signed in
                  </label>
                </div>

                <div className="text-sm">
                  <button type="button" className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-300">
                    Forgot password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || isTransitioning}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-blue-500/25 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 border border-blue-500/20"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isTransitioning ? "Access Granted" : "Signing In..."}
                  </>
                ) : (
                  <span className="flex items-center">
                    <FaShieldAlt className="mr-2" />
                    Access Dashboard
                  </span>
                )}
              </button>
            </form>

            {/* Security Notice */}
            <div className="mt-8 p-4 bg-slate-700/30 rounded-xl border border-slate-600/50">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200 mb-1">Secure Access</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    This portal is protected by advanced security measures. All activities are monitored and logged for security purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            &copy; 2024 Management System • v2.4.1
          </p>
          <p className="text-slate-600 text-xs mt-1">
            Authorized Access Only
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;