import Banner from '../components/Banner';
import Category from '../components/Category';
import Products from '../components/Products';
import Packages from "../components/Packages";

const Home = () => {
  return (
    <div>
      <Banner />
      <Packages />
        <Products />
      <Category />
 
    </div>
  );
};

export default Home;
