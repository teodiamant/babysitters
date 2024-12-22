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
            {
                question: "How do I verify the babysitter’s qualifications?",
                answer: "Babysitter profiles include certifications and reviews from other parents. You can also directly communicate with them to verify their qualifications.",
            },
            {
                question: "What if a babysitter cancels at the last minute?",
                answer: "You can search for another available babysitter through the platform, and we recommend having a backup list of preferred babysitters.",
            },
            {
                question: "How do I pay the babysitter?",
                answer: "Payments can be made directly through the platform using the vouchers.",
            },
            {
                question: "Are babysitters background-checked?",
                answer: "Yes, all babysitters on the platform undergo a basic background check. You can also view reviews and ratings from other parents.",
            },
            {
                question: "How do I set up a recurring schedule with a babysitter?",
                answer: "Once you’ve hired a babysitter, you can coordinate with them directly to establish recurring bookings and schedules.",
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
            {
                question: "How do I get more bookings?",
                answer: "Ensure your profile is complete with detailed information, a friendly photo, and updated availability. Respond promptly to parent inquiries.",
            },
            {
                question: "How do I handle special needs children?",
                answer: "Make sure to communicate with parents beforehand about the child’s requirements. Taking relevant certifications or training can also help.",
            },
            {
                question: "Can I decline a babysitting job?",
                answer: "Yes, you can decline a job request if it doesn’t fit your schedule or preferences. However, we encourage clear communication with parents.",
            },
            {
                question: "What should I do in case of an emergency?",
                answer: "Always keep emergency contacts and information handy. Inform the parents and contact emergency services if needed.",
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
