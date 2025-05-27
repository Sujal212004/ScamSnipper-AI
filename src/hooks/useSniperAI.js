import { useState, useEffect, useCallback } from 'react';
import SniperAI from '../services/SniperAI';

export const useSniperAI = () => {
  const [isReady, setIsReady] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [error, setError] = useState(null);

  // Initialize SniperAI
  useEffect(() => {
    const init = async () => {
      try {
        await SniperAI.initialize();
        setIsReady(true);
      } catch (err) {
        setError(err.message);
      }
    };
    init();

    // Cleanup on unmount
    return () => {
      SniperAI.terminate();
    };
  }, []);

  // Analyze text
  const analyze = useCallback(async (text) => {
    if (!text) return null;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await SniperAI.analyze(text);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Train model
  const train = useCallback(async (text, isScam) => {
    setIsTraining(true);
    setError(null);
    
    try {
      const result = await SniperAI.train(text, isScam);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsTraining(false);
    }
  }, []);

  // Reset model
  const reset = useCallback(async () => {
    setError(null);
    try {
      return await SniperAI.reset();
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  return {
    isReady,
    isAnalyzing,
    isTraining,
    error,
    analyze,
    train,
    reset
  };
};