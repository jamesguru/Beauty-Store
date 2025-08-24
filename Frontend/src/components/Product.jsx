import { showAverageRating } from "./Ratings";

const Product = ({ product }) => {
  return (
    <div className="group relative flex flex-col items-center justify-between bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 m-4 cursor-pointer border border-gray-100">
      {/* Product Image with Hover Effect */}
      <div className="relative h-80 w-full overflow-hidden">
        <img
          src={product.img}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

        {/* Quick View Button */}
        <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-rose-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </button>

        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{product.discount}%
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="w-full p-4 flex flex-col">
        {/* Product Title */}
        <h2 className="font-medium text-gray-800 text-lg mb-2 line-clamp-2 h-14 overflow-hidden">
          {product.title}
        </h2>

        {/* Rating */}
        {product.ratingsCount ? (
          <div className="flex items-center mb-3">
            {showAverageRating(product)}
            <span className="text-xs text-gray-500 ml-1">
              ({product.ratingsCount || ""})
            </span>
          </div>
        ) : (
          ""
        )}

        {/* Price */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center">
            <span className="text-rose-700 font-bold text-xl">
              Ksh{product.originalPrice}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-400 line-through text-sm ml-2">
                Ksh{product.originalPrice}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button className="bg-rose-100 text-rose-700 p-2 rounded-full hover:bg-rose-600 hover:text-white transition-colors duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Favorite Button */}
      <button className="absolute top-3 right-12 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400 hover:text-rose-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
    </div>
  );
};

export default Product;
