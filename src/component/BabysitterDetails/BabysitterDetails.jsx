// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
// import { FIREBASE_DB } from '../../config/firebase';
// import { Container, Typography, Button, Paper, Rating, Box } from '@mui/material';
// import { getAuth } from 'firebase/auth';

// const BabysitterDetails = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [babysitter, setBabysitter] = useState(null);
//     const [reviews, setReviews] = useState([]); // Κριτικές
//     const auth = getAuth();

//     useEffect(() => {
//         const fetchBabysitter = async () => {
//             const docRef = doc(FIREBASE_DB, "babysitters", id);
//             const docSnap = await getDoc(docRef);
    
//             if (docSnap.exists()) {
//                 setBabysitter(docSnap.data());
//             } else {
//                 console.log("No such document!");
//             }
//         };
    
//         fetchBabysitter();
//     }, [id]);
    
//     useEffect(() => {
//         const fetchReviews = async () => {
//             if (!babysitter || !babysitter.email) return; // Προσθήκη ασφαλιστικού ελέγχου
    
//             const ratingsRef = collection(FIREBASE_DB, "ratings");
//             const q = query(ratingsRef, where("babysitterDetails.email", "==", babysitter.email));
//             const querySnapshot = await getDocs(q);
    
//             const reviewsData = querySnapshot.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data(),
//             }));
    
//             setReviews(reviewsData);
//         };
    
//         fetchReviews();
//     }, [babysitter]); // Ενημέρωση των εξαρτήσεων για να περιμένει το babysitter
    

//     const calculateAge = (dob) => {
//         const birthDate = new Date(dob);
//         const today = new Date();
//         let age = today.getFullYear() - birthDate.getFullYear();
//         const m = today.getMonth() - birthDate.getMonth();
//         if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//             age--;
//         }
//         return age;
//     };

//     const handleMakeContract = () => {
//         const user = auth.currentUser;
//         if (user) {
//             navigate('/make-contract', {
//                 state: { 
//                     babysitterDetails: babysitter, 
//                     userDetails: { 
//                         uid: user.uid, 
//                         email: user.email, 
//                         displayName: user.displayName 
//                     }
//                 }});
//         } else {
//             alert("Please sign in to make a contract.");
//             navigate('/login');
//         }
//     };

//     if (!babysitter) {
//         return <Typography>Loading...</Typography>;
//     }

//     return (
//         <Container maxWidth="sm">
//             <Paper elevation={3} sx={{ p: 2 }}>
//                 <Typography variant="h4" gutterBottom>{babysitter.firstName} {babysitter.lastName}</Typography>
//                 <Typography variant="subtitle1">{babysitter.email}</Typography>
//                 <img src={babysitter.profilePicture || 'default_image.jpg'} alt="Babysitter" style={{ width: '100%' }} />
//                 <Typography sx={{ mt: 2 }}>{babysitter.bio}</Typography>
//                 <Typography sx={{ mt: 1 }}>Age: {calculateAge(babysitter.birthDate)}</Typography>
//                 <Typography sx={{ mt: 1 }}>Experience: {babysitter.experience} years</Typography>
//                 <Typography sx={{ mt: 1 }}>Certifications: {babysitter.certifications}</Typography>
//                 <Button variant="contained" color="primary" sx={{ mt: 2, mr: 1 }}>
//                     Send Message
//                 </Button>
//                 <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={handleMakeContract}>
//                     Make a Contract
//                 </Button>

//                 {/* Κριτικές */}
//                 <Box sx={{ mt: 4 }}>
//                     <Typography variant="h5" gutterBottom>Reviews</Typography>
//                     {reviews.length > 0 ? (
//                         reviews.map(review => (
//                             <Paper key={review.id} elevation={2} sx={{ p: 2, mb: 2 }}>
//                                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                                     <Rating value={review.rating} precision={0.5} readOnly />
//                                     <Typography variant="body2" sx={{ ml: 1 }}>
//                                         {review.rating} stars
//                                     </Typography>
//                                 </Box>
//                                 {review.comment && (
//                                     <Typography variant="body2" color="textSecondary">
//                                         {review.comment}
//                                     </Typography>
//                                 )}
//                                 <Typography variant="caption" color="textSecondary">
//                                     Submitted by: {review.parentDetails.email}
//                                 </Typography>
//                             </Paper>
//                         ))
//                     ) : (
//                         <Typography>No reviews yet.</Typography>
//                     )}
//                 </Box>
//             </Paper>
//         </Container>
//     );
// };

// export default BabysitterDetails;
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

  const handleViewChat = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Please sign in to send a message.");
        navigate("/login");
        return;
      }
  
      // Εύρεση υπάρχουσας συνομιλίας
      const chatsQuery = query(
        collection(FIREBASE_DB, "chats"),
        where("participants", "array-contains", user.email)
      );
      const chatsSnap = await getDocs(chatsQuery);
  
      let existingChat = null;
  
      chatsSnap.forEach((doc) => {
        const data = doc.data();
        if (
          data.participants.includes(user.email) &&
          data.participants.includes(babysitter.email)
        ) {
          existingChat = { id: doc.id, ...data };
        }
      });
  
      if (existingChat) {
        // Αν υπάρχει ήδη η συνομιλία
        navigate(`/chat/${existingChat.id}`, { state: { userEmail: user.email } });
        return;
      }
  
      // Δημιουργία νέας συνομιλίας με μόνο τα emails
      const newChatRef = await addDoc(collection(FIREBASE_DB, "chats"), {
        participants: [user.email, babysitter.email], // Μόνο τα emails
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
