import React, { useState, useRef } from 'react';
import axios from 'axios';
import './TherapyPage.css';

const TherapyPage = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post('/api/therapy/query', {
        query: query
      });
      setResponse(response.data.response);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Sorry, there was an error processing your request.');
    }
    setIsLoading(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob);

        setIsLoading(true);
        try {
          // For now, we'll simulate speech recognition since we don't have the backend implementation
          const simulatedText = "I'm having trouble reading and writing";
          setQuery(simulatedText);
          
          const response = await axios.post('/api/therapy/query', {
            query: simulatedText
          });
          setResponse(response.data.response);
        } catch (error) {
          console.error('Error:', error);
          setResponse('Sorry, there was an error processing your speech.');
        }
        setIsLoading(false);
      };

      mediaRecorderRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setResponse('Error accessing microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="therapy-container">
      <h1>🧠 Therapist Chatbot for Dyslexic Individuals</h1>
      
      <div className="input-section">
        <form onSubmit={handleTextSubmit}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your message here..."
            className="text-input"
          />
          <button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? 'Processing...' : 'Send'}
          </button>
        </form>

        <div className="voice-section">
          <p>Or use voice input:</p>
          <button
            onClick={isListening ? stopRecording : startRecording}
            className={`voice-button ${isListening ? 'listening' : ''}`}
          >
            {isListening ? '🎤 Stop Recording' : '🎤 Start Recording'}
          </button>
        </div>
      </div>

      {response && (
        <div className="response-section">
          <h3>Therapist's Response:</h3>
          <div className="response-content">
            {response}
          </div>
        </div>
      )}
    </div>
  );
};

export default TherapyPage; 