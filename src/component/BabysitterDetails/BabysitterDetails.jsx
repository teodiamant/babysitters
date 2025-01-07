import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';
import { Container, Typography, Button, Paper } from '@mui/material';
import { getAuth } from 'firebase/auth';

const BabysitterDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [babysitter, setBabysitter] = useState(null);
    const auth = getAuth(); 

    useEffect(() => {
        const fetchBabysitter = async () => {
            const docRef = doc(FIREBASE_DB, "babysitters", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setBabysitter(docSnap.data());
            } else {
                console.log("No such document!");
            }
        };

        fetchBabysitter();
    }, [id]);

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    // Safe check for availability
    const formatAvailability = (availability) => {
        if (Array.isArray(availability)) {
            return availability.join(", ");
        }
        return 'Not specified';
    };

    const handleMakeContract = () => {
        const user = auth.currentUser;
        if (user) {
            navigate('/make-contract', {
                state: { 
                    babysitterDetails: babysitter, 
                    userDetails: { 
                        uid: user.uid, 
                        email: user.email, 
                        displayName: user.displayName 
                    }
                }});
        } else {
            alert("Please sign in to make a contract.");
            navigate('/login');
        }
    };

    if (!babysitter) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h4" gutterBottom>{babysitter.firstName} {babysitter.lastName}</Typography>
                <Typography variant="subtitle1">{babysitter.email}</Typography>
                <img src={babysitter.profilePicture || 'default_image.jpg'} alt="Babysitter" style={{ width: '100%' }} />
                <Typography sx={{ mt: 2 }}>{babysitter.bio}</Typography>
                <Typography sx={{ mt: 1 }}>Age: {calculateAge(babysitter.birthDate)}</Typography>
                <Typography sx={{ mt: 1 }}>Experience: {babysitter.experience} years</Typography>
                <Typography sx={{ mt: 1 }}>Certifications: {babysitter.certifications}</Typography>
                <Typography sx={{ mt: 1 }}>Availability: {formatAvailability(babysitter.availability)}</Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2, mr: 1 }}>
                    Send Message
                </Button>
                <Button variant="contained" color="secondary" sx={{ mt: 2 }}  onClick={handleMakeContract}>
                    Make a Contract
                </Button>
            </Paper>
        </Container>
    );
};

export default BabysitterDetails;
