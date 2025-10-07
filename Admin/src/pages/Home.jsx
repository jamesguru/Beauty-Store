import { LineChart } from "@mui/x-charts/LineChart";

const Home = () => {
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
                  <h3 className="text-2xl font-bold text-gray-800 mt-2">699</h3>
                  <p className="text-green-500 text-sm mt-2 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    +12% from last month
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
                  <h3 className="text-2xl font-bold text-gray-800 mt-2">100</h3>
                  <p className="text-orange-500 text-sm mt-2 flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    +5% from last week
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
                  <p className="text-gray-500 text-sm font-medium">Active Users</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-2">200</h3>
                  <p className="text-purple-500 text-sm mt-2 flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    +8% from yesterday
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
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
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
                  {[
                    { name: "John Doe", date: "2024-01-15", amount: "$200", status: "Approved", statusColor: "text-green-600 bg-green-50" },
                    { name: "Sarah Smith", date: "2024-01-14", amount: "$350", status: "Pending", statusColor: "text-orange-600 bg-orange-50" },
                    { name: "Mike Johnson", date: "2024-01-14", amount: "$150", status: "Declined", statusColor: "text-red-600 bg-red-50" },
                    { name: "Emily Davis", date: "2024-01-13", amount: "$480", status: "Approved", statusColor: "text-green-600 bg-green-50" },
                    { name: "Alex Wilson", date: "2024-01-13", amount: "$275", status: "Approved", statusColor: "text-green-600 bg-green-50" }
                  ].map((transaction, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                            {transaction.name.split(' ').map(n => n[0]).join('')}
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
                  ))}
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
                  <h4 className="text-2xl font-bold text-gray-800">$200,000</h4>
                </div>
                <div className="h-12 w-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">💰</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100">
                <div>
                  <p className="text-sm text-gray-600">Total Losses</p>
                  <h4 className="text-2xl font-bold text-gray-800">$0</h4>
                </div>
                <div className="h-12 w-12 bg-red-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">📉</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Revenue Trend</h3>
            <LineChart
              xAxis={[{ 
                data: [1, 2, 3, 5, 8, 10],
                label: "Days",
                scaleType: "point"
              }]}
              series={[
                {
                  data: [2, 5.5, 2, 8.5, 1.5, 5],
                  label: "Revenue (k$)",
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;