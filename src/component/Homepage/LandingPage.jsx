import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Typography,
    TextField,
    Autocomplete,
} from '@mui/material';
import backgroundImage from './backgroundLandingPage1.jpg';
const municipalitiesOfAttica = [
    "Αγία Βαρβάρα",
    "Αγία Παρασκευή",
    "Άγιοι Ανάργυροι - Καματερό",
    "Άγιος Δημήτριος",
    "Αθήνα",
    "Αιγάλεω",
    "Αχαρνές",
    "Βάρη - Βούλα - Βουλιαγμένη",
    "Βύρωνας",
    "Γαλάτσι",
    "Γλυφάδα",
    "Δάφνη - Υμηττός",
    "Ελληνικό - Αργυρούπολη",
    "Ζωγράφου",
    "Ηλιούπολη",
    "Ίλιον",
    "Καλλιθέα",
    "Κηφισιά",
    "Μαρούσι",
    "Μεταμόρφωση",
    "Μοσχάτο - Ταύρος",
    "Νέα Ιωνία",
    "Νέα Σμύρνη",
    "Νέος Ηράκλειο",
    "Παπάγου - Χολαργός",
    "Πειραιάς",
    "Περιστέρι",
    "Πετρούπολη",
    "Φιλοθέη - Ψυχικό",
    "Χαϊδάρι",
    "Χαλάνδρι",
];

const LandingPage = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState('');

    const handleButtonClick = () => {
        navigate('/search', { state: { location } }); // Redirect to search.jsx
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh', // Full viewport height
                margin: -2.5,
                padding: 0,
                boxSizing: 'border-box',
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <Box
                sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent overlay
                    padding: '20px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)', // Shadow for depth
                }}
            >
                <Typography
                    variant="h2"
                    sx={{
                        mb: 4,
                        color: '#4c3b34',
                        fontFamily: "'Pacifico', cursive",
                    }}
                >
                    Welcome to Babysitters
                </Typography>
                <Autocomplete
                    options={municipalitiesOfAttica}
                    freeSolo
                    value={location}
                    onChange={(event, value) => setLocation(value || '')}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search by Location"
                            fullWidth
                            margin="normal"
                        />
                    )}
                    sx={{ mb: 4 }} // Add spacing below the input
                />
                <Button
                    variant="contained"
                    onClick={handleButtonClick}
                    sx={{
                        backgroundColor: '#795e53',
                        color: '#fff',
                        fontSize: '1.2rem',
                        padding: '10px 20px',
                        '&:hover': {
                            backgroundColor: '#4c3b34',
                        },
                    }}
                >
                    Find a Babysitter
                </Button>
            </Box>
        </Box>
    );
};

export default LandingPage;
