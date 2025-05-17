import { createGlobalStyle } from 'styled-components';
import theme from './theme';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${theme.fonts.primary};
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
    line-height: 1.6;
    font-size: 18px; /* Slightly larger font for better readability */
    letter-spacing: 0.5px; /* Increased letter spacing for dyslexic readers */
  }

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: ${theme.spacing.medium};
    line-height: 1.3;
    font-weight: 600;
    letter-spacing: 0.7px;
    font-family: ${theme.fonts.primary};
  }

  p {
    margin-bottom: ${theme.spacing.medium};
    font-family: ${theme.fonts.primary};
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: color 0.3s ease;
    font-family: ${theme.fonts.primary};

    &:hover {
      color: ${theme.colors.lightText};
    }
  }

  button {
    cursor: pointer;
    border: none;
    border-radius: ${theme.borderRadius};
    padding: ${theme.spacing.small} ${theme.spacing.medium};
    background-color: ${theme.colors.button};
    color: ${theme.colors.text};
    font-family: ${theme.fonts.primary};
    font-size: 16px;
    transition: all 0.3s ease;

    &:hover {
      background-color: ${theme.colors.lightText};
      color: ${theme.colors.secondary};
    }
  }

  input, textarea {
    font-family: ${theme.fonts.primary};
  }

  /* Styles for better accessibility */
  ::selection {
    background-color: ${theme.colors.primary};
    color: white;
  }
`;

export default GlobalStyles; 