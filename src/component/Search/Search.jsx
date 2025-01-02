import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid ,Paper, Divider, CardMedia, CardContent, Typography, CardActionArea, TextField, Pagination,Box,Button } from '@mui/material';
import { collection, query, getDocs } from 'firebase/firestore';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { FIREBASE_DB } from '../../config/firebase';

function calculateAge(birthDate) {
    const birthdate = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDifference = today.getMonth() - birthdate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthdate.getDate())) {
        age--;
    }
    return age;
}

const BabysitterProfile = ({ babysitter }) => {
    const navigate = useNavigate();

    const viewDetails = () => {
        navigate(`/babysitters/${babysitter.id}`);
    };

    return (
        <Paper elevation={3} sx={{ display: 'flex', maxWidth: '100%', mb: 2, overflow: 'hidden', borderRadius: '10px' }}>
            <CardActionArea onClick={viewDetails} sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                <CardMedia
                    component="img"
                    sx={{ width: 160, height: 160, borderRadius: '50%' }}
                    image={babysitter.profilePicture || 'default_image.jpg'}
                    alt="Babysitter photo"
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: '1 0 auto', p: 2 }}>
                    <CardContent sx={{ flex: '1 0 auto', p: 0 }}>
                        <Typography variant="h6" component="div" sx={{ fontSize: '1rem' }}>
                            {babysitter.firstName} {babysitter.lastName}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                            <StarBorderIcon color="action" />
                            <Typography variant="body2" color="text.secondary">
                                Age: {calculateAge(babysitter.birthDate)} Years
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            Experience: {babysitter.experience} Years
                        </Typography>
                    </CardContent>
                    <Divider />
                    <CardContent sx={{ p: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Bio: {babysitter.bio}
                        </Typography>
                    </CardContent>
                </Box>
            </CardActionArea>
        </Paper>
    );
};

export default function Search() {
    const [babysitters, setBabysitters] = useState([]);
    const [filteredBabysitters, setFilteredBabysitters] = useState([]);
    const [ageFilterMin, setAgeFilterMin] = useState('');
    const [ageFilterMax, setAgeFilterMax] = useState('');
    const [experienceFilterMin, setExperienceFilterMin] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchBabysitters = async () => {
            const q = query(collection(FIREBASE_DB, 'babysitters'));
            const querySnapshot = await getDocs(q);
            const babysitterData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setBabysitters(babysitterData);
            setFilteredBabysitters(babysitterData); // Initialize with all data
        };

        fetchBabysitters();
    }, []);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const applyFilters = () => {
        let filtered = babysitters.filter(b => {
            const age = calculateAge(b.birthDate);
            return (ageFilterMin === '' || age >= parseInt(ageFilterMin)) && (ageFilterMax === '' || age <= parseInt(ageFilterMax));
        }).filter(b => {
            return experienceFilterMin === '' || b.experience >= parseInt(experienceFilterMin);
        });

        setFilteredBabysitters(filtered);
        setPage(1); // Reset to first page
    };

    const clearFilters = () => {
        setAgeFilterMin('');
        setAgeFilterMax('');
        setExperienceFilterMin('');
        setFilteredBabysitters(babysitters);
        setPage(1);
    };

    return (
        <Container sx={{ py: 8 }} maxWidth="md">
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Minimum age"
                        variant="outlined"
                        value={ageFilterMin}
                        onChange={e => setAgeFilterMin(e.target.value)}
                        style={{ marginRight: 10 }}
                        type="number"
                    />
                    <TextField
                        label="Maximum age"
                        variant="outlined"
                        value={ageFilterMax}
                        onChange={e => setAgeFilterMax(e.target.value)}
                        type="number"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Minimum experience (years)"
                        variant="outlined"
                        value={experienceFilterMin}
                        onChange={e => setExperienceFilterMin(e.target.value)}
                        type="number"
                    />
                    <Button onClick={applyFilters} variant="contained" sx={{ ml: 2 }}>Apply Filters</Button>
                    <Button onClick={clearFilters} variant="outlined" sx={{ ml: 2 }}>Clear Filters</Button>
                </Grid>
                {filteredBabysitters.slice((page - 1) * itemsPerPage, page * itemsPerPage).map(babysitter => (
                    <Grid item key={babysitter.id} xs={12}>
                        <BabysitterProfile babysitter={babysitter} />
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <Pagination
                        count={Math.ceil(filteredBabysitters.length / itemsPerPage)}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Grid>
            </Grid>
        </Container>
    );
}