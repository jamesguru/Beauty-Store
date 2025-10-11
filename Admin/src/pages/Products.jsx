import { DataGrid } from '@mui/x-data-grid';
import { FaTrash, FaEdit, FaPlus, FaSearch, FaBox } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { userRequest } from "../requestMethods";
import { useEffect, useState } from 'react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 30,
  });

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const res = await userRequest.get("/products");
        setProducts(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.desc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      field: "_id", 
      headerName: "ID", 
      width: 90,
      headerClassName: 'font-bold text-gray-700'
    },
    {
      field: "product",
      headerName: "Product",
      width: 300,
      headerClassName: 'font-bold text-gray-700',
      renderCell: (params) => {
        return (
          <div className="flex items-center space-x-3">
            <img
              className="h-12 w-12 rounded-lg object-cover border border-gray-200"
              src={params.row.img?.[0] || '/api/placeholder/48/48'} 
              alt={params.row.title}
              onError={(e) => {
                e.target.src = '/api/placeholder/48/48';
              }}
            />
            <div>
              <div className="font-medium text-gray-900">{params.row.title}</div>
              {params.row.category && (
                <div className="text-sm text-gray-500">{params.row.category}</div>
              )}
            </div>
          </div>
        );
      },
    },
    { 
      field: "desc", 
      headerName: "Description", 
      width: 200,
      headerClassName: 'font-bold text-gray-700',
      renderCell: (params) => (
        <div className="text-sm text-gray-600 line-clamp-2">
          {params.row.desc}
        </div>
      )
    },
    { 
      field: "originalPrice", 
      headerName: "Price", 
      width: 120,
      headerClassName: 'font-bold text-gray-700',
      renderCell: (params) => (
        <span className="font-semibold text-gray-900">
          KES{params.row.originalPrice}
        </span>
      )
    },
    { 
      field: "inStock", 
      headerName: "Stock", 
      width: 120,
      headerClassName: 'font-bold text-gray-700',
      renderCell: (params) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          params.row.inStock 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {params.row.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      )
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 100,
      headerClassName: 'font-bold text-gray-700',
      renderCell: (params) => {
        return (
          <Link to={`/product/${params.id}`}>
            <button className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
              <FaEdit size={12} />
              <span>Edit</span>
            </button>
          </Link>
        );
      },
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      headerClassName: 'font-bold text-gray-700',
      renderCell: () => {
        return (
          <button className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium">
            <FaTrash size={12} />
            <span>Delete</span>
          </button>
        );
      },
    },
  ];

  // Calculate statistics
  const totalProducts = products.length;
  const inStockProducts = products.filter(product => product.inStock).length;
  const outOfStockProducts = totalProducts - inStockProducts;
  const averagePrice = products.length > 0 
    ? (products.reduce((sum, product) => sum + (product.originalPrice || 0), 0) / products.length).toFixed(2)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
              <p className="text-gray-600">Manage your product inventory and listings</p>
            </div>
            <Link to="/newproduct">
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium mt-4 sm:mt-0">
                <FaPlus size={14} />
                <span>Add New Product</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaBox className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{inStockProducts}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">✓</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{outOfStockProducts}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 font-bold text-lg">!</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Price</p>
                <p className="text-2xl font-bold text-gray-900 mt-1"> KES{averagePrice}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold text-lg">$</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Toolbar */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products by name, description, or category..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-3">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium">
                  Filter
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium">
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* DataGrid */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <DataGrid
                getRowId={(row) => row._id}
                rows={filteredProducts}
                checkboxSelection
                columns={columns}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[30]}
                disableSelectionOnClick
                autoHeight
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid #f3f4f6',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f9fafb',
                    borderBottom: '2px solid #e5e7eb',
                  },
                  '& .MuiDataGrid-footerContainer': {
                    backgroundColor: '#f9fafb',
                    borderTop: '1px solid #e5e7eb',
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: '#f8fafc',
                  },
                }}
              />
            )}
          </div>
        </div>

        {/* Pagination Info */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {Math.min(filteredProducts.length, 30)} of {filteredProducts.length} products per page
        </div>
      </div>
    </div>
  );
};

export default Products;