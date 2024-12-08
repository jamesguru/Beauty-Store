import {DataGrid} from '@mui/x-data-grid';
import { FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Products = () => {

  const data = [
    {
      _id: "101",
      title: "Moisturizing Cream",
      img: "https://images.pexels.com/photos/8054395/pexels-photo-8054395.jpeg",
      desc: "Hydrating cream for dry skin.",
      originalPrice: 25.99,
      discountedPrice: 19.99,
      inStock: true,
    },
    {
      _id: "102",
      title: "Revitalizing Serum",
      img: "https://images.pexels.com/photos/3755657/pexels-photo-3755657.jpeg",
      desc: "Brightening serum for radiant skin.",
      originalPrice: 45.99,
      discountedPrice: 39.99,
      inStock: false,
    },
    {
      _id: "103",
      title: "Exfoliating Scrub",
      img: "https://images.pexels.com/photos/2730153/pexels-photo-2730153.jpeg",
      desc: "Gentle scrub for smooth skin.",
      originalPrice: 20.00,
      discountedPrice: 15.99,
      inStock: true,
    },
    {
      _id: "104",
      title: "Anti-Aging Cream",
      img: "https://images.pexels.com/photos/2496219/pexels-photo-2496219.jpeg",
      desc: "Cream to reduce signs of aging.",
      originalPrice: 55.00,
      discountedPrice: 49.99,
      inStock: true,
    },
    {
      _id: "105",
      title: "Cleansing Gel",
      img: "https://images.pexels.com/photos/6782462/pexels-photo-6782462.jpeg",
      desc: "Gel to cleanse and refresh skin.",
      originalPrice: 18.00,
      discountedPrice: 15.50,
      inStock: false,
    },
    {
      _id: "106",
      title: "Sun Protection Lotion",
      img: "https://images.pexels.com/photos/416717/pexels-photo-416717.jpeg",
      desc: "SPF 50 sun protection lotion.",
      originalPrice: 22.99,
      discountedPrice: 19.99,
      inStock: true,
    },
    {
      _id: "107",
      title: "Hydrating Face Mask",
      img: "https://images.pexels.com/photos/337373/pexels-photo-337373.jpeg",
      desc: "Hydration face mask for deep moisture.",
      originalPrice: 30.00,
      discountedPrice: 25.99,
      inStock: false,
    },
    {
      _id: "108",
      title: "Vitamin C Serum",
      img: "https://images.pexels.com/photos/4792671/pexels-photo-4792671.jpeg",
      desc: "Serum with Vitamin C for skin brightening.",
      originalPrice: 50.00,
      discountedPrice: 45.00,
      inStock: true,
    }
  ];
  
  const columns = [
    { field: "_id", headerName: "ID", width: 90 },
    {
      field: "product",
      headerName: "Product",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="flex items-center">
            <img
              className="h-12 w-12 rounded-full object-cover mr-2"
              src={params.row.img}
              alt=""
              height="100px"
              width="100px"
            />
            {params.row.title}
          </div>
        );
      },
    },
    { field: "desc", headerName: "Description", width: 150 },
    { field: "originalPrice", headerName: "Price ($)", width: 100 },
    { field: "inStock", headerName: "In Stock", width: 100 },
    {
      field: "edit",
      headerName: "Edit",
      width: 100,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/product/${params.id}`}>
              <button className="bg-gray-400 text-white cursor-pointer w-[70px]">
                Edit
              </button>
            </Link>
          </>
        );
      },
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      renderCell: () => {
        return (
          <>
            <FaTrash className="text-red-500 cursor-pointer m-2" />
          </>
        );
      },
    },
  ];


  return (
    <div className="p-5 w-[70vw]">
      <div className="flex items-center justify-between m-[30px]">
        <h1 className="m-[20px] text-[20px]">All Products</h1>
        <button className="bg-[#1e1e1e] p-[10px] font-semibold text-white cursor-pointer">
          Create
        </button>
      </div>
      <div className='m-[30px]'>
      <DataGrid getRowId={(row) => row._id} rows={data} checkboxSelection columns={columns} />
      </div>

    </div>
  );
};

export default Products;
