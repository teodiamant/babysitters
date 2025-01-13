
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  addDoc,
  doc,
  deleteDoc,
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
  TextField,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const ParentProfile = () => {
  const [requests, setRequests] = useState([]);
  const [currentJob, setCurrentJob] = useState(null);
  const [pastJobs, setPastJobs] = useState([]); // Ιστορικό συνεργασιών
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null); // For managing dialog details
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

          // Find past jobs
          const completedJobs = parentRequests.filter((request) => {
            if (request.state === "Accepted") {
              const startDate = new Date(request.startDate);
              const durationInMonths = parseInt(request.duration || "0", 10);
              const endDate = new Date(startDate);
              endDate.setMonth(startDate.getMonth() + durationInMonths);
              return endDate < new Date();
            }
            return false;
          });
          setPastJobs(completedJobs);
        } else {
          setRequests([]);
          setCurrentJob(null);
          setPastJobs([]);
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

  const handleRatingSubmit = async (job, rating, comment) => {
    if (!job.babysitterDetails.email || !job.userDetails.email || !job.id) {
        alert("Missing job or user details.");
        return;
    }

    if (!rating) {
        alert("Please provide a rating before submitting.");
        return;
    }

    try {
        const ratingsRef = collection(FIREBASE_DB, "ratings");

        // Check if rating already exists
        const existingRatingQuery = query(
            ratingsRef,
            where("babysitterDetails.email", "==", job.babysitterDetails.email),
            where("parentDetails.email", "==", job.userDetails.email),
            where("jobId", "==", job.id)
        );

        const existingRatingSnap = await getDocs(existingRatingQuery);

        if (!existingRatingSnap.empty) {
            // Update existing rating
            const ratingDoc = existingRatingSnap.docs[0];
            const ratingRef = doc(FIREBASE_DB, "ratings", ratingDoc.id);

            await updateDoc(ratingRef, {
                rating: rating || ratingDoc.data().rating,
                comment: comment || ratingDoc.data().comment,
                updatedAt: new Date(),
            });

            alert("Rating updated successfully!");
        } else {
            // Create new rating
            const ratingData = {
                babysitterDetails: job.babysitterDetails,
                parentDetails: job.userDetails,
                jobId: job.id,
                rating,
                comment: comment || "",
                createdAt: new Date(),
            };

            await addDoc(ratingsRef, ratingData);
            alert("Rating submitted successfully!");
        }
    } catch (error) {
        console.error("Error submitting rating:", error);
        alert("Failed to submit rating.");
    }
};

  const handleDeleteRequest = async (requestId) => {
    try {
      const requestRef = doc(FIREBASE_DB, "requests", requestId);
      await deleteDoc(requestRef);
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== requestId)
      );
      alert("Request deleted successfully!");
    } catch (error) {
      console.error("Error deleting request:", error);
      alert("Failed to delete request.");
    }
  };

const handleOpenDetails = (request) => {
  setSelectedRequest(request);
};

const handleCloseDetails = () => {
  setSelectedRequest(null);
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
                Edit Profile
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
                <>
                  <Typography>
                    Babysitter: {currentJob.babysitterDetails.name}
                    <br />
                    Start Date:{" "}
                    {new Date(currentJob.startDate).toLocaleDateString()}
                    <br />
                    Payment Status:{" "}
                    {currentJob.payment === "true" ? "Accepted" : "Rejected"}
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={() => handleOpenDetails(currentJob)}
                  >
                    View Details
                  </Button>
                </>
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
                    <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => handleOpenDetails(request)}
                      >
                        View Details
                      </Button>
                      {request.state === "Pending" && (
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDeleteRequest(request.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </Box>
                    
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

          {/* Ιστορικό Συνεργασιών */}
          <Grid item xs={12} sx={{ mt: 4 }}>
  <Typography variant="h6" sx={{ mb: 2 }}>
    Past Jobs
  </Typography>
  {pastJobs.length > 0 ? (
    pastJobs.map((job) => (
      <Card key={job.id} sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="body1">
            Babysitter Name: {job.babysitterDetails.name}
          </Typography>
          <Typography variant="body1">
            Start Date: {new Date(job.startDate).toLocaleDateString()}
          </Typography>
          <Typography variant="body1">
            Duration: {job.duration} months
          </Typography>
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => handleOpenDetails(job)}
          >
            View Details
          </Button>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              {job.rating ? "Your Rating:" : "Rate this job:"}
            </Typography>
            {job.rating && !job.isEditing ? (
              <>
                <Rating value={job.rating} readOnly precision={0.5} />
                <Typography variant="body2" color="textSecondary">
                  {job.comment || "No comment provided"}
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => {
                    // Allow editing
                    job.isEditing = true;
                    setPastJobs((prev) =>
                      prev.map((prevJob) =>
                        prevJob.id === job.id ? { ...prevJob, isEditing: true } : prevJob
                      )
                    );
                  }}
                >
                  Edit Review
                </Button>
              </>
            ) : (
              <>
                <Rating
                  name={`rating-${job.id}`}
                  max={5}
                  value={job.tempRating || job.rating || 0}
                  onChange={(event, value) => {
                    job.tempRating = value; // Temporarily store rating
                    setPastJobs((prev) =>
                      prev.map((prevJob) =>
                        prevJob.id === job.id
                          ? { ...prevJob, tempRating: value }
                          : prevJob
                      )
                    );
                  }}
                />
                <TextField
                  label="Optional comment"
                  multiline
                  rows={3}
                  fullWidth
                  sx={{ mt: 2 }}
                  value={job.tempComment || job.comment || ""}
                  onChange={(e) => {
                    job.tempComment = e.target.value; // Temporarily store comment
                    setPastJobs((prev) =>
                      prev.map((prevJob) =>
                        prevJob.id === job.id
                          ? { ...prevJob, tempComment: e.target.value }
                          : prevJob
                      )
                    );
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() =>
                    handleRatingSubmit(job, job.tempRating, job.tempComment)
                  }
                >
                  {job.rating ? "Update Rating" : "Submit Rating"}
                </Button>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    ))
  ) : (
    <Typography>No past jobs found.</Typography>
  )}
          </Grid>
        </Grid>
      </Grid>
       {/* Dialog for Viewing Details */}
       <Dialog open={!!selectedRequest} onClose={handleCloseDetails}>
        <DialogTitle>Request Details</DialogTitle>
        <DialogContent>
                  {selectedRequest && (
                    <>
                      <Typography variant="h6">Contract Details</Typography>
                      <Typography variant="body1">
                        Parent Name: {selectedRequest.userDetails.displayName || "Anonymous"}
                      </Typography>
                      <Typography variant="body1">Parent Email: {selectedRequest.userDetails.email}</Typography>
                      <Typography variant="body1">Babysitter Name: {selectedRequest.babysitterDetails.name}</Typography>
                      <Typography variant="body1">Babysitter Email: {selectedRequest.babysitterDetails.email}</Typography>
                      <Typography variant="body1">Start Date: {new Date(selectedRequest.startDate).toLocaleDateString()}</Typography>
                      <Typography variant="body1">Duration: {selectedRequest.duration} months</Typography>
                      <Typography variant="body1">City: {selectedRequest.city}</Typography>
                      <Typography variant="body1">Street: {selectedRequest.street}</Typography>
                      <Typography variant="body1">Postal Code: {selectedRequest.postalCode}</Typography>
                      <Typography variant="body1">Number of Children: {selectedRequest.numberOfChildren}</Typography>
                      <Typography variant="body1">Children Ages: {selectedRequest.childrenAges}</Typography>
                      <Typography variant="body1">Specializations: {selectedRequest.specializations || "None"}</Typography>
                      <Typography variant="body1">
                        Days Needed: {selectedRequest.availability.days.join(", ") || "None"}
                      </Typography>
                      <Typography variant="body1">
                        Preferred Hours:{" "}
                        {selectedRequest.availability.preferredHours.start
                          ? `${selectedRequest.availability.preferredHours.start} - ${selectedRequest.availability.preferredHours.end}`
                          : "Not specified"}
                      </Typography>
                      <Typography variant="body1">
                        Flexible with Hours: {selectedRequest.availability.isFlexibleWithHours ? "Yes" : "No"}
                      </Typography>
                      <Typography variant="body1">
                        Flexible Availability: {selectedRequest.availability.isFlexible ? "Yes" : "No"}
                      </Typography>
                      <Typography variant="body1">
                        Payment Status: {selectedRequest.payment === "true" ? "Accepted" : "Rejected"}
                      </Typography>
                    </>
                  )}
                </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ParentProfile;

