import { API_KEYS } from '../utils/constants';

// Placeholder API service for URL verification
export const verifyUrl = async (url) => {
  try {
    // In a real application, this would make an actual API call
    // Using IPQS API as an example: https://www.ipqualityscore.com/documentation/malicious-url-scanner-api/overview
    
    console.log(`Verifying URL: ${url} with IPQS API`);
    
    // Simulate API response with mock data
    // This would be replaced with a real fetch call in production
    const mockResponse = {
      success: true,
      message: 'URL scan complete',
      unsafe: url.includes('scam') || url.includes('phish') || !url.includes('https'),
      spamming: url.includes('spam'),
      malware: url.includes('malware'),
      phishing: url.includes('login') && !url.includes('secure'),
      suspicious: !url.includes('https') || url.includes('free') || url.includes('win'),
      risk_score: url.includes('scam') ? 85 : url.includes('free') ? 65 : 30,
    };
    
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return mockResponse;
  } catch (error) {
    console.error('Error verifying URL:', error);
    throw new Error('Failed to verify URL. Please try again later.');
  }
};

// Check PhishTank database (placeholder)
export const checkPhishTank = async (url) => {
  try {
    console.log(`Checking URL against PhishTank: ${url}`);
    
    // Simulate API response
    const mockResponse = {
      success: true,
      in_database: url.includes('phish') || url.includes('scam'),
      verified: url.includes('phish'),
      details: url.includes('phish') 
        ? 'This URL has been verified as a phishing attempt' 
        : 'URL not found in database'
    };
    
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return mockResponse;
  } catch (error) {
    console.error('Error checking PhishTank:', error);
    throw new Error('Failed to check PhishTank database. Please try again later.');
  }
};

// Send SMS alert (placeholder for Twilio integration)
export const sendSmsAlert = async (phoneNumber, message) => {
  try {
    console.log(`Sending SMS to ${phoneNumber}: ${message}`);
    console.log('Using Twilio credentials:', API_KEYS.TWILIO.ACCOUNT_SID);
    
    // In production, this would use the Twilio API
    // https://www.twilio.com/docs/sms/api
    
    // Simulate sending SMS
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      message: 'SMS alert sent successfully',
      to: phoneNumber,
      sent_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error sending SMS alert:', error);
    throw new Error('Failed to send SMS alert. Please try again later.');
  }
};

// Get random images from Unsplash for UI (placeholder)
export const getRandomImage = async (query = 'security', count = 1) => {
  try {
    // In production, this would use the Unsplash API
    // https://unsplash.com/documentation
    
    // For this demo, we'll use static image URLs
    const mockImages = [
      'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg',
      'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg',
      'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg',
      'https://images.pexels.com/photos/6963944/pexels-photo-6963944.jpeg',
      'https://images.pexels.com/photos/5984705/pexels-photo-5984705.jpeg'
    ];
    
    // Select random images from the array
    const selectedImages = Array(count)
      .fill()
      .map(() => mockImages[Math.floor(Math.random() * mockImages.length)]);
    
    return count === 1 ? selectedImages[0] : selectedImages;
  } catch (error) {
    console.error('Error fetching images:', error);
    return 'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg'; // Fallback image
  }
};