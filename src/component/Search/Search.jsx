// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Grid,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Box,
//   Select,
//   MenuItem,
//   Pagination,
//   Card,
//   CardActionArea,
//   CardContent,
//   CardMedia,
// } from "@mui/material";
// import { collection, query, getDocs } from "firebase/firestore";
// import { FIREBASE_DB } from "../../config/firebase";
// import StarBorderIcon from "@mui/icons-material/StarBorder";

// function calculateAge(birthDate) {
//   if (!birthDate) return "N/A";
//   const birthdate = new Date(birthDate);
//   const today = new Date();
//   let age = today.getFullYear() - birthdate.getFullYear();
//   const monthDifference = today.getMonth() - birthdate.getMonth();
//   if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthdate.getDate())) {
//     age--;
//   }
//   return age;
// }

// const BabysitterProfileCard = ({ babysitter }) => (
//   <Card elevation={3} sx={{ mb: 2, backgroundColor: "#f3b2ac" }}>
//     <CardActionArea sx={{ display: "flex", p: 2 }}>
//       <CardMedia
//         component="img"
//         sx={{ width: 100, height: 100, borderRadius: "50%" }}
//         image={babysitter.profilePicture || "default_image.jpg"}
//         alt="Babysitter"
//       />
//       <Box sx={{ ml: 2, display: "flex", flexDirection: "column", justifyContent: "center" }}>
//         <CardContent sx={{ p: 0 }}>
//           <Typography variant="h6">
//             {babysitter.firstName} {babysitter.lastName}
//           </Typography>
//           <Typography variant="body2" color="textSecondary">
//             Age: {calculateAge(babysitter.birthDate)} years
//           </Typography>
//           <Typography variant="body2" color="textSecondary">
//             Experience: {babysitter.experience} years
//           </Typography>
//         </CardContent>
//       </Box>
//     </CardActionArea>
//   </Card>
// );

// export default function Search() {
//   const [babysitters, setBabysitters] = useState([]);
//   const [filteredBabysitters, setFilteredBabysitters] = useState([]);
//   const [ageFilterMin, setAgeFilterMin] = useState("");
//   const [ageFilterMax, setAgeFilterMax] = useState("");
//   const [experienceFilterMin, setExperienceFilterMin] = useState("");
//   const [sortOption, setSortOption] = useState("default");
//   const [page, setPage] = useState(1);
//   const itemsPerPage = 5;

//   useEffect(() => {
//     const fetchBabysitters = async () => {
//       const q = query(collection(FIREBASE_DB, "babysitters"));
//       const querySnapshot = await getDocs(q);
//       const babysitterData = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setBabysitters(babysitterData);
//       setFilteredBabysitters(babysitterData);
//     };

//     fetchBabysitters();
//   }, []);

//   const applyFilters = () => {
//     let filtered = babysitters.filter((b) => {
//       const age = calculateAge(b.birthDate);
//       return (
//         (ageFilterMin === "" || age >= parseInt(ageFilterMin)) &&
//         (ageFilterMax === "" || age <= parseInt(ageFilterMax)) &&
//         (experienceFilterMin === "" || b.experience >= parseInt(experienceFilterMin))
//       );
//     });

//     if (sortOption === "highestRating") {
//       filtered = filtered.sort((a, b) => b.rating - a.rating);
//     }

//     setFilteredBabysitters(filtered);
//     setPage(1);
//   };

//   const clearFilters = () => {
//     setAgeFilterMin("");
//     setAgeFilterMax("");
//     setExperienceFilterMin("");
//     setSortOption("default");
//     setFilteredBabysitters(babysitters);
//     setPage(1);
//   };

//   const handleSortChange = (event) => {
//     setSortOption(event.target.value);
//     applyFilters();
//   };

//   const handlePageChange = (event, value) => {
//     setPage(value);
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         backgroundColor: "#795e53",
//         minHeight: "100vh",
//         margin: -2.5,
//         padding: 7,
//       }}
//     >
//       <Container maxWidth="lg">
//         <Grid container spacing={4}>
//           {/* Filters Section */}
//           <Grid item xs={12} md={4}>
//             <Paper elevation={3} sx={{ p: 3, backgroundColor: "#f3b2ac" }}>
//               <Typography variant="h6" sx={{ mb: 2 }}>
//                 Filters
//               </Typography>
//               <TextField
//                 label="Minimum Age"
//                 variant="outlined"
//                 value={ageFilterMin}
//                 onChange={(e) => setAgeFilterMin(e.target.value)}
//                 type="number"
//                 fullWidth
//                 margin="normal"
//               />
//               <TextField
//                 label="Maximum Age"
//                 variant="outlined"
//                 value={ageFilterMax}
//                 onChange={(e) => setAgeFilterMax(e.target.value)}
//                 type="number"
//                 fullWidth
//                 margin="normal"
//               />
//               <TextField
//                 label="Minimum Experience (years)"
//                 variant="outlined"
//                 value={experienceFilterMin}
//                 onChange={(e) => setExperienceFilterMin(e.target.value)}
//                 type="number"
//                 fullWidth
//                 margin="normal"
//               />
//               <Button
//                 onClick={applyFilters}
//                 variant="contained"
//                 fullWidth
//                 sx={{
//                   mt: 2,
//                   backgroundColor: "#795e53",
//                   "&:hover": { backgroundColor: "#4c3b34" },
//                 }}
//               >
//                 Apply Filters
//               </Button>
//               <Button
//                 onClick={clearFilters}
//                 variant="outlined"
//                 fullWidth
//                 sx={{ mt: 2 }}
//               >
//                 Clear Filters
//               </Button>
//             </Paper>
//           </Grid>

//           {/* Results Section */}
//           <Grid item xs={12} md={8}>
//             <Box
//               sx={{
//                 mb: 2,
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <Typography variant="h6">
//                 Results | {filteredBabysitters.length} Babysitters
//               </Typography>
//               <Select
//                 value={sortOption}
//                 onChange={handleSortChange}
//                 sx={{ width: 200 }}
//               >
//                 <MenuItem value="default">Default</MenuItem>
//                 <MenuItem value="highestRating">Highest Rating</MenuItem>
//               </Select>
//             </Box>
//             {filteredBabysitters
//               .slice((page - 1) * itemsPerPage, page * itemsPerPage)
//               .map((babysitter) => (
//                 <BabysitterProfileCard key={babysitter.id} babysitter={babysitter} />
//               ))}
//             <Pagination
//               count={Math.ceil(filteredBabysitters.length / itemsPerPage)}
//               page={page}
//               onChange={handlePageChange}
//               color="primary"
//               sx={{ mt: 2 }}
//             />
//           </Grid>
//         </Grid>
//       </Container>
//     </Box>
//   );
// }
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  TextField,
  Box,
  Button,
  Typography,
  Pagination,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { collection, query, getDocs } from 'firebase/firestore';
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

const BabysitterProfile = ({ babysitter }) => (
  <Paper elevation={3} sx={{ display: 'flex', padding: 2, marginBottom: 2, borderRadius: '10px', cursor: 'pointer' }}>
    <img
      src={babysitter.profilePicture || 'default_image.jpg'}
      alt="Babysitter"
      style={{ width: 80, height: 80, borderRadius: '50%', marginRight: 16 }}
    />
    <Box>
      <Typography variant="h6">{`${babysitter.firstName} ${babysitter.lastName}`}</Typography>
      <Typography variant="body2">Age: {calculateAge(babysitter.birthDate)}</Typography>
      <Typography variant="body2">Experience: {babysitter.experience} years</Typography>
      <Typography variant="body2">Location: {babysitter.location}</Typography>
    </Box>
  </Paper>
);

const Search = () => {
  const [babysitters, setBabysitters] = useState([]);
  const [filteredBabysitters, setFilteredBabysitters] = useState([]);
  const [filters, setFilters] = useState({
    ageMin: '',
    ageMax: '',
    experienceMin: '',
    location: '',
    gender: '',
    isFlexibleWithHours: false,
    days: [],
    startTime: '',
    endTime: '',
  });
  const [sortBy, setSortBy] = useState(''); // Για ταξινόμηση
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
      setFilteredBabysitters(babysitterData);
    };

    fetchBabysitters();
  }, []);

  const applyFilters = () => {
    let filtered = babysitters.filter(b => {
      const age = calculateAge(b.birthDate);
      const matchesAge =
        (filters.ageMin === '' || age >= parseInt(filters.ageMin)) &&
        (filters.ageMax === '' || age <= parseInt(filters.ageMax));
      const matchesExperience = filters.experienceMin === '' || b.experience >= parseInt(filters.experienceMin);
      const matchesLocation = filters.location === '' || (b.location && b.location.toLowerCase().includes(filters.location.toLowerCase()));
      const matchesGender = filters.gender === '' || b.gender === filters.gender;
      const matchesFlexibleHours = !filters.isFlexibleWithHours || b.availability?.isFlexibleWithHours;
      const matchesDays = filters.days.length === 0 || filters.days.every(day => b.availability?.days.includes(day));
      const matchesStartTime = !filters.startTime || (b.availability?.preferredHours?.start >= filters.startTime);
      const matchesEndTime = !filters.endTime || (b.availability?.preferredHours?.end <= filters.endTime);

      return matchesAge && matchesExperience && matchesLocation && matchesGender && matchesFlexibleHours && matchesDays && matchesStartTime && matchesEndTime;
    });

    if (sortBy === 'score') {
      filtered = filtered.sort((a, b) => (b.score || 0) - (a.score || 0)); // Αν η βαθμολογία δεν υπάρχει, υπολογίζεται ως 0
    }

    setFilteredBabysitters(filtered);
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      ageMin: '',
      ageMax: '',
      experienceMin: '',
      location: '',
      gender: '',
      isFlexibleWithHours: false,
      days: [],
      startTime: '',
      endTime: '',
    });
    setFilteredBabysitters(babysitters);
    setPage(1);
  };

  const handleDaySelection = (day) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      days: prevFilters.days.includes(day)
        ? prevFilters.days.filter(d => d !== day)
        : [...prevFilters.days, day],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <Container sx={{ py: 4 }} maxWidth="lg">
      <Grid container spacing={2}>
        {/* Filters Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <TextField
              label="Minimum Age"
              name="ageMin"
              value={filters.ageMin}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              type="number"
            />
            <TextField
              label="Maximum Age"
              name="ageMax"
              value={filters.ageMax}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              type="number"
            />
            <TextField
              label="Minimum Experience (years)"
              name="experienceMin"
              value={filters.experienceMin}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              type="number"
            />
            <TextField
              label="Location"
              name="location"
              value={filters.location}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={filters.gender}
                onChange={handleInputChange}
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="h6" sx={{ my: 2 }}>
              Availability
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <Button
                  key={day}
                  variant={filters.days.includes(day) ? 'contained' : 'outlined'}
                  onClick={() => handleDaySelection(day)}
                  sx={{ margin: '4px' }}
                >
                  {day.substring(0, 3)}
                </Button>
              ))}
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.isFlexibleWithHours}
                  onChange={e => setFilters(prev => ({ ...prev, isFlexibleWithHours: e.target.checked }))}
                />
              }
              label="Flexible Hours"
            />
            <TextField
              label="Start Time"
              name="startTime"
              type="time"
              value={filters.startTime}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="End Time"
              name="endTime"
              type="time"
              value={filters.endTime}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <Box sx={{ my: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="score">Score</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
              <Button variant="contained" onClick={applyFilters}>
                Apply Filters
              </Button>
              <Button variant="outlined" onClick={clearFilters}>
                Clear Filters
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Babysitter Profiles Section */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Total Results: {filteredBabysitters.length}
          </Typography>
          {filteredBabysitters
            .slice((page - 1) * itemsPerPage, page * itemsPerPage)
            .map(babysitter => (
              <BabysitterProfile key={babysitter.id} babysitter={babysitter} />
            ))}
          <Pagination
            count={Math.ceil(filteredBabysitters.length / itemsPerPage)}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
            sx={{ marginTop: 2 }}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Search;

