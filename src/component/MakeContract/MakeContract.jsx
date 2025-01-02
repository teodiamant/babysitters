// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Container, Typography, Button, TextField, Box } from '@mui/material';

// const ContractForm = () => {
//     const navigate = useNavigate();
//     const [user] = useState('user');
//     const [childAge, setChildAge] = useState('');
//     const [days, setDays] = useState('');
//     const [hours, setHours] = useState('');
//     const [location, setLocation] = useState('');
//     const [street, setStreet] = useState('');
//     const [zipcode, setZipcode] = useState('');
//     const [duration, setDuration] = useState('');

//     const handleSubmit = () => {
//         // Implement contract submission logic
//         console.log("Contract submitted");
//         navigate('/confirmation'); // Navigate to confirmation page
//     };

//     return (
//         <Container maxWidth="sm">
//             <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
//                 Child Care Contract Creation
//             </Typography>
//             <Box component="form" noValidate autoComplete="off">
//                 <Typography variant="body1" paragraph>
//                     I, {user}, would like the babysitter to provide care for my child of {childAge} years old, on {days}, during {hours}, at my home
//                     located in {location}, on street {street}, with the postal code {zipcode}, for a duration of {duration} months.
//                 </Typography>
//                 <TextField fullWidth label="Child's Age" variant="outlined" value={childAge} onChange={e => setChildAge(e.target.value)} sx={{ mb: 2 }} />
//                 <TextField fullWidth label="Care Days" variant="outlined" value={days} onChange={e => setDays(e.target.value)} sx={{ mb: 2 }} />
//                 <TextField fullWidth label="Care Hours" variant="outlined" value={hours} onChange={e => setHours(e.target.value)} sx={{ mb: 2 }} />
//                 <TextField fullWidth label="Location" variant="outlined" value={location} onChange={e => setLocation(e.target.value)} sx={{ mb: 2 }} />
//                 <TextField fullWidth label="Street" variant="outlined" value={street} onChange={e => setStreet(e.target.value)} sx={{ mb: 2 }} />
//                 <TextField fullWidth label="Postal Code" variant="outlined" value={zipcode} onChange={e => setZipcode(e.target.value)} sx={{ mb: 2 }} />
//                 <TextField fullWidth label="Contract Duration (months)" variant="outlined" value={duration} onChange={e => setDuration(e.target.value)} sx={{ mb: 2 }} />
//                 <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
//                     Send Contract
//                 </Button>
//             </Box>
//         </Container>
//     );
// };
// export default ContractForm;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, TextField, Box } from '@mui/material';

const ContractForm = () => {
    const navigate = useNavigate();
    const [user] = useState('user');
    const [childAge, setChildAge] = useState('');
    const [days, setDays] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [location, setLocation] = useState('');
    const [street, setStreet] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [duration, setDuration] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Contract submitted");
        navigate('/confirmation'); // Navigate to confirmation page
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
                Child Care Contract Creation
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box sx={{ mt: 2, mb: 2 }}>
                    <Typography variant="body1">
                        I, <strong>{user}</strong>, require a babysitter to provide care for my child, aged
                        <TextField
                            value={childAge}
                            onChange={e => setChildAge(e.target.value)}
                            size="small"
                            type="number"
                            sx={{ width: '80px', mx: 2 }}
                        /> years, on the following days:
                        <TextField
                            value={days}
                            onChange={e => setDays(e.target.value)}
                            size="small"
                            sx={{ width: '200px', mx: 2 }}
                        /> from
                        <TextField
                            value={startTime}
                            onChange={e => setStartTime(e.target.value)}
                            type="time"
                            size="small"
                            sx={{ mx: 2 }}
                        /> to
                        <TextField
                            value={endTime}
                            onChange={e => setEndTime(e.target.value)}
                            type="time"
                            size="small"
                            sx={{ mx: 2 }}
                        />, at my residence located at
                        <TextField
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            size="small"
                            sx={{ mx: 2 }}
                        />, 
                        <TextField
                            value={street}
                            onChange={e => setStreet(e.target.value)}
                            size="small"
                            sx={{ mx: 2 }}
                        /> with postal code
                        <TextField
                            value={zipcode}
                            onChange={e => setZipcode(e.target.value)}
                            type="number"
                            size="small"
                            sx={{ mx: 2 }}
                        />, starting on
                        <TextField
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            type="date"
                            size="small"
                            sx={{ mx: 2 }}
                        /> and ending on
                        <TextField
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            type="date"
                            size="small"
                            sx={{ mx: 2 }}
                        /> for a duration of
                        <TextField
                            value={duration}
                            onChange={e => setDuration(e.target.value)}
                            type="number"
                            size="small"
                            sx={{ width: '80px', mx: 2 }}
                        /> months.
                    </Typography>
                </Box>
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Send Contract
                </Button>
            </form>
        </Container>
    );
};

export default ContractForm;
