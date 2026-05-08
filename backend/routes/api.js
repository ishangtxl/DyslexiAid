const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

const MAX_QUERY_LENGTH = Number(process.env.MAX_QUERY_LENGTH || 2000);
const MAX_TTS_LENGTH = Number(process.env.MAX_TTS_LENGTH || 5000);
const MAX_IMAGE_BYTES = Number(process.env.MAX_IMAGE_BYTES || 5 * 1024 * 1024);
const ALLOWED_IMAGE_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);
const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';
const VOICE_ID_PATTERN = /^[A-Za-z0-9_-]{10,64}$/;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const validateText = (value, fieldName, maxLength) => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return `${fieldName} is required`;
  }

  if (value.length > maxLength) {
    return `${fieldName} must be ${maxLength} characters or fewer`;
  }

  return null;
};

const validateBase64Image = (image, mimeType) => {
  if (typeof image !== 'string' || image.trim().length === 0 || typeof mimeType !== 'string') {
    return 'Image and mimeType are required';
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.has(mimeType)) {
    return 'Unsupported image type. Use PNG, JPEG, or WebP';
  }

  if (!/^[A-Za-z0-9+/=]+$/.test(image)) {
    return 'Image must be base64 encoded';
  }

  const estimatedBytes = Math.ceil((image.length * 3) / 4);
  if (estimatedBytes > MAX_IMAGE_BYTES) {
    return `Image must be ${Math.floor(MAX_IMAGE_BYTES / (1024 * 1024))}MB or smaller`;
  }

  return null;
};

const requireGeminiKey = (res) => {
  if (!process.env.GEMINI_API_KEY) {
    res.status(500).json({
      success: false,
      message: 'GEMINI_API_KEY is not configured on the server'
    });
    return false;
  }
  return true;
};

const requireElevenLabsKey = (res) => {
  if (!process.env.ELEVENLABS_API_KEY) {
    res.status(500).json({
      success: false,
      message: 'ELEVENLABS_API_KEY is not configured on the server'
    });
    return false;
  }
  return true;
};

const getSafeProviderMessage = (fallback) => (
  process.env.NODE_ENV === 'development' ? fallback : 'Provider request failed'
);

// Educational Chatbot API (Study Pal)
router.post('/generate', async (req, res) => {
  try {
    const { query } = req.body;
    const validationError = validateText(query, 'Query', MAX_QUERY_LENGTH);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    if (!requireGeminiKey(res)) return;

    // Create the prompt
    const prompt = `${query.trim()}

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
    console.error('Error generating content:', error.message);
    res.status(500).json({
      success: false,
      message: getSafeProviderMessage(error.message || 'Failed to generate content')
    });
  }
});

// Therapy/Emotional Support Chatbot API (Best Buddy)
router.post('/therapy', async (req, res) => {
  try {
    const { query } = req.body;
    const validationError = validateText(query, 'Query', MAX_QUERY_LENGTH);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    if (!requireGeminiKey(res)) return;

    // Create the therapy-focused prompt
    const prompt = `User: ${query.trim()}

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
    console.error('Error generating therapy response:', error.message);
    res.status(500).json({
      success: false,
      message: getSafeProviderMessage(error.message || 'Failed to generate response')
    });
  }
});

// Handwriting Decoder API
router.post('/decode-handwriting', async (req, res) => {
  try {
    const { image, mimeType } = req.body;
    const validationError = validateBase64Image(image, mimeType);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    if (!requireGeminiKey(res)) return;

    // Create multimodal content with text and image
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const parts = [
      { text: 'Identify the disability and decrypt the text in the image. On decrypting, improvise it so that it makes sense. Return only the decrypted text and nothing else. I repeat, I want only the decrypted text.' },
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
    console.error('Error decoding handwriting:', error.message);
    res.status(500).json({
      success: false,
      message: getSafeProviderMessage(error.message || 'Failed to decode handwriting')
    });
  }
});

// ElevenLabs Text-to-Speech API
router.post('/elevenlabs-tts', async (req, res) => {
  try {
    const { text, voiceId = DEFAULT_VOICE_ID, speed = 1.0 } = req.body;
    const validationError = validateText(text, 'Text', MAX_TTS_LENGTH);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    if (typeof voiceId !== 'string' || !VOICE_ID_PATTERN.test(voiceId)) {
      return res.status(400).json({ success: false, message: 'Invalid voiceId' });
    }

    const numericSpeed = Number(speed);
    if (!Number.isFinite(numericSpeed) || numericSpeed < 0.7 || numericSpeed > 1.2) {
      return res.status(400).json({ success: false, message: 'Speed must be between 0.7 and 1.2' });
    }

    if (!requireElevenLabsKey(res)) return;

    // Call ElevenLabs API
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text: text.trim(),
        model_id: 'eleven_turbo_v2_5',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          speed: numericSpeed
        }
      },
      {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer',
        timeout: 30000,
        maxBodyLength: 1024 * 1024,
        maxContentLength: 10 * 1024 * 1024
      }
    );

    // Return audio data
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': response.data.length
    });
    res.send(response.data);

  } catch (error) {
    console.error('Error generating speech with ElevenLabs:', error.message);
    res.status(500).json({
      success: false,
      message: getSafeProviderMessage(error.response?.data?.detail?.message || error.message || 'Failed to generate speech')
    });
  }
});

// Image search proxy keeps provider keys out of browser-delivered frontend code.
router.get('/image-search', async (req, res) => {
  try {
    const { query } = req.query;
    const validationError = validateText(query, 'Query', 80);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    if (!process.env.UNSPLASH_ACCESS_KEY) {
      return res.status(500).json({
        success: false,
        message: 'UNSPLASH_ACCESS_KEY is not configured on the server'
      });
    }

    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query: query.trim(),
        per_page: 1,
        client_id: process.env.UNSPLASH_ACCESS_KEY
      },
      timeout: 10000,
      maxContentLength: 1024 * 1024
    });

    const imageUrl = response.data?.results?.[0]?.urls?.small || null;
    res.json({ success: true, imageUrl });
  } catch (error) {
    console.error('Error fetching image:', error.message);
    res.status(500).json({
      success: false,
      message: getSafeProviderMessage(error.message || 'Failed to fetch image')
    });
  }
});

// Get available ElevenLabs voices
router.get('/elevenlabs-voices', async (req, res) => {
  try {
    if (!requireElevenLabsKey(res)) return;

    // Fetch voices from ElevenLabs
    const response = await axios.get(
      'https://api.elevenlabs.io/v1/voices',
      {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY
        },
        timeout: 10000,
        maxContentLength: 1024 * 1024
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
    console.error('Error fetching ElevenLabs voices:', error.message);
    res.status(500).json({
      success: false,
      message: getSafeProviderMessage(error.response?.data?.detail?.message || error.message || 'Failed to fetch voices')
    });
  }
});

module.exports = router;
