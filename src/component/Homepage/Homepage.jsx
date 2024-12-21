import React, { useState } from 'react';
import { Container, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function HomePage() {
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');  // Use a string in 'YYYY-MM-DD' format for date input
    const [duration, setDuration] = useState('');

    const handleSearch = () => {
        console.log('Searching for:', { location, date, duration });
        // Implement search logic here
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>Find a Babysitter</Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="location-label">Location</InputLabel>
                <Select
                    labelId="location-label"
                    id="location"
                    value={location}
                    label="Location"
                    onChange={e => setLocation(e.target.value)}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value="Athens">Athens</MenuItem>
                    <MenuItem value="Thessaloniki">Thessaloniki</MenuItem>
                </Select>
            </FormControl>
            
            <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                InputLabelProps={{
                    shrink: true,
                }}
                sx={{ mt: 2, mb: 2 }}
            />

            <TextField
                fullWidth
                label="Duration (months)"
                type="number"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                sx={{ mt: 2, mb: 2 }}
            />
            
            <Button variant="contained" onClick={handleSearch} sx={{ mb: 2 }}>
                Search
            </Button>
        </Container>
    );
}

export default HomePage;
