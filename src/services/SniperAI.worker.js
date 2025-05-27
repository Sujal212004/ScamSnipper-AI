import * as Comlink from 'comlink';
import * as tf from '@tensorflow/tfjs';
import { AI_CONSTANTS } from '../utils/constants';

class SniperAI {
  constructor() {
    this.models = new Map();
    this.trainingData = new Map();
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      await this.initializeModels();
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Worker initialization error:', error);
      return false;
    }
  }

  async initializeModels() {
    const modelTypes = ['general', 'sentiment', 'intent', 'safety'];
    
    for (const type of modelTypes) {
      try {
        const model = await tf.loadLayersModel(`indexeddb://sniper-ai-${type}-model`);
        this.models.set(type, model);
      } catch (e) {
        const model = this.createModel(type);
        await model.save(`indexeddb://sniper-ai-${type}-model`);
        this.models.set(type, model);
      }
      
      const savedData = localStorage.getItem(`sniper-ai-${type}-training`);
      this.trainingData.set(type, savedData ? JSON.parse(savedData) : []);
    }
  }

  createModel(type) {
    const model = tf.sequential();
    
    switch (type) {
      case 'general':
        model.add(tf.layers.dense({
          inputShape: [AI_CONSTANTS.MODEL_ARCHITECTURE.inputShape[0]],
          units: 32,
          activation: 'relu'
        }));
        model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
        break;
        
      case 'sentiment':
        model.add(tf.layers.embedding({
          inputDim: AI_CONSTANTS.CHAT_VOCAB_SIZE,
          outputDim: 32,
          inputLength: AI_CONSTANTS.MAX_SEQUENCE_LENGTH
        }));
        model.add(tf.layers.lstm({ units: 64 }));
        model.add(tf.layers.dense({ units: 3, activation: 'softmax' }));
        break;
        
      case 'intent':
        model.add(tf.layers.embedding({
          inputDim: AI_CONSTANTS.CHAT_VOCAB_SIZE,
          outputDim: 64,
          inputLength: AI_CONSTANTS.MAX_SEQUENCE_LENGTH
        }));
        model.add(tf.layers.bidirectional({
          layer: tf.layers.lstm({ units: 32, returnSequences: true })
        }));
        model.add(tf.layers.globalMaxPooling1d());
        model.add(tf.layers.dense({ 
          units: AI_CONSTANTS.CHAT_INTENT_CLASSES,
          activation: 'softmax'
        }));
        break;
        
      case 'safety':
        model.add(tf.layers.dense({
          inputShape: [AI_CONSTANTS.MODEL_ARCHITECTURE.inputShape[0]],
          units: 64,
          activation: 'relu'
        }));
        model.add(tf.layers.dropout({ rate: 0.3 }));
        model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
        break;
    }
    
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: type === 'sentiment' || type === 'intent' ? 'categoricalCrossentropy' : 'binaryCrossentropy',
      metrics: ['accuracy']
    });
    
    return model;
  }

  async analyze(text, type) {
    if (!this.isInitialized) await this.initialize();

    const model = this.models.get(type);
    const features = this.extractFeatures(text, type);
    
    const prediction = model.predict(tf.tensor2d([features]));
    const scores = await prediction.data();
    prediction.dispose();
    
    return {
      type,
      scores,
      confidence: Math.max(...scores),
      features: this.analyzeFeatures(features, type)
    };
  }

  async train(text, label, type) {
    if (!this.isInitialized) await this.initialize();

    const features = this.extractFeatures(text, type);
    const model = this.models.get(type);
    
    const trainingData = this.trainingData.get(type);
    trainingData.push({ features, label, text, timestamp: Date.now() });
    localStorage.setItem(`sniper-ai-${type}-training`, JSON.stringify(trainingData));

    const xs = tf.tensor2d([features]);
    const ys = type === 'sentiment' || type === 'intent'
      ? tf.oneHot([label], this.getNumClasses(type))
      : tf.tensor2d([[label]]);

    const result = await model.fit(xs, ys, {
      epochs: 5,
      batchSize: 1,
      shuffle: true
    });

    await model.save(`indexeddb://sniper-ai-${type}-model`);

    xs.dispose();
    ys.dispose();

    return {
      accuracy: result.history.acc[result.history.acc.length - 1],
      loss: result.history.loss[result.history.loss.length - 1]
    };
  }

  extractFeatures(text, type) {
    switch (type) {
      case 'general':
      case 'safety':
        return this.extractGeneralFeatures(text);
      case 'sentiment':
      case 'intent':
        return this.extractSequenceFeatures(text);
      default:
        throw new Error(`Unknown model type: ${type}`);
    }
  }

  extractGeneralFeatures(text) {
    const features = new Array(AI_CONSTANTS.MODEL_ARCHITECTURE.inputShape[0]).fill(0);
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
  }

  extractSequenceFeatures(text) {
    const features = new Array(AI_CONSTANTS.MAX_SEQUENCE_LENGTH).fill(0);
    const tokens = text.toLowerCase().split(/\s+/).slice(0, AI_CONSTANTS.MAX_SEQUENCE_LENGTH);
    
    tokens.forEach((token, i) => {
      features[i] = AI_CONSTANTS.CHAT_VOCAB[token] || AI_CONSTANTS.CHAT_VOCAB['<UNK>'];
    });

    return features;
  }

  analyzeFeatures(features, type) {
    switch (type) {
      case 'general':
      case 'safety':
        return features.map((value, index) => ({
          feature: AI_CONSTANTS.FEATURES[index],
          importance: value
        })).filter(f => f.importance > 0);
        
      case 'sentiment':
      case 'intent':
        return features
          .map((value, index) => ({
            token: Object.keys(AI_CONSTANTS.CHAT_VOCAB).find(k => 
              AI_CONSTANTS.CHAT_VOCAB[k] === value
            ) || '<UNK>',
            position: index,
            value
          }))
          .filter(f => f.value > 0);
    }
  }

  getNumClasses(type) {
    switch (type) {
      case 'sentiment':
        return 3;
      case 'intent':
        return AI_CONSTANTS.CHAT_INTENT_CLASSES;
      default:
        return 1;
    }
  }
}

Comlink.expose(SniperAI);