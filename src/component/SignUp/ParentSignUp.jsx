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

const steps = ['Personal Details', 'Additional Information', 'Setup Profile'];

const ParentSignUp = () => {
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
        numberOfChildren: '',
        childrenAges: '',
        profilePicture: '',
        area: '',
        street: '',
        postalCode: '',
        role: 'parent'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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

            const userRef = doc(FIREBASE_DB, 'parents', userId);
            await setDoc(userRef, {
                ...formData,
                createdAt: new Date(),
            });

            setSuccessMessage('Registration successful!');
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            console.error('Error saving user data:', error);
            setErrorMessage('An error occurred during registration. Please try again.');
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
            <Stepper activeStep={activeStep} alternativeLabel sx={{
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
                Parent Sign-Up
            </Typography>
            {successMessage && <Alert severity="success">{successMessage}</Alert>}
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            {activeStep === 0 && (
                <form>
                    {/* Name and Gender Section */}
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
                    {/* Address Section */}
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
                        label="Area *"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Street Address *"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Postal Code *"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
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
                        Additional Information
                    </Typography>
                    <TextField
                        label="Number of Children *"
                        name="numberOfChildren"
                        type="number"
                        value={formData.numberOfChildren}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Children Ages"
                        name="childrenAges"
                        value={formData.childrenAges}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        rows={3}
                        sx={{ mb: 2 }}
                    />
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

export default ParentSignUp;
