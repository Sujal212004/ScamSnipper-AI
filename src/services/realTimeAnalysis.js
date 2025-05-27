import * as tf from '@tensorflow/tfjs';
import { io } from 'socket.io-client';
import { SCAM_PHRASES } from '../utils/constants';

let socket = null;
let model = null;

// Initialize socket connection
export const initializeSocket = (url) => {
  socket = io(url, {
    reconnectionDelay: 1000,
    reconnection: true,
    reconnectionAttempts: 10,
    transports: ['websocket'],
    agent: false,
    upgrade: false,
    rejectUnauthorized: false
  });

  // Set up event listeners
  socket.on('connect', () => {
    console.log('Connected to real-time analysis server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from real-time analysis server');
  });

  socket.on('scam_alert', (data) => {
    handleScamAlert(data);
  });

  return socket;
};

// Initialize TensorFlow model
export const initializeModel = async () => {
  try {
    model = await tf.loadLayersModel('indexeddb://scam-detector-model');
    console.log('Loaded existing model');
  } catch (error) {
    console.log('Creating new model');
    model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [10], units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    await model.save('indexeddb://scam-detector-model');
  }
};

// Analyze text in real-time
export const analyzeText = async (text) => {
  if (!model) await initializeModel();

  const features = extractFeatures(text);
  const prediction = model.predict(tf.tensor2d([features]));
  const score = await prediction.data();
  prediction.dispose();

  const matches = SCAM_PHRASES.filter(phrase => 
    text.toLowerCase().includes(phrase.toLowerCase())
  );

  return {
    scamProbability: score[0],
    safetyScore: Math.round((1 - score[0]) * 100),
    matches,
    features: analyzeFeatures(features),
    timestamp: new Date().toISOString()
  };
};

// Extract features from text
const extractFeatures = (text) => {
  const features = new Array(10).fill(0);
  const lowerText = text.toLowerCase();

  features[0] = Number(/urgent|immediate|alert|warning|limited time/i.test(lowerText));
  features[1] = Number(/bank|account|credit|debit|money|payment|transfer/i.test(lowerText));
  features[2] = Number(/password|verify|login|security|authenticate|confirm/i.test(lowerText));
  features[3] = Number(/win|winner|prize|lottery|reward|congratulations/i.test(lowerText));
  features[4] = Number(/bitcoin|crypto|wire|western union|moneygram|gift card/i.test(lowerText));
  features[5] = Number(/ssn|social security|birth date|address|license|passport/i.test(lowerText));
  features[6] = Number(/irs|fbi|microsoft|apple|amazon|support|service/i.test(lowerText));
  features[7] = Number(/suspend|terminate|legal|arrest|police|lawsuit|court/i.test(lowerText));
  features[8] = Number(text.split(/[!?]/).length > 3 || text === text.toUpperCase());
  features[9] = Number(/\b(ur|u r|plz|pls|kindly|dear)\b/i.test(lowerText));

  return features;
};

// Analyze feature importance
const analyzeFeatures = (features) => {
  const featureNames = [
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
  ];

  return features
    .map((value, index) => ({
      name: featureNames[index],
      importance: value
    }))
    .filter(f => f.importance > 0);
};

// Handle incoming scam alerts
const handleScamAlert = (data) => {
  // Dispatch event for UI updates
  const event = new CustomEvent('scamAlert', { detail: data });
  window.dispatchEvent(event);
};

// Clean up resources
export const cleanup = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  if (model) {
    model.dispose();
    model = null;
  }
};