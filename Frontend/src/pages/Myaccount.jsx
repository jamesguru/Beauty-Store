import { useDispatch, useSelector } from "react-redux";
import { logOut } from '../redux/userRedux';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaSignOutAlt, FaSave } from 'react-icons/fa';

const Myaccount = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logOut());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">My Account</h1>
          <p className="text-gray-600">Manage your personal information and account settings</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Account Information Section */}
          <div className="p-8 border-b border-rose-100">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mr-4">
                <FaUser className="text-rose-600 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold text-gray-800">{user.currentUser?.name}</h2>
                <p className="text-gray-600">{user.currentUser?.email}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Account Settings Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaUser className="text-rose-600 mr-2" />
                Personal Information
              </h3>
              <form className="space-y-5">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      value={user.currentUser?.name} 
                      className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-colors duration-300"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input 
                      type="email" 
                      value={user.currentUser?.email} 
                      className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-colors duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      value="+1 (555) 123-4567" 
                      className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-colors duration-300"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      value="DownTown 123, Sydney" 
                      className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-colors duration-300"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center"
                >
                  <FaSave className="mr-2" />
                  Save Changes
                </button>
              </form>
            </div>

            {/* Password Management Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaLock className="text-rose-600 mr-2" />
                Password & Security
              </h3>
              <form className="space-y-5">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Current Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input 
                      type="password" 
                      className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-colors duration-300"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input 
                      type="password" 
                      className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-colors duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Confirm New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input 
                      type="password" 
                      className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-colors duration-300"
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-rose-100 hover:bg-rose-200 text-rose-700 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
                >
                  Update Password
                </button>
                
                <button 
                  type="button" 
                  onClick={handleLogout}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center mt-4"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Additional Account Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Order History</h3>
            <p className="text-gray-600 text-sm">View your past orders and purchases</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Wishlist</h3>
            <p className="text-gray-600 text-sm">See your saved favorite products</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Preferences</h3>
            <p className="text-gray-600 text-sm">Customize your shopping experience</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Myaccount;