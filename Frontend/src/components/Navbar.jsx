import { FaSearch, FaUser, FaHeart, FaTimes } from 'react-icons/fa';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { useSelector } from "react-redux";
import Badge from '@mui/material/Badge';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const wishlist = useSelector((state) => state.wishlist);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  // Function to handle category navigation
  const handleCategoryClick = (category) => {
    // Navigate to products page with category filter
    window.location.href = `/products/${category.toLowerCase()}`;
  };

  return (
    <>
      {/* This prevents horizontal scrolling by ensuring content doesn't overflow */}
      <style jsx>{`
        html, body {
          overflow-x: hidden;
          max-width: 100%;
        }
      `}</style>
      
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-2 bg-white shadow-md' : 'py-4 bg-gradient-to-b from-rose-50 to-white'} w-full overflow-hidden`}>
        <div className="container mx-auto px-4 flex items-center justify-between w-full">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 z-10">
            <div className="cursor-pointer transition-transform duration-300 hover:scale-105 flex items-center">
              <img 
                src="https://res.cloudinary.com/dap91fhxh/image/upload/v1759863437/Screenshot_from_2025-10-07_21-56-04_sspduo.png" 
                alt="Dubois Beauty" 
                className="h-12 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-8 mx-6">
            <Link 
              to="/products/skincare" 
              className="text-gray-700 hover:text-rose-600 transition-colors duration-300 font-medium"
            >
              Skincare
            </Link>
            <Link 
              to="/products/makeup" 
              className="text-gray-700 hover:text-rose-600 transition-colors duration-300 font-medium"
            >
              Makeup
            </Link>
            <Link 
              to="/products/body" 
              className="text-gray-700 hover:text-rose-600 transition-colors duration-300 font-medium"
            >
              Body
            </Link>
            <Link 
              to="/products/fragrance" 
              className="text-gray-700 hover:text-rose-600 transition-colors duration-300 font-medium"
            >
              Fragrance
            </Link>
            <Link to="/new" className="text-rose-600 font-medium flex items-center">
              New
              <span className="ml-1 bg-rose-100 text-rose-600 text-xs px-2 py-1 rounded-full">+</span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <form 
              onSubmit={handleSearchSubmit}
              className="relative w-full"
            >
              <input 
                type="text" 
                placeholder="Find your perfect product..." 
                className="w-full py-3 px-5 pr-12 rounded-full border border-rose-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all duration-300 shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Link to={`/products?search=${encodeURIComponent(search)}`}>
                <button 
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rose-500 hover:text-rose-700 transition-colors duration-300"
                >
                  <FaSearch className="text-xl" />
                </button>
              </Link>
            </form>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-5 md:space-x-6">
            {/* Search Icon - Mobile */}
            <div className="md:hidden">
              <button 
                onClick={handleSearchToggle}
                className="p-2 text-gray-600 hover:text-rose-500 transition-colors duration-300"
                aria-label="Search"
              >
                {isSearchExpanded ? <FaTimes className="text-xl" /> : <FaSearch className="text-xl" />}
              </button>
            </div>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative group hidden sm:block">
              <div className="p-2 rounded-full group-hover:bg-rose-50 transition-colors duration-300">
                <Badge 
                  badgeContent={wishlist?.quantity || 0} 
                  color="error"
                  overlap="circular"
                >
                  <FaHeart className="text-rose-400 group-hover:text-rose-600 transition-colors duration-300" />
                </Badge>
              </div>
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs text-rose-600 font-medium">
                Wishlist
              </span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative group">
              <div className="p-2 rounded-full group-hover:bg-rose-50 transition-colors duration-300">
                <Badge 
                  badgeContent={cart.quantity} 
                  color="error"
                  overlap="circular"
                >
                  <ShoppingBasketIcon 
                    className="text-rose-500 group-hover:text-rose-700 transition-colors duration-300" 
                    fontSize="medium"
                  />
                </Badge>
              </div>
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs text-rose-600 font-medium">
                Cart
              </span>
            </Link>

            {/* User Account */}
            <Link to={user.currentUser ? "/myaccount" : "/login"} className="relative group">
              <div className="flex items-center space-x-1 p-2 rounded-full group-hover:bg-rose-50 transition-colors duration-300">
                <div className="bg-rose-100 p-2 rounded-full">
                  <FaUser className="text-rose-600 group-hover:text-rose-700 transition-colors duration-300" />
                </div>
                {user.currentUser && (
                  <span className="hidden md:inline text-sm font-medium text-gray-700 group-hover:text-rose-700 transition-colors duration-300">
                    {user.currentUser.name}
                  </span>
                )}
              </div>
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs text-rose-600 font-medium">
                {user.currentUser ? "Account" : "Login"}
              </span>
            </Link>
          </div>
        </div>

        {/* Expanded Search for Mobile */}
        {isSearchExpanded && (
          <div className="md:hidden bg-white py-3 px-4 shadow-inner animate-slideDown w-full">
            <form 
              onSubmit={handleSearchSubmit}
              className="relative w-full"
            >
              <input 
                type="text" 
                placeholder="Find your perfect product..." 
                className="w-full py-3 px-5 pr-12 rounded-full border border-rose-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all duration-300"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
              <Link to={`/products?search=${encodeURIComponent(search)}`}>
                <button 
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rose-500 hover:text-rose-700 transition-colors duration-300"
                >
                  <FaSearch className="text-xl" />
                </button>
              </Link>
            </form>
          </div>
        )}

        {/* Mobile Category Navigation */}
        <div className="lg:hidden bg-white border-t border-rose-100 py-2 px-4 w-full overflow-x-auto">
          <div className="flex space-x-6 justify-center min-w-max">
            <Link 
              to="/products/skincare" 
              className="text-sm text-gray-700 hover:text-rose-600 transition-colors duration-300 font-medium whitespace-nowrap"
            >
              Skincare
            </Link>
            <Link 
              to="/products/makeup" 
              className="text-sm text-gray-700 hover:text-rose-600 transition-colors duration-300 font-medium whitespace-nowrap"
            >
              Makeup
            </Link>
            <Link 
              to="/products/body" 
              className="text-sm text-gray-700 hover:text-rose-600 transition-colors duration-300 font-medium whitespace-nowrap"
            >
              Body
            </Link>
            <Link 
              to="/products/fragrance" 
              className="text-sm text-gray-700 hover:text-rose-600 transition-colors duration-300 font-medium whitespace-nowrap"
            >
              Fragrance
            </Link>
            <Link to="/new" className="text-sm text-rose-600 font-medium whitespace-nowrap">New</Link>
          </div>
        </div>
      </nav>
      
      {/* Add padding to the top of your page content to account for fixed navbar */}
      <div className="pt-24"></div>
    </>
  );
};

export default Navbar;