// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { doc, getDoc } from 'firebase/firestore';
// import { FIREBASE_DB } from '../../config/firebase';
// import { Container, Card, CardMedia, CardContent, Typography, Button, Box } from '@mui/material';

// const BabysitterProfile = () => {
//     const [babysitter, setBabysitter] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const { id } = useParams();
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchBabysitter = async () => {
            
//             try {
//                 const docRef = doc(FIREBASE_DB, "babysitters", id);
//                 const docSnap = await getDoc(docRef);
//                 if (docSnap.exists()) {
//                     setBabysitter({ id: docSnap.id, ...docSnap.data() });
//                 } else {
//                     setError("No such document!");
//                     navigate('/search'); // Redirect if no babysitter is found
//                 }
//             } catch (err) {
//                 setError("Failed to fetch data");
//                 console.error(err);
//             }
//             setLoading(false);
//         };

//         fetchBabysitter();
//     }, [id, navigate]);

//     const handleSendMessage = () => {
//         console.log("Message sent to:", babysitter?.firstName);
//         // Implement messaging functionality
//     };

//     const handleMakeContract = () => {
//         console.log("Contract made with:", babysitter?.firstName);
//         // Implement contract creation functionality
//     };

//     if (loading) {
//         return <Typography>Loading...</Typography>;
//     }

//     if (error) {
//         return <Typography color="error">{error}</Typography>;
//     }

//     return (
//         <Container maxWidth="md">
//             <Card sx={{ mt: 4 }}>
//                 <CardMedia
//                     component="img"
//                     height="340"
//                     image={babysitter?.profilePicture || 'default_image.jpg'}
//                     alt={babysitter?.firstName}
//                 />
//                 <CardContent>
//                     <Typography gutterBottom variant="h4" component="div">
//                         {babysitter?.firstName} {babysitter?.lastName}
//                     </Typography>
//                     <Typography variant="body1" color="text.secondary">
//                         Email: {babysitter?.email}
//                     </Typography>
//                     <Typography variant="body1" color="text.secondary">
//                         Phone: {babysitter?.phoneNumber}
//                     </Typography>
//                     <Typography variant="body1" color="text.secondary">
//                         Location: {babysitter?.area}
//                     </Typography>
//                     <Typography variant="body1" color="text.secondary">
//                         Experience: {babysitter?.experience} years
//                     </Typography>
//                     <Typography variant="body1" color="text.secondary">
//                         Date of Birth: {new Date(babysitter?.birthDate).toLocaleDateString()}
//                     </Typography>
//                 </CardContent>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-around', p: 2 }}>
//                     <Button variant="contained" color="primary" onClick={handleSendMessage}>
//                         Send Message
//                     </Button>
//                     <Button variant="contained" color="secondary" onClick={handleMakeContract}>
//                         Make a Contract
//                     </Button>
//                 </Box>
//             </Card>
//         </Container>
//     );
// };

// export default BabysitterProfile;
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
                    where("status", "in", ["pending", "accepted"])
                );
                const pendingAcceptedSnap = await getDocs(pendingAcceptedQuery);

                const otherQuery = query(
                    requestsRef,
                    where("babysitterId", "==", id),
                    where("status", "not-in", ["pending", "accepted"])
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
