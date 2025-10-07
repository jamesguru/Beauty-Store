import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Myaccount from "./pages/Myaccount";
import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import Announcement from "./components/Announcement";
import Product from "./pages/Product";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductList from "./pages/ProductList";
import Order from "./pages/Order";
import {useSelector } from "react-redux";
import Timetable from "./pages/Timetable";
import ScrollToTop from "./components/ScrollToTop"; // Add this import
import Packages from "./pages/Package";
import BundleDetail from "./pages/PackageDetailedPage";
import SkinClinic from "./pages/Clinic";

function App() {
  const user = useSelector((state) => state.user);
  const Layout = () => {
    return (
      <div>
        <ScrollToTop /> {/* Add this line */}
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children:[
        {
          path:"/",
          element: <Home />
        },
        {
          path:"/cart",
          element: <Cart />
        },
        {
          path:"/login",
          element: <Login />
        },
        {
          path:"/create-account",
          element: <Register />
        },
         {
          path:"/packages",
          element: <Packages />
        },

         {
          path:"/skincare-timetable",
          element: <Timetable />
        },
         {
          path:"/skin-clinic",
          element: <SkinClinic />
        },

        {
          path:"/myaccount",
          element: user?.currentUser ? <Myaccount /> : <Home />
        },
        {
          path:"/product/:productId",
          element: <Product />
        },
         {
          path:"/package/:packageId",
          element: <BundleDetail />
        },
        {
          path:"/products/:searchterm",
          element: <ProductList />
        },
        {
          path:"/myorders",
          element: user?.currentUser ? <Order /> : <Login/>
        }
      ]
    },
   
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;