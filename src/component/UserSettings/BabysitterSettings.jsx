import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, CircularProgress, Alert,Autocomplete, } from '@mui/material';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase';
import { useParams } from 'react-router-dom';
import { doc } from 'firebase/firestore';

const municipalitiesOfAttica = [
    "Αγία Βαρβάρα", "Αγία Παρασκευή", "Άγιοι Ανάργυροι - Καματερό", "Άγιος Δημήτριος",
    "Αθήνα", "Αιγάλεω", "Αχαρνές", "Βάρη - Βούλα - Βουλιαγμένη", "Βύρωνας",
    "Γαλάτσι", "Γλυφάδα", "Δάφνη - Υμηττός", "Ελληνικό - Αργυρούπολη",
    "Ζωγράφου", "Ηλιούπολη", "Ίλιον", "Καλλιθέα", "Κηφισιά", "Μαρούσι",
    "Μεταμόρφωση", "Μοσχάτο - Ταύρος", "Νέα Ιωνία", "Νέα Σμύρνη",
    "Νέος Ηράκλειο", "Παπάγου - Χολαργός", "Πειραιάς", "Περιστέρι",
    "Πετρούπολη", "Φιλοθέη - Ψυχικό", "Χαϊδάρι", "Χαλάνδρι",
];
const certificationsList = [
    'Πιστοποίηση Πρώτων Βοηθειών',
    'Πιστοποίηση CPR (για βρέφη και παιδιά)',
    'Εκπαίδευση για Πρόληψη και Αντιμετώπιση Πνιγμού',
    'Πιστοποίηση Βασικής Υποστήριξης Ζωής (BLS)',
    'Εκπαίδευση για Χρήση Αυτόματου Εξωτερικού Απινιδωτή (AED)',
    'Πιστοποίηση Ψυχολογίας Παιδιών ή Εκπαίδευσης Προσχολικής Ηλικίας',
    'Πιστοποιημένο Σεμινάριο Babysitter (π.χ. από τον Ερυθρό Σταυρό)',
    'Εκπαίδευση Φροντίδας Παιδιών με Ειδικές Ανάγκες',
    'Πιστοποίηση Ασφάλειας στο Σπίτι',
    'Πιστοποίηση Καθαρού Ποινικού Μητρώου',
    'Πιστοποίηση Ασφάλειας Τροφίμων',
    'Πιστοποίηση Διατροφής για Βρέφη και Παιδιά (π.χ. μπουκάλι, υποστήριξη θηλασμού)',
    'Πιστοποίηση Κολύμβησης και Ασφάλειας στο Νερό',
    'Δίπλωμα Οδήγησης και Πιστοποίηση Αμυντικής Οδήγησης',
    'Εκπαίδευση Διαχείρισης Συγκρούσεων και Συμπεριφοράς',
    'Πιστοποίηση Γλωσσικών Ικανοτήτων (αν είναι απαραίτητο)',
    'Συστάσεις και Μαρτυρίες από προηγούμενες οικογένειες ή εργοδότες',
    'Εμπειρία σε Ομαδική Φροντίδα (π.χ. παιδικοί σταθμοί, κατασκηνώσεις)',
  ];


const BabysitterSettings = () => {
    const { email } = useParams(); // Λήψη του email από τα URL params
    console.log("Babysitter Email:", email);
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
    const [docId, setDocId] = useState(null); // Για την αποθήκευση του ID του document

    useEffect(() => {
        const fetchBabysitterData = async () => {
            setLoading(true);
            try {
                const babysittersRef = collection(FIREBASE_DB, 'babysitters');
                const q = query(babysittersRef, where('email', '==', email));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0]; // Υποθέτουμε ότι υπάρχει μόνο ένα αποτέλεσμα
                    setFormData(doc.data());
                    setDocId(doc.id); // Αποθήκευση του ID του document
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
    }, [email]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLocationChange = (event, value) => {
        setFormData((prev) => ({
            ...prev,
            location: value || [], // Ενημερώνει το array των περιοχών
        }));
    };
    const handlecertificationsChange = (event, value) => {
        setFormData((prev) => ({
            ...prev,
            certifications: value || [], // Ενημερώνει το array των περιοχών
        }));
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
        if (!docId) {
            setError('Unable to update profile. Document ID not found.');
            return;
        }

        setSaving(true);
        setSuccessMessage('');
        setError('');
        try {
            const docRef = doc(FIREBASE_DB, 'babysitters', docId);
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
            <Autocomplete
                multiple
                options={certificationsList}
                value={formData.certifications}
                onChange={handlecertificationsChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Certifications/Skills"
                        placeholder="certifications"
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                )}
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
            <Autocomplete
                multiple
                options={municipalitiesOfAttica}
                value={formData.location}
                onChange={handleLocationChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Service Locations"
                        placeholder="Select one or more locations"
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                )}
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
