import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.spacing.medium};
  background-color: ${props => props.theme.colors.highlight};
  color: ${props => props.theme.colors.primary};
  font-size: 1rem;
`;

const Footer = () => {
  return (
    <FooterContainer>
      © 2026 DyslexiAid
    </FooterContainer>
  );
};

export default Footer;
