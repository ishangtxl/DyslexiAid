# Dyslexia Support Application

An AI-assisted application designed to help children with dyslexia overcome challenges in reading, writing, and communication.

## Features

1. **Read Aloud** - Text-to-speech tools to help with reading difficulties
2. **Emotional Chatbot** - AI companion for emotional support and understanding
3. **Therapy Chatbot** - Guided therapy sessions to build confidence and skills
4. **Understanding Writing** - Tools to help with writing and expressing ideas

## Tech Stack

- **Frontend:** React.js with styled-components
- **Backend:** Node.js with Express
- **Styling:** Custom theme designed to be dyslexia-friendly

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

3. Create a `.env` file based on `.env.example`:
   ```
   PORT=5000
   NODE_ENV=development
   ```

4. Start the server:
   ```
   npm start
   ```
   
   For development with auto-reload:
   ```
   npm run dev
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

3. Start the development server:
   ```
   npm start
   ```

4. The application will be available at `http://localhost:3000`

## Project Structure

- `/frontend` - React.js frontend application
  - `/src/components` - Reusable UI components
  - `/src/pages` - Page components for each route
  - `/src/styles` - Global styles and theme

- `/backend` - Node.js backend server
  - `/routes` - API route handlers
  
## Accessibility Features

This application includes several features to make it more accessible for users with dyslexia:

- Larger font sizes and increased letter spacing
- Dyslexia-friendly color scheme with good contrast
- Simple, clean interface with minimal distractions
- Clear visual hierarchy and intuitive navigation

## Development

- To add new features, create the necessary components and update the routing in `App.js`
- For backend changes, add or modify routes in the `/routes` directory
- Ensure all UI components follow the established design system for consistency 