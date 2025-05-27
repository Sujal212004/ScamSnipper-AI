// API Keys (Placeholders - Replace with actual keys in production)
export const API_KEYS = {
  IPQUALITYSCORE: "YOUR_IPQUALITYSCORE_API_KEY",
  PHISHTANK: "YOUR_PHISHTANK_API_KEY",
  TWILIO: {
    ACCOUNT_SID: "YOUR_TWILIO_ACCOUNT_SID",
    AUTH_TOKEN: "YOUR_TWILIO_AUTH_TOKEN",
    PHONE_NUMBER: "+1234567890"
  },
  UNSPLASH: "YOUR_UNSPLASH_API_KEY"
};

// Firebase Configuration (Placeholder - Replace with actual config)
export const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

// Common Scam Types
export const SCAM_TYPES = {
  PHISHING: "Phishing",
  VOICE: "Voice Scam",
  SMS: "SMS Scam",
  EMAIL: "Email Scam",
  FAKE_WEBSITE: "Fake Website",
  MALWARE: "Malware",
  SOCIAL_ENGINEERING: "Social Engineering",
  IDENTITY_THEFT: "Identity Theft",
  INVESTMENT: "Investment Scam",
  OTHER: "Other"
};

// Achievement Badges
export const BADGES = {
  NEWCOMER: {
    id: "newcomer",
    title: "Newcomer",
    description: "Joined the ScamSniper community",
    icon: "👋",
    points: 10
  },
  FIRST_SCAN: {
    id: "first_scan",
    title: "First Scan",
    description: "Completed your first scam scan",
    icon: "🔍",
    points: 25
  },
  REPORTER: {
    id: "reporter",
    title: "Scam Reporter",
    description: "Reported your first scam",
    icon: "🛡️",
    points: 50
  },
  VOICE_DETECTOR: {
    id: "voice_detector",
    title: "Voice Detector",
    description: "Used voice detection to identify a scam",
    icon: "🎤",
    points: 75
  },
  IMAGE_ANALYZER: {
    id: "image_analyzer",
    title: "Image Analyzer",
    description: "Used OCR to detect a scam logo",
    icon: "📷",
    points: 75
  },
  PROTECTOR: {
    id: "protector",
    title: "Community Protector",
    description: "Reported 10 scams",
    icon: "🦸",
    points: 200
  }
};

// Common scam phrases for voice detection
export const SCAM_PHRASES = [
  "verify your account",
  "suspended your account",
  "unusual activity",
  "gift card",
  "winning prize",
  "urgent",
  "security breach",
  "tax refund",
  "social security",
  "warranty expired",
  "legal action",
  "arrest warrant",
  "bitcoin payment",
  "remote access",
  "technical support"
];

// Heatmap default location (New York City)
export const DEFAULT_MAP_CENTER = [40.7128, -74.0060];
export const DEFAULT_ZOOM = 12;

// AI Model Configuration
export const AI_CONSTANTS = {
  MODEL_NAME: 'scam-detector-model',
  CHAT_MODEL_NAME: 'scam-chat-model',
  MIN_TRAINING_SAMPLES: 10,
  MIN_CHAT_TRAINING_SAMPLES: 50,
  CONFIDENCE_THRESHOLD: 0.8,
  UPDATE_INTERVAL: 1000 * 60 * 60 * 24, // 24 hours
  
  // Chat model configuration
  MAX_SEQUENCE_LENGTH: 50,
  CHAT_VOCAB_SIZE: 10000,
  CHAT_INTENT_CLASSES: 7,
  CHAT_INTENTS: [
    'greeting',
    'farewell',
    'question',
    'report_scam',
    'request_help',
    'provide_info',
    'other'
  ],
  
  // Chat vocabulary (simplified version - expand in production)
  CHAT_VOCAB: {
    '<PAD>': 0,
    '<UNK>': 1,
    'hello': 2,
    'hi': 3,
    'hey': 4,
    'bye': 5,
    'goodbye': 6,
    'help': 7,
    'scam': 8,
    'report': 9,
    // Add more vocabulary words as needed
  },

  FEATURES: [
    'Urgency',
    'Financial Terms',
    'Security/Login',
    'Prizes/Rewards',
    'Payment Methods',
    'Personal Info',
    'Organization Names',
    'Threats/Legal',
    'Text Style',
    'Informal Language'
  ],
  
  TRAINING_CONFIG: {
    epochs: 10,
    batchSize: 32,
    validationSplit: 0.2,
    shuffle: true,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
      }
    }
  },
  
  MODEL_ARCHITECTURE: {
    inputShape: [10],
    layers: [
      { units: 16, activation: 'relu' },
      { units: 8, activation: 'relu' },
      { units: 1, activation: 'sigmoid' }
    ]
  }
};

// DeepSeek AI Configuration
export const DEEPSEEK_CONFIG = {
  apiKey: "YOUR_DEEPSEEK_API_KEY", // Replace with actual key in production
  model: "deepseek-chat",
  maxTokens: 150,
  temperature: 0.7,
  topP: 0.9,
  baseUrl: "https://api.deepseek.com/v1"
};