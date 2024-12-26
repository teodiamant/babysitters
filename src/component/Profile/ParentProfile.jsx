import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';
import { Container, Card, CardMedia, CardContent, Typography, Button, Box } from '@mui/material';

const ParentProfile = () => {
    const [parent, setParent] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchParent = async () => {
            const docRef = doc(FIREBASE_DB, "parents", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setParent({ id: docSnap.id, ...docSnap.data() });
            } else {
                console.log("No such document!");
                navigate('/search'); // Redirect if no parent is found
            }
        };

        fetchParent();
    }, [id, navigate]);

    if (!parent) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container maxWidth="md">
            <Card sx={{ mt: 4 }}>
                <CardMedia
                    component="img"
                    height="340"
                    image={parent.profilePicture || 'default_image.jpg'}
                    alt={parent.firstName}
                />
                <CardContent>
                    <Typography gutterBottom variant="h4" component="div">
                        {parent.firstName} {parent.lastName}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Email: {parent.email}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Phone: {parent.phoneNumber}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Location: {parent.area}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Date of Birth: {new Date(parent.birthDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                        You are viewing a Parent Profile
                    </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', p: 2 }}>
                    <Button variant="contained" color="primary">
                        Contact
                    </Button>
                    <Button variant="contained" color="secondary">
                        Request Services
                    </Button>
                </Box>
            </Card>
        </Container>
    );
};

export default ParentProfile;
