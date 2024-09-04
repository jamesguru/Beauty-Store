import { FaSearch, FaUser } from "react-icons/fa";
import ShoppingBacketIcon from "@mui/icons-material/ShoppingBasket";
import Badge from "@mui/material/Badge";
const Navbar = () => {
  return (
    <div className="flex items-center justify-between h-[100px] shadow-md px-6">
      <div className="cursor-pointer m-2">
        <img src="/blisslogo1.png" alt="" height="200px" width="200px" />
      </div>

      <div className="flex items-center m-2">
        <input
          type="text"
          placeholder="search"
          className="p-[15px] border-2 border-[#f096dd] border-solid w-[500px] outline-none rounded-lg mr-[-30px]"
        />
        <FaSearch className="text-[20px] cursor-pointer" />
      </div>

      <div className="flex items-center">
        <div className="mr-[20px] cursor-pointer">
          <Badge badgeContent={2} color="secondary">
            <ShoppingBacketIcon className="text-pink-500" />
          </Badge>
        </div>

        <div className="flex items-center cursor-pointer space-x-2 border border-pink-300 p-2 rounded-lg hover:bg-pink-100 duration-300">
          <FaUser className="text-[#e455c5] hover:text-pink-600 transition duration-300" />
          <span className="text-[#e455c5] hover:text-pink-600 font-semibold">
            Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
