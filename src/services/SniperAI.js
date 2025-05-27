import * as Comlink from 'comlink';
import * as tf from '@tensorflow/tfjs';
import { AI_CONSTANTS } from '../utils/constants';

// Enhanced SniperAI service with multi-model training
class SniperAIService {
  constructor() {
    this.worker = null;
    this.ai = null;
    this.isInitialized = false;
    this.models = new Map();
    this.trainingData = new Map();
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Create worker and wrap with Comlink
      this.worker = new Worker(
        new URL('./SniperAI.worker.js', import.meta.url),
        { type: 'module' }
      );
      
      // Create proxy to worker
      const SniperAI = Comlink.wrap(this.worker);
      this.ai = await new SniperAI();
      
      // Initialize base models - ensure we await this
      await this.initializeModels();
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('SniperAI initialization error:', error);
      return false;
    }
  }

  async initializeModels() {
    // Initialize different models for specialized tasks
    const modelTypes = ['general', 'sentiment', 'intent', 'safety'];
    
    for (const type of modelTypes) {
      try {
        // Try to load existing model
        const model = await tf.loadLayersModel(`indexeddb://sniper-ai-${type}-model`);
        // Ensure model is compiled after loading
        model.compile({
          optimizer: tf.train.adam(0.001),
          loss: type === 'sentiment' || type === 'intent' ? 'categoricalCrossentropy' : 'binaryCrossentropy',
          metrics: ['accuracy']
        });
        this.models.set(type, model);
        console.log(`Loaded existing ${type} model`);
      } catch (e) {
        // Create new model if none exists
        const model = this.createModel(type);
        await model.save(`indexeddb://sniper-ai-${type}-model`);
        this.models.set(type, model);
        console.log(`Created new ${type} model`);
      }
      
      // Load training data
      const savedData = localStorage.getItem(`sniper-ai-${type}-training`);
      if (savedData) {
        this.trainingData.set(type, JSON.parse(savedData));
      } else {
        this.trainingData.set(type, []);
      }
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
    
    // Ensure model is compiled immediately after creation
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: type === 'sentiment' || type === 'intent' ? 'categoricalCrossentropy' : 'binaryCrossentropy',
      metrics: ['accuracy']
    });
    
    return model;
  }

  async analyze(text) {
    if (!this.isInitialized) await this.initialize();

    try {
      const results = await Promise.all([
        this.analyzeWithModel(text, 'general'),
        this.analyzeWithModel(text, 'sentiment'),
        this.analyzeWithModel(text, 'intent'),
        this.analyzeWithModel(text, 'safety')
      ]);
      
      return {
        success: true,
        general: results[0],
        sentiment: results[1],
        intent: results[2],
        safety: results[3],
        confidence: Math.min(...results.map(r => r.confidence)),
        needsTraining: this.needsMoreTraining()
      };
    } catch (error) {
      console.error('Analysis error:', error);
      return { success: false, error: error.message };
    }
  }

  async analyzeWithModel(text, type) {
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

  async analyzeChat(text) {
    if (!this.isInitialized) await this.initialize();

    try {
      const features = this.extractFeatures(text, 'intent');
      const model = this.models.get('intent');
      
      const prediction = model.predict(tf.tensor2d([features]));
      const scores = await prediction.data();
      prediction.dispose();

      const intentIndex = scores.indexOf(Math.max(...scores));
      const confidence = scores[intentIndex];

      return {
        success: true,
        intent: AI_CONSTANTS.CHAT_INTENTS[intentIndex],
        confidence,
        features: this.analyzeFeatures(features, 'intent'),
        needsTraining: this.needsMoreTraining('intent')
      };
    } catch (error) {
      console.error('Chat analysis error:', error);
      return { success: false, error: error.message };
    }
  }

  async trainChat(text, intentIndex) {
    if (!this.isInitialized) await this.initialize();

    try {
      const result = await this.trainModel(text, intentIndex, 'intent');
      return {
        success: true,
        ...result
      };
    } catch (error) {
      console.error('Chat training error:', error);
      return { success: false, error: error.message };
    }
  }

  async train(text, labels) {
    if (!this.isInitialized) await this.initialize();

    try {
      const results = await Promise.all(
        Object.entries(labels).map(([type, label]) => 
          this.trainModel(text, label, type)
        )
      );
      
      return {
        success: true,
        results: Object.fromEntries(
          results.map((result, i) => [
            Object.keys(labels)[i],
            result
          ])
        )
      };
    } catch (error) {
      console.error('Training error:', error);
      return { success: false, error: error.message };
    }
  }

  async trainModel(text, label, type) {
    const features = this.extractFeatures(text, type);
    const model = this.models.get(type);
    
    // Verify model is compiled before training
    if (!model.compiled) {
      model.compile({
        optimizer: tf.train.adam(0.001),
        loss: type === 'sentiment' || type === 'intent' ? 'categoricalCrossentropy' : 'binaryCrossentropy',
        metrics: ['accuracy']
      });
    }
    
    // Add to training data
    const trainingData = this.trainingData.get(type);
    trainingData.push({
      features,
      label,
      text,
      timestamp: Date.now()
    });
    
    // Save training data
    localStorage.setItem(
      `sniper-ai-${type}-training`,
      JSON.stringify(trainingData)
    );

    // Convert to tensors
    const xs = tf.tensor2d([features]);
    const ys = type === 'sentiment' || type === 'intent'
      ? tf.oneHot([label], this.getNumClasses(type))
      : tf.tensor2d([[label]]);

    // Train model
    const result = await model.fit(xs, ys, {
      epochs: 5,
      batchSize: 1,
      shuffle: true
    });

    // Save updated model
    await model.save(`indexeddb://sniper-ai-${type}-model`);

    // Cleanup
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
        return 3; // negative, neutral, positive
      case 'intent':
        return AI_CONSTANTS.CHAT_INTENT_CLASSES;
      default:
        return 1;
    }
  }

  needsMoreTraining(type = null) {
    if (type) {
      const data = this.trainingData.get(type);
      return !data || data.length < AI_CONSTANTS.MIN_CHAT_TRAINING_SAMPLES;
    }
    
    return Array.from(this.trainingData.values()).some(
      data => !data || data.length < AI_CONSTANTS.MIN_TRAINING_SAMPLES
    );
  }

  async reset() {
    try {
      // Clear all training data
      this.trainingData.clear();
      for (const type of this.models.keys()) {
        localStorage.removeItem(`sniper-ai-${type}-training`);
        await tf.io.removeModel(`indexeddb://sniper-ai-${type}-model`);
      }
      
      this.models.clear();
      this.isInitialized = false;
      await this.initialize();

      return { success: true };
    } catch (error) {
      console.error('Reset error:', error);
      return { success: false, error: error.message };
    }
  }

  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.ai = null;
      this.isInitialized = false;
      
      // Cleanup TensorFlow.js models
      for (const model of this.models.values()) {
        model.dispose();
      }
      this.models.clear();
      this.trainingData.clear();
    }
  }
}

// Export singleton instance
export default new SniperAIService();