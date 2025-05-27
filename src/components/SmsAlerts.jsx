import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Bell, Send, Check, AlertTriangle, Info, MessageSquare } from 'lucide-react';
import { toast } from 'react-toastify';
import Card from './common/Card';
import Button from './common/Button';
import { sendSmsAlert } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { SCAM_TYPES } from '../utils/constants';
import { formatPhoneNumber } from '../utils/helpers';

const SmsAlerts = () => {
  const { currentUser, updateProfile } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '');
  const [alertTypes, setAlertTypes] = useState({
    phishing: true,
    voice: true,
    sms: true,
    email: true,
    fake_website: true
  });
  const [frequency, setFrequency] = useState('immediate');
  const [isSaving, setIsSaving] = useState(false);
  const [showTestForm, setShowTestForm] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  
  // Toggle alert type
  const toggleAlertType = (type) => {
    setAlertTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  // Save preferences
  const savePreferences = async () => {
    if (!phoneNumber) {
      toast.error('Please enter a phone number to receive SMS alerts');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Update user profile
      await updateProfile({
        phoneNumber,
        preferences: {
          ...(currentUser?.preferences || {}),
          smsAlerts: true,
          alertTypes,
          alertFrequency: frequency
        }
      });
      
      toast.success('SMS alert preferences saved successfully');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Send test message
  const sendTestMessage = async () => {
    if (!phoneNumber) {
      toast.error('Please enter a phone number to send a test message');
      return;
    }
    
    if (!testMessage) {
      toast.error('Please enter a message to send');
      return;
    }
    
    setIsSendingTest(true);
    
    try {
      // Send SMS alert
      await sendSmsAlert(phoneNumber, testMessage);
      
      toast.success('Test message sent successfully');
      setTestMessage('');
      setShowTestForm(false);
    } catch (error) {
      console.error('Error sending test message:', error);
      toast.error('Failed to send test message. Please try again.');
    } finally {
      setIsSendingTest(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SMS Scam Alerts</h1>
        <p className="text-gray-600 mb-8">
          Receive SMS notifications about scams in your area and when your scans detect threats.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Alert Preferences</h2>
            
            {/* Phone Number */}
            <div className="mb-6">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="flex">
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 555-5555"
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Enter your phone number to receive SMS alerts about scams.
              </p>
            </div>
            
            {/* Alert Types */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Alert Types</h3>
              <p className="text-sm text-gray-600 mb-4">
                Select the types of scams you want to receive alerts about:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(SCAM_TYPES).map(([key, label]) => (
                  <div key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`alert-${key}`}
                      checked={alertTypes[key.toLowerCase()] || false}
                      onChange={() => toggleAlertType(key.toLowerCase())}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`alert-${key}`} className="ml-2 text-sm text-gray-700">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Alert Frequency */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Alert Frequency</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="frequency-immediate"
                    name="frequency"
                    value="immediate"
                    checked={frequency === 'immediate'}
                    onChange={() => setFrequency('immediate')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor="frequency-immediate" className="ml-2 text-sm text-gray-700">
                    Immediate (send alerts as soon as threats are detected)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="frequency-daily"
                    name="frequency"
                    value="daily"
                    checked={frequency === 'daily'}
                    onChange={() => setFrequency('daily')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor="frequency-daily" className="ml-2 text-sm text-gray-700">
                    Daily Summary (receive a daily digest of threats)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="frequency-weekly"
                    name="frequency"
                    value="weekly"
                    checked={frequency === 'weekly'}
                    onChange={() => setFrequency('weekly')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor="frequency-weekly" className="ml-2 text-sm text-gray-700">
                    Weekly Summary (receive a weekly digest of threats)
                  </label>
                </div>
              </div>
            </div>
            
            {/* Save Button */}
            <div className="flex space-x-3">
              <Button
                onClick={savePreferences}
                loading={isSaving}
                disabled={isSaving}
                icon={<Check className="h-4 w-4" />}
              >
                {isSaving ? 'Saving...' : 'Save Preferences'}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowTestForm(!showTestForm)}
              >
                {showTestForm ? 'Hide Test Form' : 'Send Test Message'}
              </Button>
            </div>
            
            {/* Test Message Form */}
            {showTestForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 pt-6 border-t border-gray-200"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-3">Send Test Message</h3>
                
                <div className="mb-4">
                  <label htmlFor="testMessage" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="testMessage"
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    placeholder="Enter a test message..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <Button
                  onClick={sendTestMessage}
                  loading={isSendingTest}
                  disabled={isSendingTest || !testMessage || !phoneNumber}
                  icon={<Send className="h-4 w-4" />}
                >
                  {isSendingTest ? 'Sending...' : 'Send Test Message'}
                </Button>
              </motion.div>
            )}
          </Card>
          
          {/* Example Alerts */}
          <Card
            title="Example Alert Messages"
            icon={<MessageSquare className="h-5 w-5 text-primary-600" />}
          >
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-800">
                  <strong>ALERT:</strong> A new phishing campaign targeting [Bank Name] customers has been detected. 
                  Be cautious of emails asking for your login credentials or personal information. 
                  Legitimate banks never request sensitive info via email.
                </p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-800">
                  <strong>ALERT:</strong> Your recent URL scan of "example-scam.com" detected a high-risk phishing site. 
                  This site has been reported for attempting to steal login credentials. 
                  We recommend avoiding this website.
                </p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-800">
                  <strong>ALERT:</strong> Multiple voice scams impersonating the IRS have been reported in your area. 
                  Remember, the IRS will never call to demand immediate payment or threaten legal action without prior mail notification.
                </p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Right column */}
        <div>
          {/* How It Works */}
          <Card
            title="How SMS Alerts Work"
            icon={<Info className="h-5 w-5 text-primary-600" />}
            className="mb-6"
          >
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-800 font-medium mr-2">1</span>
                <span>Enter your phone number and select your alert preferences.</span>
              </li>
              <li className="flex">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-800 font-medium mr-2">2</span>
                <span>We monitor for scams matching your selected categories.</span>
              </li>
              <li className="flex">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-800 font-medium mr-2">3</span>
                <span>When threats are detected, you receive SMS alerts based on your chosen frequency.</span>
              </li>
              <li className="flex">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-800 font-medium mr-2">4</span>
                <span>Alerts include details about the scam and safety tips.</span>
              </li>
            </ul>
          </Card>
          
          {/* Current Status */}
          <Card
            title="Alert Status"
            icon={<Bell className="h-5 w-5 text-secondary-600" />}
          >
            <div className="space-y-4">
              {currentUser?.phoneNumber ? (
                <>
                  <div className="flex items-center justify-between p-2 bg-success-50 rounded-md">
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-success-500 mr-2" />
                      <span className="text-sm text-success-700">SMS Alerts Active</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <span className="text-sm text-gray-700">Phone Number</span>
                    <span className="text-sm font-medium">{formatPhoneNumber(currentUser.phoneNumber)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <span className="text-sm text-gray-700">Alert Categories</span>
                    <span className="text-sm font-medium">{
                      currentUser?.preferences?.alertTypes 
                        ? Object.keys(currentUser.preferences.alertTypes).filter(k => 
                            currentUser.preferences.alertTypes[k]).length 
                        : '0'
                    }</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <span className="text-sm text-gray-700">Last Alert Sent</span>
                    <span className="text-sm font-medium">Never</span>
                  </div>
                </>
              ) : (
                <div className="p-4 text-center">
                  <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No Phone Number Set</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Add your phone number above to start receiving SMS alerts.
                  </p>
                </div>
              )}
              
              <div className="p-3 bg-warning-50 border border-warning-200 rounded-md">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-warning-500 mr-2" />
                  <div>
                    <p className="text-sm text-warning-700">
                      <strong>Demo Mode:</strong> In this demo, SMS messages are simulated and not actually sent.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SmsAlerts;