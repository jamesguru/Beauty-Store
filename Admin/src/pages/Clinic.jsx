import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent,
  Chip, Card, CardMedia, CardContent, Grid, Paper, Alert
} from '@mui/material';
import { 
  FaUser, FaImage, FaCalendar, FaPhone, FaEnvelope, 
  FaEye, FaTrash, FaStethoscope, FaClipboardList,
  FaSkull, FaAllergies, FaHeart, FaGlobeAmericas,
  FaBrain, FaUtensils, FaNotesMedical
} from 'react-icons/fa';
import { userRequest } from '../requestMethods';

const ClinicAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await userRequest.get("/clinic");
      if (response.data.success) {
        setAssessments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { 
      field: 'name', 
      headerName: 'Client', 
      width: 180,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
            <FaUser className="text-white text-sm" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{params.value}</div>
            <div className="text-xs text-gray-500">{params.row.email}</div>
          </div>
        </div>
      )
    },
    { 
      field: 'phone', 
      headerName: 'Contact', 
      width: 140,
      renderCell: (params) => (
        <div className="flex items-center gap-2 text-gray-600">
          <FaPhone size={12} />
          <span className="text-sm">{params.value}</span>
        </div>
      )
    },
    { 
      field: 'skinType', 
      headerName: 'Skin Type', 
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value || 'Not specified'}
          size="small"
          variant="outlined"
          className="border-blue-200 text-blue-700"
        />
      )
    },
    { 
      field: 'concerns', 
      headerName: 'Concerns', 
      width: 200,
      renderCell: (params) => (
        <div className="flex flex-wrap gap-1">
          {params.value?.slice(0, 2).map((concern, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-pink-100 text-pink-800 rounded-full text-xs"
            >
              {concern}
            </span>
          ))}
          {params.value?.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              +{params.value.length - 2}
            </span>
          )}
        </div>
      )
    },
    { 
      field: 'images', 
      headerName: 'Photos', 
      width: 100,
      renderCell: (params) => (
        <div className="flex items-center gap-2 text-gray-600">
          <FaImage size={14} />
          <span className="font-medium">{params.value?.length || 0}</span>
        </div>
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 140,
      renderCell: (params) => {
        const statusConfig = {
          pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '⏳' },
          under_review: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '🔍' },
          completed: { color: 'bg-green-100 text-green-800 border-green-200', icon: '✅' },
          cancelled: { color: 'bg-red-100 text-red-800 border-red-200', icon: '❌' }
        };
        
        const config = statusConfig[params.value] || statusConfig.pending;
        
        return (
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${config.color}`}>
            <span>{config.icon}</span>
            <span>{params.value.replace('_', ' ').toUpperCase()}</span>
          </div>
        );
      }
    },
    { 
      field: 'createdAt', 
      headerName: 'Submitted', 
      width: 120,
      renderCell: (params) => (
        <div className="flex items-center gap-2 text-gray-600">
          <FaCalendar size={12} />
          <span className="text-sm">{new Date(params.value).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleViewDetails(params.row)}
          className="flex items-center gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
        >
          <FaEye size={12} />
          View
        </Button>
      )
    }
  ];

  const handleViewDetails = (assessment) => {
    setSelectedAssessment(assessment);
    setOpenDialog(true);
  };

  const handleStatusUpdate = async (assessmentId, newStatus) => {
    setStatusUpdateLoading(true);
    try {
      const response = await userRequest.put(`/clinic/${assessmentId}`, { 
        status: newStatus 
      });

      if (response.data.success) {
        fetchAssessments();
        setSelectedAssessment(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const handleDeleteAssessment = async (assessmentId) => {
    if (window.confirm('Are you sure you want to delete this assessment? This action cannot be undone.')) {
      try {
        const response = await userRequest.delete(`/clinic/${assessmentId}`);
        if (response.data.success) {
          fetchAssessments();
          setOpenDialog(false);
        }
      } catch (error) {
        console.error('Error deleting assessment:', error);
      }
    }
  };

  const StatusButton = ({ status, currentStatus, onClick }) => {
    const isActive = status === currentStatus;
    const statusStyles = {
      pending: isActive ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-700 border-yellow-300',
      under_review: isActive ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 border-blue-300',
      completed: isActive ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700 border-green-300',
      cancelled: isActive ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700 border-red-300'
    };

    return (
      <Button
        variant={isActive ? "contained" : "outlined"}
        onClick={onClick}
        disabled={statusUpdateLoading}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${statusStyles[status]}`}
      >
        {status.replace('_', ' ').toUpperCase()}
      </Button>
    );
  };

  const InfoCard = ({ icon, title, value, className = "" }) => (
    <div className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg ${className}`}>
      <div className="text-gray-600">{icon}</div>
      <div>
        <div className="text-sm text-gray-600">{title}</div>
        <div className="font-medium text-gray-900">{value || 'Not provided'}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
              <FaStethoscope className="text-white text-lg" />
            </div>
            <Typography variant="h4" className="font-bold text-gray-900">
              Skin Clinic Assessments
            </Typography>
          </div>
          <Typography className="text-gray-600">
            Manage and review client skin assessment submissions
          </Typography>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{assessments.length}</div>
                <div className="text-gray-600">Total Assessments</div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaClipboardList className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {assessments.filter(a => a.status === 'pending').length}
                </div>
                <div className="text-gray-600">Pending Review</div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-xl">⏳</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {assessments.filter(a => a.status === 'under_review').length}
                </div>
                <div className="text-gray-600">In Progress</div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">🔍</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {assessments.filter(a => a.status === 'completed').length}
                </div>
                <div className="text-gray-600">Completed</div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Grid */}
        <Paper className="rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <Typography variant="h6" className="font-semibold text-gray-800">
              Assessment Submissions
            </Typography>
            <Typography className="text-sm text-gray-600 mt-1">
              {assessments.length} total submission(s) - Click view to see full details
            </Typography>
          </div>
          
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={assessments}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              loading={loading}
              disableSelectionOnClick
              getRowId={(row) => row._id}
              className="border-0"
              sx={{
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #f3f4f6',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f9fafb',
                  borderBottom: '2px solid #e5e7eb',
                },
              }}
            />
          </Box>
        </Paper>

        {/* Assessment Details Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            className: "rounded-2xl"
          }}
        >
          <DialogTitle className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                  <FaUser className="text-white" />
                </div>
                <div>
                  <Typography variant="h6" className="font-bold text-gray-900">
                    {selectedAssessment?.name}
                  </Typography>
                  <Typography className="text-sm text-gray-600">
                    Skin Assessment Details
                  </Typography>
                </div>
              </div>
              <Button 
                color="error" 
                variant="outlined" 
                size="small"
                startIcon={<FaTrash />}
                onClick={() => handleDeleteAssessment(selectedAssessment?._id)}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Delete
              </Button>
            </div>
          </DialogTitle>
          
          <DialogContent className="p-6 bg-gray-50">
            {selectedAssessment && (
              <Grid container spacing={3}>
                {/* Personal Information */}
                <Grid item xs={12} md={6}>
                  <Card className="rounded-xl shadow-sm border border-gray-200">
                    <CardContent className="p-6">
                      <Typography variant="h6" className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FaUser className="text-pink-500" />
                        Personal Information
                      </Typography>
                      <div className="space-y-3">
                        <InfoCard icon="👤" title="Full Name" value={selectedAssessment.name} />
                        <InfoCard icon="📧" title="Email" value={selectedAssessment.email} />
                        <InfoCard icon="📱" title="Phone" value={selectedAssessment.phone} />
                        <InfoCard icon="🎂" title="Age" value={selectedAssessment.age} />
                        <InfoCard icon="💆" title="Skin Type" value={selectedAssessment.skinType} />
                      </div>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Assessment Details */}
                <Grid item xs={12} md={6}>
                  <Card className="rounded-xl shadow-sm border border-gray-200">
                    <CardContent className="p-6">
                      <Typography variant="h6" className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FaClipboardList className="text-blue-500" />
                        Assessment Details
                      </Typography>
                      <div className="space-y-3">
                        <InfoCard icon={<FaGlobeAmericas />} title="Environment" value={selectedAssessment.environment} />
                        <InfoCard icon={<FaBrain />} title="Stress Level" value={selectedAssessment.stressLevel} />
                        <InfoCard icon={<FaUtensils />} title="Diet" value={selectedAssessment.diet} />
                        <InfoCard icon={<FaAllergies />} title="Allergies" value={selectedAssessment.allergies || 'None reported'} />
                        <InfoCard icon={<FaHeart />} title="Skin Goals" value={selectedAssessment.goals} />
                      </div>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Skin Concerns */}
                <Grid item xs={12}>
                  <Card className="rounded-xl shadow-sm border border-gray-200">
                    <CardContent className="p-6">
                      <Typography variant="h6" className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FaSkull className="text-purple-500" />
                        Skin Concerns ({selectedAssessment.concerns?.length || 0})
                      </Typography>
                      <div className="flex flex-wrap gap-2">
                        {selectedAssessment.concerns?.map((concern, index) => (
                          <Chip 
                            key={index} 
                            label={concern} 
                            variant="outlined"
                            className="border-purple-200 text-purple-700 bg-purple-50"
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Current Routine */}
                {selectedAssessment.currentRoutine && (
                  <Grid item xs={12}>
                    <Card className="rounded-xl shadow-sm border border-gray-200">
                      <CardContent className="p-6">
                        <Typography variant="h6" className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <FaNotesMedical className="text-green-500" />
                          Current Skincare Routine
                        </Typography>
                        <Typography className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                          {selectedAssessment.currentRoutine}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Uploaded Images */}
                <Grid item xs={12}>
                  <Card className="rounded-xl shadow-sm border border-gray-200">
                    <CardContent className="p-6">
                      <Typography variant="h6" className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FaImage className="text-orange-500" />
                        Uploaded Skin Photos ({selectedAssessment.images?.length || 0})
                      </Typography>
                      <Grid container spacing={2}>
                        {selectedAssessment.images?.map((image, index) => (
                          <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                              <CardMedia
                                component="img"
                                height="200"
                                image={image}
                                alt={`Skin view ${index + 1}`}
                                className="object-cover hover:scale-105 transition-transform duration-200"
                              />
                              <CardContent className="p-3 bg-gray-50">
                                <Typography variant="body2" align="center" className="font-medium text-gray-700">
                                  View {index + 1}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Status Management */}
                <Grid item xs={12}>
                  <Card className="rounded-xl shadow-sm border border-gray-200">
                    <CardContent className="p-6">
                      <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
                        Assessment Status Management
                      </Typography>
                      <Alert severity="info" className="mb-4 rounded-lg">
                        Update the status to track the assessment progress through the review pipeline.
                      </Alert>
                      <div className="flex flex-wrap gap-3">
                        {['pending', 'under_review', 'completed', 'cancelled'].map((status) => (
                          <StatusButton
                            key={status}
                            status={status}
                            currentStatus={selectedAssessment.status}
                            onClick={() => handleStatusUpdate(selectedAssessment._id, status)}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Expert Notes & Recommendations */}
                {(selectedAssessment.expertNotes || selectedAssessment.recommendations?.length > 0) && (
                  <Grid item xs={12}>
                    <Card className="rounded-xl shadow-sm border border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <CardContent className="p-6">
                        <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
                          Expert Analysis & Recommendations
                        </Typography>
                        
                        {selectedAssessment.expertNotes && (
                          <div className="mb-6">
                            <Typography variant="subtitle1" className="font-semibold text-gray-700 mb-2">
                              Expert Notes:
                            </Typography>
                            <Typography className="text-gray-600 bg-white p-4 rounded-lg border">
                              {selectedAssessment.expertNotes}
                            </Typography>
                          </div>
                        )}

                        {selectedAssessment.recommendations?.length > 0 && (
                          <div>
                            <Typography variant="subtitle1" className="font-semibold text-gray-700 mb-3">
                              Product Recommendations:
                            </Typography>
                            <Grid container spacing={2}>
                              {selectedAssessment.recommendations.map((rec, index) => (
                                <Grid item xs={12} md={6} key={index}>
                                  <Card className="bg-white border border-gray-200">
                                    <CardContent className="p-4">
                                      <Typography variant="subtitle1" className="font-semibold text-gray-900">
                                        {rec.product}
                                      </Typography>
                                      <Chip 
                                        label={rec.category} 
                                        size="small" 
                                        className="bg-blue-100 text-blue-800 mb-2"
                                      />
                                      <Typography variant="body2" className="text-gray-600 mb-2">
                                        {rec.reason}
                                      </Typography>
                                      <Typography variant="caption" className="text-gray-500">
                                        Key Ingredients: {rec.keyIngredients?.join(', ')}
                                      </Typography>
                                    </CardContent>
                                  </Card>
                                </Grid>
                              ))}
                            </Grid>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ClinicAssessments;