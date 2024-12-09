import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"
import { useState, } from "react";
import { login } from "../redux/apiCalls";
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";


const Login = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleLogin = (e) => {
    e.preventDefault()
    try {
      setLoading(true);

      login(dispatch, { email, password });

      console.log(user.currentUser)

      setLoading(false)
      navigate("/")

    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  }


  return (
    <div className="flex items-center justify-center mt-[5%]">

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="flex items-center bg-white shadow-lg rounded-lg overflow-hidden">
        {/* IMAGE */}

        <div className="h-[500px] w-[500px] transition-transform duration-700 ease-in-out transform hover:scale-105">

          <img
            src="/lotion1.jpg"
            alt="login"
            className="object-cover h-full w-full"
          />

        </div>

        {/* FORM */}

        <div className="p-10 w-[500px]">
          <h2 className="text-xl font-bold text-gray-700 mb-5">Login</h2>

          <form className="spay-y-5">

            <div className="mb-5">
              <label htmlFor="" className="block text-gray-600 mb-1">
                Email
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d55fbb]"
                placeholder="example@example.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-5">
              <label htmlFor="" className="block text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d55fbb]"
                placeholder="*******"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="w-full py-2 bg-[#d55fbb] text-white font-bold rounded-md transition-transform duration-500 hover:bg-blue-200 focus:outline-none focus:ring-red-500 transform hover:scale-105"
              onClick={handleLogin}
            >
             {loading ? "loading ..." : "Login"}
            </button>

            <div className="mt-4 text-sm text-gray-600">

              <span>Don`t have an account?</span>
              <Link to="/create-account" className="text-red-500 hover:underline ml-1">
                Sign Up
              </Link>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Login;
