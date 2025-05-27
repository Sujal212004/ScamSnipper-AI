import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import { motion } from 'framer-motion';
import { MapPin, AlertTriangle, ChevronDown, Calendar, Search } from 'lucide-react';
import Card from './common/Card';
import Button from './common/Button';
import { useScamReports } from '../contexts/ScamReportsContext';
import { DEFAULT_MAP_CENTER, DEFAULT_ZOOM, SCAM_TYPES } from '../utils/constants';
import { getRandomCoordinatesNear, formatDate, getStatusFromScore } from '../utils/helpers';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom hook for creating a heatmap layer
const useHeatmap = (points) => {
  const map = useMap();
  
  useEffect(() => {
    if (!points || points.length === 0) return;
    
    console.log('Creating heatmap with points:', points);
    
    // Check if heatmap layer exists
    let heatmapLayer = map._heatmap;
    
    // Remove existing heatmap layer if it exists
    if (heatmapLayer) {
      map.removeLayer(heatmapLayer);
    }
    
    try {
      // Create new heatmap layer
      heatmapLayer = L.heatLayer(points, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: {
          0.0: 'green',
          0.5: 'yellow',
          1.0: 'red'
        }
      }).addTo(map);
      
      // Store heatmap layer reference
      map._heatmap = heatmapLayer;
      
      // Center map on points if there are any
      if (points.length > 0) {
        const bounds = L.latLngBounds(points);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    } catch (error) {
      console.error('Error creating heatmap:', error);
    }
    
    return () => {
      if (map._heatmap) {
        map.removeLayer(map._heatmap);
        map._heatmap = null;
      }
    };
  }, [map, points]);
  
  return null;
};

// Heatmap component
const HeatmapLayer = ({ reports }) => {
  // Convert reports to heatmap points
  const points = reports.map(report => {
    if (!report.location || typeof report.location.lat !== 'number' || typeof report.location.lng !== 'number') {
      console.warn('Invalid report location:', report);
      return null;
    }
    return [
      report.location.lat,
      report.location.lng,
      // Intensity based on safety score (inverted - higher risk = higher intensity)
      report.safetyScore ? (100 - report.safetyScore) / 100 * 0.8 + 0.2 : 0.5
    ];
  }).filter(point => point !== null); // Remove any invalid points
  
  console.log('Heatmap points:', points);
  
  useHeatmap(points);
  
  return null;
};

const Heatmap = () => {
  const { reports, addReport } = useScamReports();
  const [selectedReport, setSelectedReport] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    date: 'all',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [demoReports, setDemoReports] = useState([]);
  
  // Generate demo reports if no real reports exist
  useEffect(() => {
    if (reports.length === 0) {
      const types = Object.values(SCAM_TYPES);
      const now = new Date();
      
      // Generate 20 random reports
      const generatedReports = Array(20).fill().map((_, i) => {
        const daysAgo = Math.floor(Math.random() * 30);
        const reportDate = new Date(now);
        reportDate.setDate(reportDate.getDate() - daysAgo);
        
        const safetyScore = Math.floor(Math.random() * 100);
        const coordinates = getRandomCoordinatesNear(DEFAULT_MAP_CENTER[0], DEFAULT_MAP_CENTER[1], 10);
        
        return {
          id: `demo-${i}`,
          type: types[Math.floor(Math.random() * types.length)],
          timestamp: reportDate.toISOString(),
          location: {
            lat: coordinates[0],
            lng: coordinates[1],
            city: 'New York'
          },
          safetyScore,
          source: `demo-source-${i}`,
          details: {
            scannedUrl: `https://example-${i}.com`,
            message: `Demo scam report ${i}`
          }
        };
      });
      
      setDemoReports(generatedReports);
      
      // Add demo reports to context
      generatedReports.forEach(report => {
        addReport(report);
      });
    }
  }, [reports.length, addReport]);
  
  // Log reports for debugging
  useEffect(() => {
    console.log('Current reports:', reports);
  }, [reports]);
  
  // Filtered reports based on criteria
  const filteredReports = reports.filter(report => {
    // Filter by type
    if (filters.type !== 'all' && report.type !== filters.type) {
      return false;
    }
    
    // Filter by date
    if (filters.date !== 'all') {
      const reportDate = new Date(report.timestamp);
      const now = new Date();
      
      if (filters.date === 'today') {
        const today = new Date(now.setHours(0, 0, 0, 0));
        if (reportDate < today) return false;
      } else if (filters.date === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        if (reportDate < weekAgo) return false;
      } else if (filters.date === 'month') {
        const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        if (reportDate < monthAgo) return false;
      }
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const sourceMatch = report.source && report.source.toLowerCase().includes(searchTerm);
      const typeMatch = report.type && report.type.toLowerCase().includes(searchTerm);
      const cityMatch = report.location && report.location.city && report.location.city.toLowerCase().includes(searchTerm);
      
      if (!sourceMatch && !typeMatch && !cityMatch) return false;
    }
    
    return true;
  });
  
  // Handle report selection
  const handleReportSelect = (report) => {
    setSelectedReport(report);
  };
  
  // Toggle filters display
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Update filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Scam Report Heatmap</h1>
        <p className="text-gray-600 mb-8">
          Visualize scam reports in your area to identify high-risk locations and trends.
        </p>
      </motion.div>
      
      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <div className="mb-4 sm:mb-0">
            <h3 className="text-lg font-medium text-gray-900">
              {filteredReports.length} {filters.type !== 'all' ? filters.type : ''} Reports
              {filters.date !== 'all' && ` in the ${filters.date === 'today' ? 'last 24 hours' : filters.date === 'week' ? 'last week' : 'last month'}`}
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFilters}
            icon={<ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
        
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-4 border-t border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Type filter */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Scam Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Types</option>
                  {Object.values(SCAM_TYPES).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              {/* Date filter */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Time Period
                </label>
                <select
                  id="date"
                  name="date"
                  value={filters.date}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Last 24 Hours</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>
              
              {/* Search filter */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search by location or type..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="h-[600px]">
              <MapContainer center={DEFAULT_MAP_CENTER} zoom={DEFAULT_ZOOM} className="h-full w-full rounded-lg">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <HeatmapLayer reports={filteredReports} />
                
                {/* Markers for each report */}
                {filteredReports.map(report => (
                  <Marker
                    key={report.id}
                    position={[report.location.lat, report.location.lng]}
                    eventHandlers={{
                      click: () => handleReportSelect(report),
                    }}
                  >
                    <Popup>
                      <div className="text-sm">
                        <p className="font-semibold">{report.type} Report</p>
                        <p className="text-gray-600">{formatDate(report.timestamp)}</p>
                        {report.source && (
                          <p className="mt-1">Source: {report.source}</p>
                        )}
                        <button
                          onClick={() => handleReportSelect(report)}
                          className="mt-2 text-primary-600 hover:text-primary-800 font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </Card>
        </div>
        
        {/* Report details or list */}
        <div>
          {selectedReport ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                title="Report Details"
                icon={<AlertTriangle className="h-5 w-5 text-warning-500" />}
                className="h-full"
              >
                <div className="space-y-4">
                  {/* Report type and date */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Type</span>
                    <span className="text-sm font-medium">{selectedReport.type}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Reported On</span>
                    <span className="text-sm font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      {formatDate(selectedReport.timestamp)}
                    </span>
                  </div>
                  
                  {/* Location */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Location</span>
                    <span className="text-sm font-medium flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                      {selectedReport.location.city || 'Unknown'}
                    </span>
                  </div>
                  
                  {/* Safety score */}
                  {selectedReport.safetyScore !== undefined && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-500">Safety Score</span>
                        <span className="text-sm font-medium">{selectedReport.safetyScore}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            selectedReport.safetyScore >= 80 ? 'bg-success-500' :
                            selectedReport.safetyScore >= 50 ? 'bg-warning-500' : 'bg-danger-500'
                          }`} 
                          style={{ width: `${selectedReport.safetyScore}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Status */}
                  {selectedReport.safetyScore !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Status</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedReport.safetyScore >= 80 ? 'bg-success-50 text-success-700' :
                        selectedReport.safetyScore >= 50 ? 'bg-warning-50 text-warning-700' : 'bg-danger-50 text-danger-700'
                      }`}>
                        {getStatusFromScore(selectedReport.safetyScore).label}
                      </span>
                    </div>
                  )}
                  
                  {/* Source */}
                  {selectedReport.source && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Source</span>
                      <span className="text-sm font-medium text-gray-900 max-w-[200px] truncate">
                        {selectedReport.source}
                      </span>
                    </div>
                  )}
                  
                  {/* Details */}
                  {selectedReport.details && selectedReport.details.message && (
                    <div className="pt-4 mt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Additional Details</h4>
                      <p className="text-sm text-gray-600">
                        {selectedReport.details.message}
                      </p>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedReport(null)}
                      fullWidth
                    >
                      Back to Reports
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                title="Recent Reports"
                icon={<AlertTriangle className="h-5 w-5 text-warning-500" />}
                className="h-full"
              >
                {filteredReports.length > 0 ? (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {filteredReports.slice(0, 10).map(report => {
                      const status = getStatusFromScore(report.safetyScore || 0);
                      
                      return (
                        <div
                          key={report.id}
                          className="p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleReportSelect(report)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{report.type}</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-${status.color}-50 text-${status.color}-700`}>
                              {status.label}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {report.location.city || 'Unknown'}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(report.timestamp)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    
                    {filteredReports.length > 10 && (
                      <div className="text-center pt-2 text-sm text-gray-500">
                        Showing 10 of {filteredReports.length} reports
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No Reports Found</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Try adjusting your filters to see more results.
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Heatmap;