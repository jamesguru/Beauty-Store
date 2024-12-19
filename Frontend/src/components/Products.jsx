import { useEffect, useState } from "react";
import Product from "./Product";
import PropTypes from "prop-types"
import {userRequest} from "../requestMethods"
import {Link} from "react-router-dom";



const Products = ({ filters, sort, query }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  console.log(products)

  useEffect(() => {
    const getProducts = async () => {

      try {
        let res;

        if (query) {
          res = await userRequest.get(`/products?search=${query}`);
        } else {
          res = await userRequest.get("/products");
        }
        setProducts(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getProducts();

  }, [
    query
  ])


  useEffect(() => {

    let tempProducts = [...products];

    // apply filters

    if (filters) {
      tempProducts = tempProducts.filter((item) => Object.entries(filters).every(([key, value]) => {
        if (!value) return true;

        return item[key].includes(value);
      }))
    }


    //Apply sorting

    if (sort === "newest") {
      tempProducts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    } else if (sort === "asc") {

      tempProducts.sort((a, b) => a.originalPrice - b.originalPrice);

    } else if (sort === "desc") {
      tempProducts.sort((a, b) => b.originalPrice - a.originalPrice);
    }

    setFilteredProducts(tempProducts);
  }, [products, filters, sort])

  return (
    <div className="flex flex-wrap mx-[40px]">
      {filteredProducts.map((product, index) => (

        <Link to={`/product/${product._id}`}>
          <Product img={product.img} title={product.title} />
        </Link>
      ))
      }
    </div>
  );
};

Products.propTypes = {
  cat: PropTypes.string,
  filters: PropTypes.object,
  sort: PropTypes.string,
  query: PropTypes.string
}

export default Products;
