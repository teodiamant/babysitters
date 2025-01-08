import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../config/firebase";
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Avatar,
  Paper,
} from "@mui/material";

const BabysitterProfile = () => {
  const [pendingAcceptedRequests, setPendingAcceptedRequests] = useState([]);
  const [otherRequests, setOtherRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { email } = useParams(); // Email από το URL param
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const requestsRef = collection(FIREBASE_DB, "requests");
  
        // Ανάκτηση όλων των αιτημάτων για το email της νταντάς
        const babysitterQuery = query(
          requestsRef,
          where("babysitterDetails.email", "==", email)
        );
        const requestsSnap = await getDocs(babysitterQuery);
  
        if (!requestsSnap.empty) {
          const allRequests = requestsSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
  
          // Διαχωρισμός αιτημάτων σε εκκρεμότητα/αποδεκτά και άλλα
          setPendingAcceptedRequests(
            allRequests.filter((request) =>
              ["pending", "accepted"].includes(request.state)
            )
          );
          setOtherRequests(
            allRequests.filter(
              (request) => !["pending", "accepted"].includes(request.state)
            )
          );
        } else {
          // Κανένα αίτημα δεν βρέθηκε
          setPendingAcceptedRequests([]);
          setOtherRequests([]);
        }
      } catch (err) {
        setError("Failed to fetch requests");
        console.error("Error fetching requests:", err);
      }
      setLoading(false);
    };
  
    fetchRequests();
  }, [email]);
  

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        {/* Αριστερή Στήλη */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ textAlign: "center" }}>
              <Avatar
                alt="Babysitter Profile"
                src="/static/images/avatar/1.jpg"
                sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                Babysitter Name
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Email: {email}
              </Typography>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => navigate("/babysitter-settings")}
              >
                Go to Settings
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Δεξιά Στήλη */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={4}>
            {/* Αιτήματα σε εκκρεμότητα ή αποδεκτά */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Pending or Accepted Requests
              </Typography>
              {pendingAcceptedRequests.length > 0 ? (
                pendingAcceptedRequests.map((request) => (
                  <Card key={request.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="body1">
                        Request ID: {request.id}
                      </Typography>
                      <Typography variant="body1">
                        Status: {request.state}
                      </Typography>
                      <Typography variant="body1">
                        Parent Name: {request.parentName}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography>No requests found.</Typography>
              )}
            </Grid>

            {/* Λοιπά Αιτήματα */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Other Requests
              </Typography>
              {otherRequests.length > 0 ? (
                otherRequests.map((request) => (
                  <Card key={request.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="body1">
                        Request ID: {request.id}
                      </Typography>
                      <Typography variant="body1">
                        Status: {request.state}
                      </Typography>
                      <Typography variant="body1">
                        Parent Name: {request.parentName}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography>No requests found.</Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BabysitterProfile;


