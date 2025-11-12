import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  getAllCustomWords,
  saveCustomWord,
  deleteCustomWord,
  getDictionaryStats,
  exportDictionary,
  importDictionary,
  fileToBase64
} from '../utils/customDictionary';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.large};
`;

const PageHeader = styled.h1`
  color: ${props => props.theme.colors.primary};
  font-size: 2.5rem;
  margin-bottom: ${props => props.theme.spacing.medium};
  text-align: center;
`;

const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.7;
  margin-bottom: ${props => props.theme.spacing.large};
  text-align: center;
`;

const Section = styled.section`
  background-color: ${props => props.theme.colors.tile};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.large};
  margin-bottom: ${props => props.theme.spacing.large};
  box-shadow: ${props => props.theme.shadow};
`;

const SectionHeader = styled.h2`
  color: ${props => props.theme.colors.primary};
  font-size: 1.8rem;
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.small};
  font-weight: 500;
  font-size: 1.1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.medium};
  font-size: 1.1rem;
  border: 1px solid ${props => props.theme.colors.highlight};
  border-radius: ${props => props.theme.borderRadius};
  background-color: ${props => props.theme.colors.secondary};
  font-family: ${props => props.theme.fonts.primary};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const FileInput = styled.input`
  display: none;
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
  margin-right: ${props => props.theme.spacing.small};

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.primary};
    color: white;
  }

  &:disabled {
    background-color: #cccccc;
    color: #888888;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: ${props => props.theme.colors.secondary};

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.highlight};
    color: ${props => props.theme.colors.text};
  }
`;

const DeleteButton = styled(Button)`
  background-color: #e57373;
  color: white;

  &:hover:not(:disabled) {
    background-color: #d32f2f;
  }
`;

const ImagePreviewContainer = styled.div`
  margin: ${props => props.theme.spacing.medium} 0;
  padding: ${props => props.theme.spacing.medium};
  background-color: white;
  border-radius: ${props => props.theme.borderRadius};
  text-align: center;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 200px;
  border-radius: ${props => props.theme.borderRadius};
`;

const PlaceholderText = styled.p`
  color: #999;
  font-style: italic;
`;

const WordsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.medium};
  margin-top: ${props => props.theme.spacing.medium};
`;

const WordCard = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.medium};
  box-shadow: ${props => props.theme.shadow};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.small};
`;

const WordText = styled.h3`
  color: ${props => props.theme.colors.primary};
  font-size: 1.5rem;
  margin: 0;
  text-transform: capitalize;
`;

const WordImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: ${props => props.theme.borderRadius};
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  background-color: #f0f0f0;
  border-radius: ${props => props.theme.borderRadius};
  color: #999;
  font-style: italic;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px dashed transparent;

  &:hover {
    background-color: #e0e0e0;
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }
`;

const WordMeta = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.small};
  margin-top: ${props => props.theme.spacing.small};
`;

const Message = styled.div`
  padding: ${props => props.theme.spacing.medium};
  border-radius: ${props => props.theme.borderRadius};
  margin-bottom: ${props => props.theme.spacing.medium};
  background-color: ${props => props.type === 'error' ? '#ffebee' : '#e8f5e9'};
  color: ${props => props.type === 'error' ? '#c62828' : '#2e7d32'};
  border-left: 4px solid ${props => props.type === 'error' ? '#c62828' : '#2e7d32'};
`;

const StatsContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.large};
  flex-wrap: wrap;
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const StatBox = styled.div`
  background-color: white;
  padding: ${props => props.theme.spacing.medium};
  border-radius: ${props => props.theme.borderRadius};
  flex: 1;
  min-width: 150px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: ${props => props.theme.spacing.small};
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const SearchInput = styled(Input)`
  max-width: 400px;
`;

const DictionarySettingsPage = () => {
  const [words, setWords] = useState({});
  const [newWord, setNewWord] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState(null);
  const [stats, setStats] = useState({ wordCount: 0, estimatedSizeKB: 0 });
  const [searchTerm, setSearchTerm] = useState('');

  // Load words on mount
  useEffect(() => {
    loadWords();
    loadStats();
  }, []);

  const loadWords = () => {
    const allWords = getAllCustomWords();
    setWords(allWords);
  };

  const loadStats = () => {
    const statistics = getDictionaryStats();
    setStats(statistics);
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const base64 = await fileToBase64(file);
      setSelectedFile(base64);
      setImagePreview(base64);
      setMessage(null);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
      setSelectedFile(null);
      setImagePreview(null);
    }
  };

  const handleAddWord = () => {
    if (!newWord.trim()) {
      setMessage({ type: 'error', text: 'Please enter a word' });
      return;
    }

    // Allow adding words without images
    const result = saveCustomWord(newWord, selectedFile);

    if (result.success) {
      const imageNote = selectedFile ? '' : ' (without image - add one later)';
      setMessage({ type: 'success', text: `Word "${newWord}" added successfully${imageNote}!` });
      setNewWord('');
      setSelectedFile(null);
      setImagePreview(null);
      loadWords();
      loadStats();
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  };

  const handleDeleteWord = (word) => {
    if (!window.confirm(`Are you sure you want to delete "${word}"?`)) {
      return;
    }

    const result = deleteCustomWord(word);

    if (result.success) {
      setMessage({ type: 'success', text: `Word "${word}" deleted successfully!` });
      loadWords();
      loadStats();
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  };

  const handleUpdateWordImage = async (word, event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const base64 = await fileToBase64(file);
      const result = saveCustomWord(word, base64);

      if (result.success) {
        setMessage({ type: 'success', text: `Image added to "${word}" successfully!` });
        loadWords();
        loadStats();
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleExport = () => {
    const result = exportDictionary();
    if (result.success) {
      setMessage({ type: 'success', text: 'Dictionary exported successfully!' });
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = importDictionary(text, 'merge');

      if (result.success) {
        setMessage({ type: 'success', text: 'Dictionary imported successfully!' });
        loadWords();
        loadStats();
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to import dictionary file' });
    }
  };

  const filteredWords = Object.entries(words).filter(([word]) =>
    word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageContainer>
      <PageHeader>Custom Word Dictionary</PageHeader>
      <Description>
        Add your own word-image pairings to improve image accuracy during reading.
        These custom images will be shown instead of searching online.
      </Description>

      {message && (
        <Message type={message.type}>
          {message.text}
        </Message>
      )}

      {/* Statistics */}
      <Section>
        <SectionHeader>Dictionary Statistics</SectionHeader>
        <StatsContainer>
          <StatBox>
            <StatLabel>Total Words</StatLabel>
            <StatValue>{stats.wordCount}</StatValue>
          </StatBox>
          <StatBox>
            <StatLabel>Storage Used</StatLabel>
            <StatValue>{stats.estimatedSizeKB} KB</StatValue>
          </StatBox>
        </StatsContainer>
      </Section>

      {/* Add New Word */}
      <Section>
        <SectionHeader>Add New Word</SectionHeader>

        <FormGroup>
          <Label htmlFor="word-input">Word</Label>
          <Input
            id="word-input"
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            placeholder="Enter a word (e.g., cat, dog, house)"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="image-upload">Image (Optional - can add later)</Label>
          <FileInput
            id="image-upload"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
          />
          <Button as="label" htmlFor="image-upload">
            Choose Image
          </Button>
          <span style={{ marginLeft: '10px', color: '#666' }}>
            (Max 200KB, JPEG/PNG/WebP/GIF)
          </span>
        </FormGroup>

        <ImagePreviewContainer>
          {imagePreview ? (
            <PreviewImage src={imagePreview} alt="Preview" />
          ) : (
            <PlaceholderText>Image preview will appear here</PlaceholderText>
          )}
        </ImagePreviewContainer>

        <Button onClick={handleAddWord}>
          Add Word
        </Button>
        <SecondaryButton
          onClick={() => {
            setNewWord('');
            setSelectedFile(null);
            setImagePreview(null);
            setMessage(null);
          }}
        >
          Clear
        </SecondaryButton>
      </Section>

      {/* Existing Words */}
      <Section>
        <SectionHeader>Existing Words ({Object.keys(words).length})</SectionHeader>

        <FormGroup>
          <SearchInput
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search words..."
          />
        </FormGroup>

        {filteredWords.length === 0 ? (
          <PlaceholderText>
            {searchTerm ? 'No words found matching your search.' : 'No custom words yet. Add some above!'}
          </PlaceholderText>
        ) : (
          <WordsGrid>
            {filteredWords.map(([word, data]) => (
              <WordCard key={word}>
                <WordText>{word}</WordText>
                {data.imageData ? (
                  <WordImage src={data.imageData} alt={word} />
                ) : (
                  <>
                    <FileInput
                      id={`image-upload-${word}`}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      onChange={(e) => handleUpdateWordImage(word, e)}
                    />
                    <ImagePlaceholder as="label" htmlFor={`image-upload-${word}`}>
                      <span>No image yet</span>
                      <span style={{ fontSize: '0.9rem', color: '#666' }}>Click to upload</span>
                    </ImagePlaceholder>
                  </>
                )}
                <WordMeta>
                  Added: {new Date(data.dateAdded).toLocaleDateString()}
                </WordMeta>
                <ButtonGroup>
                  <DeleteButton onClick={() => handleDeleteWord(word)}>
                    Delete
                  </DeleteButton>
                </ButtonGroup>
              </WordCard>
            ))}
          </WordsGrid>
        )}
      </Section>

      {/* Import/Export */}
      <Section>
        <SectionHeader>Import/Export Dictionary</SectionHeader>

        <FormGroup>
          <Label>Export Dictionary</Label>
          <p style={{ color: '#666', marginBottom: '10px' }}>
            Download your custom dictionary as a JSON file for backup or sharing.
          </p>
          <Button onClick={handleExport}>
            Export Dictionary
          </Button>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="import-file">Import Dictionary</Label>
          <p style={{ color: '#666', marginBottom: '10px' }}>
            Import a previously exported dictionary. Words will be merged with existing ones.
          </p>
          <FileInput
            id="import-file"
            type="file"
            accept="application/json,.json"
            onChange={handleImport}
          />
          <SecondaryButton as="label" htmlFor="import-file">
            Choose File to Import
          </SecondaryButton>
        </FormGroup>
      </Section>
    </PageContainer>
  );
};

export default DictionarySettingsPage;
