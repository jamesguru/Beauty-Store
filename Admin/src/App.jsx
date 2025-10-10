import {createBrowserRouter, Outlet, RouterProvider} from 'react-router-dom';
import Menu from './components/Menu';
import Home from './pages/Home';
import Users from './pages/Users';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Banners from './pages/Banners';
import NewProduct from './pages/NewProduct';
import Product from './pages/Product';
import Bundles from './pages/Bundle';
import CreateBundle from './pages/NewBundle';
import Login from './pages/Login';
import Payments from './pages/Payments';
import Analytics from './pages/Analytics';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  return user ? children : <Login />;
};

function App () {
  const Layout = () => {
    return (
      <div className="flex">
        <div>
          <Menu />
        </div>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    );
  };

  const router = createBrowserRouter ([
    {
      path: '/',
      element: <Login />,
    },
    {
      path: '/',
      element: <ProtectedRoute><Layout /></ProtectedRoute>,
      children: [
        {
          path: '/home',
          element: <Home />,
        },
        {
          path: '/users',
          element: <Users />,
        },
        {
          path: '/products',
          element: <Products />,
        },
        {
          path: '/orders',
          element: <Orders />,
        },
         {
          path: '/payments',
          element: <Payments />,
        },
        {
          path: '/bundles',
          element: <Bundles />,
        },
        {
          path: '/bundles/create',
          element: <CreateBundle />,
        },
        {
          path: '/banners',
          element: <Banners />,
        },
         {
          path: '/tracking',
          element: <Analytics />,
        },
        {
          path: '/newproduct',
          element: <NewProduct />,
        },
        {
          path: '/product/:id',
          element: <Product />,
        }
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;