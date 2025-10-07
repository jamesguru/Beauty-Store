import { FaTrash, FaEdit, FaSearch, FaUserPlus } from 'react-icons/fa';
import { DataGrid } from '@mui/x-data-grid';
import { userRequest } from "../requestMethods";
import { useEffect, useState } from 'react';

const Users = () => {
  const columns = [
    { 
      field: "_id", 
      headerName: "ID", 
      width: 90,
      headerClassName: 'font-bold text-gray-700'
    },
    { 
      field: "name", 
      headerName: "Name", 
      width: 180,
      headerClassName: 'font-bold text-gray-700',
      renderCell: (params) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {params.row.name?.charAt(0) || 'U'}
          </div>
          <span className="font-medium">{params.row.name}</span>
        </div>
      )
    },
    { 
      field: "email", 
      headerName: "Email", 
      width: 220,
      headerClassName: 'font-bold text-gray-700'
    },
    { 
      field: "phone", 
      headerName: "Phone", 
      width: 150,
      headerClassName: 'font-bold text-gray-700'
    },
    { 
      field: "role", 
      headerName: "Role", 
      width: 120,
      headerClassName: 'font-bold text-gray-700',
      renderCell: (params) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          params.row.role === 'Admin' 
            ? 'bg-purple-100 text-purple-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {params.row.role}
        </span>
      )
    },
    { 
      field: "status", 
      headerName: "Status", 
      width: 120,
      headerClassName: 'font-bold text-gray-700',
      renderCell: () => (
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
          Active
        </span>
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      headerClassName: 'font-bold text-gray-700',
      renderCell: () => {
        return (
          <div className="flex items-center space-x-2">
            <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200">
              <FaEdit size={14} />
            </button>
            <button className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors duration-200">
              <FaTrash size={14} />
            </button>
          </div>
        );
      },
    },
  ];

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoading(true);
        const res = await userRequest.get("/users");
        setUsers(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage your team members and their account permissions here.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaUserPlus className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {users.filter(user => user.role === 'Admin').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold text-lg">A</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">✓</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">+{Math.floor(users.length * 0.1)}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 font-bold text-lg">↑</span>
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
                  placeholder="Search users by name, email, or role..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-3">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium">
                  Filter
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center space-x-2">
                  <FaUserPlus size={14} />
                  <span>Add User</span>
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
                rows={filteredUsers}
                checkboxSelection
                columns={columns}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[30]} // Only show 30 as an option
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
          Showing {Math.min(filteredUsers.length, 30)} of {filteredUsers.length} users per page
        </div>
      </div>
    </div>
  );
}

export default Users;