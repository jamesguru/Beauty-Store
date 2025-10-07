import Banner from '../components/Banner';
import Category from '../components/Category';
import Products from '../components/Products';
import Packages from "../components/Packages";
import Timetable from './Timetable';

const Home = () => {
  return (
    <div>
      <Banner />
      <Packages />
        <Products />
        <Timetable />
      <Category />
 
    </div>
  );
};

export default Home;
