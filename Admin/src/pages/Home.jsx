import { LineChart } from "@mui/x-charts/LineChart";
import { useState, useEffect } from "react";
import { userRequest } from "../requestMethods";

const Home = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeOrders: 0,
    activeUsers: 0,
    totalRevenue: 0,
    totalLosses: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    days: [],
    revenue: []
  });

  // Function to convert UTC to EAT (UTC+3)
  const convertToEAT = (utcDateString) => {
    try {
      const date = new Date(utcDateString);
      return new Date(date.getTime() + (3 * 60 * 60 * 1000));
    } catch (error) {
      return new Date();
    }
  };

  // Format date for display (DD/MM/YYYY)
  const formatDate = (dateString) => {
    try {
      const date = convertToEAT(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      return 'Invalid Date';
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [
          productsRes,
          ordersRes,
          usersRes,
          paymentsRes
        ] = await Promise.all([
          userRequest.get("/products"),
          userRequest.get("/orders"),
          userRequest.get("/users"),
          userRequest.get("/payments")
        ]);

        // Calculate statistics
        const products = productsRes.data;
        const orders = ordersRes.data;
        const users = usersRes.data;
        const payments = paymentsRes.data;

        // Calculate total revenue from completed payments
        const completedPayments = payments.filter(payment => 
          payment.status === 'completed' || payment.payment_status === 'success'
        );
        const totalRevenue = completedPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

        // Calculate losses from failed payments
        const failedPayments = payments.filter(payment => 
          payment.status === 'failed' || payment.payment_status === 'failed'
        );
        const totalLosses = failedPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

        // Get active orders (status 0 or 1)
        const activeOrders = orders.filter(order => order.status === 0 || order.status === 1).length;

        // Get latest transactions (last 5 completed payments)
        const latestTransactions = completedPayments
          .slice(0, 5)
          .map(payment => ({
            id: payment._id,
            name: `${payment.first_name} ${payment.last_name}`,
            date: formatDate(payment.created_at),
            amount: `KES ${payment.amount?.toLocaleString() || '0'}`,
            status: "Completed",
            statusColor: "text-green-600 bg-green-50"
          }));

        // Prepare chart data (last 7 days revenue)
        const last7Days = getLast7DaysRevenue(completedPayments);

        setStats({
          totalProducts: products.length,
          activeOrders: activeOrders,
          activeUsers: users.length,
          totalRevenue: totalRevenue,
          totalLosses: totalLosses
        });

        setTransactions(latestTransactions);
        setChartData(last7Days);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Function to get last 7 days revenue data for chart
  const getLast7DaysRevenue = (payments) => {
    const days = [];
    const revenue = [];
    
    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const dayRevenue = payments
        .filter(payment => {
          const paymentDate = new Date(payment.created_at).toISOString().split('T')[0];
          return paymentDate === dateString;
        })
        .reduce((sum, payment) => sum + (payment.amount || 0), 0);
      
      days.push(date.getDate().toString());
      revenue.push(dayRevenue / 1000); // Convert to thousands for chart
    }
    
    return { days, revenue };
  };

  // Function to get initials from name
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT SECTION */}
        <div className="flex-1">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Products</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-2">{stats.totalProducts}</h3>
                  <p className="text-green-500 text-sm mt-2 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Active in store
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">📦</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Active Orders</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-2">{stats.activeOrders}</h3>
                  <p className="text-orange-500 text-sm mt-2 flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    Pending processing
                  </p>
                </div>
                <div className="h-12 w-12 bg-red-50 rounded-xl flex items-center justify-center">
                  <div className="h-8 w-8 bg-red-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">🛒</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Users</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-2">{stats.activeUsers}</h3>
                  <p className="text-purple-500 text-sm mt-2 flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Registered customers
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <div className="h-8 w-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">👥</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Latest Transactions</h3>
                <button 
                  className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
                  onClick={() => window.location.href = '/payments'}
                >
                  View All
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Customer</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Date</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Amount</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                              {getInitials(transaction.name)}
                            </div>
                            <span className="font-medium text-gray-800">{transaction.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{transaction.date}</td>
                        <td className="py-4 px-6 font-semibold text-gray-800">{transaction.amount}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${transaction.statusColor}`}>
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-8 px-6 text-center text-gray-500">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-full lg:w-96">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Financial Summary</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <h4 className="text-2xl font-bold text-gray-800">KES {stats.totalRevenue.toLocaleString()}</h4>
                </div>
                <div className="h-12 w-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">💰</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100">
                <div>
                  <p className="text-sm text-gray-600">Failed Payments</p>
                  <h4 className="text-2xl font-bold text-gray-800">KES {stats.totalLosses.toLocaleString()}</h4>
                </div>
                <div className="h-12 w-12 bg-red-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">📉</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Revenue Trend (Last 7 Days)</h3>
            {chartData.days.length > 0 ? (
              <LineChart
                xAxis={[{ 
                  data: chartData.days,
                  label: "Days",
                  scaleType: "point"
                }]}
                series={[
                  {
                    data: chartData.revenue,
                    label: "Revenue (K KES)",
                    color: "#3B82F6",
                    area: true,
                    showMark: true,
                  },
                ]}
                height={300}
                margin={{ left: 40, right: 20, top: 20, bottom: 40 }}
                grid={{ vertical: true, horizontal: true }}
                sx={{
                  ".MuiLineElement-root": {
                    strokeWidth: 3,
                  },
                  ".MuiAreaElement-root": {
                    fill: "url(#gradient)",
                  },
                }}
                slotProps={{
                  legend: {
                    hidden: true,
                  },
                }}
              >
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </LineChart>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No revenue data available for the last 7 days
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;