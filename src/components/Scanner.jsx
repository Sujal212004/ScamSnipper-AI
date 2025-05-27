import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import useSound from 'use-sound';
import { Search, AlertTriangle, Check, ExternalLink, Shield, Info } from 'lucide-react';
import Card from './common/Card';
import Button from './common/Button';
import { verifyUrl, checkPhishTank } from '../services/api';
import { useScamReports } from '../contexts/ScamReportsContext';
import { useAuth } from '../contexts/AuthContext';
import { addUserPoints, awardBadge } from '../services/auth';
import { calculateSafetyScore, getStatusFromScore } from '../utils/helpers';

// Alert sound URL
const ALERT_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

const Scanner = () => {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const { addReport } = useScamReports();
  const { currentUser, updateProfile } = useAuth();
  
  // Initialize sound hook
  const [playAlert] = useSound(ALERT_SOUND_URL);
  
  // Clear error when URL changes
  useEffect(() => {
    if (errorMessage) setErrorMessage('');
  }, [url]);
  
  // Handle scan
  const handleScan = async (e) => {
    e.preventDefault();
    
    // Validate URL
    if (!url) {
      setErrorMessage('Please enter a URL to scan');
      return;
    }
    
    // Add protocol if missing
    let scanUrl = url;
    if (!scanUrl.startsWith('http://') && !scanUrl.startsWith('https://')) {
      scanUrl = 'https://' + scanUrl;
    }
    
    // Start scanning
    setScanning(true);
    setScanResults(null);
    setErrorMessage('');
    
    try {
      // First scan with our service
      const results = await verifyUrl(scanUrl);
      
      // Then check PhishTank
      const phishTankResults = await checkPhishTank(scanUrl);
      
      // Calculate safety score with enhanced accuracy
      const safetyScore = calculateSafetyScore(
        scanUrl,
        results.message,
        phishTankResults.in_database ? 0 : 100
      );
      
      // Play alert sound if risk is high
      if (safetyScore < 50) {
        playAlert();
      }
      
      // Combine results
      const combinedResults = {
        ...results,
        phishTank: phishTankResults,
        safetyScore,
        scannedUrl: scanUrl,
        timestamp: new Date().toISOString()
      };
      
      // Set results
      setScanResults(combinedResults);
      
      // Add to reports if suspicious
      if (safetyScore < 70) {
        await addReport({
          type: 'URL Scan',
          source: scanUrl,
          safetyScore,
          details: combinedResults,
          location: { lat: 40.7128, lng: -74.0060, city: 'New York' }
        });
        
        // Show warning toast
        toast.warning('Suspicious URL detected! Exercise caution.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      
      // Award points and badges
      if (currentUser) {
        // Update scan count
        const updatedUser = {
          ...currentUser,
          scansCompleted: (currentUser.scansCompleted || 0) + 1
        };
        
        // Award points
        await addUserPoints(10, 'Completed URL scan');
        
        // Award badge for first scan if not already awarded
        if (updatedUser.scansCompleted === 1) {
          await awardBadge('first_scan');
          toast.success('🎉 New badge earned: First Scan!');
        }
        
        // Update user profile
        await updateProfile(updatedUser);
      }
      
    } catch (error) {
      console.error('Scan error:', error);
      setErrorMessage('Failed to scan URL. Please try again.');
    } finally {
      setScanning(false);
    }
  };
  
  // Get status based on safety score
  const getStatusInfo = (score) => {
    return getStatusFromScore(score);
  };
  
  // Status info for display
  const statusInfo = scanResults ? getStatusInfo(scanResults.safetyScore) : null;
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">URL Scanner</h1>
        <p className="text-gray-600 mb-8">
          Scan any URL to check for phishing attempts, malware, and other security threats.
        </p>
      </motion.div>
      
      {/* Scan Form */}
      <Card className="mb-8">
        <form onSubmit={handleScan}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                Enter URL to Scan
              </label>
              <input
                type="text"
                id="url"
                name="url"
                placeholder="example.com or https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              {errorMessage && (
                <p className="mt-1 text-sm text-danger-600">{errorMessage}</p>
              )}
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                disabled={scanning}
                loading={scanning}
                className="whitespace-nowrap"
              >
                {scanning ? 'Scanning...' : 'Scan URL'}
                {!scanning && <Search className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>
        </form>
      </Card>
      
      {/* Scan Results */}
      {scanResults && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            title="Scan Results"
            subtitle={scanResults.scannedUrl}
            className={`border-${statusInfo.color}-200 mb-8`}
          >
            {/* Overall Status */}
            <div className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {statusInfo.color === 'success' ? (
                    <div className="rounded-full p-2 bg-success-100">
                      <Check className="h-6 w-6 text-success-600" />
                    </div>
                  ) : statusInfo.color === 'warning' ? (
                    <div className="rounded-full p-2 bg-warning-100">
                      <AlertTriangle className="h-6 w-6 text-warning-600" />
                    </div>
                  ) : (
                    <div className="rounded-full p-2 bg-danger-100">
                      <AlertTriangle className="h-6 w-6 text-danger-600" />
                    </div>
                  )}
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {statusInfo.label} URL
                    </h3>
                    <p className="text-sm text-gray-500">
                      This URL has been {statusInfo.color === 'success' ? 'verified as safe' : statusInfo.color === 'warning' ? 'flagged as suspicious' : 'detected as dangerous'}
                    </p>
                  </div>
                </div>
                <div>
                  <div className={`text-${statusInfo.color}-700 text-2xl font-bold`}>
                    {scanResults.safetyScore}/100
                  </div>
                  <div className="text-sm text-gray-500 text-center">Safety Score</div>
                </div>
              </div>
            </div>
            
            {/* Risk Factors */}
            <h3 className="text-lg font-medium text-gray-900 mb-3">Risk Assessment</h3>
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between p-2 rounded-md bg-gray-50">
                <span className="text-sm font-medium text-gray-700">Phishing Risk</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${scanResults.phishing ? 'bg-danger-50 text-danger-700' : 'bg-success-50 text-success-700'}`}>
                  {scanResults.phishing ? 'High' : 'Low'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-2 rounded-md bg-gray-50">
                <span className="text-sm font-medium text-gray-700">Malware Risk</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${scanResults.malware ? 'bg-danger-50 text-danger-700' : 'bg-success-50 text-success-700'}`}>
                  {scanResults.malware ? 'High' : 'Low'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-2 rounded-md bg-gray-50">
                <span className="text-sm font-medium text-gray-700">Spam Risk</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${scanResults.spamming ? 'bg-warning-50 text-warning-700' : 'bg-success-50 text-success-700'}`}>
                  {scanResults.spamming ? 'Medium' : 'Low'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-2 rounded-md bg-gray-50">
                <span className="text-sm font-medium text-gray-700">PhishTank Database</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${scanResults.phishTank.in_database ? 'bg-danger-50 text-danger-700' : 'bg-success-50 text-success-700'}`}>
                  {scanResults.phishTank.in_database ? 'Found in Database' : 'Not Listed'}
                </span>
              </div>
            </div>
            
            {/* Recommendations */}
            <h3 className="text-lg font-medium text-gray-900 mb-3">Recommendations</h3>
            <div className="p-4 rounded-lg bg-primary-50 border border-primary-200 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Shield className="h-5 w-5 text-primary-600" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-primary-800">Safety Advice</h4>
                  {statusInfo.color === 'success' ? (
                    <p className="mt-1 text-sm text-primary-700">
                      This URL appears to be safe. However, always exercise caution when sharing personal information online.
                    </p>
                  ) : statusInfo.color === 'warning' ? (
                    <p className="mt-1 text-sm text-primary-700">
                      This URL has some suspicious characteristics. Proceed with caution and avoid entering sensitive information.
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-primary-700">
                      This URL is likely unsafe. We strongly recommend avoiding this website to protect your personal information and device.
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Risk Score Details */}
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Detailed Analysis</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Safety Score</span>
                    <span className="text-sm font-medium text-gray-700">{scanResults.safetyScore}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full bg-${statusInfo.color}-500`} 
                      style={{ width: `${scanResults.safetyScore}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p className="mb-2">
                    <strong>Analysis Summary:</strong> {scanResults.message || 'URL scan completed successfully.'}
                  </p>
                  
                  {scanResults.phishTank.in_database && (
                    <div className="p-3 bg-danger-50 border border-danger-200 rounded-md mt-2">
                      <div className="flex">
                        <Info className="h-5 w-5 text-danger-500" />
                        <p className="ml-2 text-danger-700">
                          This URL has been reported as a phishing attempt in the PhishTank database.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button onClick={() => setScanResults(null)}>
                Scan Another URL
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open(scanResults.scannedUrl, '_blank')}
              >
                Visit URL (Cautiously)
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
      
      {/* Scanning Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card
          title="URL Security Tips"
          icon={<Info className="h-5 w-5 text-primary-600" />}
        >
          <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
            <li>Always check that URLs begin with "https://" and show a padlock icon in your browser.</li>
            <li>Be suspicious of URLs with misspellings or extra characters (e.g., "paypa1.com" instead of "paypal.com").</li>
            <li>Hover over links before clicking to see where they actually lead.</li>
            <li>Avoid clicking on links in unsolicited emails, messages, or pop-ups.</li>
            <li>Use our scanner to check any suspicious links before visiting them.</li>
          </ul>
        </Card>
      </motion.div>
    </div>
  );
};

export default Scanner;