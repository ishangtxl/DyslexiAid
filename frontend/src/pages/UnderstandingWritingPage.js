import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyDLRh5LHcyYpxQx6oHSKlsX_tj1Xap0Ods");
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const PageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.large};
`;

const PageHeader = styled.h1`
  color: ${props => props.theme.colors.primary};
  font-size: 2.5rem;
  margin-bottom: ${props => props.theme.spacing.large};
  text-align: center;
`;

const PageFeatureImage = styled.img`
  display: block;
  width: 150px;
  height: 150px;
  object-fit: contain;
  margin: 0 auto ${props => props.theme.spacing.large} auto;
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

const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed ${props => props.theme.colors.highlight};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.large};
  margin-bottom: ${props => props.theme.spacing.large};
  background-color: ${props => props.theme.colors.secondary};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.highlight + '30'};
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${props => props.theme.spacing.medium};
  color: ${props => props.theme.colors.text};
`;

const UploadText = styled.p`
  font-size: 1.2rem;
  margin-bottom: ${props => props.theme.spacing.small};
`;

const UploadSubtext = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text + '80'};
`;

const Button = styled.button`
  padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.large};
  background-color: ${props => props.theme.colors.button};
  color: ${props => props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  width: 100%;
  max-width: 300px;
  margin: ${props => props.theme.spacing.medium} 0;

  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: white;
  }

  &:disabled {
    background-color: ${props => props.theme.colors.disabled};
    cursor: not-allowed;
  }
`;

const ImagePreviewContainer = styled.div`
  margin: ${props => props.theme.spacing.large} 0;
  text-align: center;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 400px;
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const ResultContainer = styled.div`
  margin-top: ${props => props.theme.spacing.large};
  background-color: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.large};
  border: 1px solid ${props => props.theme.colors.highlight};
`;

const ResultTitle = styled.h3`
  margin-bottom: ${props => props.theme.spacing.medium};
  color: ${props => props.theme.colors.primary};
`;

const ResultText = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: ${props => props.theme.spacing.medium};
  font-size: 1.1rem;
  border: 1px solid ${props => props.theme.colors.highlight};
  border-radius: ${props => props.theme.borderRadius};
  background-color: white;
  font-family: ${props => props.theme.fonts.primary};
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: ${props => props.theme.colors.primary};
  animation: spin 1s ease-in-out infinite;
  margin: ${props => props.theme.spacing.large} 0;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  background-color: #fadbd8;
  padding: ${props => props.theme.spacing.medium};
  border-radius: ${props => props.theme.borderRadius};
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const SuccessMessage = styled.div`
  color: #27ae60;
  background-color: #d4efdf;
  padding: ${props => props.theme.spacing.medium};
  border-radius: ${props => props.theme.borderRadius};
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const UnderstandingWritingPage = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Reset states
    setError('');
    setSuccess('');
    setExtractedText('');
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, JPEG)');
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }
    
    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const extractTextFromImage = async () => {
    if (!imageFile) return;
    
    setIsProcessing(true);
    setError('');
    setSuccess('');
    
    try {
      // Convert the image file to base64
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const base64Data = e.target.result.split(',')[1];
          
          // Create content parts for the API request
          const parts = [
            {
              text: "identify the disability and decrypt the text in the image. On decrypting, improvise it so that it makes sense. Return only the decrypted text and nothing else. I repeat, I want only the decrypted text."
            },
            {
              inlineData: {
                mimeType: imageFile.type,
                data: base64Data
              }
            }
          ];
          
          // Make API call to Gemini
          const result = await model.generateContent(parts);
          const text = result.response.text();
          
          setExtractedText(text);
          setSuccess('✅ Text successfully extracted!');
        } catch (error) {
          console.error('Error processing image:', error);
          setError(`Error processing image: ${error.message}`);
        } finally {
          setIsProcessing(false);
        }
      };
      
      reader.onerror = () => {
        setError('Error reading file');
        setIsProcessing(false);
      };
      
      reader.readAsDataURL(imageFile);
    } catch (error) {
      console.error('Error:', error);
      setError(`Error: ${error.message}`);
      setIsProcessing(false);
    }
  };

  const downloadText = () => {
    if (!extractedText) return;
    
    const element = document.createElement('a');
    const file = new Blob([extractedText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'decrypted_text.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <PageContainer>
      <PageHeader>Handwriting Decoder</PageHeader>
      <PageFeatureImage src="/images/hand.png" alt="Handwriting Decoder" />
      <ContentSection>
        <Description>
          Just upload a picture of the writing, and I'll do my best to read it for you. I'm going to help people understand your amazing ideas, even if the letters dance around a bit!
        </Description>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/png, image/jpeg, image/jpg" 
          onChange={handleFileSelect}
        />
        
        <UploadContainer onClick={handleUploadClick}>
          <UploadIcon>📤</UploadIcon>
          <UploadText>Upload an Image</UploadText>
          <UploadSubtext>Click to select or drop an image (PNG, JPG, JPEG)</UploadSubtext>
        </UploadContainer>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        
        {imagePreview && (
          <ImagePreviewContainer>
            <ImagePreview src={imagePreview} alt="Uploaded handwriting" />
          </ImagePreviewContainer>
        )}
        
        <div style={{ textAlign: 'center' }}>
          <Button 
            onClick={extractTextFromImage} 
            disabled={!imageFile || isProcessing}
          >
            {isProcessing ? 'Processing...' : '🔍 Decode Handwriting'}
          </Button>
        </div>
        
        {isProcessing && (
          <div style={{ textAlign: 'center' }}>
            <LoadingSpinner />
            <p>Processing image, please wait...</p>
          </div>
        )}
        
        {extractedText && (
          <ResultContainer>
            <ResultTitle>📝 Extracted Text</ResultTitle>
            <ResultText 
              value={extractedText} 
              readOnly 
            />
            <div style={{ textAlign: 'center' }}>
              <Button onClick={downloadText}>
                📄 Download as TXT
              </Button>
            </div>
          </ResultContainer>
        )}
      </ContentSection>
    </PageContainer>
  );
};

export default UnderstandingWritingPage; 