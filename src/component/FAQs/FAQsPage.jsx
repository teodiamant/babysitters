import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQsPage2 = ({ section }) => {
    const faqs = {
        parents: [
            {
                question: "How do I sign up as a parent?",
                answer: "You can sign up by clicking the 'Sign Up' button on the homepage and selecting 'Parent' during registration.",
            },
            {
                question: "How do I find a babysitter?",
                answer: "Use the search bar on the homepage to filter babysitters by location, availability, and experience.",
            },
        ],
        babysitters: [
            {
                question: "How do I create a profile?",
                answer: "Log in and navigate to 'My Profile' to complete your details and upload a photo.",
            },
            {
                question: "What should I include in my profile?",
                answer: "Include your experience, certifications, availability, and a friendly introduction to attract parents.",
            },
        ],
    };

    return (
        <Box
            sx={{
                px: 4,
                py: 6,
                backgroundColor: '#f9f9f9',
                minHeight: '100vh',
            }}
        >
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
                {section === 'parents' ? 'FAQs for Parents/Guardians' : 'FAQs for Babysitters'}
            </Typography>
            {faqs[section].map((faq, index) => (
                <Accordion key={index} sx={{ mb: 2 }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{ backgroundColor: '#f2f2f2', fontWeight: 'bold' }}
                    >
                        {faq.question}
                    </AccordionSummary>
                    <AccordionDetails sx={{ backgroundColor: '#fff' }}>
                        <Typography>{faq.answer}</Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
};

export default FAQsPage2;
