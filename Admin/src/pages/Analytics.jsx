import { useState, useEffect } from "react";
import { userRequest } from "../requestMethods";
import { FaUsers, FaEye, FaDesktop, FaMobile, FaChartBar, FaCalendar } from "react-icons/fa";

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(7);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [summaryRes, activityRes] = await Promise.all([
        userRequest.get(`/analytics/summary?days=${timeRange}`),
        userRequest.get('/analytics?limit=10')
      ]);

      setSummary(summaryRes.data.data);
      setRecentActivity(activityRes.data.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">User behavior and platform insights</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value={1}>Last 24 Hours</option>
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
          </select>
        </div>

        {/* Stats Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Page Views</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{summary.totalPageViews}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaEye className="text-blue-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{summary.uniqueVisitors}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaUsers className="text-green-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Desktop Users</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {summary.deviceBreakdown.find(d => d._id === 'desktop')?.count || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaDesktop className="text-purple-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mobile Users</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {summary.deviceBreakdown.find(d => d._id === 'mobile')?.count || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FaMobile className="text-orange-600 text-xl" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">Recent User Activity</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">User</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Action</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Page</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Device</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Location</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentActivity.map((activity) => (
                  <tr key={activity._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      {activity.userName ? (
                        <div>
                          <div className="font-medium text-gray-900">{activity.userName}</div>
                          <div className="text-sm text-gray-500">{activity.userEmail}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Anonymous</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        activity.actionType === 'login' ? 'bg-green-100 text-green-800' :
                        activity.actionType === 'purchase' ? 'bg-blue-100 text-blue-800' :
                        activity.actionType === 'page_view' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {activity.actionType}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 max-w-xs truncate">
                      {activity.pageUrl}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {activity.deviceType === 'mobile' && <FaMobile className="text-gray-400" />}
                        {activity.deviceType === 'desktop' && <FaDesktop className="text-gray-400" />}
                        {activity.deviceType === 'tablet' && <FaMobile className="text-gray-400" />}
                        <span className="text-sm text-gray-600 capitalize">{activity.deviceType}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {activity.country && activity.country !== 'unknown' ? activity.country : 'Unknown'}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;