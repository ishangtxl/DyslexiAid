# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DyslexiAid is a web application designed to assist individuals with dyslexia through four core features:
- **Read Aloud** - Text-to-speech with visual highlighting and image association
- **Study Pal** - AI-powered educational chatbot for learning assistance
- **Best Buddy** - Emotional support chatbot for dyslexia-related challenges
- **Handwriting Decoder** - AI-powered handwriting recognition from images

## Development Commands

### Full Application (from root)
- `npm start` - Runs both frontend and backend concurrently
- `npm run backend` - Starts only the backend server
- `npm run frontend` - Starts only the frontend dev server
- `npm run install-all` - Installs dependencies for root, backend, and frontend

### Backend (from `/backend`)
- `npm start` - Starts the backend server on port 5000
- `npm run dev` - Starts the backend with nodemon for auto-reload

### Frontend (from `/frontend`)
- `npm start` - Starts React dev server on port 3000 (proxies API calls to :5000)
- `npm run build` - Creates production build
- `npm test` - Runs Jest tests with React Testing Library

### Environment Setup
Backend requires a `.env` file in `/backend` with:
```
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
```

## Architecture Overview

### Tech Stack
- **Frontend**: React 18, React Router, Styled Components, Axios
- **Backend**: Node.js 18+, Express.js, Google GenAI SDK (@google/genai v1.29.0+)
- **AI Model**: Gemini 2.5 Flash for all AI features

### Application Flow
Frontend → Backend API → Google Gemini AI → Backend → Frontend

All AI processing happens server-side in the backend. The frontend never directly calls external APIs (except for client-side features like Web Speech API and Tesseract OCR).

## Backend Structure (`/backend`)

### Server (`server.js`)
Express server with:
- CORS enabled for all origins in development
- Body parsing middleware (JSON and URL-encoded)
- Single route mount point: `/api` → `routes/api.js`
- Error handling middleware

### API Routes (`routes/api.js`)
All routes are prefixed with `/api`:

**POST /api/generate** - Educational chatbot (Study Pal)
- Receives: `{ query: string }`
- Returns: `{ success: boolean, text: string }`
- Uses Gemini with educational prompt tailored for dyslexic children (simple language, 120-word limit)

**POST /api/therapy** - Emotional support chatbot (Best Buddy)
- Receives: `{ query: string }`
- Returns: `{ success: boolean, text: string }`
- Uses Gemini with therapy-focused prompt (120-150 words, validation, encouragement)

**POST /api/decode-handwriting** - Handwriting recognition
- Receives: `{ image: base64string, mimeType: string }`
- Returns: `{ success: boolean, text: string }`
- Uses Gemini's multimodal capabilities to decode handwriting from images

### Backend Dependencies
- `@google/genai` - Google's official Gemini AI SDK (v1.29.0+, replaces deprecated @google/generative-ai)
- `express` - Web server framework
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

**Important:** The old `@google/generative-ai` package is deprecated as of 2025 and support ends August 31, 2025. Always use `@google/genai` for new projects.

## Frontend Structure (`/frontend`)

### Application Entry (`src/`)
- `index.js` - React DOM entry point
- `App.js` - Router setup with ThemeProvider, defines all routes
- `styles/theme.js` - Dyslexia-friendly theme (OpenDyslexic font, warm colors, generous spacing)
- `styles/GlobalStyles.js` - Global CSS reset and base styles

### Page Components (`src/pages/`)

**HomePage.js** - Landing page with feature tiles

**ReadAloudPage.js** - Text-to-speech feature
- Uses browser's Web Speech API for TTS
- Tesseract.js for OCR from uploaded images
- Unsplash API for word-related images during reading
- Fully client-side, no backend calls

**EmotionalChatbotPage.js** - Study Pal (Educational chatbot)
- Calls `POST /api/generate` for responses
- Speech recognition and synthesis for voice interaction
- Word highlighting during text-to-speech

**TherapyChatbotPage.js** - Best Buddy (Emotional support chatbot)
- Calls `POST /api/therapy` for responses
- Speech recognition and synthesis for voice interaction
- Word highlighting during text-to-speech

**UnderstandingWritingPage.js** - Handwriting Decoder
- Calls `POST /api/decode-handwriting` with base64 image
- File upload with preview
- Text export as .txt file

### Frontend Dependencies
- `react` & `react-dom` - UI framework
- `react-router-dom` - Client-side routing
- `styled-components` - CSS-in-JS styling
- `axios` - HTTP client for backend API calls
- `tesseract.js` - Client-side OCR (ReadAloudPage only)

### Navigation
All routes defined in App.js:
- `/` - HomePage
- `/readaloud` - ReadAloudPage
- `/emotional-chatbot` - EmotionalChatbotPage (Study Pal)
- `/therapy-chatbot` - TherapyChatbotPage (Best Buddy)
- `/understanding-writing` - UnderstandingWritingPage

## Dyslexia-Friendly Design Principles

### Typography
- Primary font: OpenDyslexic (weighted bottom letters for easier recognition)
- Fallbacks: Arial, Verdana, sans-serif
- Font size: 1.1-1.2rem minimum for body text
- Line height: 1.6-1.8 for comfortable reading

### Colors (from `theme.js`)
- Primary: `#522F1D` (dark brown)
- Background: `#F5EEE2` (light beige)
- Accent: `#D7C0A9` (tan/beige)
- High contrast without harsh brightness

### Spacing & Layout
- Generous padding: 8px/16px/24px scale
- Uncluttered interfaces with clear visual hierarchy
- Rounded corners (8px border-radius) for softer appearance

### AI Response Guidelines
All Gemini prompts enforce:
- Simple vocabulary and short sentences
- 120-150 word limit per response
- Chunking information into digestible pieces
- Encouraging, positive language
- No complex formatting or asterisk-wrapped text

## Security Considerations

### API Keys
- **CRITICAL**: `GEMINI_API_KEY` must be stored in backend `.env` file only
- Never commit `.env` to version control
- Frontend has no direct access to API keys
- All AI requests proxied through backend

### CORS Configuration
- Development: Allows all origins (`origin: true`)
- Production: Should restrict to specific frontend domain

## Common Development Tasks

### Adding a New AI Feature
1. Add new endpoint in `backend/routes/api.js`
2. Use the new SDK pattern:
   ```javascript
   const response = await ai.models.generateContent({
     model: 'gemini-2.5-flash',
     contents: 'your prompt here',
     generationConfig: { maxOutputTokens: 800 } // optional
   });
   const text = response.text; // Note: response.text, not response.response.text()
   ```
3. Create Gemini prompt tailored for dyslexic users
4. Create frontend page component in `src/pages/`
5. Add route in `App.js`
6. Use Axios to call your new backend endpoint

### Modifying AI Prompts
- Educational prompts: `backend/routes/api.js` → `/api/generate` endpoint
- Therapy prompts: `backend/routes/api.js` → `/api/therapy` endpoint
- Handwriting prompts: `backend/routes/api.js` → `/api/decode-handwriting` endpoint

### Testing
- Frontend: `cd frontend && npm test`
- Backend: No tests currently implemented
- Manual testing: Run full stack with `npm start` from root

## Deployment Notes

### Backend
- **Requires Node.js 18+** (required by @google/genai SDK)
- Set `GEMINI_API_KEY` environment variable
- Default port: 5000 (configurable via `PORT` env var)
- Run `npm install` to get latest dependencies including `@google/genai`

### Frontend
- Production build: `npm run build` from `/frontend`
- Serves static files from `build/` directory
- Update proxy configuration for production backend URL
- Ensure CORS is configured correctly for production domain
