# Dyslexia App Backend

This is the backend server for the Dyslexia App.

## Setup

1. Install dependencies:
```
npm install
```

2. Create a `.env` file in the backend directory with your Gemini API key:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

3. Start the server:
```
npm start
```

## API Endpoints

### GET /api/health
- Check if the server is running

### POST /api/generate
- Generates a dyslexia-friendly educational response using Google's Gemini AI
- Request body: `{ "query": "your question here" }`
- Response: `{ "success": true, "text": "AI generated response" }`

### Other endpoints
- See `routes/api.js` for other available endpoints 