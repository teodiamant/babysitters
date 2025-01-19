import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Typography,
    TextField,
    Autocomplete,
    Grid,
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
                height: '100vh',
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
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    padding: '20px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
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
                    sx={{ mb: 4 }}
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

            <Box
                sx={{
                    marginTop: 6,
                    textAlign: 'center',
                    position: 'relative',
                }}
            >
                <Grid container spacing={4} alignItems="center" justifyContent="center">
                    <Grid item xs={2} md={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {/* Rectangle for How It Works */}
                        <Box
                            sx={{
                                color: '#4c3b34',
                                backgroundColor: '#d5caac',
                                flexDirection: 'column',
                                height: 50,
                                width: 500,
                                padding: '16px',
                                borderRadius: '5px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: 3,
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                position: 'relative',
                            }}
                        >
                            How It Works
                        </Box>
                        {/* Line connecting How It Works to Step 1 */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                right: '25px',
                                left: '5%',
                                width: '250px',
                                height: '1.5mm',
                                backgroundColor: '#d5caac',
                            }}
                        />
                    </Grid>

                    {[ // Steps with circle format
                        {
                            title: 'Step 1: Search for a Babysitter near you', 
                        },
                        {
                            title: 'Step 2: Select using your preferences',
                        },
                        {
                            title: 'Step 3: Connect,Chat and Book smoothly',
                        },
                    ].map((step, index) => (
                        <Grid item xs={3} md={3} key={index} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#d5caac',
                                    width: 130,
                                    height: 130,
                                    borderRadius: '50%',
                                    color: '#4c3b34',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    position: 'relative',
                                }}
                            >
                                {step.title}
                                {/* Line connecting Steps */}
                                {index < 2 && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            right: '25px',
                                            left: '100%',
                                            width: '150px',
                                            height: '1.5mm',
                                            backgroundColor: '#d5caac',
                                            transfrom: 'translateY(50%)',
                                        }}
                                    />
                                )}
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default LandingPage;
