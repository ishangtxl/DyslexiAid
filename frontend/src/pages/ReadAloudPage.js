import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Tesseract from 'tesseract.js';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.large};
`;

const PageHeader = styled.h1`
  color: ${props => props.theme.colors.primary};
  font-size: 2.5rem;
  margin-bottom: ${props => props.theme.spacing.large};
  text-align: center;
`;

const ContentSection = styled.section`
  background-color: ${props => props.theme.colors.tile};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.large};
  margin-bottom: ${props => props.theme.spacing.large};
  box-shadow: ${props => props.theme.shadow};
`;

const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.7;
  margin-bottom: ${props => props.theme.spacing.large};
`;

const TilesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.large};
`;

const TopTile = styled.div`
  background-color: ${props => props.theme.colors.tile};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.large};
  box-shadow: ${props => props.theme.shadow};
`;

const BottomTilesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: ${props => props.theme.spacing.large};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ControlsTile = styled.div`
  background-color: ${props => props.theme.colors.tile};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.large};
  box-shadow: ${props => props.theme.shadow};
`;

const PlayerTile = styled.div`
  background-color: ${props => props.theme.colors.tile};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.large};
  box-shadow: ${props => props.theme.shadow};
`;

const TileHeader = styled.h2`
  color: ${props => props.theme.colors.primary};
  font-size: 1.8rem;
  margin-bottom: ${props => props.theme.spacing.medium};
  text-align: left;
`;

const InputColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.medium};
`;

const PlayerColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.medium};
`;

const SubHeader = styled.h2`
  color: ${props => props.theme.colors.primary};
  font-size: 1.8rem;
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: ${props => props.theme.spacing.medium};
  font-size: 1.1rem;
  border: 1px solid ${props => props.theme.colors.highlight};
  border-radius: ${props => props.theme.borderRadius};
  margin-bottom: ${props => props.theme.spacing.medium};
  background-color: ${props => props.theme.colors.secondary};
  font-family: ${props => props.theme.fonts.primary};
`;

const FileUploadContainer = styled.div`
  border: 2px dashed ${props => props.theme.colors.highlight};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.medium};
  text-align: center;
  cursor: pointer;
  margin-bottom: ${props => props.theme.spacing.medium};
  transition: background-color 0.3s;
  
  &:hover {
    background-color: rgba(215, 192, 169, 0.1);
  }
`;

const FileInput = styled.input`
  display: none;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.medium};
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.large};
  font-size: 1.1rem;
  background-color: ${props => props.theme.colors.button};
  color: ${props => props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: white;
  }

  &:disabled {
    background-color: #cccccc;
    color: #888888;
    cursor: not-allowed;
  }
`;

const SelectContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const Select = styled.select`
  padding: ${props => props.theme.spacing.small};
  font-size: 1rem;
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${props => props.theme.colors.highlight};
  background-color: ${props => props.theme.colors.secondary};
  font-family: ${props => props.theme.fonts.primary};
  width: 100%;
  max-width: 300px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.small};
  font-weight: 500;
`;

const TextDisplay = styled.div`
  background-color: ${props => props.theme.colors.secondary};
  padding: ${props => props.theme.spacing.medium};
  border-radius: ${props => props.theme.borderRadius};
  height: 300px;
  overflow-y: auto;
  border: 1px solid ${props => props.theme.colors.highlight};
  line-height: 1.8;
`;

const Word = styled.span`
  display: inline-block;
  padding: 2px;
  border-radius: 4px;
  margin: 0 2px;
  transition: background-color 0.2s;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(215, 192, 169, 0.3);
  }
  
  &.highlighted {
    background-color: #90ee90;
    color: ${props => props.theme.colors.primary};
  }
`;

const ImagePreview = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.medium};
  box-shadow: ${props => props.theme.shadow};
  margin-top: ${props => props.theme.spacing.medium};
  text-align: center;
  display: ${props => props.show ? 'block' : 'none'};
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 200px;
  border-radius: ${props => props.theme.borderRadius};
`;

const ProgressInfo = styled.div`
  background-color: ${props => props.theme.colors.secondary};
  padding: ${props => props.theme.spacing.medium};
  border-radius: ${props => props.theme.borderRadius};
  margin-top: ${props => props.theme.spacing.medium};
  border: 1px solid ${props => props.theme.colors.highlight};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  margin-top: 8px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => `${props.progress}%`};
  background-color: ${props => props.theme.colors.primary};
  transition: width 0.3s ease;
`;

const UploadedImagePreview = styled.div`
  margin-top: ${props => props.theme.spacing.medium};
  text-align: center;
  background-color: ${props => props.theme.colors.secondary};
  padding: ${props => props.theme.spacing.medium};
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid ${props => props.theme.colors.highlight};
`;

const UploadedImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  border-radius: ${props => props.theme.borderRadius};
`;

const FlexGap = styled.div`
  height: ${props => props.size || '16px'};
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: ${props => props.theme.spacing.medium};
  border-bottom: 1px solid ${props => props.theme.colors.highlight};
`;

const Tab = styled.button`
  padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.medium};
  font-size: 1rem;
  background-color: ${props => props.active ? props.theme.colors.highlight : 'transparent'};
  color: ${props => props.theme.colors.text};
  border: none;
  border-bottom: 3px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  border-top-left-radius: ${props => props.theme.borderRadius};
  border-top-right-radius: ${props => props.theme.borderRadius};
  cursor: pointer;
  margin-right: ${props => props.theme.spacing.small};
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    background-color: ${props => !props.active && 'rgba(215, 192, 169, 0.1)'};
  }
`;

const TabEmoji = styled.span`
  font-size: 1.2rem;
`;

const SliderContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing.medium};
  width: 100%;
`;

const SpeedBar = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;

const EmojiIndicator = styled.div`
  font-size: 1.5rem;
  position: absolute;
  top: 15px;
  filter: contrast(1.5) saturate(1.2);
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.5);
  background-color: ${props => props.theme.colors.secondary};
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 0;
`;

const SlowEmoji = styled(EmojiIndicator)`
  left: -25px;
  transform: scaleX(-1);
`;

const FastEmoji = styled(EmojiIndicator)`
  right: -25px;
  transform: scaleX(-1);
`;

const SliderTrack = styled.div`
  position: relative;
  width: 100%;
  height: 2px;
  background-color: ${props => props.theme.colors.highlight};
  margin: 24px 0 12px;
  z-index: 1;
`;

const SliderMarkers = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  position: relative;
`;

const SliderMarker = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.highlight};
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: -5px;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary};
  }
`;

const SliderLabels = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 8px;
  font-size: 0.85rem;
`;

const SliderLabel = styled.div`
  text-align: center;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
`;

const SliderInput = styled.input`
  position: absolute;
  top: -8px;
  width: 100%;
  height: 20px;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
`;

const ReadAloudPage = () => {
  const [text, setText] = useState(
    "The Read Aloud tool is designed to help children with dyslexia overcome reading challenges. Many dyslexic children struggle with decoding text, recognizing words, and maintaining reading flow. Our text-to-speech feature converts written text into spoken words, allowing children to hear the text while following along visually."
  );
  const [processedText, setProcessedText] = useState([]);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const [currentWord, setCurrentWord] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [activeTab, setActiveTab] = useState('text'); // 'text', 'image', 'file'
  const [uploadedImage, setUploadedImage] = useState(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [ocrStatusText, setOcrStatusText] = useState('');
  const [textPosition, setTextPosition] = useState(0); // Track current position in text
  
  const synth = window.speechSynthesis;
  const utteranceRef = useRef(null);
  const wordsRef = useRef([]);
  
  // Initialize Tesseract worker for OCR
  useEffect(() => {
    // With modern Tesseract.js, we don't need to initialize the worker in advance
    // We'll create it when needed
    
    return () => {
      // Cleanup function remains empty as we'll create/destroy workers on demand
    };
  }, []);
  
  // Tokenize text into words and spaces
  const tokenizeText = (text) => {
    const tokens = [];
    let wordBuffer = '';
    let spaceBuffer = '';
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char.trim() === '') {
        if (wordBuffer) {
          tokens.push({ type: 'word', value: wordBuffer });
          wordBuffer = '';
        }
        spaceBuffer += char;
      } else {
        if (spaceBuffer) {
          tokens.push({ type: 'space', value: spaceBuffer });
          spaceBuffer = '';
        }
        wordBuffer += char;
      }
    }
    
    if (wordBuffer) tokens.push({ type: 'word', value: wordBuffer });
    if (spaceBuffer) tokens.push({ type: 'space', value: spaceBuffer });
    
    return tokens;
  };
  
  // Initialize voices
  useEffect(() => {
    const populateVoices = () => {
      const availableVoices = synth.getVoices();
      const englishVoices = availableVoices.filter(voice => 
        voice.lang.includes('en') || voice.lang.includes('EN')
      );
      setVoices(englishVoices);
      
      if (englishVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(englishVoices[0]);
      }
    };
    
    populateVoices();
    
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = populateVoices;
    }
    
    return () => {
      synth.cancel();
    };
  }, []);
  
  // Process text when it changes
  useEffect(() => {
    const tokens = tokenizeText(text);
    const words = tokens.filter(t => t.type === 'word').map(t => t.value);
    wordsRef.current = words;
    setProcessedText(tokens);
  }, [text]);
  
  // Fetch image for a word from Unsplash
  const fetchImage = async (word) => {
    if (!word) return;
    
    try {
      const ACCESS_KEY = 'F4nLejAZww7_NC1DB8SF7pf0CKQLQhr9kBaZ0w9TISI'; // This would be better stored securely
      const encodedQuery = encodeURIComponent(word);
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodedQuery}&per_page=1&client_id=${ACCESS_KEY}`
      );
      const data = await response.json();
      return data.results && data.results.length > 0 ? data.results[0].urls.small : null;
    } catch (error) {
      console.error('Error fetching image:', error);
      return null;
    }
  };
  
  // Handle word hover/click to show image
  const handleWordHover = async (word) => {
    const imageUrl = await fetchImage(word);
    if (imageUrl) {
      setImageUrl(imageUrl);
      setShowImage(true);
    }
  };
  
  // Update speech settings in real-time when changed during playback
  useEffect(() => {
    // Only proceed if currently playing
    if (isPlaying && !isPaused && utteranceRef.current) {
      // Save current position in text and current word
      const currentPosition = textPosition;
      const currentHighlightedWord = currentWord;
      
      // Cancel current speech
      synth.cancel();
      
      // Create new utterance with updated settings
      const newUtterance = new SpeechSynthesisUtterance(text.substring(currentPosition));
      newUtterance.voice = selectedVoice;
      newUtterance.rate = rate;
      newUtterance.pitch = 1;
      
      // Set up the boundary event handler to maintain highlighting continuity
      newUtterance.onboundary = (event) => {
        if (event.name === 'word') {
          // Calculate actual position in original text
          const actualCharIndex = currentPosition + event.charIndex;
          setTextPosition(actualCharIndex);
          
          // Find the word at this character position
          const currentWordObj = wordsRef.current.find(
            word => actualCharIndex >= word.start && actualCharIndex < word.end
          );
          
          if (currentWordObj) {
            // Only highlight the specific word instance at this position
            setCurrentWord(currentWordObj.index);
            
            // Fetch image for current word
            handleWordHover(currentWordObj.word);
          }
        }
      };
      
      newUtterance.onend = () => {
        setIsPlaying(false);
        setCurrentWord(null);
        setShowImage(false);
      };
      
      // Update reference and speak
      utteranceRef.current = newUtterance;
      synth.speak(newUtterance);
      
      // Keep the currently highlighted word until boundary event fires
      if (currentHighlightedWord !== null) {
        setCurrentWord(currentHighlightedWord);
      }
    }
  }, [rate, selectedVoice]); // Only run when rate or selectedVoice changes
  
  // Start reading the text
  const startReading = () => {
    if (synth.speaking) {
      synth.cancel();
    }
    
    if (!text.trim()) return;
    
    // Create an indexed map of words with their positions
    const wordPositions = [];
    let charPosition = 0;
    
    processedText.forEach(token => {
      if (token.type === 'word') {
        wordPositions.push({
          word: token.value,
          start: charPosition,
          end: charPosition + token.value.length
        });
      }
      charPosition += token.value.length;
    });
    
    // Store word position data for reference
    wordsRef.current = wordPositions.map((item, index) => ({ ...item, index }));
    
    // Reset current word
    setCurrentWord(null);
    setTextPosition(0);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.rate = rate;
    utterance.pitch = 1;
    
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        // Get the current character position in the text
        const charIndex = event.charIndex;
        setTextPosition(charIndex);
        
        // Find the word at this character position
        const currentWordObj = wordsRef.current.find(
          word => charIndex >= word.start && charIndex < word.end
        );
        
        if (currentWordObj) {
          // Only highlight the specific word instance at this position
          setCurrentWord(currentWordObj.index);
          
          // Fetch image for current word
          handleWordHover(currentWordObj.word);
        }
      }
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentWord(null);
      setShowImage(false);
    };
    
    utteranceRef.current = utterance;
    setIsPlaying(true);
    setIsPaused(false);
    synth.speak(utterance);
  };
  
  // Pause reading
  const pauseReading = () => {
    if (synth.speaking && !isPaused) {
      synth.pause();
      setIsPaused(true);
    }
  };
  
  // Resume reading
  const resumeReading = () => {
    if (isPaused) {
      synth.resume();
      setIsPaused(false);
    }
  };
  
  // Stop reading
  const stopReading = () => {
    synth.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentWord(null);
    setShowImage(false);
  };
  
  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        setText(e.target.result);
        setActiveTab('text');
      } catch (error) {
        console.error('Error reading file:', error);
        alert('Could not read the file. Please try another file.');
      }
    };
    
    reader.readAsText(file);
  };
  
  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.match('image.*')) {
      alert('Please select an image file.');
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
      setActiveTab('image');
    };
    
    reader.readAsDataURL(file);
  };
  
  // Perform OCR on the uploaded image
  const performOcr = async () => {
    if (!uploadedImage) return;
    
    setIsProcessingImage(true);
    setOcrProgress(0);
    setOcrStatusText('Preparing OCR...');
    
    try {
      setOcrStatusText('Recognizing text in image...');
      
      // Use Tesseract.recognize directly - this creates and manages the worker for us
      const result = await Tesseract.recognize(
        uploadedImage,
        'eng',
        {
          logger: progress => {
            if (progress.status === 'recognizing text') {
              setOcrProgress(parseInt(progress.progress * 100));
            }
          }
        }
      );
      
      const extractedText = result.data.text;
      
      if (extractedText.trim()) {
        setText(extractedText);
        setOcrStatusText('Text extracted successfully!');
        // Switch to text tab after processing
        setTimeout(() => {
          setActiveTab('text');
          setIsProcessingImage(false);
          setOcrProgress(0);
          setOcrStatusText('');
        }, 1500);
      } else {
        setOcrStatusText('No text found in the image.');
        setTimeout(() => {
          setIsProcessingImage(false);
          setOcrProgress(0);
        }, 1500);
      }
    } catch (error) {
      console.error('OCR Error:', error);
      setOcrStatusText(`Error processing image: ${error.message}`);
      setTimeout(() => {
        setIsProcessingImage(false);
        setOcrProgress(0);
      }, 1500);
    }
  };
  
  // Clear all text
  const clearText = () => {
    stopReading();
    setText('');
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'text':
        return (
          <>
            <TextArea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste text here that you want to be read aloud..."
            />
            <Button onClick={clearText}>Clear Text</Button>
          </>
        );
      case 'image':
        return (
          <>
            <FileUploadContainer>
              <Label htmlFor="image-upload">Upload an image with text</Label>
              <FileInput 
                id="image-upload" 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload} 
              />
              <Button 
                as="label"
                htmlFor="image-upload"
              >
                Choose Image
              </Button>
            </FileUploadContainer>
            
            {uploadedImage && (
              <>
                <UploadedImagePreview>
                  <UploadedImage src={uploadedImage} alt="Uploaded image" />
                </UploadedImagePreview>
                
                <Button 
                  onClick={performOcr} 
                  disabled={isProcessingImage}
                >
                  {isProcessingImage ? 'Processing...' : 'Extract Text'}
                </Button>
                
                {isProcessingImage && (
                  <ProgressInfo>
                    <p>{ocrStatusText}</p>
                    <ProgressBar>
                      <ProgressFill progress={ocrProgress} />
                    </ProgressBar>
                  </ProgressInfo>
                )}
              </>
            )}
          </>
        );
      case 'file':
        return (
          <FileUploadContainer>
            <Label htmlFor="file-upload">Upload a text file</Label>
            <FileInput 
              id="file-upload" 
              type="file" 
              accept=".txt,.text"
              onChange={handleFileUpload} 
            />
            <Button 
              as="label"
              htmlFor="file-upload"
            >
              Choose File
            </Button>
          </FileUploadContainer>
        );
      default:
        return null;
    }
  };
  
  return (
    <PageContainer>
      <PageHeader>Read Aloud</PageHeader>
      
      <ContentSection>
        <Description>
          The Read Aloud tool helps with reading by turning text into speech. Listen along as each word is highlighted and see pictures for words to help understand the meaning.
        </Description>
        
        <TilesContainer>
          <TopTile>
            <TileHeader>Text Input</TileHeader>
            
            <Tabs>
              <Tab 
                active={activeTab === 'text'} 
                onClick={() => setActiveTab('text')}
              >
                <TabEmoji>📝</TabEmoji> Text Input
              </Tab>
              <Tab 
                active={activeTab === 'image'} 
                onClick={() => setActiveTab('image')}
              >
                <TabEmoji>🖼️</TabEmoji> Image
              </Tab>
              <Tab 
                active={activeTab === 'file'} 
                onClick={() => setActiveTab('file')}
              >
                <TabEmoji>📄</TabEmoji> Text File
              </Tab>
            </Tabs>
            
            {renderTabContent()}
          </TopTile>
          
          <BottomTilesContainer>
            <ControlsTile>
              <TileHeader>Select Voice:</TileHeader>
              <Select 
                id="voice-select"
                value={voices.indexOf(selectedVoice)}
                onChange={(e) => setSelectedVoice(voices[e.target.value])}
              >
                {voices.map((voice, index) => (
                  <option key={index} value={index}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </Select>
              
              <FlexGap size="24px" />
              
              <Label>Speed:</Label>
              <SpeedBar>
                <SlowEmoji>🚶</SlowEmoji>
                <SliderTrack>
                  <SliderInput
                    id="speed-slider"
                    type="range"
                    min="0.25"
                    max="2"
                    step="0.25"
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                  />
                  <SliderMarkers>
                    {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                      <SliderMarker 
                        key={speed} 
                        active={rate === speed}
                        onClick={() => setRate(speed)}
                        style={{ left: `${((speed - 0.25) / 1.75) * 100}%` }}
                      />
                    ))}
                  </SliderMarkers>
                </SliderTrack>
                <FastEmoji>🏃</FastEmoji>
                <SliderLabels>
                  {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                    <SliderLabel 
                      key={speed} 
                      active={rate === speed}
                      onClick={() => setRate(speed)}
                    >
                      {speed}x
                    </SliderLabel>
                  ))}
                </SliderLabels>
              </SpeedBar>
            </ControlsTile>
            
            <PlayerTile>
              <TileHeader>Text Player</TileHeader>
              
              <ButtonContainer>
                <Button onClick={startReading} disabled={!text.trim() || !selectedVoice}>
                  Read Aloud
                </Button>
                <Button onClick={pauseReading} disabled={!isPlaying || isPaused}>
                  Pause
                </Button>
                <Button onClick={resumeReading} disabled={!isPaused}>
                  Resume
                </Button>
                <Button onClick={stopReading} disabled={!isPlaying && !isPaused}>
                  Stop
                </Button>
              </ButtonContainer>
              
              <TextDisplay>
                {processedText.map((token, index) => {
                  if (token.type === 'word') {
                    // Find the corresponding index in our tracked words
                    const wordObj = wordsRef.current?.find(
                      w => w.word === token.value && 
                      w.start === processedText.slice(0, index).reduce((sum, t) => sum + t.value.length, 0)
                    );
                    
                    const isHighlighted = wordObj && wordObj.index === currentWord;
                    
                    return (
                      <Word 
                        key={`word-${index}`}
                        className={isHighlighted ? 'highlighted' : ''}
                        onClick={() => handleWordHover(token.value)}
                      >
                        {token.value}
                      </Word>
                    );
                  } else {
                    return token.value;
                  }
                })}
              </TextDisplay>
              
              <ImagePreview show={showImage}>
                {imageUrl && (
                  <>
                    <p>Visual for current word:</p>
                    <Image src={imageUrl} alt="Word visualization" />
                  </>
                )}
              </ImagePreview>
            </PlayerTile>
          </BottomTilesContainer>
        </TilesContainer>
      </ContentSection>
    </PageContainer>
  );
};

export default ReadAloudPage; 