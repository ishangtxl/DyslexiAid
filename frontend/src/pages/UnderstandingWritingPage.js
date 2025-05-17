import React, { useState } from 'react';
import styled from 'styled-components';

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

const ToolContainer = styled.div`
  margin-top: ${props => props.theme.spacing.large};
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.highlight};
  margin-bottom: ${props => props.theme.spacing.large};
`;

const Tab = styled.button`
  padding: ${props => props.theme.spacing.medium};
  background-color: ${props => props.active ? props.theme.colors.highlight : 'transparent'};
  border: none;
  border-bottom: 3px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
`;

const TextAreaContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing.large};
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: ${props => props.theme.spacing.medium};
  font-size: 1.1rem;
  border: 1px solid ${props => props.theme.colors.highlight};
  border-radius: ${props => props.theme.borderRadius};
  background-color: ${props => props.theme.colors.secondary};
  font-family: ${props => props.theme.fonts.primary};
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.medium};
`;

const Button = styled.button`
  padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.large};
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

const UnderstandingWritingPage = () => {
  const [activeTab, setActiveTab] = useState('simplify');
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);

  const handleAnalyze = () => {
    if (text.trim() === '') return;
    
    // Mock results based on active tab
    let mockResult;
    switch(activeTab) {
      case 'simplify':
        mockResult = {
          title: 'Simplified Text',
          content: 'This is a simplified version of your text, using shorter sentences and clearer language.'
        };
        break;
      case 'grammar':
        mockResult = {
          title: 'Grammar Check Results',
          content: 'Your text looks good! We found 2 small grammar suggestions that have been highlighted in your text.'
        };
        break;
      case 'spelling':
        mockResult = {
          title: 'Spelling Check Results',
          content: 'We found 3 possible spelling errors. They have been highlighted in your text.'
        };
        break;
      case 'summarize':
        mockResult = {
          title: 'Text Summary',
          content: 'This is a brief summary of your text that captures the main ideas in a shorter format.'
        };
        break;
      default:
        mockResult = null;
    }
    
    setResult(mockResult);
  };

  return (
    <PageContainer>
      <PageHeader>Understanding Writing</PageHeader>
      
      <ContentSection>
        <Description>
          The Understanding Writing tool helps children with dyslexia overcome challenges in written expression
          and comprehension. Dyslexia often makes it difficult to organize thoughts, use correct spelling and 
          grammar, and understand complex text. Our AI-powered writing assistant offers several helpful features:
          text simplification that breaks down complex sentences, grammar and spelling correction with dyslexia-specific
          guidance, summarization to highlight key points, and word prediction to assist with writing flow.
          By reducing the cognitive load associated with writing and reading comprehension, children can
          focus on expressing their ideas clearly and understanding written material more effectively.
          This tool builds confidence in written communication and helps develop independent writing skills.
        </Description>
        
        <ToolContainer>
          <TabsContainer>
            <Tab 
              active={activeTab === 'simplify'} 
              onClick={() => setActiveTab('simplify')}
            >
              Simplify Text
            </Tab>
            <Tab 
              active={activeTab === 'grammar'} 
              onClick={() => setActiveTab('grammar')}
            >
              Grammar Check
            </Tab>
            <Tab 
              active={activeTab === 'spelling'} 
              onClick={() => setActiveTab('spelling')}
            >
              Spelling Help
            </Tab>
            <Tab 
              active={activeTab === 'summarize'} 
              onClick={() => setActiveTab('summarize')}
            >
              Summarize
            </Tab>
          </TabsContainer>
          
          <TextAreaContainer>
            <TextArea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here..."
            />
            <ButtonContainer>
              <Button onClick={handleAnalyze}>Analyze Text</Button>
              <Button onClick={() => setText('')}>Clear Text</Button>
            </ButtonContainer>
          </TextAreaContainer>
          
          {result && (
            <ResultContainer>
              <ResultTitle>{result.title}</ResultTitle>
              <p>{result.content}</p>
            </ResultContainer>
          )}
        </ToolContainer>
      </ContentSection>
    </PageContainer>
  );
};

export default UnderstandingWritingPage; 