import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  Pagination,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
} from "@mui/material";
import { collection, query, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../../config/firebase";
import StarBorderIcon from "@mui/icons-material/StarBorder";

function calculateAge(birthDate) {
  if (!birthDate) return "N/A";
  const birthdate = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDifference = today.getMonth() - birthdate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  return age;
}

const BabysitterProfileCard = ({ babysitter }) => (
  <Card elevation={3} sx={{ mb: 2, backgroundColor: "#f3b2ac" }}>
    <CardActionArea sx={{ display: "flex", p: 2 }}>
      <CardMedia
        component="img"
        sx={{ width: 100, height: 100, borderRadius: "50%" }}
        image={babysitter.profilePicture || "default_image.jpg"}
        alt="Babysitter"
      />
      <Box sx={{ ml: 2, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <CardContent sx={{ p: 0 }}>
          <Typography variant="h6">
            {babysitter.firstName} {babysitter.lastName}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Age: {calculateAge(babysitter.birthDate)} years
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Experience: {babysitter.experience} years
          </Typography>
        </CardContent>
      </Box>
    </CardActionArea>
  </Card>
);

export default function Search() {
  const [babysitters, setBabysitters] = useState([]);
  const [filteredBabysitters, setFilteredBabysitters] = useState([]);
  const [ageFilterMin, setAgeFilterMin] = useState("");
  const [ageFilterMax, setAgeFilterMax] = useState("");
  const [experienceFilterMin, setExperienceFilterMin] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchBabysitters = async () => {
      const q = query(collection(FIREBASE_DB, "babysitters"));
      const querySnapshot = await getDocs(q);
      const babysitterData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBabysitters(babysitterData);
      setFilteredBabysitters(babysitterData);
    };

    fetchBabysitters();
  }, []);

  const applyFilters = () => {
    let filtered = babysitters.filter((b) => {
      const age = calculateAge(b.birthDate);
      return (
        (ageFilterMin === "" || age >= parseInt(ageFilterMin)) &&
        (ageFilterMax === "" || age <= parseInt(ageFilterMax)) &&
        (experienceFilterMin === "" || b.experience >= parseInt(experienceFilterMin))
      );
    });

    if (sortOption === "highestRating") {
      filtered = filtered.sort((a, b) => b.rating - a.rating);
    }

    setFilteredBabysitters(filtered);
    setPage(1);
  };

  const clearFilters = () => {
    setAgeFilterMin("");
    setAgeFilterMax("");
    setExperienceFilterMin("");
    setSortOption("default");
    setFilteredBabysitters(babysitters);
    setPage(1);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    applyFilters();
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#795e53",
        minHeight: "100vh",
        margin: -2.5,
        padding: 7,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Filters Section */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, backgroundColor: "#f3b2ac" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Filters
              </Typography>
              <TextField
                label="Minimum Age"
                variant="outlined"
                value={ageFilterMin}
                onChange={(e) => setAgeFilterMin(e.target.value)}
                type="number"
                fullWidth
                margin="normal"
              />
              <TextField
                label="Maximum Age"
                variant="outlined"
                value={ageFilterMax}
                onChange={(e) => setAgeFilterMax(e.target.value)}
                type="number"
                fullWidth
                margin="normal"
              />
              <TextField
                label="Minimum Experience (years)"
                variant="outlined"
                value={experienceFilterMin}
                onChange={(e) => setExperienceFilterMin(e.target.value)}
                type="number"
                fullWidth
                margin="normal"
              />
              <Button
                onClick={applyFilters}
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  backgroundColor: "#795e53",
                  "&:hover": { backgroundColor: "#4c3b34" },
                }}
              >
                Apply Filters
              </Button>
              <Button
                onClick={clearFilters}
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
              >
                Clear Filters
              </Button>
            </Paper>
          </Grid>

          {/* Results Section */}
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">
                Results | {filteredBabysitters.length} Babysitters
              </Typography>
              <Select
                value={sortOption}
                onChange={handleSortChange}
                sx={{ width: 200 }}
              >
                <MenuItem value="default">Default</MenuItem>
                <MenuItem value="highestRating">Highest Rating</MenuItem>
              </Select>
            </Box>
            {filteredBabysitters
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((babysitter) => (
                <BabysitterProfileCard key={babysitter.id} babysitter={babysitter} />
              ))}
            <Pagination
              count={Math.ceil(filteredBabysitters.length / itemsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              sx={{ mt: 2 }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
