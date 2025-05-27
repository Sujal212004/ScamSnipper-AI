import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout components
import Navbar from './Navbar';
import Footer from './Footer';
import SniperAIChat from './common/SniperAIChat';

// Pages
import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

// Feature components
import Dashboard from './Dashboard';
import Scanner from './Scanner';
import Heatmap from './Heatmap';
import VoiceDetector from './VoiceDetector';
import ImageScanner from './ImageScanner';
import Leaderboard from './Leaderboard';
import SmsAlerts from './SmsAlerts';

// Auth context
import { useAuth } from '../contexts/AuthContext';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => {
  useEffect(() => {
    // Set page title
    document.title = 'ScamSniper AI - Advanced Scam Detection Platform';
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/scanner" 
            element={
              <ProtectedRoute>
                <Scanner />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/heatmap" 
            element={
              <ProtectedRoute>
                <Heatmap />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/voice-detector" 
            element={
              <ProtectedRoute>
                <VoiceDetector />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/image-scan" 
            element={
              <ProtectedRoute>
                <ImageScanner />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/leaderboard" 
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/sms-alerts" 
            element={
              <ProtectedRoute>
                <SmsAlerts />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      
      {/* SniperAI Chat */}
      <SniperAIChat />
      
      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default App;