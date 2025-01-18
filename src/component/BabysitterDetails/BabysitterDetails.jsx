import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../config/firebase";
import {
  Container,
  Typography,
  Button,
  Paper,
  Rating,
  Box,
} from "@mui/material";
import { getAuth } from "firebase/auth";

const BabysitterDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [babysitter, setBabysitter] = useState(null);
  const [reviews, setReviews] = useState([]); // Κριτικές
  const auth = getAuth();

  // Φόρτωση δεδομένων νταντάς
  useEffect(() => {
    const fetchBabysitter = async () => {
      const docRef = doc(FIREBASE_DB, "babysitters", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setBabysitter(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    fetchBabysitter();
  }, [id]);

  // Φόρτωση κριτικών
  useEffect(() => {
    const fetchReviews = async () => {
      if (!babysitter || !babysitter.email) return;

      const ratingsRef = collection(FIREBASE_DB, "ratings");
      const q = query(
        ratingsRef,
        where("babysitterDetails.email", "==", babysitter.email)
      );
      const querySnapshot = await getDocs(q);

      const reviewsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReviews(reviewsData);
    };

    fetchReviews();
  }, [babysitter]);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  const fetchUserDetailsForChat = async (parentEmail, babysitterEmail) => {
    try {
      // Query για τον γονέα
      const parentQuery = query(
        collection(FIREBASE_DB, "parents"),
        where("email", "==", parentEmail)
      );
      const parentSnapshot = await getDocs(parentQuery);
  
      // Query για τη νταντά
      const babysitterQuery = query(
        collection(FIREBASE_DB, "babysitters"),
        where("email", "==", babysitterEmail)
      );
      const babysitterSnapshot = await getDocs(babysitterQuery);
  
      const userDetails = {};
  
      // Εξαγωγή δεδομένων για τον γονέα
      if (!parentSnapshot.empty) {
        const parentData = parentSnapshot.docs[0].data();
        userDetails[parentEmail] = {
          name: `${parentData.firstName} ${parentData.lastName}` || "Anonymous",
          photoURL: parentData.profilePicture || "default_image.jpg",
          email: parentEmail,
        };
      } else {
        console.warn(`No data found for parent with email: ${parentEmail}`);
      }
  
      // Εξαγωγή δεδομένων για τη νταντά
      if (!babysitterSnapshot.empty) {
        const babysitterData = babysitterSnapshot.docs[0].data();
        userDetails[babysitterEmail] = {
          name: `${babysitterData.firstName} ${babysitterData.lastName}` || "Anonymous",
          photoURL: babysitterData.profilePicture || "default_image.jpg",
          email: babysitterEmail,
        };
      } else {
        console.warn(`No data found for babysitter with email: ${babysitterEmail}`);
      }
  
      return userDetails;
    } catch (error) {
      console.error("Error fetching user details for chat:", error);
      return null;
    }
  };
  

  const handleViewChat = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Please sign in to send a message.");
        navigate("/login");
        return;
      }
  
      const userDetails = await fetchUserDetailsForChat(user.email, babysitter.email);
  
      if (!userDetails) {
        alert("Failed to fetch user details. Please try again.");
        return;
      }
  
      // Δημιουργία νέας συνομιλίας με τα πλήρη στοιχεία
      const newChatRef = await addDoc(collection(FIREBASE_DB, "chats"), {
        participants: [user.email, babysitter.email],
        users: {
          parent: userDetails[user.email],
          babysitter: userDetails[babysitter.email],
        },
        createdAt: serverTimestamp(),
      });
  
      navigate(`/chat/${newChatRef.id}`, { state: { userEmail: user.email } });
    } catch (error) {
      console.error("Error starting chat:", error);
      alert("Failed to start chat. Please try again.");
    }
  };
  
  
  
  const handleMakeContract = () => {
    const user = auth.currentUser;
    if (user) {
      navigate("/make-contract", {
        state: {
          babysitterDetails: babysitter,
          userDetails: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          },
        },
      });
    } else {
      alert("Please sign in to make a contract.");
      navigate("/login");
    }
  };

  if (!babysitter) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          backgroundColor: "#f9f9f9",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Babysitter Info */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <img
            src={babysitter.profilePicture || "default_image.jpg"}
            alt="Babysitter"
            style={{
              width: 250,
              height: 250,
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: 16,
            }}
          />
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#4c3b34" }}>
            {babysitter.firstName} {babysitter.lastName}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "#757575", mb: 1 }}>
            {babysitter.email}
          </Typography>
          
        </Box>
  
        {/* Additional Details */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ fontWeight: "bold", color: "#795e53" }}>
            Age: <span style={{ color: "#4c3b34" }}>{calculateAge(babysitter.birthDate)}</span>
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold", color: "#795e53", mt: 1 }}>
            Experience: <span style={{ color: "#4c3b34" }}>{babysitter.experience} years</span>
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold", color: "#795e53", mt: 1, mb: 1 }}>
            Availability:
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {babysitter.availability.days && babysitter.availability.days.length > 0 ? (
              babysitter.availability.days.map((day, index) => (
                <Box
                  key={index}
                  sx={{
                    padding: "8px 16px",
                    borderRadius: "16px",
                    backgroundColor: "#f3b2ac",
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                    minWidth: "80px",
                  }}
                >
                  {day}
                </Box>
              ))
            ) : (
              <Typography variant="body2" sx={{ color: "#757575" }}>
                Not Available
              </Typography>
            )}
          </Box>

          <Typography variant="body1" sx={{ fontWeight: "bold", color: "#795e53", mt: 1 }}>
            Job Type: <span style={{ color: "#4c3b34" }}>{babysitter.availability.fullTimeOrPartTime} </span>
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold", color: "#795e53", mt: 1 }}>
            {babysitter.bio}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold", color: "#795e53", mt: 1 }}>
            Certifications:
            <Box
              component="ul"
              sx={{
                listStyle: "none",
                p: 0,
                mt: 1,
                color: "#4c3b34",
              }}
            >
              {Array.isArray(babysitter.certifications) && babysitter.certifications.length > 0 ? (
                babysitter.certifications.map((cert, index) => (
                  <li key={index} style={{ marginBottom: 4 }}>
                    - {cert}
                  </li>
                ))
              ) : (
                <li>Not Specified</li>
              )}
            </Box>
          </Typography>
        </Box>
  
        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: "#4c3b34",
              "&:hover": { backgroundColor: "#795e53" },
            }}
            onClick={handleViewChat}
          >
            Send Message
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              backgroundColor: "#795e53",
              "&:hover": { backgroundColor: "#4c3b34" },
            }}
            onClick={handleMakeContract}
          >
            Make a Contract
          </Button>
        </Box>
  
        {/* Reviews Section */}
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#4c3b34",
              borderBottom: "2px solid #795e53",
              display: "inline-block",
              mb: 2,
            }}
          >
            Reviews
          </Typography>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Paper
                key={review.id}
                elevation={2}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  backgroundColor: "#fff",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Rating value={review.rating} precision={0.5} readOnly />
                  <Typography
                    variant="body2"
                    sx={{
                      ml: 1,
                      fontWeight: "bold",
                      color: "#4c3b34",
                    }}
                  >
                    {review.rating} stars
                  </Typography>
                </Box>
                {review.comment && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#757575",
                      fontStyle: "italic",
                      mb: 1,
                    }}
                  >
                    "{review.comment}"
                  </Typography>
                )}
                <Typography
                  variant="caption"
                  sx={{ color: "#b0b0b0", fontStyle: "italic" }}
                >
                  Submitted by: {review.parentDetails.email}
                </Typography>
              </Paper>
            ))
          ) : (
            <Typography variant="body1" sx={{ color: "#757575", mt: 1 }}>
              No reviews yet.
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
  
};

export default BabysitterDetails;
