import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';
import { useParams } from 'react-router-dom';

const BabysitterSettings = () => {
    const { userId } = useParams(); // Get userId from URL params
    console.log("User ID:", userId);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        experience: '',
        certifications: '',
        bio: '',
        profilePicture: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchBabysitterData = async () => {
            setLoading(true);
            try {
                const docRef = doc(FIREBASE_DB, 'babysitters', userId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setFormData(docSnap.data());
                } else {
                    setError('Babysitter data not found.');
                }
            } catch (err) {
                console.error('Error fetching babysitter data:', err);
                setError('Failed to load babysitter data.');
            } finally {
                setLoading(false);
            }
        };

        fetchBabysitterData();
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, profilePicture: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setSuccessMessage('');
        setError('');
        try {
            const docRef = doc(FIREBASE_DB, 'babysitters', userId);
            await updateDoc(docRef, formData);
            setSuccessMessage('Profile updated successfully!');
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

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
            <Typography variant="h5" sx={{ mb: 3 }}>
                Babysitter Settings
            </Typography>
            {successMessage && <Alert severity="success">{successMessage}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
            />
            <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
            />
            <TextField
                label="Years of Experience"
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

            <Button
                variant="contained"
                onClick={handleSave}
                sx={{ bgcolor: '#795e53', '&:hover': { bgcolor: '#4c3b34' }, mt: 3 }}
                fullWidth
                disabled={saving}
            >
                {saving ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
        </Container>
    );
};

export default BabysitterSettings;
