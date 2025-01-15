import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  addDoc,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
} from "@mui/material";
import { onAuthStateChanged, getAuth } from "firebase/auth";

const BabysitterProfile = () => {
  const [allRequests, setAllRequests] = useState([]);
  const [currentJob, setCurrentJob] = useState(null);
  const [historyRequests, setHistoryRequests] = useState([]);
   const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null); // Για το pop-up
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
  
              if (role === "babysitter") {
                // Query the 'parents' collection
                const babysitterQuery = query(
                  collection(FIREBASE_DB, "babysitters"),
                  where("email", "==", userEmail)
                );
                const babysitterSnapshot = await getDocs(babysitterQuery);
  
                if (!babysitterSnapshot.empty) {
                  const babysitterDoc = babysitterSnapshot.docs[0];
                  const babysitterData =babysitterDoc.data();
  
                  setUser({
                    id: userDoc.id,
                    email: userEmail,
                    name:babysitterData?.firstName,
                    photoURL: babysitterData.profilePicture || "path/to/default/photo.jpg",
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

        // Fetch all requests for the babysitter
        const babysitterQuery = query(
          requestsRef,
          where("babysitterDetails.email", "==", email)
        );
        const requestsSnap = await getDocs(babysitterQuery);

        if (!requestsSnap.empty) {
          const requests = requestsSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setAllRequests(requests);

          // Check for current job
          const activeJob = requests.find(
            (request) =>
              request.state === "Accepted" &&
              new Date(request.startDate) <= new Date()
          );

          setCurrentJob(activeJob || null);

          // Get history requests
          const history = requests.filter(
            (request) =>
              request.state === "Accepted" &&
              new Date(request.startDate) < new Date()
          );
          setHistoryRequests(history);
        } else {
          setAllRequests([]);
          setCurrentJob(null);
          setHistoryRequests([]);
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

  const handleUpdateRequestState = async (requestId, newState) => {
    try {
      const requestRef = doc(FIREBASE_DB, "requests", requestId);
      await updateDoc(requestRef, { state: newState });
      setAllRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId ? { ...request, state: newState } : request
        )
      );
    } catch (error) {
      console.error("Error updating request state:", error);
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
        {/* Left Column */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ textAlign: "center" }}>
              <Avatar
                alt="Babysitter Profile"
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
                onClick={() => navigate(`/babysitter-settings/${email}`)}
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
                onClick={() => navigate(`/chat/${chat.id}`, { state: { userEmail: email } })}
              >
                Chat with {chat.participants.find((participant) => participant !== email)}
              </Button>
            ))
          ) : (
            <Typography>No active chats.</Typography>
          )}
        </Box>
        </Grid>

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
                      src={currentJob.userDetails.profilePicture || "default_image.jpg"}
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

          {/* All Requests */}
          <Grid item xs={12} sx={{ mt: 4 }}>
  <Typography variant="h6" sx={{ mb: 2 }}>
    All Requests
  </Typography>
  {allRequests.length > 0 ? (
    allRequests.map((request) => (
      <Card key={request.id} sx={{ mb: 4, p: 2 }}>
        <CardContent sx={{ display: "flex", alignItems: "flex-start" }}>
          {/* Φωτογραφία */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
              mr: 2,
            }}
          >
            <img
              src={
                request.userDetails.profilePicture || "default_babysitter_image.jpg"
              }
              alt="Babysitter"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>

          {/* Πληροφορίες */}
          <Box sx={{ flex: 1 }}>
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
              <strong>Start Date:</strong>{" "}
              {new Date(request.startDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body1">
              <strong>Days:</strong> {request.availability.days.join(", ")}
            </Typography>
            <Typography variant="body1">
              <strong>Hours:</strong>{" "}
              {`${request.availability.preferredHours.start} - ${request.availability.preferredHours.end}`}
            </Typography>
            <Typography variant="body1">
              <strong>Address:</strong> {request.street}, {request.city},{" "}
              {request.postalCode}
            </Typography>

            {/* Κουμπιά */}
            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => handleOpenDetails(request)}
              >
                View Details
              </Button>
              {request.state === "Pending" && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() =>
                      handleUpdateRequestState(request.id, "Accepted")
                    }
                  >
                    Accept
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() =>
                      handleUpdateRequestState(request.id, "Rejected")
                    }
                  >
                    Reject
                  </Button>
                </>
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
            </Box>
          </Box>
        </CardContent>
      </Card>
    ))
  ) : (
    <Typography>No requests found.</Typography>
  )}
</Grid>

        
{/* History Section */}
<Grid item xs={12} sx={{ mt: 4 }}>
<Typography variant="h6" sx={{ mb: 2 }}>
      History
    </Typography>
  <Paper elevation={3} sx={{ p: 3 }}>
    {historyRequests.length > 0 ? (
      historyRequests.map((request) => (
        <Card key={request.id} sx={{ mb: 2 }}>
          <CardContent sx={{ display: "flex", alignItems: "flex-start" }}>
            {/* Φωτογραφία */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                overflow: "hidden",
                flexShrink: 0,
                mr: 2,
              }}
            >
              <img
                src={
                  request.userDetails?.profilePicture || "default_parent_image.jpg"
                }
                alt="Parent"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>

            {/* Πληροφορίες */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1">
                <strong>Parent Name:</strong> {request.parentName}
              </Typography>
              <Typography variant="body1">
                <strong>Start Date:</strong>{" "}
                {new Date(request.startDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body1">
                <strong>Payment Status:</strong>{" "}
                {request.payment === "true" ? "Accepted" : "Rejected"}
              </Typography>
 {/* Κριτικές */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Reviews
          </Typography>
          {request.length > 0 ? (
            request.map((request) => (
              <Paper key={request.id} elevation={2} sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Rating value={request.rating} precision={0.5} readOnly />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {request.rating} stars
                  </Typography>
                </Box>
                {request.comment && (
                  <Typography variant="body2" color="textSecondary">
                    {request.comment}
                  </Typography>
                )}
                <Typography variant="caption" color="textSecondary">
                  Submitted by: {request.parentDetails.email}
                </Typography>
              </Paper>
            ))
          ) : (
            <Typography>No reviews yet.</Typography>
          )}
        </Box>

              <Button
                variant="outlined"
                onClick={() => handleOpenDetails(request)}
                sx={{ mt: 2 }}
              >
                View Details
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))
    ) : (
      <Typography>No history found.</Typography>
    )}
  </Paper>
</Grid>
</Grid>
      </Grid>

      {/* Dialog for Viewing Details */}
      <Dialog open={!!selectedRequest} onClose={handleCloseDetails}>
        <DialogTitle>Contract Details</DialogTitle>
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

export default BabysitterProfile;

