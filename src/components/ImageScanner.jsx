import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, Loader, AlertTriangle, Shield, Check, Info } from 'lucide-react';
import Card from './common/Card';
import Button from './common/Button';
import { useScamReports } from '../contexts/ScamReportsContext';
import { analyzeImage } from '../services/scamDetection';
import { useAuth } from '../contexts/AuthContext';
import { addUserPoints, awardBadge } from '../services/auth';
import { toast } from 'react-toastify';

const ImageScanner = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const { addReport } = useScamReports();
  const { currentUser, updateProfile } = useAuth();
  
  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Reset previous results
    setResults(null);
    setError(null);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    
    // Set selected file
    setSelectedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };
  
  // Trigger file input click
  const handleSelectClick = () => {
    fileInputRef.current.click();
  };
  
  // Handle image analysis
  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError('Please select an image to analyze');
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Analyze image using OCR
      const analysisResults = await analyzeImage(selectedImage);
      setResults(analysisResults);
      
      // Add to reports if suspicious
      if (analysisResults.riskScore > 30) {
        await addReport({
          type: 'Image Scan',
          source: selectedImage.name,
          safetyScore: analysisResults.safetyScore,
          details: {
            extractedText: analysisResults.extractedText,
            matches: analysisResults.matches,
            message: `Image scan detected ${analysisResults.matches.length} suspicious elements.`
          },
          location: { lat: 40.7128, lng: -74.0060, city: 'New York' } // Demo location
        });
      }
      
      // Award points and badges
      if (currentUser) {
        // Award points
        await addUserPoints(15, 'Completed image scan');
        
        // Award badge if not already awarded
        const hasBadge = currentUser.badges && 
                        currentUser.badges.some(badge => badge.id === 'image_analyzer');
        
        if (!hasBadge) {
          const result = await awardBadge('image_analyzer');
          if (result.success && !result.alreadyAwarded) {
            toast.success('🎉 New badge earned: Image Analyzer!');
          }
        }
        
        // Update user profile
        await updateProfile({
          scansCompleted: (currentUser.scansCompleted || 0) + 1
        });
      }
      
    } catch (err) {
      console.error('Image analysis error:', err);
      setError(err.message || 'Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Reset scanner
  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResults(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Logo & Image Scanner</h1>
        <p className="text-gray-600 mb-8">
          Scan images and logos to detect potential scams and counterfeit branding.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image upload and preview */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Image</h3>
              
              {!imagePreview ? (
                <div
                  onClick={handleSelectClick}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-primary-500 transition-colors"
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Click to select an image or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports JPEG, PNG, GIF (max 5MB)
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Selected"
                      className="max-h-[300px] rounded-lg mx-auto mb-4"
                    />
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                        <Loader className="h-8 w-8 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 mb-1">
                    {selectedImage.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {Math.round(selectedImage.size / 1024)} KB
                  </p>
                </div>
              )}
              
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              
              {error && (
                <div className="mt-4 p-3 bg-danger-50 border border-danger-200 rounded-md text-danger-700 text-sm">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-danger-500 mr-2" />
                    {error}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={handleAnalyze}
                disabled={!selectedImage || isAnalyzing}
                loading={isAnalyzing}
                fullWidth
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
              </Button>
              
              {imagePreview && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={isAnalyzing}
                >
                  Reset
                </Button>
              )}
            </div>
          </Card>
          
          {/* Analysis results */}
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                title="Analysis Results"
                icon={results.riskScore >= 50 
                  ? <AlertTriangle className="h-5 w-5 text-danger-500" />
                  : <Shield className="h-5 w-5 text-success-500" />
                }
              >
                {/* Overall risk assessment */}
                <div className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {results.riskScore >= 50 ? (
                        <div className="rounded-full p-2 bg-danger-100">
                          <AlertTriangle className="h-6 w-6 text-danger-600" />
                        </div>
                      ) : (
                        <div className="rounded-full p-2 bg-success-100">
                          <Check className="h-6 w-6 text-success-600" />
                        </div>
                      )}
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {results.riskScore >= 50 ? 'Potentially Suspicious' : 'Likely Safe'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {results.riskScore >= 50 
                            ? 'This image contains elements associated with scams.' 
                            : 'No significant scam indicators detected in this image.'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className={`text-${results.riskScore >= 50 ? 'danger' : 'success'}-700 text-2xl font-bold`}>
                        {results.safetyScore}/100
                      </div>
                      <div className="text-sm text-gray-500 text-center">Safety Score</div>
                    </div>
                  </div>
                </div>
                
                {/* Detected text */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Extracted Text</h3>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-[200px] overflow-y-auto">
                    {results.extractedText ? (
                      <p className="text-gray-800 whitespace-pre-line">
                        {results.extractedText}
                      </p>
                    ) : (
                      <p className="text-gray-500 italic">
                        No text was detected in this image.
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Detected suspicious terms */}
                {results.matches && results.matches.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Suspicious Terms Detected</h3>
                    <div className="space-y-2">
                      {results.matches.map((term, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center p-2 bg-warning-50 border border-warning-200 rounded-md"
                        >
                          <AlertTriangle className="h-5 w-5 text-warning-500 mr-2" />
                          <span className="text-warning-700">{term}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Risk assessment */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Risk Assessment</h3>
                  <div className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Risk Score</span>
                      <span className="text-sm font-medium text-gray-700">{results.riskScore}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          results.riskScore >= 70 ? 'bg-danger-500' :
                          results.riskScore >= 30 ? 'bg-warning-500' : 'bg-success-500'
                        }`} 
                        style={{ width: `${results.riskScore}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Bank references */}
                  {results.suspiciousBankReferences && (
                    <div className="p-3 mb-3 bg-danger-50 border border-danger-200 rounded-md">
                      <div className="flex">
                        <AlertTriangle className="h-5 w-5 text-danger-500 mr-2" />
                        <div>
                          <p className="text-danger-700 font-medium">Suspicious Bank References Detected</p>
                          <p className="text-sm text-danger-600 mt-1">
                            This image may contain altered bank or payment service logos, which is a common phishing tactic.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Recommendations */}
                <h3 className="text-lg font-medium text-gray-900 mb-3">Recommendations</h3>
                <div className="p-4 rounded-lg bg-primary-50 border border-primary-200">
                  <div className="flex">
                    <Info className="h-5 w-5 text-primary-600 mr-2" />
                    <div>
                      {results.riskScore >= 50 ? (
                        <>
                          <p className="text-primary-800 font-medium">Exercise Caution</p>
                          <p className="text-sm text-primary-700 mt-1">
                            This image contains elements commonly associated with scams. Be wary of any requests for personal information or payments related to this image.
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-primary-800 font-medium">Likely Safe</p>
                          <p className="text-sm text-primary-700 mt-1">
                            No significant scam indicators were detected, but always verify the source of any images before taking action based on them.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button 
                    variant="outline"
                    onClick={handleReset}
                    fullWidth
                  >
                    Scan Another Image
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
        
        {/* Right column */}
        <div>
          {/* How it works */}
          <Card
            title="How It Works"
            icon={<ImageIcon className="h-5 w-5 text-primary-600" />}
            className="mb-6"
          >
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-800 font-medium mr-2">1</span>
                <span>Upload an image of a logo, document, or screenshot.</span>
              </li>
              <li className="flex">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-800 font-medium mr-2">2</span>
                <span>Our OCR technology extracts text from the image.</span>
              </li>
              <li className="flex">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-800 font-medium mr-2">3</span>
                <span>The text is analyzed for common scam indicators.</span>
              </li>
              <li className="flex">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-800 font-medium mr-2">4</span>
                <span>We also check for altered brand logos and suspicious elements.</span>
              </li>
              <li className="flex">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-800 font-medium mr-2">5</span>
                <span>You receive a detailed report with risk assessment and recommendations.</span>
              </li>
            </ul>
          </Card>
          
          {/* Tips */}
          <Card
            title="What to Scan"
            icon={<Info className="h-5 w-5 text-secondary-600" />}
          >
            <p className="text-sm text-gray-600 mb-4">
              This tool is particularly useful for detecting:
            </p>
            
            <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
              <li>Fake bank logos in phishing emails</li>
              <li>Counterfeit payment service branding</li>
              <li>Screenshots of suspicious websites</li>
              <li>QR codes from untrusted sources</li>
              <li>Documents with suspicious letterheads</li>
              <li>Social media profile images of potential scammers</li>
            </ul>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Privacy Note:</strong> All image processing happens locally in your browser. 
                Your images are not stored on our servers.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImageScanner;