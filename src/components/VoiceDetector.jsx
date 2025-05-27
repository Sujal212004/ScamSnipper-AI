import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, AlertTriangle, Play, Square, CheckCircle } from 'lucide-react';
import Card from './common/Card';
import Button from './common/Button';
import { SCAM_PHRASES } from '../utils/constants';
import { useScamReports } from '../contexts/ScamReportsContext';
import { analyzeVoiceTranscript } from '../services/scamDetection';
import useSpeechRecognition from '../hooks/useSpeechRecognition';

const VoiceDetector = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [detectedPhrases, setDetectedPhrases] = useState([]);
  const [demoMode, setDemoMode] = useState(false);
  const [demoAudio, setDemoAudio] = useState(null);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const { addReport } = useScamReports();
  const audioContextRef = useRef(null);
  const demoTimeoutRef = useRef(null);
  
  // Initialize speech recognition
  const {
    transcript,
    isListening,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition({
    onResult: (result) => {
      console.log('Speech recognition result:', result);
    }
  });
  
  // Handle transcript changes
  useEffect(() => {
    if (!transcript) return;
    
    // Analyze transcript for scam indicators
    const analyze = async () => {
      try {
        const result = await analyzeVoiceTranscript(transcript);
        setAnalysis(result);
        
        // Update detected phrases
        if (result.matches && result.matches.length > 0) {
          setDetectedPhrases(prev => 
            [...new Set([...prev, ...result.matches])]
          );
        }
        
        // If risk score is high, add a report
        if (result.riskScore >= 50) {
          addReport({
            type: 'Voice Scam',
            source: 'Voice Recognition',
            safetyScore: Math.max(0, 100 - result.riskScore),
            details: {
              transcript,
              matches: result.matches,
              message: `Voice scam detected with ${result.matches.length} suspicious phrases.`
            },
            location: { lat: 40.7128, lng: -74.0060, city: 'New York' } // Demo location
          });
        }
      } catch (error) {
        console.error('Error analyzing voice transcript:', error);
      }
    };
    
    analyze();
  }, [transcript, addReport]);
  
  // Start recording
  const handleStartRecording = () => {
    setIsRecording(true);
    resetTranscript();
    setDetectedPhrases([]);
    setAnalysis(null);
    startListening();
  };
  
  // Stop recording
  const handleStopRecording = () => {
    setIsRecording(false);
    stopListening();
  };
  
  // Toggle demo mode
  const toggleDemoMode = () => {
    setDemoMode(!demoMode);
    
    if (!demoMode) {
      // Generate demo audio
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      // Create demo speech synthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance();
        
        // Randomly select some scam phrases for the demo
        const randomPhrases = [];
        const numPhrases = Math.floor(Math.random() * 3) + 2; // 2-4 phrases
        
        for (let i = 0; i < numPhrases; i++) {
          const randomIndex = Math.floor(Math.random() * SCAM_PHRASES.length);
          randomPhrases.push(SCAM_PHRASES[randomIndex]);
        }
        
        // Create a convincing scam script
        utterance.text = `Hello, this is an important message regarding your account security. 
                          We have detected suspicious activity on your account. 
                          To verify your identity and prevent unauthorized access, 
                          we need you to ${randomPhrases.join('. Please also ')}.
                          This is urgent and requires your immediate attention.`;
        
        utterance.rate = 0.9;
        utterance.pitch = 1;
        
        setDemoAudio(utterance);
      }
    } else {
      // Clean up demo
      if (demoTimeoutRef.current) {
        clearTimeout(demoTimeoutRef.current);
        demoTimeoutRef.current = null;
      }
      
      if (isPlayingDemo) {
        window.speechSynthesis.cancel();
        setIsPlayingDemo(false);
      }
    }
  };
  
  // Play demo audio
  const playDemoAudio = () => {
    if (!demoAudio) return;
    
    setIsPlayingDemo(true);
    resetTranscript();
    setDetectedPhrases([]);
    setAnalysis(null);
    
    // Start speech synthesis
    window.speechSynthesis.speak(demoAudio);
    
    // Simulate transcript generation
    const demoText = demoAudio.text;
    const words = demoText.split(' ');
    let currentIndex = 0;
    
    const simulateTranscript = () => {
      if (currentIndex >= words.length) {
        setIsPlayingDemo(false);
        return;
      }
      
      // Add a few words at a time
      const wordsToAdd = Math.min(5, words.length - currentIndex);
      const segment = words.slice(currentIndex, currentIndex + wordsToAdd).join(' ');
      
      // Update transcript
      resetTranscript();
      const newTranscript = demoText.split(' ').slice(0, currentIndex + wordsToAdd).join(' ');
      
      // This would ideally update the transcript state, but since we're using a custom hook,
      // we'll analyze it directly
      analyzeVoiceTranscript(newTranscript).then(result => {
        setAnalysis(result);
        
        // Update detected phrases
        if (result.matches && result.matches.length > 0) {
          setDetectedPhrases(prev => 
            [...new Set([...prev, ...result.matches])]
          );
        }
      });
      
      currentIndex += wordsToAdd;
      
      // Schedule next update
      demoTimeoutRef.current = setTimeout(simulateTranscript, 700);
    };
    
    // Start simulation
    simulateTranscript();
  };
  
  // Stop demo audio
  const stopDemoAudio = () => {
    if (isPlayingDemo) {
      window.speechSynthesis.cancel();
      
      if (demoTimeoutRef.current) {
        clearTimeout(demoTimeoutRef.current);
        demoTimeoutRef.current = null;
      }
      
      setIsPlayingDemo(false);
    }
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isListening) {
        stopListening();
      }
      
      if (isPlayingDemo) {
        window.speechSynthesis.cancel();
      }
      
      if (demoTimeoutRef.current) {
        clearTimeout(demoTimeoutRef.current);
      }
    };
  }, [isListening, isPlayingDemo, stopListening]);
  
  // Check if browser supports speech recognition
  if (!isSupported && !demoMode) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Voice Scam Detector</h1>
          <p className="text-gray-600 mb-8">
            Detect potential scam calls in real-time by analyzing the conversation.
          </p>
        </motion.div>
        
        <Card>
          <div className="text-center py-8">
            <MicOff className="h-12 w-12 text-danger-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900">Speech Recognition Not Supported</h3>
            <p className="mt-2 text-gray-600 max-w-md mx-auto">
              Your browser doesn't support speech recognition. Please try using a different browser like Chrome, Edge, or Safari.
            </p>
            <div className="mt-6">
              <Button onClick={toggleDemoMode}>
                Try Demo Mode Instead
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Voice Scam Detector</h1>
        <p className="text-gray-600 mb-8">
          {demoMode 
            ? "Demo mode: Listen to a simulated scam call and see how our detector identifies suspicious phrases."
            : "Detect potential scam calls in real-time by analyzing the conversation."}
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main recording panel */}
        <div className="lg:col-span-2">
          <Card>
            <div className="text-center py-6">
              <motion.div
                animate={isRecording || isPlayingDemo ? {
                  scale: [1, 1.1, 1],
                  transition: { repeat: Infinity, duration: 1.5 }
                } : {}}
                className={`inline-flex items-center justify-center h-24 w-24 rounded-full ${
                  isRecording || isPlayingDemo 
                    ? 'bg-danger-100 text-danger-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {demoMode ? (
                  isPlayingDemo ? (
                    <Volume2 className="h-12 w-12" />
                  ) : (
                    <Volume2 className="h-12 w-12" />
                  )
                ) : (
                  isRecording ? (
                    <Mic className="h-12 w-12" />
                  ) : (
                    <MicOff className="h-12 w-12" />
                  )
                )}
              </motion.div>
              
              <h3 className="mt-4 text-xl font-medium text-gray-900">
                {demoMode
                  ? (isPlayingDemo ? "Playing Demo Call..." : "Demo Mode")
                  : (isRecording ? "Listening..." : "Start Listening")}
              </h3>
              
              <p className="mt-2 text-gray-600 max-w-md mx-auto">
                {demoMode
                  ? "Play a demo of a scam call to see how our detector works."
                  : "Speak or play a phone call to detect potential scam phrases in real-time."}
              </p>
              
              <div className="mt-6 flex justify-center space-x-4">
                {demoMode ? (
                  isPlayingDemo ? (
                    <Button 
                      variant="danger" 
                      onClick={stopDemoAudio}
                      icon={<Square className="h-4 w-4" />}
                    >
                      Stop Demo
                    </Button>
                  ) : (
                    <Button 
                      onClick={playDemoAudio}
                      icon={<Play className="h-4 w-4" />}
                    >
                      Play Demo Call
                    </Button>
                  )
                ) : (
                  isRecording ? (
                    <Button 
                      variant="danger" 
                      onClick={handleStopRecording}
                      icon={<Square className="h-4 w-4" />}
                    >
                      Stop Listening
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleStartRecording}
                      icon={<Mic className="h-4 w-4" />}
                    >
                      Start Listening
                    </Button>
                  )
                )}
                
                <Button 
                  variant="outline" 
                  onClick={toggleDemoMode}
                >
                  {demoMode ? "Exit Demo Mode" : "Try Demo Mode"}
                </Button>
              </div>
            </div>
            
            {/* Transcript display */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Transcript</h3>
              <div className="bg-gray-50 rounded-lg p-4 min-h-[200px] max-h-[300px] overflow-y-auto">
                {transcript || (analysis && analysis.transcript) ? (
                  <p className="text-gray-800 whitespace-pre-line">
                    {transcript || analysis.transcript}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">
                    {isRecording || isPlayingDemo 
                      ? "Listening for speech..." 
                      : "Transcript will appear here when you start listening."}
                  </p>
                )}
              </div>
            </div>
            
            {/* Analysis results */}
            {analysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 pt-6 border-t border-gray-200"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-3">Analysis Results</h3>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-700 font-medium">Risk Level:</span>
                    <div className="flex items-center">
                      {analysis.riskScore >= 75 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger-50 text-danger-700">
                          High Risk
                        </span>
                      ) : analysis.riskScore >= 25 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-50 text-warning-700">
                          Medium Risk
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-50 text-success-700">
                          Low Risk
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Risk Score</span>
                      <span className="text-sm font-medium text-gray-700">{analysis.riskScore}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          analysis.riskScore >= 75 ? 'bg-danger-500' :
                          analysis.riskScore >= 25 ? 'bg-warning-500' : 'bg-success-500'
                        }`} 
                        style={{ width: `${analysis.riskScore}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {detectedPhrases.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Detected Suspicious Phrases:
                      </h4>
                      <ul className="space-y-2">
                        {detectedPhrases.map((phrase, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex items-center"
                          >
                            <AlertTriangle className="h-4 w-4 text-warning-500 mr-2" />
                            <span className="text-sm">{phrase}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </Card>
        </div>
        
        {/* Right column */}
        <div>
          {/* Common scam phrases */}
          <Card
            title="Common Scam Phrases"
            icon={<AlertTriangle className="h-5 w-5 text-warning-500" />}
            className="mb-6"
          >
            <p className="text-sm text-gray-600 mb-4">
              Watch out for these common phrases used in scam calls. Our detector is trained to recognize these and similar patterns.
            </p>
            
            <ul className="space-y-2">
              {SCAM_PHRASES.slice(0, 10).map((phrase, index) => (
                <li key={index} className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{phrase}</span>
                </li>
              ))}
            </ul>
          </Card>
          
          {/* Tips */}
          <Card
            title="How To Use This Tool"
            icon={<Volume2 className="h-5 w-5 text-primary-600" />}
          >
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-800 font-medium mr-2">1</span>
                <span>Press "Start Listening" and put your phone on speaker mode near your device.</span>
              </li>
              <li className="flex">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-800 font-medium mr-2">2</span>
                <span>Our system will analyze the conversation in real-time for suspicious phrases.</span>
              </li>
              <li className="flex">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-800 font-medium mr-2">3</span>
                <span>If scam phrases are detected, you'll see alerts and a risk score.</span>
              </li>
              <li className="flex">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-800 font-medium mr-2">4</span>
                <span>For privacy, no recordings are stored - only analyzed in your browser.</span>
              </li>
            </ul>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Privacy Note:</strong> All speech processing happens locally in your browser. 
                No audio is sent to our servers or stored.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VoiceDetector;