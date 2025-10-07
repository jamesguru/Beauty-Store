import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-rose-50 to-white pt-16 pb-8 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <img 
                src="https://res.cloudinary.com/dap91fhxh/image/upload/v1759863437/Screenshot_from_2025-10-07_21-56-04_sspduo.png" 
                alt="Dubois Beauty" 
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Discover the essence of French beauty with our carefully crafted natural products. 
              Let your skin flourish and embrace your natural radiance with Dubois Beauty.
            </p>
            <div className="flex space-x-3">
              {/* Twitter */}
              <a 
                href="#" 
                className="bg-white p-2 rounded-full shadow-sm text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 transform hover:scale-110 border border-rose-200"
                aria-label="Follow us on Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.23 5.924c-.813.36-1.684.603-2.598.711a4.517 4.517 0 001.984-2.486c-.867.514-1.826.888-2.847 1.09a4.503 4.503 0 00-7.673 4.106 12.78 12.78 0 01-9.292-4.71 4.501 4.501 0 001.392 6.008 4.482 4.482 0 01-2.044-.563v.057a4.504 4.504 0 003.605 4.416 4.515 4.515 0 01-2.036.077 4.506 4.506 0 004.205 3.127 9.034 9.034 0 01-5.602 1.932c-.363 0-.722-.021-1.079-.064a12.765 12.765 0 006.917 2.027c8.304 0 12.847-6.878 12.847-12.847 0-.195-.004-.39-.014-.583a9.183 9.183 0 002.252-2.343c-.825.367-1.71.614-2.63.723a4.518 4.518 0 001.979-2.495z" />
                </svg>
              </a>
              
              {/* Facebook */}
              <a 
                href="#" 
                className="bg-white p-2 rounded-full shadow-sm text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 transform hover:scale-110 border border-rose-200"
                aria-label="Follow us on Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21.5 0h-19A2.5 2.5 0 000 2.5v19A2.5 2.5 0 002.5 24h10.156v-8.797H9.548v-3.23h3.108V9.03c0-3.067 1.872-4.736 4.605-4.736 1.31 0 2.435.097 2.76.14v3.202l-1.897.001c-1.49 0-1.779.708-1.779 1.747v2.289h3.557l-.464 3.23h-3.093V24H21.5a2.5 2.5 0 002.5-2.5v-19A2.5 2.5 0 0021.5 0z" />
                </svg>
              </a>
              
              {/* Instagram */}
              <a 
                href="#" 
                className="bg-white p-2 rounded-full shadow-sm text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 transform hover:scale-110 border border-rose-200"
                aria-label="Follow us on Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>

              {/* Pinterest */}
              <a 
                href="#" 
                className="bg-white p-2 rounded-full shadow-sm text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 transform hover:scale-110 border border-rose-200"
                aria-label="Follow us on Pinterest"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21.5c-5.238 0-9.5-4.262-9.5-9.5S6.762 2.5 12 2.5s9.5 4.262 9.5 9.5-4.262 9.5-9.5 9.5zm3.5-13.5c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5zm-7 0c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5zm3.5 0c-2.485 0-4.5 2.015-4.5 4.5 0 1.306.559 2.479 1.447 3.295.088.081.2.125.317.125.146 0 .288-.063.385-.174.122-.140.15-.333.073-.5-.197-.417-.302-.882-.302-1.371 0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5c-.276 0-.5.224-.5.5s.224.5.5.5c2.485 0 4.5-2.015 4.5-4.5s-2.015-4.5-4.5-4.5z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links - Matching Navbar Categories */}
          <div>
            <h3 className="text-lg font-semibold text-rose-800 mb-6 relative inline-block">
              Shop
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-rose-300 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Skincare', path: '/products/skincare' },
                { name: 'Makeup', path: '/products/makeup' },
                { name: 'Body Care', path: '/products/body' },
                { name: 'Fragrance', path: '/products/fragrance' },
                { name: 'New Arrivals', path: '/new' },
                { name: 'All Products', path: '/products' }
              ].map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.path} 
                    className="text-gray-700 hover:text-rose-600 transition-all duration-300 flex items-center group font-medium"
                  >
                    <svg className="w-3 h-3 mr-2 text-rose-400 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-rose-800 mb-6 relative inline-block">
              Support
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-rose-300 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Contact Us', path: '/contact' },
                { name: 'FAQs', path: '/faqs' },
                { name: 'Shipping Info', path: '/shipping' },
                { name: 'Returns', path: '/returns' },
                { name: 'Track Order', path: '/track-order' },
                { name: 'Size Guide', path: '/size-guide' }
              ].map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.path} 
                    className="text-gray-700 hover:text-rose-600 transition-all duration-300 flex items-center group font-medium"
                  >
                    <svg className="w-3 h-3 mr-2 text-rose-400 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-rose-800 mb-6 relative inline-block">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-rose-300 rounded-full"></span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-start group">
                <svg className="w-5 h-5 text-rose-600 mr-3 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-gray-700 group-hover:text-rose-600 transition-colors duration-300 text-sm">
                  123 Rue de Beauté<br />
                  75001 Paris, France
                </p>
              </div>
              
              <div className="flex items-center group">
                <svg className="w-5 h-5 text-rose-600 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <p className="text-gray-700 group-hover:text-rose-600 transition-colors duration-300 text-sm">
                  +33 1 23 45 67 89
                </p>
              </div>
              
              <div className="flex items-center group">
                <svg className="w-5 h-5 text-rose-600 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-700 group-hover:text-rose-600 transition-colors duration-300 text-sm">
                  info@duboisbeauty.com
                </p>
              </div>
            </div>

            {/* Newsletter Signup - Matching Navbar Search Style */}
            <div className="mt-8">
              <h4 className="text-sm font-semibold text-rose-800 mb-3">
                Get Beauty Updates
              </h4>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full py-3 px-5 pr-12 rounded-full border border-rose-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all duration-300 shadow-sm text-sm"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rose-500 hover:text-rose-700 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-rose-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              &copy; 2025 Dubois Beauty. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center space-x-6">
              {[
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Terms of Service', path: '/terms' },
                { name: 'Shipping Policy', path: '/shipping' },
                { name: 'Returns', path: '/returns' }
              ].map((item) => (
                <a 
                  key={item.name} 
                  href={item.path}
                  className="text-gray-600 hover:text-rose-600 text-sm transition-colors duration-300 mb-2 md:mb-0 font-medium"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;