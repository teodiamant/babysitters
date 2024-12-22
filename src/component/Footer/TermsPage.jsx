import React from 'react';
import { Typography, Container } from '@mui/material';

const TermsPage = () => {
    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
                Terms and Conditions
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                By using Babysitters, you agree to the following terms and conditions:
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                - Babysitters is a platform to connect parents/guardians with babysitters. We do not take responsibility for any direct interactions.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                - Users are responsible for ensuring the accuracy of their profiles and interactions on the platform.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                - Payments are processed securely through the platform. Babysitters does not handle disputes outside the platform.
            </Typography>
            <Typography variant="body1">
                For further information, please contact <a href="mailto:info@babysitters.com">info@babysitters.com</a>.
            </Typography>
        </Container>
    );
};

export default TermsPage;
