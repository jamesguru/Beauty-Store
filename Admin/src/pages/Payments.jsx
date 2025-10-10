import { FaCheckCircle, FaTimesCircle, FaClock, FaSearch, FaMoneyBillWave, FaSync, FaEye, FaCalendar } from "react-icons/fa";
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from "react";
import { userRequest } from "../requestMethods";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Format date for display (DD/MM/YYYY)
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return 'Invalid Date';
    }
  };

  // Format time only (HH:MM AM/PM)
  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error("Time formatting error:", error);
      return 'Invalid Time';
    }
  };

  // Format full date and time
  const formatFullDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error("Full DateTime formatting error:", error);
      return 'Invalid Date';
    }
  };

  const handleUpdatePayment = async (id, newStatus) => {
    try {
      await userRequest.put(`/payments/${id}`, {
        status: newStatus,
        payment_status: newStatus === 'completed' ? 'success' : newStatus
      });
      
      // Update local state
      setPayments(payments.map(payment => 
        payment._id === id ? { 
          ...payment, 
          status: newStatus,
          payment_status: newStatus === 'completed' ? 'success' : newStatus,
          updated_at: new Date().toISOString() // Update the timestamp
        } : payment
      ));
    } catch (error) {
      console.log("Update payment error:", error);
    }
  };

  const handleDeletePayment = async (id) => {
    if (window.confirm("Are you sure you want to delete this payment record?")) {
      try {
        await userRequest.delete(`/payments/${id}`);
        setPayments(payments.filter(payment => payment._id !== id));
      } catch (error) {
        console.log("Delete payment error:", error);
      }
    }
  };

  const getStatusInfo = (status, paymentStatus) => {
    const statusMap = {
      completed: { text: 'Completed', color: 'bg-green-100 text-green-800', icon: FaCheckCircle },
      success: { text: 'Success', color: 'bg-green-100 text-green-800', icon: FaCheckCircle },
      initiated: { text: 'Initiated', color: 'bg-blue-100 text-blue-800', icon: FaClock },
      pending: { text: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: FaClock },
      failed: { text: 'Failed', color: 'bg-red-100 text-red-800', icon: FaTimesCircle },
      cancelled: { text: 'Cancelled', color: 'bg-gray-100 text-gray-800', icon: FaTimesCircle }
    };

    // Use payment_status if available, otherwise use status
    const mainStatus = paymentStatus || status;
    return statusMap[mainStatus] || statusMap.pending;
  };

  const getAmountColor = (amount, status) => {
    if (status === 'completed' || status === 'success') return 'text-green-700 font-bold';
    if (status === 'failed' || status === 'cancelled') return 'text-red-700';
    return 'text-gray-900 font-semibold';
  };

  const columns = [
    { 
      field: "_id", 
      headerName: "Payment ID", 
      width: 120,
      headerClassName: 'font-bold text-gray-700',
      renderCell: (params) => (
        <span className="font-mono text-sm text-gray-600">
          #{params.row._id.slice(-6)}
        </span>
      )
    },
    { 
      field: "reference", 
      headerName: "Order ID", 
      width: 120,
      headerClassName: 'font-bold text-gray-700',
      renderCell: (params) => (
        <span className="font-mono text-sm text-blue-600">
          #{params.row.reference?.slice(-6) || 'N/A'}
        </span>
      )
    },
    { 
      field: "customer", 
      headerName: "Customer", 
      width: 200,
      headerClassName: 'font-bold text-gray-700',
      renderCell: (params) => (
        <div>
          <div className="font-medium text-gray-900">{params.row.first_name} {params.row.last_name}</div>
          <div className="text-sm text-gray-500">{params.row.email}</div>
        </div>
      )
    },
    { 
      field: "phone", 
      headerName: "Phone", 
      width: 140,
      headerClassName: 'font-bold text-gray-700',
      renderCell: (params) => (
        <span className="text-sm text-gray-600">{params.row.phone}</span>
      )
    },
    { 
      field: "amount", 
      headerName: "Amount", 
      width: 120,
      headerClassName: 'font-bold text-gray-700',
      renderCell: (params) => (
        <span className={`${getAmountColor(params.row.amount, params.row.payment_status)}`}>
          KES {params.row.amount?.toLocaleString() || '0'}
        </span>
      )
    },
    {
      field: "payment_status",
      headerName: "Payment Status",
      width: 150,
      headerClassName: 'font-bold text-gray-700',
      renderCell: (params) => {
        const statusInfo = getStatusInfo(params.row.status, params.row.payment_status);
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
      field: "provider",
      headerName: "Provider",
      width: 120,
      headerClassName: 'font-bold text-gray-700',
      renderCell: (params) => (
        <span className="text-sm text-gray-600 capitalize">{params.row.payment_provider}</span>
      )
    },
    {
      field: "created_at",
      headerName: "Created At",
      width: 160,
      headerClassName: 'font-bold text-gray-700',
      renderCell: (params) => {
        const fullDateTime = formatFullDateTime(params.row.created_at);
        
        return (
          <div className="text-sm text-gray-600" title={`Full: ${fullDateTime}`}>
            <div className="flex items-center space-x-1">
              <FaCalendar size={10} className="text-gray-400" />
              <span>{formatDate(params.row.created_at)}</span>
            </div>
            <div className="text-xs text-gray-400">
              {formatTime(params.row.created_at)}
            </div>
          </div>
        );
      }
    },
    {
      field: "updated_at",
      headerName: "Updated At",
      width: 160,
      headerClassName: 'font-bold text-gray-700',
      renderCell: (params) => {
        const fullDateTime = formatFullDateTime(params.row.updated_at);
        
        return (
          <div className="text-sm text-gray-600" title={`Full: ${fullDateTime}`}>
            <div className="flex items-center space-x-1">
              <FaCalendar size={10} className="text-gray-400" />
              <span>{formatDate(params.row.updated_at)}</span>
            </div>
            <div className="text-xs text-gray-400">
              {formatTime(params.row.updated_at)}
            </div>
          </div>
        );
      }
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      headerClassName: 'font-bold text-gray-700',
      renderCell: (params) => {
        const canUpdate = params.row.status !== 'completed' && params.row.status !== 'success';
        return (
          <div className="flex items-center space-x-2">
            {canUpdate ? (
              <>
                <button
                  onClick={() => handleUpdatePayment(params.row._id, 'completed')}
                  className="flex items-center space-x-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors duration-200"
                  title="Mark as Completed"
                >
                  <FaCheckCircle size={10} />
                  <span>Complete</span>
                </button>
                <button
                  onClick={() => handleUpdatePayment(params.row._id, 'failed')}
                  className="flex items-center space-x-1 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors duration-200"
                  title="Mark as Failed"
                >
                  <FaTimesCircle size={10} />
                  <span>Fail</span>
                </button>
              </>
            ) : (
              <span className="text-gray-400 text-xs">Completed</span>
            )}
            <button
              onClick={() => handleDeletePayment(params.row._id)}
              className="flex items-center space-x-1 px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 transition-colors duration-200"
              title="Delete Payment"
            >
              <FaTimesCircle size={10} />
              <span>Delete</span>
            </button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    const getPayments = async () => {
      try {
        setLoading(true);
        const res = await userRequest.get("/payments");
        setPayments(res.data);
      } catch (error) {
        console.log("Fetch payments error:", error);
      } finally {
        setLoading(false);
      }
    };
    getPayments();
  }, []);

  // Filter payments based on search term
  const filteredPayments = payments.filter(payment =>
    payment.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (payment.orderId?._id && payment.orderId._id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate statistics
  const totalPayments = payments.length;
  const completedPayments = payments.filter(payment => 
    payment.status === 'completed' || payment.payment_status === 'success'
  ).length;
  const pendingPayments = payments.filter(payment => 
    payment.status === 'pending' || payment.status === 'initiated'
  ).length;
  const failedPayments = payments.filter(payment => 
    payment.status === 'failed' || payment.payment_status === 'failed'
  ).length;
  const totalRevenue = payments
    .filter(payment => payment.status === 'completed' || payment.payment_status === 'success')
    .reduce((sum, payment) => sum + (payment.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Management</h1>
          <p className="text-gray-600">Manage and track payment transactions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Payments</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalPayments}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaMoneyBillWave className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{completedPayments}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{pendingPayments}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FaClock className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">KES {totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">KSh</span>
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
                  placeholder="Search payments by customer name, email, phone, or ID..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Clear
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center space-x-2"
                >
                  <FaSync size={14} />
                  <span>Refresh</span>
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
                rows={filteredPayments}
                checkboxSelection
                columns={columns}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[10, 25, 50]}
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
          Showing {Math.min(filteredPayments.length, paginationModel.pageSize)} of {filteredPayments.length} payments
        </div>
      </div>
    </div>
  );
};

export default Payments;