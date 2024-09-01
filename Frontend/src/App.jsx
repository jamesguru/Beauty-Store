import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Myaccount from "./pages/Myaccount";
import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import Announcement from "./components/Announcement";

function App() {
  const Layout = () => {
    return (
      <div>
        <Announcement/>
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
          path:"/myaccount",
          element: <Myaccount />
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
