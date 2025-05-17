const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google Generative AI with API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Read Aloud API
router.post('/read-aloud', (req, res) => {
  try {
    const { text } = req.body;
    // In a real app, this would connect to a text-to-speech service
    res.json({ 
      success: true, 
      message: 'Text received for speech conversion',
      textLength: text ? text.length : 0
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Educational Chatbot API (Gemini API integration)
router.post('/generate', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        message: 'GEMINI_API_KEY is not configured on the server' 
      });
    }

    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Create the prompt
    const prompt = `${query}\n
      You're an educational assistant for a child with dyslexia.
      Use simple language, no images, 120-word limit.
      Focus on clarity, repetition, chunking, and encouragement.
      Do not give words enclosed in asterisk.
      Make it as simple as possible, as if you're explaining to a kid who has just started learning that concept.
      Don't give people as examples.`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    res.json({ 
      success: true, 
      text: text
    });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to generate content' 
    });
  }
});

// Emotional Chatbot API
router.post('/emotional-chat', (req, res) => {
  try {
    const { message } = req.body;
    // In a real app, this would connect to an AI service
    res.json({ 
      success: true, 
      response: "I understand how you feel. It's perfectly normal to feel that way. Would you like to talk more about it?"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Therapy Chatbot API
router.post('/therapy-session', (req, res) => {
  try {
    const { sessionId, message } = req.body;
    // In a real app, this would connect to an AI service
    res.json({ 
      success: true, 
      sessionId: sessionId || 'new-session-123',
      response: "That's great progress! Let's continue with our session. How did that last exercise make you feel?"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Writing Assistant API
router.post('/analyze-text', (req, res) => {
  try {
    const { text, analysisType } = req.body;
    
    let result;
    // In a real app, this would connect to different NLP services based on analysis type
    switch(analysisType) {
      case 'simplify':
        result = "This is a simplified version of your text. It uses shorter sentences and simpler words.";
        break;
      case 'grammar':
        result = "Grammar check complete. 2 suggestions found.";
        break;
      case 'spelling':
        result = "Spelling check complete. 3 possible errors found.";
        break;
      case 'summarize':
        result = "Summary: This is a concise summary of the main points in your text.";
        break;
      default:
        result = "Please select a valid analysis type.";
    }
    
    res.json({ 
      success: true, 
      result,
      originalTextLength: text ? text.length : 0
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user sessions
router.get('/user-sessions', (req, res) => {
  try {
    // In a real app, this would fetch from a database
    res.json({ 
      success: true, 
      sessions: [
        {
          id: 1,
          title: 'Building Reading Confidence',
          description: 'A guided session to develop strategies for reading with confidence and reducing anxiety.',
          progress: 75
        },
        {
          id: 2,
          title: 'Word Recognition Techniques',
          description: 'Learn and practice effective methods for recognizing challenging words.',
          progress: 30
        },
        {
          id: 3,
          title: 'Managing Frustration',
          description: 'Develop coping mechanisms for dealing with frustration during reading and writing tasks.',
          progress: 50
        }
      ]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router; 