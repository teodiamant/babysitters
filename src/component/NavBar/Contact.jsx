import React from 'react';
import { Typography, Container } from '@mui/material';

const Contact = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 5,
        pb: 3,
        pt: 2,
        textAlign: 'center',
        backgroundColor: '#f9f5e7',
        borderRadius: 2,
        boxShadow: 2,
        color: '#4c3b34',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontFamily: "'Pacifico', cursive",
          mb: 3,
          color: '#795e53',
        }}
      >
        Babysitters
      </Typography>
      <Typography variant="body1" sx={{ fontSize: '1.2rem', mb: 2 }}>
        Email: <a href="mailto:info@babysitters.com" style={{ color: '#4c3b34' }}>info@babysitters.com</a>
      </Typography>
      <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
        Contact Us: <a href="tel:+306969696969" style={{ color: '#4c3b34' }}>+30 6969696969</a>
      </Typography>
    </Container>
  );
};

export default Contact;
