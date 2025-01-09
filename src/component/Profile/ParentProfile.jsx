import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
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

const ParentProfile = () => {
  const [requests, setRequests] = useState([]);
  const [currentJob, setCurrentJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { email } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const requestsRef = collection(FIREBASE_DB, "requests");

        // Fetch all requests for the parent
        const parentQuery = query(
          requestsRef,
          where("userDetails.email", "==", email)
        );
        const requestsSnap = await getDocs(parentQuery);

        if (!requestsSnap.empty) {
          const parentRequests = requestsSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setRequests(parentRequests);

          // Find the current job
          const activeJob = parentRequests.find(
            (request) =>
              request.state === "Accepted" &&
              new Date(request.startDate) <= new Date()
          );
          setCurrentJob(activeJob || null);
        } else {
          setRequests([]);
          setCurrentJob(null);
        }
      } catch (err) {
        setError("Failed to fetch requests");
        console.error("Error fetching requests:", err);
      }
      setLoading(false);
    };

    fetchRequests();
  }, [email]);

  const handleTogglePayment = async (requestId, newPaymentStatus) => {
    try {
      const requestRef = doc(FIREBASE_DB, "requests", requestId);

      await updateDoc(requestRef, { payment: newPaymentStatus });

      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId
            ? { ...request, payment: newPaymentStatus }
            : request
        )
      );
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

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
                alt="Parent Profile"
                src="/static/images/avatar/2.jpg"
                sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                Parent Name
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
                onClick={() => navigate(`/parent-settings/${email}`)}
              >
                Go to Settings
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Δεξιά Στήλη */}
        <Grid item xs={12} md={8}>
          {/* Τρέχουσα Εργασία */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Current Job
              </Typography>
              {currentJob ? (
                <Typography>
                  You are currently working with:{" "}
                  {currentJob.babysitterDetails.name} <br />
                  Start Date:{" "}
                  {new Date(currentJob.startDate).toLocaleDateString()} <br />
                  Payment Status:{" "}
                  {currentJob.payment === "true" ? "Accepted" : "Rejected"}
                </Typography>
              ) : (
                <Typography>No current job.</Typography>
              )}
            </Paper>
          </Grid>

          {/* Όλα τα Αιτήματα */}
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Your Requests
            </Typography>
            {requests.length > 0 ? (
              requests.map((request) => (
                <Card key={request.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="body1">
                      Request ID: {request.id}
                    </Typography>
                    <Typography variant="body1">
                      Status: {request.state}
                    </Typography>
                    <Typography variant="body1">
                      Babysitter Name: {request.babysitterDetails.name}
                    </Typography>
                    <Typography variant="body1">
                      Start Date:{" "}
                      {new Date(request.startDate).toLocaleDateString()}
                    </Typography>
                    {request.state === "Accepted" && (
                      <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                        <Button
                          variant={
                            request.payment === "true"
                              ? "contained"
                              : "outlined"
                          }
                          color="success"
                          onClick={() =>
                            handleTogglePayment(request.id, "true")
                          }
                        >
                          Accepted
                        </Button>
                        <Button
                          variant={
                            request.payment === "false"
                              ? "contained"
                              : "outlined"
                          }
                          color="error"
                          onClick={() =>
                            handleTogglePayment(request.id, "false")
                          }
                        >
                          Rejected
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography>No requests found.</Typography>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ParentProfile;
