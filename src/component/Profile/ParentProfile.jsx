
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
  serverTimestamp,
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
import { onAuthStateChanged, getAuth } from "firebase/auth";


const ParentProfile = () => {
  const [requests, setRequests] = useState([]);
  const [currentJob, setCurrentJob] = useState(null);
  const [pastJobs, setPastJobs] = useState([]); // Ιστορικό συνεργασιών
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null); // For managing dialog details
  const { email } = useParams();
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  const auth = getAuth();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userEmail = firebaseUser.email;

          // Query the 'users' collection to get the user's role
          const usersQuery = query(
            collection(FIREBASE_DB, "users"),
            where("email", "==", userEmail)
          );
          const usersSnapshot = await getDocs(usersQuery);

          if (!usersSnapshot.empty) {
            const userDoc = usersSnapshot.docs[0];
            const userData = userDoc.data();

            const role = userData.role; // Get the user's role

            if (role === "parent") {
              // Query the 'parents' collection
              const parentQuery = query(
                collection(FIREBASE_DB, "parents"),
                where("email", "==", userEmail)
              );
              const parentSnapshot = await getDocs(parentQuery);

              if (!parentSnapshot.empty) {
                const parentDoc = parentSnapshot.docs[0];
                const parentData = parentDoc.data();

                setUser({
                  id: userDoc.id,
                  email: userEmail,
                  name: parentData?.firstName,
                  photoURL: parentData.profilePicture || "path/to/default/photo.jpg",
                  role: role,
                });
              } else {
                console.warn("No data found in 'parents' collection for this email.");
              }
            } else {
              console.warn("Role not supported for this component.");
            }
          } else {
            console.warn("No user data found in 'users' collection for this email.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        console.log("No user is signed in.");
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

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
    const fetchChats = async () => {
      try {
        const chatsQuery = query(
          collection(FIREBASE_DB, "chats"),
          where("participants", "array-contains", email)
        );
        const chatsSnap = await getDocs(chatsQuery);
  
        setChats(chatsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };
    fetchChats();
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

const handleViewChat = async (parentEmail, babysitterEmail) => {
  try {
    // Εύρεση υπάρχοντος chat
    const chatsQuery = query(
      collection(FIREBASE_DB, "chats"),
      where("participants", "array-contains", parentEmail)
    );
    const chatsSnap = await getDocs(chatsQuery);

    // Έλεγχος αν υπάρχει chat με τον babysitter
    let existingChat = null;
    chatsSnap.forEach((doc) => {
      const data = doc.data();
      if (data.participants.includes(babysitterEmail)) {
        existingChat = { id:doc.id, ...data };
      }
    });

    // Αν υπάρχει ήδη το chat, κάνε navigate σε αυτό
    if (existingChat) {
      navigate(`/chat/${existingChat.id}`, { state: { userEmail: parentEmail } });
      return;
    }

    // Αν δεν υπάρχει, δημιούργησε νέο chat
    const newChatRef = await addDoc(collection(FIREBASE_DB, "chats"), {
      participants: [parentEmail, babysitterEmail], // Emails και των δύο χρηστών
      createdAt: serverTimestamp(),
    });

    // Μεταφορά στο νέο chat
    navigate(`/chat/${newChatRef.id}`, { state: { userEmail: parentEmail } });
  } catch (error) {
    console.error("Error handling chat:", error);
    alert("Failed to open chat. Please try again.");
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
                src={user?.photoURL|| "path/to/default/photo.jpg"}
                sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
              {user?.name || "Parent Name"}
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
          <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Active Chats
          </Typography>
          {chats.length > 0 ? (
            chats.map((chat) => (
              <Button
                key={chat.id}
                fullWidth
                variant="outlined"
                sx={{ mt: 1 }}
                onClick={() =>
                  navigate(`/chat/${chat.id}`, { state: { userEmail: email } })
                }
              >
                Chat with {chat.participants.find((participant) => participant !== email)}
              </Button>
            ))
          ) : (
            <Typography>No active chats.</Typography>
          )}
        </Box>
        </Grid>

        {/* Δεξιά Στήλη */}
        <Grid item xs={12} md={8}>
          {/* Τρέχουσα Εργασία */}
          <Typography variant="h6" sx={{ mb: 2 }}>
                Current Job
              </Typography>
          <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
      {currentJob ? (
        <>
          {/* Φωτογραφία Νταντάς */}
          <img
            src={currentJob.babysitterDetails.profilePicture || "default_image.jpg"}
            alt="Babysitter"
            style={{
              width: 150, // Μεγαλύτερο πλάτος
              height: 150, // Μεγαλύτερο ύψος
              borderRadius: "50%", // Κυκλική εμφάνιση
              objectFit: "cover",
            }}
          />
          {/* Πληροφορίες */}
          <Box sx={{ flex: 1, textAlign: "left" }}>
            <Typography variant="body1">
              <strong>Babysitter:</strong> {currentJob.babysitterDetails.firstName}{" "}
              {currentJob.babysitterDetails.lastName}
            </Typography>
            <Typography variant="body1">
              <strong>Start Date:</strong> {new Date(currentJob.startDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body1">
              <strong>Payment Status:</strong> {currentJob.payment === "true" ? "Accepted" : "Rejected"}
            </Typography>
            <Typography variant="body1">
              <strong>Days:</strong> {currentJob.availability.days.join(", ")}
            </Typography>
            <Typography variant="body1">
              <strong>Hours:</strong> {currentJob.availability.preferredHours.start} -{" "}
              {currentJob.availability.preferredHours.end}
            </Typography>
            <Typography variant="body1">
              <strong>Address:</strong> {currentJob.street}, {currentJob.city}, {currentJob.postalCode}
            </Typography>
            <Button variant="outlined" sx={{ mt: 2 }} onClick={() => handleOpenDetails(currentJob)}>
              View Details
            </Button>
          </Box>
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
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 3, flexDirection: { xs: "column", md: "row" }, }}>
          {/* Φωτογραφία Νταντάς */}
          <img
            src={request.babysitterDetails.profilePicture || "default_image.jpg"}
            alt="Babysitter"
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          {/* Πληροφορίες */}
          <Box sx={{ flex: 1, textAlign: "left" }}>
            <Typography variant="body1">
              <strong>Request ID:</strong> {request.id}
            </Typography>
            <Typography variant="body1">
              <strong>Status:</strong> {request.state}
            </Typography>
            <Typography variant="body1">
              <strong>Babysitter Name:</strong> {request.babysitterDetails.firstName}{" "}
              {request.babysitterDetails.lastName}
            </Typography>
            <Typography variant="body1">
              <strong>Start Date:</strong> {new Date(request.startDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body1">
              <strong>Days:</strong> {request.availability.days.join(", ")}
            </Typography>
            <Typography variant="body1">
              <strong>Hours:</strong> {request.availability.preferredHours.start} -{" "}
              {request.availability.preferredHours.end}
            </Typography>
            <Typography variant="body1">
              <strong>Address:</strong> {request.street}, {request.city}, {request.postalCode}
            </Typography>
          </Box>
        </CardContent>
        <CardContent>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}>
            <Button variant="outlined" onClick={() => handleOpenDetails(request)}>
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
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                handleViewChat(
                  request.userDetails.email,
                  request.babysitterDetails.email
                )
              }
            >
              View Chat
            </Button>
            {request.state === "Accepted" && (
              <>
                <Button
                  variant={request.payment === "true" ? "contained" : "outlined"}
                  color="success"
                  onClick={() => handleTogglePayment(request.id, "true")}
                >
                  Accepted
                </Button>
                <Button
                  variant={request.payment === "false" ? "contained" : "outlined"}
                  color="error"
                  onClick={() => handleTogglePayment(request.id, "false")}
                >
                  Rejected
                </Button>
              </>
            )}
          </Box>
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
      <Card key={job.id} sx={{ mb: 4, p: 2 }}>
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* Φωτογραφία Νταντάς */}
          <img
            src={job.babysitterDetails.profilePicture || "default_image.jpg"}
            alt="Babysitter"
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />

          {/* Πληροφορίες */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1">
              <strong>Babysitter Name:</strong> {job.babysitterDetails.firstName}{" "}
              {job.babysitterDetails.lastName}
            </Typography>
            <Typography variant="body1">
              <strong>Start Date:</strong>{" "}
              {new Date(job.startDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body1">
              <strong>Duration:</strong> {job.duration} months
            </Typography>
            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => handleOpenDetails(job)}
            >
              View Details
            </Button>
          </Box>
        </CardContent>

        {/* Βαθμολογία */}
        <CardContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              {job.rating ? "Your Rating:" : "Add Rating:"}
            </Typography>
            {job.rating && !job.isEditing ? (
              <>
                <Rating value={job.rating} readOnly precision={0.5} />
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  {job.comment || "No comment provided"}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Submitted by: {job.babysitterDetails.email}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      job.isEditing = true;
                      setPastJobs((prev) =>
                        prev.map((prevJob) =>
                          prevJob.id === job.id
                            ? { ...prevJob, isEditing: true }
                            : prevJob
                        )
                      );
                    }}
                  >
                    Edit Rating
                  </Button>
                </Box>
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
                <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      handleRatingSubmit(job, job.tempRating, job.tempComment);
                      job.isEditing = false;
                      setPastJobs((prev) =>
                        prev.map((prevJob) =>
                          prevJob.id === job.id
                            ? {
                                ...prevJob,
                                rating: job.tempRating,
                                comment: job.tempComment,
                                isEditing: false,
                              }
                            : prevJob
                        )
                      );
                    }}
                  >
                    Save Rating
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      job.isEditing = false;
                      setPastJobs((prev) =>
                        prev.map((prevJob) =>
                          prevJob.id === job.id
                            ? { ...prevJob, isEditing: false }
                            : prevJob
                        )
                      );
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
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
                      <Typography variant="body1">Babysitter Name: {selectedRequest.babysitterDetails.firstName} {selectedRequest.babysitterDetails.lastName}</Typography>
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

