import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaGift, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaBoxOpen,
  FaUsers,
  FaDollarSign,
  FaStar
} from 'react-icons/fa';
import { userRequest } from '../requestMethods';

const Bundles = () => {
  const [bundles, setBundles] = useState([]);
  const [filteredBundles, setFilteredBundles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBundles: 0,
    prebuiltBundles: 0,
    customBundles: 0,
    totalRevenue: 0
  });

  // Fetch bundles from database
  useEffect(() => {
    const getBundles = async () => {
      setIsLoading(true);
      try {
        const res = await userRequest.get("/bundles");
        const bundlesData = res.data;
        setBundles(bundlesData);
        setFilteredBundles(bundlesData);
        
        // Calculate stats
        const totalBundles = bundlesData.length;
        const prebuiltBundles = bundlesData.filter(bundle => bundle.isPrebuilt).length;
        const customBundles = bundlesData.filter(bundle => !bundle.isPrebuilt).length;
        
        // Calculate total revenue (you might want to get this from orders instead)
        const totalRevenue = bundlesData.reduce((total, bundle) => {
          return total + (bundle.discountedPrice * (bundle.sales || 0));
        }, 0);

        setStats({
          totalBundles,
          prebuiltBundles,
          customBundles,
          totalRevenue
        });
      } catch (error) {
        console.log("Error fetching bundles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getBundles();
  }, []);

  useEffect(() => {
    let filtered = bundles;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(bundle =>
        bundle.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bundle.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(bundle => 
        activeTab === 'prebuilt' ? bundle.isPrebuilt : !bundle.isPrebuilt
      );
    }
    
    setFilteredBundles(filtered);
  }, [searchTerm, activeTab, bundles]);

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'BEST VALUE': return 'bg-green-500';
      case 'POPULAR': return 'bg-blue-500';
      case 'PREMIUM': return 'bg-purple-500';
      case 'NEW': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const getBundleType = (bundle) => {
    return bundle.isPrebuilt ? 'prebuilt' : 'custom';
  };

  const calculateSavings = (bundle) => {
    return bundle.originalPrice - bundle.discountedPrice;
  };

  const handleDeleteBundle = async (bundleId) => {
    if (window.confirm('Are you sure you want to delete this bundle?')) {
      try {
        await userRequest.delete(`/bundles/${bundleId}`);
        // Remove bundle from state
        setBundles(prev => prev.filter(bundle => bundle._id !== bundleId));
        // Show success message or notification
        alert('Bundle deleted successfully');
      } catch (error) {
        console.error('Error deleting bundle:', error);
        alert('Failed to delete bundle');
      }
    }
  };

  const formatPrice = (price) => {
    return `KES ${price}`;
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="h-48 bg-gray-300 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Beauty Bundles</h1>
            <p className="text-gray-600">Manage and create beautiful product packages</p>
          </div>
          <Link
            to="/bundles/create"
            className="mt-4 lg:mt-0 bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold"
          >
            <FaPlus className="text-sm" />
            <span>Create New Bundle</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-pink-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Bundles</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBundles}</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                <FaGift className="text-pink-600 text-xl" />
              </div>
            </div>
            <p className="text-green-600 text-sm mt-2">Active bundles</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Prebuilt Bundles</p>
                <p className="text-2xl font-bold text-gray-900">{stats.prebuiltBundles}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FaBoxOpen className="text-blue-600 text-xl" />
              </div>
            </div>
            <p className="text-green-600 text-sm mt-2">Curated packages</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Custom Bundles</p>
                <p className="text-2xl font-bold text-gray-900">{stats.customBundles}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FaUsers className="text-green-600 text-xl" />
              </div>
            </div>
            <p className="text-green-600 text-sm mt-2">User created</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">KES {stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FaDollarSign className="text-purple-600 text-xl" />
              </div>
            </div>
            <p className="text-green-600 text-sm mt-2">From bundle sales</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === 'all' 
                    ? 'bg-pink-500 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Bundles ({bundles.length})
              </button>
              <button
                onClick={() => setActiveTab('prebuilt')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === 'prebuilt' 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Prebuilt ({stats.prebuiltBundles})
              </button>
              <button
                onClick={() => setActiveTab('custom')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === 'custom' 
                    ? 'bg-green-500 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Custom ({stats.customBundles})
              </button>
            </div>

            <div className="relative lg:w-64">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search bundles by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Bundles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBundles.map((bundle) => (
            <div key={bundle._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
              <div className="relative">
                <img 
                  src={bundle.image} 
                  alt={bundle.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {bundle.badge && (
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white ${getBadgeColor(bundle.badge)}`}>
                    {bundle.badge}
                  </div>
                )}
                <div className={`absolute top-3 left-3 px-2 py-1 rounded text-xs text-white ${
                  getBundleType(bundle) === 'prebuilt' ? 'bg-blue-500' : 'bg-green-500'
                }`}>
                  {getBundleType(bundle) === 'prebuilt' ? 'Prebuilt' : 'Custom'}
                </div>
                {calculateSavings(bundle) > 0 && (
                  <div className="absolute bottom-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                    Save KES {calculateSavings(bundle)}
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{bundle.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{bundle.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-pink-600">{formatPrice(bundle.discountedPrice)}</span>
                    {bundle.originalPrice > bundle.discountedPrice && (
                      <span className="text-gray-500 line-through text-sm">{formatPrice(bundle.originalPrice)}</span>
                    )}
                  </div>
                  {bundle.rating && (
                    <div className="flex items-center space-x-1 text-amber-500">
                      <FaStar className="text-sm" />
                      <span className="text-sm font-medium">{bundle.rating}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <FaBoxOpen className="text-xs" />
                    <span>{bundle.products?.length || 0} products</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaUsers className="text-xs" />
                    <span>{bundle.sales || 0} sales</span>
                  </div>
                </div>

                {/* Auto-generated tags */}
                {(bundle.categories?.length > 0 || bundle.concern?.length > 0) && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {bundle.categories?.slice(0, 2).map(category => (
                        <span key={category} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {category}
                        </span>
                      ))}
                      {bundle.concern?.slice(0, 2).map(concern => (
                        <span key={concern} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          {concern}
                        </span>
                      ))}
                      {(bundle.categories?.length > 2 || bundle.concern?.length > 2) && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                          +{(bundle.categories?.length - 2 || 0) + (bundle.concern?.length - 2 || 0)} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Link 
                    to={`/bundles/edit/${bundle._id}`}
                    className="flex-1 bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center space-x-1"
                  >
                    <FaEdit className="text-xs" />
                    <span>Edit</span>
                  </Link>
                  <button 
                    onClick={() => handleDeleteBundle(bundle._id)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                  >
                    <FaTrash className="text-xs" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBundles.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaGift className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {bundles.length === 0 ? 'No bundles created yet' : 'No bundles found'}
              </h3>
              <p className="text-gray-600 mb-4">
                {bundles.length === 0 
                  ? 'Get started by creating your first beauty bundle' 
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              <Link
                to="/bundles/create"
                className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors inline-flex items-center space-x-2"
              >
                <FaPlus className="text-sm" />
                <span>Create Bundle</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bundles;