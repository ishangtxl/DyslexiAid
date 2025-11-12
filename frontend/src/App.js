import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ReadAloudPage from './pages/ReadAloudPage';
import EmotionalChatbotPage from './pages/EmotionalChatbotPage';
import TherapyChatbotPage from './pages/TherapyChatbotPage';
import UnderstandingWritingPage from './pages/UnderstandingWritingPage';
import DictionarySettingsPage from './pages/DictionarySettingsPage';

// Import our custom fonts
import './fonts.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/readaloud" element={<ReadAloudPage />} />
          <Route path="/emotional-chatbot" element={<EmotionalChatbotPage />} />
          <Route path="/therapy-chatbot" element={<TherapyChatbotPage />} />
          <Route path="/understanding-writing" element={<UnderstandingWritingPage />} />
          <Route path="/dictionary" element={<DictionarySettingsPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
