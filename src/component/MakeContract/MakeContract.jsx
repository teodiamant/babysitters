import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Stepper, Step, StepLabel, CircularProgress,
        Alert, FormControlLabel, Checkbox } from '@mui/material';
import { addDoc, collection,getDocs,where,query } from 'firebase/firestore'; // Εισαγωγή addDoc
import { FIREBASE_DB } from '../../config/firebase'; // Firebase σύνδεση
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const steps = ['Personal Details', 'Child & Days Specifications', 'Setup Profile','Review'];

const MakeContract = () => {
    const { state } = useLocation();
    const { babysitterDetails, userDetails } = state;

    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isFlexible, setIsFlexible] = useState(false);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        state: '',
        payment:'',
        startDate: '',
        duration: '',
        city: '',
        street: '',
        postalCode: '', 
        numberOfChildren: '', 
        childrenAges: '', 
        specializations: '', 
        availability: { days: [], preferredHours: { start: '', end: '' }, isFlexibleWithHours: false },
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

    const fetchParentDetails = async (email) => {
        const parentQuery = query(
            collection(FIREBASE_DB, 'parents'),
            where('email', '==', email)
        );
        const parentSnapshot = await getDocs(parentQuery);
        if (!parentSnapshot.empty) {
            const parentDoc = parentSnapshot.docs[0];
            return parentDoc.data(); // Επιστρέψτε τα δεδομένα του γονέα
        } else {
            console.warn('Parent data not found');
            return null;
        }
    };
    

    const handleSubmit = async () => {
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        const parentDetails = await fetchParentDetails(userDetails.email);

        if (!parentDetails) {
            setErrorMessage('Failed to fetch parent details');
            return;
        }
        try {
            const contractData = {
                state: 'Pending',
                payment:'false',
                startDate: formData.startDate,
                duration: formData.duration,
                city: formData.city,
                street: formData.street,
                postalCode: formData.postalCode,
                numberOfChildren: formData.numberOfChildren,
                childrenAges: formData.childrenAges,
                specializations: formData.specializations,
                availability: {
                    days: formData.availability.days,
                    preferredHours: formData.availability.preferredHours,
                    isFlexibleWithHours: formData.availability.isFlexibleWithHours,
                    isFlexible: isFlexible,
                },
                createdAt: new Date(),
                userDetails: {
                    ...userDetails,
                    ...parentDetails,
                    displayName: `${parentDetails.firstName} ${parentDetails.lastName}` || "Anonymous",
                },// Προσθήκη στοιχείων του χρήστη
            babysitterDetails: babysitterDetails, // Προσθήκη στοιχείων της νταντάς
                
            };

            // Αποθήκευση δεδομένων στη Firestore
            try {
                console.log("Contract Data: ", contractData); // Έλεγχος δεδομένων
                await addDoc(collection(FIREBASE_DB, 'requests'), contractData); // Διορθώθηκε εδώ
                console.log('Contract created successfully');
                setSuccessMessage('Contract created successfully!');
                navigate('/search');
            } catch (error) {
                setErrorMessage('Error creating contract: ' + error.message);
                console.error('Error creating contract:', error);
            }
        } catch (error) {
            setErrorMessage('Error saving user data: ' + error.message);
            console.error('Error saving user data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5, pb: 3, pt: 2, borderRadius: 2, boxShadow: 2, textAlign: 'center', backgroundColor: '#fff' }}>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Typography variant="h5" sx={{ mb: 3 }}>
                Contract
            </Typography>
            {successMessage && <Alert severity="success">{successMessage}</Alert>}
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            
            {activeStep === 0 && (
                <form>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField label="Start Date *" name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} InputLabelProps={{ shrink: true }} fullWidth />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField label="Duration(months) *" name="duration" value={formData.duration} onChange={handleInputChange} fullWidth />
                        <TextField label="City *" name="city" value={formData.city} onChange={handleInputChange} fullWidth />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField label="Street *" name="street" value={formData.street} onChange={handleInputChange} fullWidth />
                        <TextField label="Postal Code *" name="postalCode" value={formData.postalCode} onChange={handleInputChange} fullWidth />
                    </Box>
                </form>
            )}
            
            {activeStep === 1 && (
                <form>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Child & Days Specifications
                    </Typography>
                    <TextField label="Number of Children *" name="numberOfChildren" type="number" value={formData.numberOfChildren} onChange={handleInputChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Children Ages *" name="childrenAges" value={formData.childrenAges} onChange={handleInputChange} fullWidth sx={{ mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 2 }}>Days & Hours Babysitter is Needed</Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 2 }}>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                            <Box key={day} onClick={() => handleDaySelection(day)} sx={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '2px solid #f3b2ac', backgroundColor: formData.availability.days.includes(day) ? '#f3b2ac' : 'transparent', color: formData.availability.days.includes(day) ? '#fff' : '#4c3b34', cursor: 'pointer', fontWeight: 'bold', userSelect: 'none' }}>
                                {day.substring(0, 3).toUpperCase()}
                            </Box>
                        ))}
                    </Box>
                    <FormControlLabel control={<Checkbox checked={isFlexible} onChange={(e) => setIsFlexible(e.target.checked)} />} label="Flexible Availability" sx={{ mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 2 }}>Preferred Hours</Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField label="Start Time" name="start" type="time" value={formData.availability.preferredHours.start} onChange={(e) => setFormData({ ...formData, availability: { ...formData.availability, preferredHours: { ...formData.availability.preferredHours, start: e.target.value } } })} InputLabelProps={{ shrink: true }} fullWidth />
                        <TextField label="End Time" name="end" type="time" value={formData.availability.preferredHours.end} onChange={(e) => setFormData({ ...formData, availability: { ...formData.availability, preferredHours: { ...formData.availability.preferredHours, end: e.target.value } } })} InputLabelProps={{ shrink: true }} fullWidth />
                    </Box>
                    <FormControlLabel control={<Checkbox checked={formData.availability.isFlexibleWithHours} onChange={(e) => setFormData({ ...formData, availability: { ...formData.availability, isFlexibleWithHours: e.target.checked } })} />} label="Flexible Hours" sx={{ mb: 2 }} />
                </form>
            )}

            {activeStep === 2 && (
                <form>
                    <TextField label="Specializations (e.g., allergies, special needs)" name="specializations" value={formData.specializations} onChange={handleInputChange} fullWidth multiline rows={3} sx={{ mb: 2 }} />
                </form>
            )}

            {activeStep === 3 && (
                <Box>
                    <Typography variant="h6">Review your details</Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Start Date: {formData.startDate}
                    </Typography>
                    <Typography variant="body1">Duration: {formData.duration} months</Typography>
                    <Typography variant="body1">City: {formData.city}</Typography>
                    <Typography variant="body1">Street: {formData.street}</Typography>
                    <Typography variant="body1">Postal Code: {formData.postalCode}</Typography>
                    <Typography variant="body1">Number of Children: {formData.numberOfChildren}</Typography>
                    <Typography variant="body1">Children Ages: {formData.childrenAges}</Typography>
                    <Typography variant="body1">Specializations: {formData.specializations}</Typography>
                    <Typography variant="body1">Availability: {formData.availability.days.join(', ')}</Typography>
                </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                {activeStep > 0 && <Button variant="outlined" onClick={handleBack}>Back</Button>}
                <Button variant="contained" onClick={handleNext} sx={{ bgcolor: '#795e53', '&:hover': { bgcolor: '#4c3b34' } }} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                </Button>
            </Box>
        </Container>
    );
};

export default MakeContract;
