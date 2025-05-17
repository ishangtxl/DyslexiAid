import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.large};
  font-family: ${props => props.theme.fonts.primary};
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-sizing: border-box;
`;

const PageHeader = styled.h1`
  color: ${props => props.theme.colors.primary};
  font-size: 2.5rem;
  margin-bottom: ${props => props.theme.spacing.medium};
  text-align: center;
`;

const ContentSection = styled.section`
  background-color: ${props => props.theme.colors.tile};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.large};
  margin-bottom: ${props => props.theme.spacing.large};
  box-shadow: ${props => props.theme.shadow};
  font-size: 1.2rem;
  line-height: 1.7;
  text-align: center;
`;

const TherapyChatbotPage = () => {
  return (
    <PageContainer>
      <PageHeader>🧠 Therapy Support</PageHeader>
      <ContentSection>
        Welcome to our therapy support page. Here, we provide a safe and understanding space for individuals with dyslexia to express their thoughts, feelings, and challenges. Our goal is to help you navigate the emotional aspects of dyslexia, build confidence, and develop effective coping strategies. Whether you're dealing with frustration, anxiety, or just need someone to talk to, we're here to listen and support you on your journey.
      </ContentSection>
    </PageContainer>
  );
};

export default TherapyChatbotPage; 