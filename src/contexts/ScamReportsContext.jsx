import React, { createContext, useContext, useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { generateId } from '../utils/helpers';
import { DEFAULT_MAP_CENTER } from '../utils/constants';

// Create context
const ScamReportsContext = createContext();

// Provider component
export const ScamReportsProvider = ({ children }) => {
  // Use localStorage to persist reports
  const [reports, setReports] = useLocalStorage('scamsniper_reports', []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add a new scam report
  const addReport = async (reportData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Generate new report with ID and timestamp
      const newReport = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        ...reportData,
        // Set default location if not provided
        location: reportData.location || {
          lat: DEFAULT_MAP_CENTER[0] + (Math.random() * 0.02 - 0.01),
          lng: DEFAULT_MAP_CENTER[1] + (Math.random() * 0.02 - 0.01)
        }
      };
      
      // Add to reports array
      setReports(prevReports => [...prevReports, newReport]);
      
      return newReport;
    } catch (err) {
      setError('Failed to add report: ' + err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Get a specific report by ID
  const getReportById = (reportId) => {
    return reports.find(report => report.id === reportId);
  };

  // Get reports by type
  const getReportsByType = (type) => {
    return reports.filter(report => report.type === type);
  };

  // Get reports by date range
  const getReportsByDateRange = (startDate, endDate) => {
    return reports.filter(report => {
      const reportDate = new Date(report.timestamp);
      return reportDate >= startDate && reportDate <= endDate;
    });
  };

  // Update an existing report
  const updateReport = (reportId, updates) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedReports = reports.map(report => 
        report.id === reportId ? { ...report, ...updates } : report
      );
      
      setReports(updatedReports);
      return getReportById(reportId);
    } catch (err) {
      setError('Failed to update report: ' + err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a report
  const deleteReport = (reportId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const filteredReports = reports.filter(report => report.id !== reportId);
      setReports(filteredReports);
      return true;
    } catch (err) {
      setError('Failed to delete report: ' + err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get report locations for heatmap
  const getReportLocations = () => {
    return reports.map(report => [
      report.location.lat,
      report.location.lng,
      report.safetyScore ? (100 - report.safetyScore) / 100 : 0.5 // Intensity based on risk
    ]);
  };

  // Context value
  const value = {
    reports,
    isLoading,
    error,
    addReport,
    getReportById,
    getReportsByType,
    getReportsByDateRange,
    updateReport,
    deleteReport,
    getReportLocations,
    totalReports: reports.length
  };

  return (
    <ScamReportsContext.Provider value={value}>
      {children}
    </ScamReportsContext.Provider>
  );
};

// Custom hook to use scam reports context
export const useScamReports = () => {
  return useContext(ScamReportsContext);
};

export default ScamReportsContext;