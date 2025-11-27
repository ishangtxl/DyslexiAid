const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

// Initialize Google Generative AI with API key from env
console.log('API Key (first 10 chars):', process.env.GEMINI_API_KEY?.substring(0, 10));
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


// Educational Chatbot API (Study Pal)
router.post('/generate', async (req, res) => {
  try {
    const { query } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'GEMINI_API_KEY is not configured on the server'
      });
    }

    // Create the prompt
    const prompt = `${query}

You're an educational assistant for a child with dyslexia.
Use simple language, no images, 120-word limit.
Focus on clarity, repetition, chunking, and encouragement.
Do not give words enclosed in asterisk.
Make it as simple as possible, as if you're explaining to a kid who has just started learning that concept.
Don't give people as examples.`;

    // Generate content
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
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

// Therapy/Emotional Support Chatbot API (Best Buddy)
router.post('/therapy', async (req, res) => {
  try {
    const { query } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'GEMINI_API_KEY is not configured on the server'
      });
    }

    // Create the therapy-focused prompt
    const prompt = `User: ${query}

Therapist (focused on helping a dyslexic person):
Response (specific and tailored for dyslexic individuals):
Focus on building a safe and supportive space.
Acknowledge the child's feelings and validate their struggles.
Emphasize that it's a different way of learning, not a disability.
Showcase successful people with dyslexia.
Motivate the child by demonstrating achievement is possible.
Highlight the importance of support and tools.
Briefly mention resources like audiobooks, specialized tutors, or assistive technologies.
End on a positive and empowering note.
Remind the child of their strengths and potential.
Use positive and affirming language throughout.
Maintain a conversational and approachable tone.
Encourage the child to ask questions and express their feelings.
Give the response in 120 to 150 words and stick to the query and remember the child is dyslexic.`;

    // Generate content
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: { maxOutputTokens: 800 }
    });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    res.json({
      success: true,
      text: text
    });
  } catch (error) {
    console.error('Error generating therapy response:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate response'
    });
  }
});

// Handwriting Decoder API
router.post('/decode-handwriting', async (req, res) => {
  try {
    const { image, mimeType } = req.body;

    if (!image || !mimeType) {
      return res.status(400).json({
        success: false,
        message: 'Image and mimeType are required'
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'GEMINI_API_KEY is not configured on the server'
      });
    }

    // Create multimodal content with text and image
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const parts = [
      { text: "Identify the disability and decrypt the text in the image. On decrypting, improvise it so that it makes sense. Return only the decrypted text and nothing else. I repeat, I want only the decrypted text." },
      {
        inlineData: {
          mimeType: mimeType,
          data: image
        }
      }
    ];

    // Generate content with multimodal support
    const result = await model.generateContent(parts);
    const response = result.response;
    const text = response.text();

    res.json({
      success: true,
      text: text
    });
  } catch (error) {
    console.error('Error decoding handwriting:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to decode handwriting'
    });
  }
});

// ElevenLabs Text-to-Speech API
router.post('/elevenlabs-tts', async (req, res) => {
  try {
    const { text, voiceId = '21m00Tcm4TlvDq8ikWAM', speed = 1.0 } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required'
      });
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'ELEVENLABS_API_KEY is not configured on the server'
      });
    }

    // Call ElevenLabs API
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text: text,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          speed: speed
        }
      },
      {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    // Return audio data
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': response.data.length
    });
    res.send(response.data);

  } catch (error) {
    console.error('Error generating speech with ElevenLabs:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.detail?.message || error.message || 'Failed to generate speech'
    });
  }
});

// Get available ElevenLabs voices
router.get('/elevenlabs-voices', async (req, res) => {
  try {
    if (!process.env.ELEVENLABS_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'ELEVENLABS_API_KEY is not configured on the server'
      });
    }

    // Fetch voices from ElevenLabs
    const response = await axios.get(
      'https://api.elevenlabs.io/v1/voices',
      {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY
        }
      }
    );

    // Format voices for frontend
    const voices = response.data.voices.map(voice => ({
      id: voice.voice_id,
      name: voice.name,
      category: voice.category,
      description: voice.labels?.description || '',
      preview_url: voice.preview_url
    }));

    res.json({
      success: true,
      voices: voices
    });

  } catch (error) {
    console.error('Error fetching ElevenLabs voices:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.detail?.message || error.message || 'Failed to fetch voices'
    });
  }
});

module.exports = router; 