import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, AlertTriangle, Bell, Award, 
  TrendingUp, MapPin, Calendar, ChevronRight,
  Users, Smartphone, Image, Mic, Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import Card from './common/Card';
import Button from './common/Button';
import { useAuth } from '../contexts/AuthContext';
import { useScamReports } from '../contexts/ScamReportsContext';
import { getRandomImage } from '../services/api';
import { calculateLevel, formatDate, getStatusFromScore } from '../utils/helpers';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { reports, totalReports } = useScamReports();
  const [bannerImage, setBannerImage] = useState('');
  
  // Get user stats
  const userLevel = calculateLevel(currentUser?.points || 0);
  const badgeCount = currentUser?.badges?.length || 0;
  const scansCompleted = currentUser?.scansCompleted || 0;
  
  // Recent reports (limited to 5)
  const recentReports = reports.slice(0, 5);
  
  // Stats
  const stats = [
    { name: 'Total Points', value: currentUser?.points || 0, icon: <Award className="h-6 w-6 text-primary-600" /> },
    { name: 'User Level', value: userLevel, icon: <TrendingUp className="h-6 w-6 text-accent-500" /> },
    { name: 'Badges Earned', value: badgeCount, icon: <Shield className="h-6 w-6 text-success-500" /> },
    { name: 'Scans Completed', value: scansCompleted, icon: <Search className="h-6 w-6 text-secondary-600" /> }
  ];
  
  // Feature cards
  const features = [
    { 
      name: 'URL Scanner', 
      description: 'Check websites for phishing and scams', 
      path: '/scanner',
      icon: <Search className="h-10 w-10 text-primary-500" />,
      color: 'bg-primary-50 border-primary-200'
    },
    { 
      name: 'Voice Detector', 
      description: 'Detect scam calls in real-time', 
      path: '/voice-detector',
      icon: <Mic className="h-10 w-10 text-secondary-500" />,
      color: 'bg-secondary-50 border-secondary-200'
    },
    { 
      name: 'Image Scanner', 
      description: 'Identify fake logos and scam images', 
      path: '/image-scan',
      icon: <Image className="h-10 w-10 text-accent-500" />,
      color: 'bg-accent-50 border-accent-200'
    },
    { 
      name: 'SMS Alerts', 
      description: 'Get notifications for potential scams', 
      path: '/sms-alerts',
      icon: <Smartphone className="h-10 w-10 text-success-500" />,
      color: 'bg-success-50 border-success-200'
    },
    { 
      name: 'Scam Heatmap', 
      description: 'View scam reports in your area', 
      path: '/heatmap',
      icon: <MapPin className="h-10 w-10 text-warning-500" />,
      color: 'bg-warning-50 border-warning-200'
    },
    { 
      name: 'Leaderboard', 
      description: 'See top scam fighters in your community', 
      path: '/leaderboard',
      icon: <Users className="h-10 w-10 text-danger-500" />,
      color: 'bg-danger-50 border-danger-200'
    }
  ];
  
  // Get random banner image
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const imageUrl = await getRandomImage('cybersecurity');
        setBannerImage(imageUrl);
      } catch (error) {
        console.error('Error fetching banner image:', error);
        setBannerImage('https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg');
      }
    };
    
    fetchImage();
  }, []);
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Banner */}
      <div 
        className="relative bg-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{
          backgroundImage: bannerImage ? `url(${bannerImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gray-900 opacity-70"></div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {currentUser?.name || currentUser?.email?.split('@')[0]}!
            </h1>
            <p className="text-gray-300 max-w-2xl">
              Your personal dashboard for scam detection and protection. Track your activity, 
              check recent scans, and access all features from here.
            </p>
          </motion.div>
          
          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg p-4"
              >
                <div className="flex items-center">
                  <div className="mr-4">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">{stat.name}</p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Features */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Protection Features
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <Link to={feature.path}>
                    <Card
                      className={`h-full transition-all hover:shadow-md cursor-pointer ${feature.color}`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-4">
                          {feature.icon}
                        </div>
                        <h3 className="font-medium text-gray-900">{feature.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            {/* Recent Activity */}
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              Recent Scam Reports
            </h2>
            
            {recentReports.length > 0 ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {recentReports.map((report, index) => {
                    const statusInfo = getStatusFromScore(report.safetyScore || 0);
                    
                    return (
                      <motion.li
                        key={report.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.05 * index }}
                        className="px-4 py-4 sm:px-6 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <AlertTriangle className={`h-6 w-6 text-${statusInfo.color}-500`} />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">
                                {report.type || 'Scam Report'} - {report.source || 'Unknown Source'}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatDate(report.timestamp)} - {report.location?.city || 'Unknown Location'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${statusInfo.color}-50 text-${statusInfo.color}-700`}>
                              {statusInfo.label}
                            </span>
                            <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
                
                <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      Showing {recentReports.length} of {totalReports} reports
                    </span>
                    <Link to="/heatmap">
                      <Button variant="outline" size="sm">
                        View All Reports
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <Card>
                <div className="text-center py-6">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No Reports Yet</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Start using the scanning tools to detect and report scams.
                  </p>
                  <div className="mt-6">
                    <Link to="/scanner">
                      <Button>
                        Start Scanning
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )}
          </div>
          
          {/* Right column */}
          <div>
            {/* User badges */}
            <Card
              title="Your Badges"
              icon={<Award className="h-5 w-5 text-primary-600" />}
              className="mb-6"
            >
              {currentUser?.badges && currentUser.badges.length > 0 ? (
                <div className="space-y-4">
                  {currentUser.badges.map((badge) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-xl">
                        {badge.icon}
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">{badge.title}</h4>
                        <p className="text-xs text-gray-500">{badge.description}</p>
                      </div>
                      <div className="ml-auto">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
                          +{badge.points} pts
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No Badges Yet</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Complete activities to earn badges and points.
                  </p>
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link to="/profile">
                  <Button variant="outline" fullWidth>
                    View All Achievements
                  </Button>
                </Link>
              </div>
            </Card>
            
            {/* Upcoming alerts */}
            <Card
              title="Safety Alerts"
              icon={<Bell className="h-5 w-5 text-warning-500" />}
            >
              <div className="space-y-4">
                <div className="p-3 bg-warning-50 border border-warning-200 rounded-lg">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-warning-500" />
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">Increased Phishing Activity</h4>
                      <p className="mt-1 text-xs text-gray-500">
                        There has been an increase in phishing attempts targeting banks in your area.
                      </p>
                      <p className="mt-2 text-xs text-gray-500">
                        <Calendar className="inline-block h-3 w-3 mr-1" />
                        {formatDate(new Date())}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-danger-500" />
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">New Voice Scam Detected</h4>
                      <p className="mt-1 text-xs text-gray-500">
                        A new voice scam claiming to be from the IRS has been reported in your area.
                      </p>
                      <p className="mt-2 text-xs text-gray-500">
                        <Calendar className="inline-block h-3 w-3 mr-1" />
                        {formatDate(new Date(Date.now() - 86400000))} {/* 1 day ago */}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link to="/sms-alerts">
                  <Button variant="outline" fullWidth>
                    Manage Alerts
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;