import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';
import { Container, Card, CardMedia, CardContent, Typography, Button, Box } from '@mui/material';

const BabysitterProfile = () => {
    const [babysitter, setBabysitter] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBabysitter = async () => {
            const docRef = doc(FIREBASE_DB, "babysitters", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setBabysitter({ id: docSnap.id, ...docSnap.data() });
            } else {
                console.log("No such document!");
                navigate('/search'); // Redirect if no babysitter is found
            }
        };

        fetchBabysitter();
    }, [id, navigate]);

    const handleSendMessage = () => {
        console.log("Message sent to:", babysitter.firstName);
        // Implement messaging functionality
    };

    const handleMakeContract = () => {
        console.log("Contract made with:", babysitter.firstName);
        // Implement contract creation functionality
    };

    if (!babysitter) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container maxWidth="md">
            <Card sx={{ mt: 4 }}>
                <CardMedia
                    component="img"
                    height="340"
                    image={babysitter.profilePicture || 'default_image.jpg'}
                    alt={babysitter.firstName}
                />
                <CardContent>
                    <Typography gutterBottom variant="h4" component="div">
                        {babysitter.firstName} {babysitter.lastName}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Email: {babysitter.email}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Phone: {babysitter.phoneNumber}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Location: {babysitter.area}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Experience: {babysitter.experience} years
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Date of Birth: {new Date(babysitter.birthDate).toLocaleDateString()}
                    </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', p: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleSendMessage}>
                        Send Message
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleMakeContract}>
                        Make a Contract
                    </Button>
                </Box>
            </Card>
        </Container>
    );
};

export default BabysitterProfile;
