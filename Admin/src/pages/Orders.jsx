import { FaCheckCircle, FaCheckDouble, FaClock, FaSearch, FaTruck, FaBoxOpen } from "react-icons/fa";
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from "react";
import { userRequest } from "../requestMethods";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const handleUpdateOrder = async (id) => {
    try {
      await userRequest.put(`/orders/${id}`, {
        "status": 2
      });
      // Update local state instead of reloading the page
      setOrders(orders.map(order => 
        order._id === id ? { ...order, status: 2 } : order
      ));
    } catch (error) {
      console.log(error);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 0:
        return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: FaClock };
      case 1:
        return { text: 'Processing', color: 'bg-blue-100 text-blue-800', icon: FaTruck };
      case 2:
        return { text: 'Delivered', color: 'bg-green-100 text-green-800', icon: FaCheckDouble };
      default:
        return { text: 'Unknown', color: 'bg-gray-100 text-gray-800', icon: FaBoxOpen };
    }
  };

  const columns = [
    { 
      field: "_id", 
      headerName: "Order ID", 
      width: 120,
      headerClassName: 'font-bold text-gray-700',
      renderCell: (params) => (
        <span className="font-mono text-sm text-gray-600">
          #{params.row._id.slice(-6)}
        </span>
      )
    },
    { 
      field: "name", 
      headerName: "Customer Name", 
      width: 180,
      headerClassName: 'font-bold text-gray-700',
      renderCell: (params) => (
        <div className="font-medium text-gray-900">{params.row.name}</div>
      )
    },
    { 
      field: "email", 
      headerName: "Email", 
      width: 200,
      headerClassName: 'font-bold text-gray-700'
    },
    { 
      field: "total", 
      headerName: "Total", 
      width: 120,
      headerClassName: 'font-bold text-gray-700',
      renderCell: (params) => (
        <span className="font-semibold text-gray-900">
          ${params.row.total?.toFixed(2) || '0.00'}
        </span>
      )
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      headerClassName: 'font-bold text-gray-700',
      renderCell: (params) => {
        const statusInfo = getStatusInfo(params.row.status);
        const StatusIcon = statusInfo.icon;
        return (
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusInfo.color} text-xs font-medium`}>
            <StatusIcon size={12} />
            <span>{statusInfo.text}</span>
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      headerClassName: 'font-bold text-gray-700',
      renderCell: (params) => {
        const canDeliver = params.row.status === 0 || params.row.status === 1;
        return (
          <div className="flex items-center space-x-2">
            {canDeliver ? (
              <button
                onClick={() => handleUpdateOrder(params.row._id)}
                className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
              >
                <FaCheckCircle size={14} />
                <span>Mark Delivered</span>
              </button>
            ) : (
              <span className="text-gray-400 text-sm font-medium">Completed</span>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);
        const res = await userRequest.get("/orders");
        setOrders(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  // Filter orders based on search term
  const filteredOrders = orders.filter(order =>
    order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 0).length;
  const processingOrders = orders.filter(order => order.status === 1).length;
  const deliveredOrders = orders.filter(order => order.status === 2).length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
          <p className="text-gray-600">Manage and track customer orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaBoxOpen className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{pendingOrders}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FaClock className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{processingOrders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaTruck className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">$</span>
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
                  placeholder="Search orders by customer name, email, or order ID..."
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
                rows={filteredOrders}
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
          Showing {Math.min(filteredOrders.length, 30)} of {filteredOrders.length} orders per page
        </div>
      </div>
    </div>
  );
};

export default Orders;