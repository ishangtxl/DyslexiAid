const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const natural = require('natural');
const faiss = require('faiss-node');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Initialize the Generative AI with API key
const GEMINI_API_KEY = 'AIzaSyDLRh5LHcyYpxQx6oHSKlsX_tj1Xap0Ods';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-pro',
  generationConfig: { 
    maxOutputTokens: 800,
    temperature: 0.7
  }
});

// Initialize TF-IDF Vectorizer
const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();
const stemmer = natural.PorterStemmer;

// Dataset paths
const datasetPath = path.join(__dirname, '../data/dataset.csv');
const faissIndexPath = path.join(__dirname, '../data/index.faiss');

// Load dataset and prepare TF-IDF
let dataset = [];
let documentMap = {};
let faissIndex;
let isInitialized = false;

async function initializeSystem() {
  if (isInitialized) return;
  
  try {
    console.log('Starting system initialization...');
    console.log('Dataset path:', datasetPath);
    
    // Check if dataset file exists
    if (!fs.existsSync(datasetPath)) {
      throw new Error(`Dataset file not found at ${datasetPath}`);
    }
    
    // Load the dataset
    dataset = await loadDataset();
    console.log(`Loaded ${dataset.length} entries from dataset`);
    
    if (dataset.length === 0) {
      throw new Error('Dataset is empty');
    }
    
    // Prepare TF-IDF
    dataset.forEach((entry, index) => {
      if (!entry.query || !entry.response) {
        console.warn(`Invalid entry at index ${index}:`, entry);
        return;
      }
      const processedQuery = preprocessText(entry.query);
      tfidf.addDocument(processedQuery);
      documentMap[index] = entry;
    });
    
    // Load FAISS index if it exists
    if (fs.existsSync(faissIndexPath)) {
      try {
        console.log('Loading existing FAISS index...');
        faissIndex = await faiss.IndexFlatL2.fromFile(faissIndexPath);
        console.log("Loaded existing FAISS index");
      } catch (error) {
        console.error("Error loading FAISS index, will create a new one:", error);
        await createFaissIndex();
      }
    } else {
      console.log('Creating new FAISS index...');
      await createFaissIndex();
    }
    
    isInitialized = true;
    console.log("System initialized successfully");
  } catch (error) {
    console.error("Error initializing system:", error);
    throw error;
  }
}

async function loadDataset() {
  return new Promise((resolve, reject) => {
    const results = [];
    console.log('Loading dataset from CSV...');
    
    fs.createReadStream(datasetPath)
      .pipe(csv())
      .on('data', (data) => {
        // Log the first few entries to verify structure
        if (results.length < 3) {
          console.log('Sample data entry:', data);
        }
        
        // Rename columns if needed based on your CSV structure
        const entry = {
          query: data.Query || data.query,
          response: data.Response || data.response
        };
        
        if (!entry.query || !entry.response) {
          console.warn('Invalid entry:', data);
          return;
        }
        
        results.push(entry);
      })
      .on('end', () => {
        console.log(`Finished loading ${results.length} entries`);
        resolve(results);
      })
      .on('error', (error) => {
        console.error('Error reading CSV:', error);
        reject(error);
      });
  });
}

function preprocessText(text) {
  if (!text) return '';
  return text.toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(' ')
    .map(word => stemmer.stem(word)) // Stemming
    .join(' ')
    .trim();
}

async function createFaissIndex() {
  try {
    // Extract TF-IDF vectors
    const vectors = [];
    for (let i = 0; i < dataset.length; i++) {
      const tfidfVector = [];
      tfidf.tfidfs(i, (j, measure) => {
        tfidfVector.push(measure);
      });
      vectors.push(new Float32Array(tfidfVector));
    }
    
    // Create and save FAISS index
    const dimension = vectors[0].length;
    faissIndex = new faiss.IndexFlatL2(dimension);
    for (const vector of vectors) {
      faissIndex.add(vector);
    }
    
    await faissIndex.writeToFile(faissIndexPath);
    console.log(`Created and saved FAISS index with dimension ${dimension}`);
  } catch (error) {
    console.error("Error creating FAISS index:", error);
    throw error;
  }
}

async function retrieveSimilarResponse(query) {
  const processedQuery = preprocessText(query);
  
  // Create TF-IDF vector for the query
  const queryTfIdf = new TfIdf();
  dataset.forEach((entry, index) => {
    queryTfIdf.addDocument(preprocessText(entry.query));
  });
  queryTfIdf.addDocument(processedQuery);
  
  const queryVector = [];
  queryTfIdf.tfidfs(dataset.length, (i, measure) => {
    queryVector.push(measure);
  });
  
  // Search in FAISS
  const { distances, labels } = await faissIndex.search(new Float32Array(queryVector), 1);
  const bestMatchIndex = labels[0];
  
  return {
    matchedQuery: dataset[bestMatchIndex].query,
    matchedResponse: dataset[bestMatchIndex].response,
    distance: distances[0]
  };
}

async function generateTherapyResponse(userQuery, context) {
  const prompt = `
    User: ${userQuery}
    Therapist (focused on helping a dyslexic person): ${context}
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
    Give the response in 120 to 150 words and stick to the query and remember the child is dyslexic
  `;
  
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating response from Gemini:", error);
    throw error;
  }
}

// API Endpoints
router.post('/', async (req, res) => {
  console.log('Therapy route hit');
  console.log('Request method:', req.method);
  console.log('Request path:', req.path);
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
  
  try {
    console.log('Received therapy query request');
    console.log('Request body:', req.body);
    
    if (!req.body || !req.body.query) {
      console.error('Invalid request body:', req.body);
      return res.status(400).json({ error: 'Query is required in request body' });
    }
    
    await initializeSystem();
    
    const { query } = req.body;
    if (!query || query.trim() === '') {
      console.log('Empty query received');
      return res.status(400).json({ error: 'Query is required' });
    }
    
    console.log('Processing query:', query);
    
    // Retrieve similar response using FAISS
    const { matchedResponse } = await retrieveSimilarResponse(query);
    console.log('Retrieved similar response:', matchedResponse);
    
    // Generate response using Gemini
    console.log('Generating response with Gemini...');
    const response = await generateTherapyResponse(query, matchedResponse);
    console.log('Response generated successfully:', response);
    
    res.json({ 
      response,
      context: matchedResponse
    });
  } catch (error) {
    console.error('Error processing therapy query:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to process query', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Add a test endpoint
router.get('/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'Therapy route is working' });
});

// Initialize the system when the server starts
console.log('Starting therapy route initialization...');
initializeSystem().catch(error => {
  console.error('Failed to initialize therapy system:', error);
  console.error('Error stack:', error.stack);
});

module.exports = router; 