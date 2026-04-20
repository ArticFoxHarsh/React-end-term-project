/**
 * useSpeechRecognition.js
 * 
 * Custom hook for Web Speech API with simple, reliable implementation
 * Handles browser compatibility and transcription
 */

import { useState, useRef, useEffect } from 'react';

const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState('');
  
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);

  useEffect(() => {
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      console.log('Speech Recognition API not supported');
      return;
    }

    setIsSupported(true);
    
    // Create recognition instance
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.language = 'en-US';

    // Handle recognition results
    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          final += transcriptPart;
        } else {
          interim += transcriptPart;
        }
      }

      if (final) {
        setTranscript(prev => {
          const updated = prev + (prev ? ' ' : '') + final;
          console.log('✅ Final transcript added:', final);
          console.log('📝 Total transcript:', updated);
          return updated;
        });
      }

      setInterimTranscript(interim);
    };

    // Handle errors
    recognition.onerror = (event) => {
      console.error('❌ Speech error:', event.error);
      setError(event.error);
      setIsListening(false);
      isListeningRef.current = false;
    };

    // Handle end of recognition
    recognition.onend = () => {
      console.log('🛑 Recognition ended');
      setIsListening(false);
      isListeningRef.current = false;
    };

    recognitionRef.current = recognition;

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Start listening
  const startListening = () => {
    if (!recognitionRef.current || isListeningRef.current) return;

    try {
      console.log('🎤 Starting speech recognition...');
      setError('');
      setTranscript('');
      setInterimTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
      isListeningRef.current = true;
    } catch (err) {
      console.error('Failed to start recognition:', err);
      setError(err.message);
    }
  };

  // Stop listening
  const stopListening = () => {
    if (!recognitionRef.current) return;

    try {
      console.log('⏹️ Stopping speech recognition...');
      recognitionRef.current.stop();
      setIsListening(false);
      isListeningRef.current = false;
    } catch (err) {
      console.error('Failed to stop recognition:', err);
      setError(err.message);
    }
  };

  // Reset transcript
  const resetTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
    setError('');
  };

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
};

export default useSpeechRecognition;
