import React from 'react';

const DyslexiAidLogo = ({ width = '250px', height = 'auto' }) => {
  return (
    <img 
      src="/images/dyslexiaid-logo.png" 
      alt="DyslexiAid - Support for Dyslexia"
      style={{ 
        width, 
        height,
        objectFit: 'contain'
      }}
    />
  );
};

export default DyslexiAidLogo; 