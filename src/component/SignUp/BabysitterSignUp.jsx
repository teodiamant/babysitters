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
    MenuItem,
    CircularProgress,
    Alert,
} from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const steps = ['Personal Details', 'Experience & Availability', 'Setup Profile'];

const BabysitterSignUp = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        birthDate: '',
        email: '',
        password: '',
        phoneNumber: '',
        experience: '',
        certifications: '',
        bio: '',
        profilePicture: '',
        availability: {
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            preferredHours: { start: '', end: '' },
        },
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDaySelection = (day) => {
        setFormData((prevData) => ({
            ...prevData,
            availability: {
                ...prevData.availability,
                days: prevData.availability.days.includes(day)
                    ? prevData.availability.days.filter((d) => d !== day)
                    : [...prevData.availability.days, day],
            },
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, profilePicture: reader.result });
        };
        if (file) {
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
        try {
            const userCredential = await createUserWithEmailAndPassword(
                FIREBASE_AUTH,
                formData.email,
                formData.password
            );

            const userId = userCredential.user.uid;

            const userRef = doc(FIREBASE_DB, 'babysitters', userId);
            await setDoc(userRef, {
                ...formData,
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
            <Stepper activeStep={activeStep} alternativeLabel 
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
            }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Typography variant="h5" sx={{ mb: 3 }}>
                Babysitter Sign-Up
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
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField
                            select
                            label="Gender *"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            fullWidth
                        >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </TextField>
                        <TextField
                            label="Birth Date *"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleInputChange}
                            type="date"
                            InputLabelProps={{ shrink: true }}
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
                        Experience
                    </Typography>
                    <TextField
                        label="Years of Experience *"
                        name="experience"
                        type="number"
                        value={formData.experience}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Certifications/Skills"
                        name="certifications"
                        value={formData.certifications}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        rows={3}
                        sx={{ mb: 2 }}
                    />
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Availability
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 2 }}>
                        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, index) => (
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
                                    backgroundColor: formData.availability.days.includes(day)
                                        ? '#f3b2ac'
                                        : 'transparent',
                                    color: formData.availability.days.includes(day) ? '#fff' : '#4c3b34',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    userSelect: 'none',
                                }}
                            >
                                {day}
                            </Box>
                        ))}
                    </Box>
                </form>
            )}
            {activeStep === 2 && (
                <form>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Setup Profile
                    </Typography>
                    <TextField
                        label="Short Bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        rows={4}
                        sx={{ mb: 2 }}
                    />
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        Upload Profile Picture (Base64):
                    </Typography>
                    <TextField
                        type="file"
                        name="profilePicture"
                        onChange={handleFileChange}
                        inputProps={{ accept: 'image/*' }}
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

export default BabysitterSignUp;
