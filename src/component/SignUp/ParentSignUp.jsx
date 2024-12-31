import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Stepper,
    Step,
    StepLabel,
    CircularProgress,
    Alert,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const steps = ['Personal Details', 'Days Babysitter is Needed', 'Additional Information'];

const ParentSignUp = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        daysNeeded: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        isFlexible: false,
        additionalInfo: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDaySelection = (day) => {
        setFormData((prevData) => ({
            ...prevData,
            daysNeeded: prevData.daysNeeded.includes(day)
                ? prevData.daysNeeded.filter((d) => d !== day)
                : [...prevData.daysNeeded, day],
        }));
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
        try {
            const userCredential = await createUserWithEmailAndPassword(
                FIREBASE_AUTH,
                formData.email,
                formData.password
            );

            const userId = userCredential.user.uid;

            // Add to users collection
            const userRef = doc(FIREBASE_DB, 'users', userId);
            await setDoc(userRef, {
                email: formData.email,
                role: 'parent',
                createdAt: new Date(),
            });

            // Add profile data to parents collection
            const parentRef = doc(FIREBASE_DB, 'parents', userId);
            await setDoc(parentRef, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                daysNeeded: formData.daysNeeded,
                isFlexible: formData.isFlexible,
                additionalInfo: formData.additionalInfo,
                createdAt: new Date(),
            });

            setSuccessMessage('Registration successful!');
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            console.error('Error saving user data:', error);
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
                        Days Babysitter is Needed
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 2 }}>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
                            (day, index) => (
                                <Box
                                    key={index}
                                    onClick={() => handleDaySelection(day)}
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '50%',
                                        border: '2px solid #f3b2ac',
                                        backgroundColor: formData.daysNeeded.includes(day)
                                            ? '#f3b2ac'
                                            : 'transparent',
                                        color: formData.daysNeeded.includes(day) ? '#fff' : '#4c3b34',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        userSelect: 'none',
                                    }}
                                >
                                    {day.slice(0, 3).toUpperCase()}
                                </Box>
                            )
                        )}
                    </Box>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.isFlexible}
                                onChange={(e) =>
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        isFlexible: e.target.checked,
                                    }))
                                }
                            />
                        }
                        label="I am flexible with the days"
                    />
                </form>
            )}
            {activeStep === 2 && (
                <form>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Additional Information
                    </Typography>
                    <TextField
                        label="Additional Info"
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        rows={4}
                        sx={{ mb: 2 }}
                    />
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
