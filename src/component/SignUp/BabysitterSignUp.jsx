import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, CircularProgress, Box, Paper, LinearProgress } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';

const ConfirmDetails = ({ userData }) => (
    <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>Confirm your details</Typography>
        <Typography>{`Name: ${userData.firstName} ${userData.lastName}`}</Typography>
        <Typography>{`Email: ${userData.email}`}</Typography>
        <Typography>{`Education: ${userData.education}`}</Typography>
        <Typography>{`Phone: ${userData.phone}`}</Typography>
        <Typography>{`Date of Birth: ${new Date(userData.dateOfBirth).toLocaleDateString()}`}</Typography>
        <Typography>{`Address: ${userData.address}, ${userData.area}, ${userData.postalCode}`}</Typography>
        <Typography>{`AMKA: ${userData.amka}`}</Typography>
        <Typography>{`Experience: ${userData.experience}`}</Typography>
        <Typography>{`Document Uploaded: ${userData.document ? 'Yes' : 'No'}`}</Typography>
        <Typography>{`Photo Uploaded: ${userData.photo ? 'Yes' : 'No'}`}</Typography>
    </Box>
);

export default function BabysitterSignUp() {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        education: '',
        phone: '',
        dateOfBirth: '',
        address: '',
        area: '',
        postalCode: '',
        amka: '',
        experience: '',
        photo: null,
        document: null
    });
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const steps = ['Basic Information', 'Additional Information', 'Confirm & Submit'];

    const handleNext = () => {
        if (activeStep === 2) {
            handleConfirmRegistration();
        } else {
            setActiveStep(prevActiveStep => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        if (files) {
            const reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload = () => {
                setUserData(prev => ({ ...prev, [name]: reader.result }));
            };
            reader.onerror = error => console.log('Error reading file:', error);
        } else {
            setUserData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleConfirmRegistration = async () => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, userData.email, userData.password);
            const userRef = doc(FIREBASE_DB, "babysitters", userCredential.user.uid);
            const dataToSave = {
                ...userData,
                documentUploaded: !!userData.document,
                photo: userData.photo
            };
    
            await setDoc(userRef, dataToSave);
            navigate('/profile'); // Navigate to the profile page
        } catch (error) {
            console.error("Registration error:", error);
            alert('Failed to register. ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <Paper sx={{ p: 2 }}>
                <Typography component="h1" variant="h5">Register as Babysitter</Typography>
                <LinearProgress variant="determinate" value={(activeStep / steps.length) * 100} sx={{ my: 3 }} />
                <form onSubmit={(e) => e.preventDefault()}>
                    {activeStep === 0 && (
                        <>
                            <TextField fullWidth label="First Name" name="firstName" value={userData.firstName} onChange={handleChange} required />
                            <TextField fullWidth label="Last Name" name="lastName" value={userData.lastName} onChange={handleChange} required />
                            <TextField fullWidth label="Email" type="email" name="email" value={userData.email} onChange={handleChange} required />
                            <TextField fullWidth label="Password" type="password" name="password" value={userData.password} onChange={handleChange} required />
                            <TextField fullWidth label="Phone" name="phone" type="number" value={userData.phone} onChange={handleChange} required />
                            <TextField fullWidth label="AMKA" name="amka" type="number" value={userData.amka} onChange={handleChange} required />
                            <TextField fullWidth label="Date of Birth" name="dateOfBirth" type="date" value={userData.dateOfBirth} onChange={handleChange} required />
                            <TextField fullWidth label="Address" name="address" value={userData.address} onChange={handleChange} required />
                            <TextField fullWidth label="Area" name="area" value={userData.area} onChange={handleChange} required />
                            <TextField fullWidth label="Postal Code" name="postalCode" value={userData.postalCode} onChange={handleChange} required />
                        </>
                    )}
                    {activeStep === 1 && (
                        <>
                            <TextField fullWidth label="Experience" name="experience" value={userData.experience} onChange={handleChange} multiline rows={4} />
                            <TextField fullWidth label="Education" name="education" value={userData.education} onChange={handleChange} multiline rows={4} />
                            <TextField type="file" name="document" onChange={handleChange} inputProps={{ accept: "application/pdf" }} label="Upload Document" />
                            <TextField type="file" name="photo" onChange={handleChange} inputProps={{ accept: "image/*" }} label="Upload Photo" />
                        </>
                    )}
                    {activeStep === 2 && <ConfirmDetails userData={userData} />}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button onClick={handleBack} disabled={activeStep === 0}>Back</Button>
                        <Button variant="contained" onClick={handleNext} color="primary">
                            {activeStep === steps.length - 1 ? 'Confirm & Register' : 'Next'}
                        </Button>
                    </Box>
                </form>
                {loading && <CircularProgress />}
            </Paper>
        </Container>
    );
}
