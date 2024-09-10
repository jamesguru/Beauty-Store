import {Link} from "react-router-dom";
const Register = () => {
  return (
    <div className="flex items-center justify-center mt-[5%]">

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
          <h2 className="text-xl font-bold text-gray-700 mb-5">Create Account</h2>

          <form className="spay-y-5">
          <div className="mb-5">
              <label htmlFor="" className="block text-gray-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d55fbb]"
                placeholder="John Doe"
              />
            </div>

            <div className="mb-5">
              <label htmlFor="" className="block text-gray-600 mb-1">
                Email
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d55fbb]"
                placeholder="example@example.com"
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
              />
            </div>

            <button className="w-full py-2 bg-[#d55fbb] text-white font-bold rounded-md transition-transform duration-500 hover:bg-blue-200 focus:outline-none focus:ring-red-500 transform hover:scale-105">
              Create an account
            </button>

            <div className="mt-4 text-sm text-gray-600">

              <span>Have an account already?</span>
              <Link to="/login" className="text-red-500 hover:underline ml-1">
                  Login
              </Link>

            </div>

          </form>

        </div>

      </div>

    </div>
  )
}

export default Register