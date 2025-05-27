import { createWorker } from 'tesseract.js';
import { SCAM_PHRASES } from '../utils/constants';

// Initialize Tesseract worker
let worker = null;

const initializeWorker = async () => {
  if (!worker) {
    worker = await createWorker('eng');
  }
  return worker;
};

/**
 * Analyzes an image for potential scam indicators
 * @param {File} image - The image file to analyze
 * @returns {Promise<{riskScore: number, safetyScore: number, matches: string[], extractedText: string, suspiciousBankReferences: boolean}>}
 */
export const analyzeImage = async (image) => {
  try {
    // Initialize Tesseract worker
    const worker = await initializeWorker();
    
    // Convert image to text
    const { data: { text } } = await worker.recognize(image);
    
    // Analyze extracted text
    const textLower = text.toLowerCase();
    const matches = [];
    let riskScore = 0;
    
    // Check for known scam phrases
    SCAM_PHRASES.forEach(phrase => {
      if (textLower.includes(phrase.toLowerCase())) {
        matches.push(phrase);
        riskScore += 15; // Increment risk score for each matched phrase
      }
    });
    
    // Check for suspicious patterns
    const patterns = {
      urgency: /urgent|immediate|limited time|act now|expires|deadline/i,
      financial: /bank|account|credit|debit|money|payment|transfer|bitcoin|crypto/i,
      personal: /ssn|social security|password|login|verify|confirm|authenticate/i,
      pressure: /must|required|mandatory|warning|alert|suspended|blocked/i,
      rewards: /prize|winner|lottery|reward|gift card|free|won/i
    };
    
    Object.entries(patterns).forEach(([key, pattern]) => {
      if (pattern.test(textLower)) {
        riskScore += 10;
      }
    });
    
    // Check for suspicious bank references
    const suspiciousBankReferences = /bank.*verify|verify.*account|account.*suspended/i.test(textLower);
    if (suspiciousBankReferences) {
      riskScore += 20;
    }
    
    // Cap risk score at 100
    riskScore = Math.min(riskScore, 100);
    
    // Calculate safety score (inverse of risk score)
    const safetyScore = 100 - riskScore;
    
    return {
      riskScore,
      safetyScore,
      matches,
      extractedText: text,
      suspiciousBankReferences
    };
  } catch (error) {
    console.error('Image analysis error:', error);
    throw new Error('Failed to analyze image. Please try again.');
  }
};

/**
 * Analyzes voice transcript for potential scam indicators
 * @param {string} transcript - The text transcript to analyze
 * @returns {Promise<{riskScore: number, matches: string[], transcript: string}>}
 */
export const analyzeVoiceTranscript = async (transcript) => {
  if (!transcript) {
    return {
      riskScore: 0,
      matches: [],
      transcript: ''
    };
  }

  const transcriptLower = transcript.toLowerCase();
  const matches = [];
  let riskScore = 0;

  // Check for known scam phrases
  SCAM_PHRASES.forEach(phrase => {
    const phraseLower = phrase.toLowerCase();
    if (transcriptLower.includes(phraseLower)) {
      matches.push(phrase);
      riskScore += 15;
    }
  });

  // Check for patterns indicating scam
  const patterns = {
    urgency: {
      pattern: /urgent|immediately|right now|emergency|cannot wait/i,
      weight: 10
    },
    threats: {
      pattern: /suspend|terminate|legal action|police|arrest|lawsuit/i,
      weight: 15
    },
    pressure: {
      pattern: /must|have to|required|mandatory|no choice/i,
      weight: 10
    },
    financial: {
      pattern: /bank account|credit card|wire transfer|western union|moneygram/i,
      weight: 15
    },
    personal: {
      pattern: /social security|password|verify identity|confirm details/i,
      weight: 20
    }
  };

  Object.entries(patterns).forEach(([key, { pattern, weight }]) => {
    if (pattern.test(transcriptLower)) {
      riskScore += weight;
    }
  });

  // Additional risk factors
  if (transcriptLower.includes('gift card')) riskScore += 25;
  if (transcriptLower.includes('bitcoin') || transcriptLower.includes('crypto')) riskScore += 20;
  if (/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(transcriptLower)) riskScore += 15; // Phone number pattern
  if (transcript === transcript.toUpperCase()) riskScore += 10; // All caps text

  // Cap the risk score at 100
  riskScore = Math.min(riskScore, 100);

  return {
    riskScore,
    matches,
    transcript
  };
};