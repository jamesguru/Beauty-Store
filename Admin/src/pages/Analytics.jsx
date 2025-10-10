import { useState, useEffect } from "react";
import { userRequest } from "../requestMethods";
import { 
  FaUsers, 
  FaEye, 
  FaDesktop, 
  FaMobile, 
  FaChartBar, 
  FaInfoCircle,
  FaUser,
  FaGlobe,
  FaMapMarkerAlt,
  FaLaptop,
  FaTablet,
  FaLink,
  FaClock,
  FaSearch,
  FaShoppingCart,
  FaSignInAlt,
  FaCreditCard,
  FaMousePointer
} from "react-icons/fa";
import { DataGrid } from '@mui/x-data-grid';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl,
  InputLabel,
  Chip,
  Tooltip,
  IconButton
} from '@mui/material';

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(7);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [rowCount, setRowCount] = useState(0);
  const [selectedRow, setSelectedRow] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange, paginationModel]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const skip = paginationModel.page * paginationModel.pageSize;
      
      const [summaryRes, activityRes] = await Promise.all([
        userRequest.get(`/analytics/summary?days=${timeRange}`),
        userRequest.get(`/analytics?limit=${paginationModel.pageSize}&skip=${skip}`)
      ]);

      setSummary(summaryRes.data.data);
      setRecentActivity(activityRes.data.data);
      setRowCount(activityRes.data.total || activityRes.data.data.length);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatActionType = (actionType) => {
    const types = {
      'page_view': 'Page View',
      'button_click': 'Button Click',
      'login': 'User Login',
      'purchase': 'Purchase',
      'add_to_cart': 'Add to Cart',
      'search': 'Search',
      'form_submit': 'Form Submit',
      'animation': 'Animation',
      'product_view': 'Product View',
      'bundle_view': 'Bundle View'
    };
    return types[actionType] || actionType;
  };

  const getActionIcon = (actionType) => {
    const icons = {
      'login': <FaSignInAlt size={12} />,
      'purchase': <FaCreditCard size={12} />,
      'page_view': <FaEye size={12} />,
      'add_to_cart': <FaShoppingCart size={12} />,
      'button_click': <FaMousePointer size={12} />,
      'search': <FaSearch size={12} />,
      'default': <FaChartBar size={12} />
    };
    return icons[actionType] || icons['default'];
  };

  const getActionColor = (actionType) => {
    const colors = {
      'login': 'success',
      'purchase': 'primary',
      'page_view': 'default',
      'add_to_cart': 'warning',
      'button_click': 'secondary',
      'search': 'info',
      'default': 'info'
    };
    return colors[actionType] || colors['default'];
  };

  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case 'desktop': return <FaDesktop size={14} />;
      case 'mobile': return <FaMobile size={14} />;
      case 'tablet': return <FaTablet size={14} />;
      default: return <FaLaptop size={14} />;
    }
  };

  const handleViewDetails = (row) => {
    setSelectedRow(row);
    setDetailModalOpen(true);
  };

  // DataGrid columns configuration
  const columns = [
    {
      field: 'user',
      headerName: 'User',
      width: 180,
      renderCell: (params) => (
        <Box>
          {params.row.userName || params.row.userEmail ? (
            <>
              <Typography variant="body2" fontWeight="medium">
                {params.row.userName || 'User'}
              </Typography>
              {params.row.userEmail && (
                <Typography variant="caption" color="textSecondary" noWrap>
                  {params.row.userEmail}
                </Typography>
              )}
            </>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Anonymous
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: 'actionType',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <Chip 
          label={formatActionType(params.value)}
          color={getActionColor(params.value)}
          size="small"
          variant="outlined"
          icon={getActionIcon(params.value)}
        />
      ),
    },
    {
      field: 'action',
      headerName: 'Action Details',
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value || 'No details'} arrow>
          <Typography variant="body2" noWrap>
            {params.value || '-'}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'pageUrl',
      headerName: 'Page',
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value} arrow>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FaLink size={12} color="#666" />
            <Typography variant="body2" noWrap>
              {params.value.split('/').pop() || 'Home'}
            </Typography>
          </Box>
        </Tooltip>
      ),
    },
    {
      field: 'device',
      headerName: 'Device & Browser',
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {getDeviceIcon(params.row.deviceType)}
          <Box>
            <Typography variant="body2" fontWeight="medium" textTransform="capitalize">
              {params.row.deviceType}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {params.row.browser !== 'unknown' ? params.row.browser : 'Unknown'}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FaMapMarkerAlt size={12} color="#666" />
          <Typography variant="body2">
            {params.row.country !== 'unknown' ? params.row.country : 'Unknown'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'referrer',
      headerName: 'Referrer',
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" noWrap>
          {params.value && params.value !== 'direct' ? 
            new URL(params.value).hostname.replace('www.', '') : 
            'Direct'
          }
        </Typography>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Time',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FaClock size={12} color="#666" />
          <Box>
            <Typography variant="body2">
              {new Date(params.value).toLocaleDateString()}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {new Date(params.value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Tooltip title="View details" arrow>
          <IconButton 
            size="small" 
            onClick={() => handleViewDetails(params.row)}
            color="primary"
          >
            <FaEye size={14} />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  // Prepare data for DataGrid
  const rows = recentActivity.map((activity, index) => ({
    id: activity._id || index,
    ...activity
  }));

  const StatsCard = ({ title, value, icon, color = "primary" }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              color: `${color}.main`,
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading && recentActivity.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Box className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Comprehensive user behavior and platform insights
          </Typography>
        </Box>

        {/* Time Range Selector */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => {
                setTimeRange(e.target.value);
                setPaginationModel({ ...paginationModel, page: 0 });
              }}
            >
              <MenuItem value={1}>Last 24 Hours</MenuItem>
              <MenuItem value={7}>Last 7 Days</MenuItem>
              <MenuItem value={30}>Last 30 Days</MenuItem>
              <MenuItem value={90}>Last 90 Days</MenuItem>
            </Select>
          </FormControl>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
            <FaInfoCircle size={16} />
            <Typography variant="caption">
              Click the eye icon to view full details
            </Typography>
          </Box>
        </Box>

        {/* Stats Cards */}
        {summary && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
              <StatsCard
                title="Total Sessions"
                value={summary.totalSessions || summary.totalPageViews}
                icon={<FaEye size={24} />}
                color="primary"
              />
              <StatsCard
                title="Unique Visitors"
                value={summary.uniqueVisitors}
                icon={<FaUsers size={24} />}
                color="success"
              />
              <StatsCard
                title="Desktop Users"
                value={summary.deviceBreakdown?.find(d => d._id === 'desktop')?.count || 0}
                icon={<FaDesktop size={24} />}
                color="secondary"
              />
              <StatsCard
                title="Mobile Users"
                value={summary.deviceBreakdown?.find(d => d._id === 'mobile')?.count || 0}
                icon={<FaMobile size={24} />}
                color="warning"
              />
            </Box>
          </Box>
        )}

        {/* DataGrid */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[5, 10, 25, 50]}
                rowCount={rowCount}
                paginationMode="server"
                disableRowSelectionOnClick
                sx={{
                  border: 0,
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: 'grey.50',
                    borderBottom: '2px solid',
                    borderColor: 'grey.200',
                  },
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid',
                    borderColor: 'grey.100',
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: 'primary.lightest',
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Detail Modal */}
        {selectedRow && detailModalOpen && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1300,
              p: 2,
            }}
            onClick={() => setDetailModalOpen(false)}
          >
            <Card
              sx={{
                maxWidth: 600,
                maxHeight: '90vh',
                overflow: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FaInfoCircle size={18} color="#1976d2" />
                  Activity Details
                </Typography>

                <Box sx={{ mt: 2, display: 'grid', gap: 3 }}>
                  {/* User Information */}
                  <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FaUser size={14} />
                      User Information
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      <Typography variant="body2"><strong>Name:</strong> {selectedRow.userName || 'Anonymous'}</Typography>
                      <Typography variant="body2"><strong>Email:</strong> {selectedRow.userEmail || 'Not provided'}</Typography>
                      <Typography variant="body2"><strong>User ID:</strong> {selectedRow.userId || 'Not logged in'}</Typography>
                    </Box>
                  </Box>

                  {/* Technical Details */}
                  <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FaLaptop size={14} />
                      Technical Details
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      <Typography variant="body2"><strong>Session ID:</strong> {selectedRow.sessionId}</Typography>
                      <Typography variant="body2"><strong>IP Address:</strong> {selectedRow.ipAddress}</Typography>
                      <Typography variant="body2"><strong>Screen:</strong> {selectedRow.screenResolution}</Typography>
                      <Typography variant="body2"><strong>Language:</strong> {selectedRow.language}</Typography>
                    </Box>
                  </Box>

                  {/* Device & Browser */}
                  <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FaDesktop size={14} />
                      Device & Browser
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      <Typography variant="body2"><strong>Device:</strong> {selectedRow.deviceType}</Typography>
                      <Typography variant="body2"><strong>Browser:</strong> {selectedRow.browser} ({selectedRow.os})</Typography>
                      <Typography variant="body2"><strong>User Agent:</strong> </Typography>
                      <Typography variant="caption" sx={{ wordBreak: 'break-all', display: 'block', mt: 0.5 }}>
                        {selectedRow.userAgent}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Location */}
                  <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FaGlobe size={14} />
                      Location
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      <Typography variant="body2"><strong>Country:</strong> {selectedRow.country !== 'unknown' ? selectedRow.country : 'Unknown'}</Typography>
                      <Typography variant="body2"><strong>City:</strong> {selectedRow.city !== 'unknown' ? selectedRow.city : 'Unknown'}</Typography>
                      <Typography variant="body2"><strong>Region:</strong> {selectedRow.region !== 'unknown' ? selectedRow.region : 'Unknown'}</Typography>
                      <Typography variant="body2"><strong>Timezone:</strong> {selectedRow.timezone !== 'unknown' ? selectedRow.timezone : 'Unknown'}</Typography>
                    </Box>
                  </Box>

                  {/* Navigation */}
                  <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FaLink size={14} />
                      Navigation
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      <Typography variant="body2"><strong>Page:</strong> {selectedRow.pageUrl}</Typography>
                      <Typography variant="body2"><strong>Title:</strong> {selectedRow.pageTitle}</Typography>
                      <Typography variant="body2"><strong>Referrer:</strong> {selectedRow.referrer}</Typography>
                    </Box>
                  </Box>

                  {/* Action Details */}
                  <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FaChartBar size={14} />
                      Action Details
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      <Typography variant="body2"><strong>Type:</strong> {formatActionType(selectedRow.actionType)}</Typography>
                      <Typography variant="body2"><strong>Action:</strong> {selectedRow.action}</Typography>
                      <Typography variant="body2"><strong>Time:</strong> {new Date(selectedRow.createdAt).toLocaleString()}</Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Analytics;