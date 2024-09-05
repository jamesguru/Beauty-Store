import StarRatings from 'react-star-ratings';
import {FaMinus, FaPlus} from 'react-icons/fa';
const Product = () => {
  return (
    <div className="h-auto flex justify-stretch p-[30px]">

      {/* LEFT */}
      <div className="flex-1 h-[500px] w-[600px]">
        <img
          src="/lotion2.jpg"
          alt=""
          className="h-[100%] w-[100%] object-cover"
        />

      </div>

      {/* RIGHT */}
      <div className="flex flex-1 flex-col ml-10">
        <h2 className="text-[25px] font-semibold mb-[20px]">
          Bajaj Almond Drops,6X Vitamin E Nourishment
        </h2>
        <span>
          The new and better Bajaj Almond Drops Hair Oil has 6x Vitamin E that helps reduce hair fall and gives beautiful, strong hair. It is light, non-sticky and the perfect solution for your hair fall worries. Now style your hair any way you want without any fear of hair fall. A non-sticky Almond Hair Oil with the goodness of 6x Vitamin E for nourishment Bajaj Almond Oil can help reduce hair fall due to breakage by up to 79% The almond oil also helps you get beautiful, strong, and shiny hair, with regular use The non-sticky oil feels light on the hair and makes styling and braiding your hair so easy Suitable for all hair types, the hair oil ensures you rock your favorite hairstyle with confidence
        </span>
        <h2 className="font-semibold mt-2 text-[20px]">$ 90</h2>

        <span className="flex items-center">

          <StarRatings
            rating={2.403}
            starDimension="25px"
            starRatedColor="yellow"
            starSpacing="5px"
          />
          (2)
        </span>

        <div className="h-52 w-96 border-2 border-gray-300 rounded-lg shadow-md my-4 p-6">
          <h2 className="flex items-center justify-center font-semibold text-lg text-gray-700 mb-4">
            WHAT’S IN THE BOX
          </h2>
          <hr className="mb-4" />
          <span className="block text-gray-600 text-base text-[18px]">
            1 Garnier Even & Matte Vitamin C Cleansing Foam 500ml
          </span>
        </div>

        <div className="inline-flex items-center bg-[#ef93db] text-white font-semibold text-sm p-3 rounded-full shadow-md">
          Wholesdale Available : $70 as from 10 items{' '}
        </div>

        <div className="flex items-center my-5 p-4">
          <FaMinus className="bg-[#ef93db] text-white cursor-pointer p-2 rounded-full mr-4 text-3xl" />
          <span className="text-lg font-semibold mx-4">1</span>
          <FaPlus className="bg-[#ef93db] text-white cursor-pointer p-2 rounded-full mr-4 text-3xl" />

        </div>

        <button className="bg-[#1e1e1e] p-[10px] w-[200px] text-white cursor-pointer">
          Add to cart
        </button>

        <hr className="my-6" />

        <div className="flex flex-col">
          <h2 className="font-semibold text-[18px]">Reviews</h2>

          <div className="flex items-center">
            <StarRatings
              rating={2.403}
              starDimension="25px"
              starRatedColor="yellow"
              starSpacing="5px"
            />
            <span className="font-semibold mx-[20px]">John K.</span>
          </div>
          <div className="flex items-center">
            <StarRatings
              rating={2.403}
              starDimension="25px"
              starRatedColor="yellow"
              starSpacing="5px"
            />
            <span className="font-semibold mx-[20px]">Jane L.</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Product;
