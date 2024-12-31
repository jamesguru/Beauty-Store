import {showAverageRating} from "./Ratings"
const Product = ({product}) => {
  return (
    <div className="flex flex-col items-center justify-center h-[500px] m-[30px] cursor-pointer">
        <img src={product.img} alt="" className="h-[400px] w-[300px] bg-cover" />
        <h2 className="font-semibold text-[18px] w-[300px]">
         {product.title}
        </h2>
        <span className="text-[18px] font-semibold flex items-center justify-center">
          {product.originalPrice}
        </span>
        <span className="flex items-center">

        {showAverageRating(product)}
        </span>

      </div>
  )
}

export default Product