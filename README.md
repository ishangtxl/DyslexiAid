# UPDATED POSTER LINK
[new link according to given template](https://drive.google.com/drive/folders/1VYdDMeQUymDpFb1whEFqqXGRDWSXzPAz?usp=sharing)
# DyslexiAid

DyslexiAid is a comprehensive web application designed to assist individuals with dyslexia in reading, writing, and emotional support. The application features several tools to help users overcome challenges related to dyslexia.

![DyslexiAid Logo](/frontend/public/dyslexiaid-logo.png)

## Features

### 1. Read Aloud 📚
- Text-to-speech functionality that reads content aloud
- Customizable reading speed and voice options
- Visual highlighting of text as it's being read

### 2. Study Pal 😊
- AI-powered educational chatbot
- Provides simplified explanations of complex topics
- Uses dyslexia-friendly language and formatting
- Voice input and output capabilities

### 3. Best Buddy 🧠
- Emotional support chatbot for dyslexia-related challenges
- Provides coping strategies and encouragement
- Creates a safe space for expressing frustrations and difficulties

### 4. Handwriting Decoder ✏️
- Uploads images of handwritten text
- Uses AI to decode and convert handwriting to digital text
- Helps users understand handwritten notes or instructions

## Technology Stack

### Frontend
- React.js
- React Router for navigation
- Styled Components for styling
- Google Generative AI SDK for client-side AI features

### Backend
- Node.js
- Express.js
- Google Generative AI API integration

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd dyslexia-app/backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the backend server:
   ```
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd dyslexia-app/frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the frontend development server:
   ```
   npm start
   ```
4. The application will be available at `http://localhost:3000`

## API Endpoints

- `/api/read-aloud` - Text-to-speech conversion
- `/api/generate` - Educational content generation
- `/api/emotional-chat` - Emotional support chatbot
- `/api/therapy-session` - Therapy chatbot interactions
- `/api/analyze-text` - Text analysis for dyslexic users

## Development

### Project Structure
```
dyslexia-app/
├── backend/
│   ├── data/
│   ├── routes/
│   │   ├── api.js
│   │   └── therapy.js
│   └── server.js
└── frontend/
    ├── public/
    └── src/
        ├── components/
        ├── pages/
        │   ├── HomePage.js
        │   ├── ReadAloudPage.js
        │   ├── EmotionalChatbotPage.js
        │   ├── TherapyChatbotPage.js
        │   └── UnderstandingWritingPage.js
        └── styles/
```

## Accessibility Features

- Dyslexia-friendly font options
- Customizable text size and spacing
- High contrast mode
- Read aloud functionality
- Voice input for reduced typing needs

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## License

This project is licensed under the MIT License

## Contact

For questions or support, please open an issue in the GitHub repository. 

#FUTURE SCOPE

## Learning agent

[Link to the repository for the learning agent](https://github.com/RamblingFlyer/eduthon-learning-pathway-agent)
