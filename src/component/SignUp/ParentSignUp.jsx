import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Stepper, Step, StepLabel,  CircularProgress,
        Alert,  } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const steps = ['Personal Details', 'Profile Picture', 'Profile Review'];

const ParentSignUp = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ firstName: '', lastName: '', 
            email: '', password: '', phoneNumber: '',  profilePicture: '', 
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({...formData, profilePicture: reader.result});
            };
            reader.readAsDataURL(file);
        }
    };
    

    const handleNext = async () => {
        if (activeStep < steps.length - 1) {
            setActiveStep(activeStep + 1);
        } else {
            await handleSubmit();
        }
    };

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep(activeStep - 1);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');
    
        let userCredential = null;
    
        try {
            // Step 1: Create user in Firebase Authentication
            userCredential = await createUserWithEmailAndPassword(
                FIREBASE_AUTH,
                formData.email,
                formData.password
            );
            const userId = userCredential.user.uid;
    
            // Step 2: Prepare parent data
            const parentDocData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                profilePicture: formData.profilePicture,
                createdAt: new Date(),
            };
    
            // Step 3: Add data to Firestore collections
            await Promise.all([
                setDoc(doc(FIREBASE_DB, 'users', userId), {
                    userId: userId,
                    email: formData.email,
                    role: 'parent',
                    createdAt: new Date(),
                }),
                setDoc(doc(FIREBASE_DB, 'parents', userId), parentDocData),
            ]);
    
            setSuccessMessage('Registration successful!');
            setTimeout(() => navigate('/'), 1000);
        } catch (error) {
            console.error('Error saving user data:', error);
    
            // Rollback: Delete user from Firebase Authentication if registration fails
            if (userCredential && userCredential.user) {
                try {
                    await userCredential.user.delete();
                    console.log('User deleted from Firebase Authentication due to failure.');
                } catch (authError) {
                    console.error('Error deleting user from Firebase Authentication:', authError);
                }
            }
    
            if (error.code === 'auth/email-already-in-use') {
                setErrorMessage('This email is already registered.');
            } else {
                setErrorMessage('An error occurred during registration. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <Container
            maxWidth="sm"
            sx={{
                mt: 5,
                pb: 3,
                pt: 2,
                borderRadius: 2,
                boxShadow: 2,
                textAlign: 'center',
                backgroundColor: '#fff',
            }}
        >
            <Stepper
                activeStep={activeStep}
                alternativeLabel
                sx={{
                    mb: 3,
                    '& .MuiStepIcon-root': {
                        color: '#795e53', // Default color for step icons
                    },
                    '& .MuiStepIcon-root.Mui-active': {
                        color: '#004951', // Active step color
                    },
                    '& .MuiStepIcon-root.Mui-completed': {
                        color: '#f3b2ac', // Completed step color
                    },
                }}
            >
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Typography variant="h5" sx={{ mb: 3 }}>
                Parent Sign-Up
            </Typography>
            {successMessage && <Alert severity="success">{successMessage}</Alert>}
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            {activeStep === 0 && (
                <form>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField
                            label="First Name *"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            label="Last Name *"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            fullWidth
                        />
                    </Box>
                    <TextField
                        label="Email *"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Password *"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Phone Number *"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                </form>
            )}
            {activeStep === 1 && (
                <form>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Setup Profile
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        Upload Profile Picture (Base64):
                    </Typography>
                    <TextField
                        type="file"
                        name="profilePicture"
                        onChange={handleFileChange}
                        InputProps={{ accept: 'image/*' }}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    {formData.profilePicture && (
                        <Box
                            component="img"
                            src={formData.profilePicture}
                            alt="Profile Preview"
                            sx={{
                                width: '100%',
                                maxWidth: 200,
                                borderRadius: '50%',
                                mt: 2,
                                border: '2px solid #004951',
                            }}
                        />
                    )}
                </form>
            )}
            {activeStep === 2 && (
                 <form>
                 <Typography variant="h6" sx={{ mb: 2 }}>
                     Review Your Information
                 </Typography>
                 <Box sx={{ mb: 2 }}>
                     <Typography variant="body1">
                         <strong>First Name:</strong> {formData.firstName}
                     </Typography>
                     <Typography variant="body1">
                         <strong>Last Name:</strong> {formData.lastName}
                     </Typography>
                     <Typography variant="body1">
                         <strong>Email:</strong> {formData.email}
                     </Typography>
                     <Typography variant="body1">
                         <strong>Phone Number:</strong> {formData.phoneNumber}
                     </Typography>
                 </Box>
                 {formData.profilePicture && (
                     <Box sx={{ textAlign: 'center', mb: 2 }}>
                         <Typography variant="body1" sx={{ mb: 1 }}>
                             <strong>Profile Picture Preview:</strong>
                         </Typography>
                         <Box
                             component="img"
                             src={formData.profilePicture}
                             alt="Profile Preview"
                             sx={{
                                 width: '100%',
                                 maxWidth: 200,
                                 borderRadius: '50%',
                                 border: '2px solid #004951',
                             }}
                         />
                     </Box>
                 )}
             </form>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                {activeStep > 0 && (
                    <Button variant="outlined" onClick={handleBack}>
                        Back
                    </Button>
                )}
                <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ bgcolor: '#795e53', '&:hover': { bgcolor: '#4c3b34' } }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                </Button>
            </Box>
        </Container>
    );
};

export default ParentSignUp;