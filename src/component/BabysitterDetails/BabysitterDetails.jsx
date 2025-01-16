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
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          {babysitter.firstName} {babysitter.lastName}
        </Typography>
        <Typography variant="subtitle1">{babysitter.email}</Typography>
        <img
          src={babysitter.profilePicture || "default_image.jpg"}
          alt="Babysitter"
          style={{ width: "100%" }}
        />
        <Typography sx={{ mt: 2 }}>{babysitter.bio}</Typography>
        <Typography sx={{ mt: 1 }}>
          Age: {calculateAge(babysitter.birthDate)}
        </Typography>
        <Typography sx={{ mt: 1 }}>
          Experience: {babysitter.experience} years
        </Typography>
        <Typography sx={{ mt: 1 }}>
          Certifications: {babysitter.certifications}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, mr: 1 }}
          onClick={handleViewChat}
        >
          Send Message
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 2 }}
          onClick={handleMakeContract}
        >
          Make a Contract
        </Button>

        {/* Κριτικές */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Reviews
          </Typography>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Paper key={review.id} elevation={2} sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Rating value={review.rating} precision={0.5} readOnly />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {review.rating} stars
                  </Typography>
                </Box>
                {review.comment && (
                  <Typography variant="body2" color="textSecondary">
                    {review.comment}
                  </Typography>
                )}
                <Typography variant="caption" color="textSecondary">
                  Submitted by: {review.parentDetails.email}
                </Typography>
              </Paper>
            ))
          ) : (
            <Typography>No reviews yet.</Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default BabysitterDetails;
