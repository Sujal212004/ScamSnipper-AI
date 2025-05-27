import { useState, useEffect, useCallback } from 'react';

const useSpeechRecognition = (options = {}) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  
  // Check if browser supports speech recognition
  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  
  // Create recognition object if supported
  const recognition = isSupported
    ? new (window.SpeechRecognition || window.webkitSpeechRecognition)()
    : null;
  
  // Configure recognition
  useEffect(() => {
    if (!recognition) return;
    
    recognition.continuous = options.continuous ?? true;
    recognition.interimResults = options.interimResults ?? true;
    recognition.lang = options.language ?? 'en-US';
    
    // Handle recognition results
    recognition.onresult = (event) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;
        
        if (result.isFinal) {
          finalTranscript += text;
        } else {
          // For interim results, just update directly
          setTranscript(text);
        }
      }
      
      // Update with final transcript if available
      if (finalTranscript) {
        setTranscript(prev => prev + ' ' + finalTranscript);
      }
      
      // Call onResult callback if provided
      if (options.onResult) {
        options.onResult(finalTranscript || event.results[event.resultIndex][0].transcript);
      }
    };
    
    // Handle errors
    recognition.onerror = (event) => {
      setError(event.error);
      if (options.onError) {
        options.onError(event.error);
      }
    };
    
    // Handle recognition end
    recognition.onend = () => {
      // Only update listening state if we're not manually stopping
      if (isListening) {
        // If continuous is true, restart recognition
        if (options.continuous) {
          recognition.start();
        } else {
          setIsListening(false);
          if (options.onEnd) {
            options.onEnd();
          }
        }
      }
    };
  }, [recognition, options, isListening]);
  
  // Start listening
  const startListening = useCallback(() => {
    if (!recognition) {
      setError('Speech recognition not supported in this browser.');
      return;
    }
    
    setError(null);
    setIsListening(true);
    
    try {
      recognition.start();
    } catch (err) {
      // Handle already started error
      if (err.name === 'InvalidStateError') {
        recognition.stop();
        setTimeout(() => {
          recognition.start();
        }, 100);
      } else {
        setError(err.message);
        setIsListening(false);
      }
    }
  }, [recognition]);
  
  // Stop listening
  const stopListening = useCallback(() => {
    if (!recognition) return;
    
    setIsListening(false);
    recognition.stop();
    
    if (options.onEnd) {
      options.onEnd();
    }
  }, [recognition, options]);
  
  // Clear transcript
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);
  
  return {
    transcript,
    isListening,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
};

export default useSpeechRecognition;