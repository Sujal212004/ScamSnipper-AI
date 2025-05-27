import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Shield, Award, Settings, Bell, 
  AlertTriangle, Edit, Save, X, LogOut, 
  Smartphone, Trash, Mail, Lock
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import { calculateLevel, formatPhoneNumber } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Profile = () => {
  const { currentUser, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phoneNumber: currentUser?.phoneNumber || '',
    preferences: {
      ...(currentUser?.preferences || {}),
      notifications: currentUser?.preferences?.notifications ?? true,
      smsAlerts: currentUser?.preferences?.smsAlerts ?? false,
      darkMode: currentUser?.preferences?.darkMode ?? false
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Calculate user stats
  const userLevel = calculateLevel(currentUser?.points || 0);
  
  // Progress to next level
  const pointsToNextLevel = (userLevel + 1) * (userLevel + 1) * 100;
  const currentLevelPoints = userLevel * userLevel * 100;
  const pointsNeeded = pointsToNextLevel - currentLevelPoints;
  const progress = ((currentUser?.points - currentLevelPoints) / pointsNeeded) * 100;
  
  // Toggle edit mode
  const toggleEdit = () => {
    if (isEditing) {
      // Cancel editing, reset form
      setEditedProfile({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phoneNumber: currentUser?.phoneNumber || '',
        preferences: {
          ...(currentUser?.preferences || {}),
          notifications: currentUser?.preferences?.notifications ?? true,
          smsAlerts: currentUser?.preferences?.smsAlerts ?? false,
          darkMode: currentUser?.preferences?.darkMode ?? false
        }
      });
    }
    setIsEditing(!isEditing);
  };
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties (preferences)
      const [parent, child] = name.split('.');
      setEditedProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      // Handle top-level properties
      setEditedProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Save profile changes
  const saveProfile = async () => {
    setIsLoading(true);
    
    try {
      await updateProfile(editedProfile);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };
  
  // Delete account (placeholder)
  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // In a real app, this would call an API to delete the account
      toast.info('Account deletion is not implemented in this demo');
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600 mb-8">
          Manage your account settings and view your achievements.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - User info */}
        <div className="lg:col-span-2">
          {/* Profile card */}
          <Card className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Profile Information
              </h2>
              
              <Button
                variant={isEditing ? 'outline' : 'primary'}
                size="sm"
                onClick={toggleEdit}
                icon={isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
            
            {isEditing ? (
              // Edit form
              <form onSubmit={(e) => { e.preventDefault(); saveProfile(); }}>
                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={editedProfile.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={editedProfile.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  {/* Phone */}
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number (for SMS alerts)
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={editedProfile.phoneNumber || ''}
                      onChange={handleChange}
                      placeholder="+1 (555) 555-5555"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  {/* Preferences */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Preferences</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="preferences.notifications"
                          name="preferences.notifications"
                          checked={editedProfile.preferences.notifications}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="preferences.notifications" className="ml-2 text-sm text-gray-700">
                          Email Notifications
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="preferences.smsAlerts"
                          name="preferences.smsAlerts"
                          checked={editedProfile.preferences.smsAlerts}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="preferences.smsAlerts" className="ml-2 text-sm text-gray-700">
                          SMS Alerts
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="preferences.darkMode"
                          name="preferences.darkMode"
                          checked={editedProfile.preferences.darkMode}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="preferences.darkMode" className="ml-2 text-sm text-gray-700">
                          Dark Mode
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Save button */}
                  <div className="flex space-x-3">
                    <Button
                      type="submit"
                      loading={isLoading}
                      disabled={isLoading}
                      icon={<Save className="h-4 w-4" />}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={toggleEdit}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              // Profile display
              <div className="space-y-6">
                {/* User info */}
                <div className="flex items-center">
                  <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
                    <User className="h-10 w-10 text-primary-600" />
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold text-gray-900">{currentUser.name}</h3>
                    <p className="text-gray-600">{currentUser.email}</p>
                    <div className="mt-1 flex items-center">
                      <Shield className="h-4 w-4 text-primary-600 mr-1" />
                      <span className="text-sm text-primary-700">Level {userLevel} Protector</span>
                    </div>
                  </div>
                </div>
                
                {/* Contact info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-700">Email</span>
                      </div>
                      <span className="text-gray-900">{currentUser.email}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <Smartphone className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-700">Phone</span>
                      </div>
                      <span className="text-gray-900">
                        {currentUser.phoneNumber 
                          ? formatPhoneNumber(currentUser.phoneNumber)
                          : <span className="text-gray-400 italic">Not set</span>
                        }
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Account settings */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Account Settings</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <Bell className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-700">Email Notifications</span>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        currentUser.preferences?.notifications 
                          ? 'bg-success-50 text-success-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {currentUser.preferences?.notifications ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <Smartphone className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-700">SMS Alerts</span>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        currentUser.preferences?.smsAlerts 
                          ? 'bg-success-50 text-success-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {currentUser.preferences?.smsAlerts ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <Settings className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-700">Dark Mode</span>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        currentUser.preferences?.darkMode 
                          ? 'bg-success-50 text-success-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {currentUser.preferences?.darkMode ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Account actions */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/sms-alerts')}
                      icon={<Bell className="h-4 w-4" />}
                    >
                      Manage Alerts
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => {}}
                      icon={<Lock className="h-4 w-4" />}
                    >
                      Change Password
                    </Button>
                    
                    <Button
                      variant="danger"
                      onClick={handleLogout}
                      icon={<LogOut className="h-4 w-4" />}
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
          
          {/* Danger Zone */}
          <Card
            title="Danger Zone"
            icon={<AlertTriangle className="h-5 w-5 text-danger-500" />}
            className="border-danger-200"
          >
            <p className="text-gray-600 mb-6">
              Actions in this section are irreversible. Please proceed with caution.
            </p>
            
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              icon={<Trash className="h-4 w-4" />}
            >
              Delete Account
            </Button>
          </Card>
        </div>
        
        {/* Right column */}
        <div>
          {/* Level Progress */}
          <Card
            title="Level Progress"
            icon={<Shield className="h-5 w-5 text-primary-600" />}
            className="mb-6"
          >
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100">
                <span className="text-2xl font-bold text-primary-700">{userLevel}</span>
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Level {userLevel} Protector</h3>
              <p className="text-sm text-gray-600">
                {pointsNeeded - (currentUser?.points - currentLevelPoints)} more points to level {userLevel + 1}
              </p>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-1 text-sm">
                <span>{currentLevelPoints} pts</span>
                <span>{pointsToNextLevel} pts</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="h-2.5 rounded-full bg-primary-600" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Earn points by scanning URLs, reporting scams, and using other protection features.
            </p>
            
            <Button
              variant="outline"
              fullWidth
              onClick={() => navigate('/scanner')}
            >
              Earn More Points
            </Button>
          </Card>
          
          {/* Badges */}
          <Card
            title="Your Badges"
            icon={<Award className="h-5 w-5 text-accent-600" />}
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
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-accent-100 flex items-center justify-center text-xl">
                      {badge.icon}
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">{badge.title}</h4>
                      <p className="text-xs text-gray-500">{badge.description}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-50 text-accent-700">
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
              <Button
                variant="outline"
                fullWidth
                onClick={() => navigate('/leaderboard')}
              >
                View Leaderboard
              </Button>
            </div>
          </Card>
          
          {/* Account Stats */}
          <Card
            title="Account Statistics"
            icon={<Shield className="h-5 w-5 text-secondary-600" />}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <span className="text-sm font-medium text-gray-700">Account Created</span>
                <span className="text-sm text-gray-900">
                  {new Date(currentUser?.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <span className="text-sm font-medium text-gray-700">Total Points</span>
                <span className="text-sm text-gray-900">
                  {currentUser?.points || 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <span className="text-sm font-medium text-gray-700">Scans Completed</span>
                <span className="text-sm text-gray-900">
                  {currentUser?.scansCompleted || 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <span className="text-sm font-medium text-gray-700">Reports Submitted</span>
                <span className="text-sm text-gray-900">
                  {currentUser?.reportsSubmitted || 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <span className="text-sm font-medium text-gray-700">Badges Earned</span>
                <span className="text-sm text-gray-900">
                  {currentUser?.badges?.length || 0}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;