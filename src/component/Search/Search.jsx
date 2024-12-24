import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Card, CardMedia, CardContent, Typography, CardActionArea } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';

const BabysitterProfile = ({ babysitter }) => {
    const navigate = useNavigate();

    const viewDetails = () => {
        // Πλοηγήστε στη σελίδα λεπτομερειών με περαιτέρω πληροφορίες για τη νταντά
        navigate(`/babysitters/${babysitter.id}`);
    };

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea onClick={viewDetails}>
                <CardMedia
                    component="img"
                    height="140"
                    image={babysitter.photo || 'default_image.jpg'}
                    alt="Babysitter photo"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {babysitter.firstName} {babysitter.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {babysitter.area}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default function Search() {
    const [babysitters, setBabysitters] = useState([]);

    useEffect(() => {
        const fetchBabysitters = async () => {
            const querySnapshot = await getDocs(collection(FIREBASE_DB, 'babysitters'));
            const babysitterData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setBabysitters(babysitterData);
        };

        fetchBabysitters();
    }, []);

    return (
        <Container sx={{ py: 8 }} maxWidth="md">
            <Grid container spacing={4}>
                {babysitters.map((babysitter) => (
                    <Grid item key={babysitter.id} xs={12} sm={6} md={4}>
                        <BabysitterProfile babysitter={babysitter} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
