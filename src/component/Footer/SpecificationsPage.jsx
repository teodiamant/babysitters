import React from 'react';
import { Typography, Container } from '@mui/material';

const SpecificationsPage = () => {
    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
                Specifications for Services
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                Babysitters offers the following specifications for services to ensure a high-quality experience:
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                - Verified Babysitters: Every babysitter profile is reviewed to ensure their identity and qualifications.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                - Secure Payment Methods: All payments are processed securely through our platform.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                - Emergency Support: Parents and babysitters can contact our support team in case of emergencies.
            </Typography>
            <Typography variant="body1">
                For more details, contact us at <a href="mailto:info@babysitters.com">info@babysitters.com</a>.
            </Typography>
        </Container>
    );
};

export default SpecificationsPage;
