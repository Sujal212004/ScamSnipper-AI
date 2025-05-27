// Format date to readable string
export const formatDate = (date) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

// Format time to readable string
export const formatTime = (date) => {
  const options = { hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleTimeString(undefined, options);
};

// Generate a random ID
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Calculate safety score from 0-100
export const calculateSafetyScore = (url, textContent, imageScore) => {
  // This is a placeholder implementation
  // In a real application, you would use more sophisticated analysis
  
  let score = 100; // Start with a perfect score
  
  // Analyze URL for suspicious patterns
  if (url) {
    if (url.includes('bit.ly') || url.includes('tinyurl') || url.includes('goo.gl')) {
      score -= 20; // Shortened URLs are suspicious
    }
    
    if (!url.includes('https://')) {
      score -= 15; // Non-HTTPS sites are less secure
    }
    
    if (url.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
      score -= 25; // IP addresses in URLs are suspicious
    }
    
    if (url.includes('login') && url.includes('verify')) {
      score -= 10; // Login verification pages can be phishing
    }
  }
  
  // Analyze text content for suspicious phrases
  if (textContent) {
    const lowerText = textContent.toLowerCase();
    const suspiciousPhrases = [
      'verify your account', 'urgent action required', 'password expired',
      'suspicious activity', 'gift card', 'claim prize', 'won lottery',
      'bank transfer', 'western union', 'moneygram', 'bitcoin payment'
    ];
    
    suspiciousPhrases.forEach(phrase => {
      if (lowerText.includes(phrase.toLowerCase())) {
        score -= 5; // Deduct points for each suspicious phrase
      }
    });
  }
  
  // Factor in image score if provided
  if (imageScore !== undefined) {
    score = Math.min(score, score * (imageScore / 100));
  }
  
  // Ensure score stays within 0-100 range
  return Math.max(0, Math.min(100, Math.round(score)));
};

// Convert safety score to status label
export const getStatusFromScore = (score) => {
  if (score >= 80) return { label: 'Safe', color: 'success' };
  if (score >= 50) return { label: 'Suspicious', color: 'warning' };
  return { label: 'Dangerous', color: 'danger' };
};

// Get random coordinates near a point for the heatmap demo
export const getRandomCoordinatesNear = (lat, lng, radiusInKm = 5) => {
  // Earth's radius in km
  const earthRadius = 6371;
  
  // Convert radius from km to radians
  const radiusInRad = radiusInKm / earthRadius;
  
  // Random angle
  const randomAngle = Math.random() * Math.PI * 2;
  
  // Random radius (we use the square root to get a more uniform distribution)
  const randomRadius = Math.sqrt(Math.random()) * radiusInRad;
  
  // Calculate new position
  const newLat = lat + randomRadius * Math.cos(randomAngle);
  const newLng = lng + randomRadius * Math.sin(randomAngle) / Math.cos(lat * Math.PI / 180);
  
  return [newLat, newLng];
};

// Calculate user level based on points
export const calculateLevel = (points) => {
  return Math.floor(Math.sqrt(points / 100)) + 1;
};

// Format phone number for display
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
  }
  return phoneNumber;
};