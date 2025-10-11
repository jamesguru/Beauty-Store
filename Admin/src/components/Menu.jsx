import {
  FaBox,
  FaChartBar,
  FaClipboard,
  FaClipboardList,
  FaCog,
  FaElementor,
  FaHdd,
  FaHome,
  FaSignOutAlt,
  FaUser,
  FaUsers,
  FaDollarSign,
  FaGift,
  FaPlus,
  FaBoxOpen,
  FaSearch,
  FaStethoscope
} from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: FaHome, label: 'Home', path: '/home', color: 'text-blue-500' },
    { icon: FaUsers, label: 'Users', path: '/users', color: 'text-purple-500' },
    { icon: FaBox, label: 'Products', path: '/products', color: 'text-orange-500' },
    { icon: FaGift, label: 'Bundles', path: '/bundles', color: 'text-pink-500' },
    { icon: FaClipboardList, label: 'Orders', path: '/orders', color: 'text-red-500' },
    { icon: FaDollarSign, label: 'Payments', path: '/payments', color: 'text-teal-500' },
    { icon: FaElementor, label: 'Banners', path: '/banners', color: 'text-indigo-500' },
    { icon: FaStethoscope, label: 'Skin Assessments', path: '/clinic', color: 'text-green-500' },
    { icon: FaClipboard, label: 'Tracking users', path: '/tracking', color: 'text-cyan-500' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // Navigate to login page
    navigate('/');
  };

  return (
    <div className="h-[100vh] bg-gradient-to-b from-gray-900 to-gray-800 p-6 w-80 shadow-2xl border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="text-center mb-8 pt-4">
        <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
          <FaGift className="text-white text-2xl" />
        </div>
        <h1 className="text-2xl font-bold text-white">Dubois Beauty</h1>
        <p className="text-gray-400 text-sm">Admin Dashboard</p>
      </div>

      {/* Navigation Menu - Scrollable Area */}
      <div className="flex-1 overflow-y-auto">
        <nav className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link key={index} to={item.path}>
                <div className={`
                  flex items-center px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer mb-1
                  ${active 
                    ? 'bg-white/10 shadow-lg border-l-4 border-pink-500' 
                    : 'hover:bg-white/5 hover:border-l-4 hover:border-gray-600'
                  }
                `}>
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-all duration-300
                    ${active 
                      ? 'bg-pink-500 shadow-lg' 
                      : 'bg-gray-700 group-hover:bg-gray-600'
                    }
                  `}>
                    <Icon className={`
                      text-lg transition-all duration-300
                      ${active ? 'text-white' : item.color}
                    `} />
                  </div>
                  <div className="flex-1">
                    <p className={`
                      font-medium transition-all duration-300
                      ${active ? 'text-white' : 'text-gray-300 group-hover:text-white'}
                    `}>
                      {item.label}
                    </p>
                  </div>
                  {active && (
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Fixed Logout Section - Won't overlap */}
      <div className="mt-auto pt-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 hover:bg-red-500/10 group border border-transparent hover:border-red-500/30"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center mr-3 transition-transform duration-300 group-hover:scale-105">
            <FaSignOutAlt className="text-white text-lg" />
          </div>
          <div className="text-left flex-1">
            <p className="text-white font-medium group-hover:text-red-200 transition-colors duration-300">
              Logout
            </p>
            <p className="text-gray-400 text-xs group-hover:text-red-300 transition-colors duration-300">
              Secure sign out
            </p>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Menu;