import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.large};
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.large};
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const TilesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.large};
  margin-top: ${props => props.theme.spacing.large};
`;

const Tile = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${props => props.theme.spacing.large};
  background-color: ${props => props.theme.colors.tile};
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.shadow};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  min-height: 220px;
  color: ${props => props.theme.colors.text};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const TileIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: ${props => props.theme.spacing.medium};
  color: ${props => props.theme.colors.primary};
`;

const TileImage = styled.img`
  width: 150px;
  height: 150px;
  object-fit: contain;
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const TileTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: ${props => props.theme.spacing.small};
  color: ${props => props.theme.colors.primary};
`;

const TileDescription = styled.p`
  font-size: 1rem;
`;

const HomePage = () => {
  const tiles = [
    {
      id: 1,
      title: 'Read Aloud',
      description: 'Listen along and picture the words',
      useImage: true,
      imgSrc: '/images/dyslexiaid-mascot.png',
      icon: '📚',
      path: '/readaloud'
    },
    {
      id: 2,
      title: 'Study Pal',
      description: 'Study buddy, ready to help',
      useImage: true,
      imgSrc: '/images/studypal.png',
      icon: '😊',
      path: '/emotional-chatbot'
    },
    {
      id: 3,
      title: 'Best Buddy',
      description: 'Wanna talk about something? Click me',
      useImage: true,
      imgSrc: '/images/bestbuddy.png',
      icon: '🧠',
      path: '/therapy-chatbot'
    },
    {
      id: 4,
      title: 'Handwriting decoder',
      description: 'Upload an image and decode the text',
      useImage: true,
      imgSrc: '/images/hand.png',
      icon: '✏️',
      path: '/understanding-writing'
    }
  ];

  return (
    <HomeContainer>
      <Header>
        <Title>Hi there! How may I help you?</Title>
      </Header>

      <TilesContainer>
        {tiles.map(tile => (
          <Tile key={tile.id} to={tile.path}>
            {tile.useImage ? (
              <TileImage src={tile.imgSrc} alt={tile.title} />
            ) : (
              <TileIcon>{tile.icon}</TileIcon>
            )}
            <TileTitle>{tile.title}</TileTitle>
            <TileDescription>{tile.description}</TileDescription>
          </Tile>
        ))}
      </TilesContainer>
    </HomeContainer>
  );
};

export default HomePage; 