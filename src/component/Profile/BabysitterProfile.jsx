
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';
import { Container, Grid, Typography, Button, Box, Card, CardContent } from '@mui/material';

const BabysitterProfile = () => {
    const [pendingAcceptedRequests, setPendingAcceptedRequests] = useState([]);
    const [otherRequests, setOtherRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const requestsRef = collection(FIREBASE_DB, "requests");
                
                // Query for pending or accepted requests
                const pendingAcceptedQuery = query(
                    requestsRef,
                    where("babysitterId", "==", id),
                    where("state", "in", ["pending", "accepted"])
                );
                const pendingAcceptedSnap = await getDocs(pendingAcceptedQuery);

                const otherQuery = query(
                    requestsRef,
                    where("babysitterId", "==", id),
                    where("state", "not-in", ["pending", "accepted"])
                );
                const otherSnap = await getDocs(otherQuery);

                // Set state with the fetched data
                setPendingAcceptedRequests(
                    pendingAcceptedSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
                );
                setOtherRequests(
                    otherSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
                );
            } catch (err) {
                setError("Failed to fetch requests");
                console.error(err);
            }
            setLoading(false);
        };

        fetchRequests();
    }, [id]);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Button variant="contained" color="primary" onClick={() => navigate('/babysitter-settings')}>
                    Go to Settings
                </Button>
            </Box>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Pending or Accepted Requests
                    </Typography>
                    {pendingAcceptedRequests.length > 0 ? (
                        pendingAcceptedRequests.map((request) => (
                            <Card key={request.id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="body1">
                                        Request ID: {request.id}
                                    </Typography>
                                    <Typography variant="body1">
                                        Status: {request.status}
                                    </Typography>
                                    <Typography variant="body1">
                                        Parent Name: {request.parentName}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography>No requests found.</Typography>
                    )}
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Other Requests
                    </Typography>
                    {otherRequests.length > 0 ? (
                        otherRequests.map((request) => (
                            <Card key={request.id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="body1">
                                        Request ID: {request.id}
                                    </Typography>
                                    <Typography variant="body1">
                                        Status: {request.status}
                                    </Typography>
                                    <Typography variant="body1">
                                        Parent Name: {request.parentName}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography>No requests found.</Typography>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default BabysitterProfile;
