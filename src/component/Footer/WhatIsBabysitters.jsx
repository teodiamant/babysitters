import React from 'react';
import { Typography, Container, Link } from '@mui/material';

const WhatIsBabysitters = () => {
    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
                What is Babysitters?
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                Babysitters is an online platform designed to connect parents and guardians with reliable, verified, and experienced babysitters. 
                Whether you're a parent looking for someone to care for your child or a babysitter seeking employment opportunities, Babysitters is here to make the process seamless, secure, and efficient.
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 4, mb: 2 }}>
                Why Choose Babysitters?
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                - **Verified Profiles**: All babysitters go through a thorough verification process to ensure trust and reliability.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                - **User-Friendly Platform**: Our easy-to-use interface makes it simple to search for babysitters or create a profile.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                - **Safety First**: We prioritize the safety of children by allowing parents to review babysitter profiles, ratings, and reviews.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                - **Flexible Options**: Babysitters accommodates all types of schedules, whether you need part-time, full-time, or occasional care.
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 4, mb: 2 }}>
                Our Mission
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                Our mission is to provide a secure and trustworthy environment where parents can find the perfect caregiver for their children, and babysitters can find rewarding job opportunities. 
                We aim to simplify the process of childcare, making it more accessible and stress-free for everyone involved.
            </Typography>
            <Typography variant="h6" sx={{ mt: 4, mb: 1, fontWeight: 'bold' }}>
                Contact Us
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
                Email: <Link href="mailto:info@babysitters.com" sx={{ color: '#004951' }}>info@babysitters.com</Link>
            </Typography>
            <Typography variant="body1">
                Phone: <strong>+0030 6969696969</strong>
            </Typography>
        </Container>
    );
};

export default WhatIsBabysitters;
