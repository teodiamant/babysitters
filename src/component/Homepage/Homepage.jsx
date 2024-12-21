import React, { useState } from 'react';
import { Container, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@date-io/date-fns';

function HomePage() {
    const [selectedLocation, setSelectedLocation] = useState('');
    const [date, setDate] = useState(new Date());
    const [duration, setDuration] = useState('');

    const isFormValid = selectedLocation && date && duration;

    const handleSearch = () => {
        console.log('Searching for:', { selectedLocation, date, duration });
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
                    value={selectedLocation}
                    label="Location"
                    onChange={e => setSelectedLocation(e.target.value)}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value="Athens">Athens</MenuItem>
                    <MenuItem value="Thessaloniki">Thessaloniki</MenuItem>
                </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    label="Start Date"
                    value={date}
                    onChange={setDate}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
            <TextField
                fullWidth
                label="Duration (months)"
                type="number"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                sx={{ mt: 2, mb: 2 }}
            />
            <Button
                variant="contained"
                onClick={handleSearch}
                disabled={!isFormValid} // Disable button if form is not valid
                sx={{ mb: 2 }}
            >
                Search
            </Button>
        </Container>
    );
}

export default HomePage;
