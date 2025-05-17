import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.medium};
  background-color: ${props => props.theme.colors.highlight};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
`;

const LogoImage = styled.img`
  height: 50px;
  object-fit: contain;
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.large};
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  font-size: 18px;
  transition: all 0.3s ease;
  padding: ${props => props.theme.spacing.small};
  border-radius: ${props => props.theme.borderRadius};

  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
`;

const Navbar = () => {
  return (
    <NavContainer>
      <Logo to="/">
        <LogoImage 
          src="/dyslexiaid-logo.png" 
          alt="DyslexiAid - Support for Dyslexia" 
        />
      </Logo>
      <NavLinks>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/readaloud">Read Aloud</NavLink>
        <NavLink to="/emotional-chatbot">Study Pal</NavLink>
        <NavLink to="/therapy-chatbot">Best Buddy</NavLink>
        <NavLink to="/understanding-writing">Handwriting decoder</NavLink>
      </NavLinks>
    </NavContainer>
  );
};

export default Navbar; 