import Product from "./Product";


const Products = () => {
  return (
    <div className="flex flex-wrap mx-[40px]">
        <Product img="/lotion.jpg" />
        <Product  img="/lotion1.jpg"/>
        <Product  img="/lotion2.jpg"/>
        <Product  img="/serum1.jpg" />
        <Product  img="/foundation.jpg" />
    </div>
  );
};

export default Products;
