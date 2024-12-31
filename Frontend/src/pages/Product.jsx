import StarRatings from 'react-star-ratings';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { userRequest } from "../requestMethods";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addProduct } from '../redux/cartRedux';
import { showAverageRating } from "../components/Ratings"

const Product = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2]
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart)

  let price;

  const handleQuantity = (action) => {
    if (action === "dec") {
      setQuantity(quantity === 1 ? 1 : quantity - 1)
    }

    if (action === "inc") {
      setQuantity(quantity + 1)
    }
  }


  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await userRequest.get("/products/find/" + id);

        setProduct(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getProduct();
  }, [id]);

  const handlePrice = (
    originalPrice,
    discountedPrice,
    wholePrice,
    minimumQuantity,
    quantity
  ) => {
    if (quantity > minimumQuantity && discountedPrice) {
      discountedPrice = wholePrice;

      price = discountedPrice;

      return price;
    } else if (quantity > minimumQuantity && originalPrice) {
      originalPrice = wholePrice;

      price = originalPrice;

      return price;
    } else if (discountedPrice) {
      price = discountedPrice;

      return price;
    } else {
      price = originalPrice;

      return price;
    }
  };

  const handleAddToCart = () => {
    dispatch(addProduct({ ...product, quantity, price, email: 'johndoe@gmail.com' }))
    toast.success("Product has been added to basket successfully", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    console.log(cart)
  }

  return (
    <div className="h-auto flex justify-stretch p-[30px]">

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover />

      {/* LEFT */}
      <div className="flex-1 h-[500px] w-[600px]">
        <img
          src={product.img}
          alt=""
          className="h-[100%] w-[100%] object-cover"
        />

      </div>

      {/* RIGHT */}
      <div className="flex flex-1 flex-col ml-10">
        <h2 className="text-[25px] font-semibold mb-[20px]">
          {product.title}
        </h2>
        <span>
          {product.desc}
        </span>
        <h2 className="font-semibold mt-2 text-[20px]">$

          {handlePrice(
            product.originalPrice,
            product.discountedPrice,
            product.wholesalePrice,
            product?.wholesaleMinimumQuantity,
            quantity
          )}</h2>

        <span className="flex items-center">

          {showAverageRating(product)}
        </span>

        <div className="h-52 w-96 border-2 border-gray-300 rounded-lg shadow-md my-4 p-6">
          <h2 className="flex items-center justify-center font-semibold text-lg text-gray-700 mb-4">
            WHAT’S IN THE BOX
          </h2>
          <hr className="mb-4" />
          <span className="block text-gray-600 text-base text-[18px]">
            {product.title}
          </span>
        </div>

        <div className="inline-flex items-center bg-[#ef93db] text-white font-semibold text-sm p-3 rounded-full shadow-md">
          Wholesale Available : ${product.wholesalePrice} as from {product.wholesaleMinimumQuantity} items{' '}
        </div>

        <div className="flex items-center my-5 p-4">
          <FaMinus className="bg-[#ef93db] text-white cursor-pointer p-2 rounded-full mr-4 text-3xl" onClick={() => handleQuantity("dec")} />
          <span className="text-lg font-semibold mx-4">{quantity}</span>
          <FaPlus className="bg-[#ef93db] text-white cursor-pointer p-2 rounded-full mr-4 text-3xl" onClick={() => handleQuantity("inc")} />

        </div>

        <button className="bg-[#1e1e1e] p-[10px] w-[200px] text-white cursor-pointer" onClick={handleAddToCart}>
          Add to cart
        </button>

        <hr className="my-6" />

        <div className="flex flex-col">
          <h2 className="font-semibold text-[18px]">Reviews</h2>


          {
            product?.ratings?.map((rating, index) => (
              <div className="flex items-center" key={index}>
                <StarRatings
                  rating={parseInt(rating.star)}
                  starDimension="25px"
                  starRatedColor="yellow"
                  starSpacing="5px"
                />
                <span className="font-semibold mx-[20px]">{rating.postedBy}</span>
              </div>
            ))
          }


        </div>

      </div>
    </div>
  );
};

export default Product;
