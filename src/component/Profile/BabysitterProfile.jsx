// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
// import { FIREBASE_DB } from "../../config/firebase";
// import {
//   Container,
//   Grid,
//   Typography,
//   Button,
//   Box,
//   Card,
//   CardContent,
//   Avatar,
//   Paper,
// } from "@mui/material";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import CancelIcon from "@mui/icons-material/Cancel";

// const BabysitterProfile = () => {
//   const [allRequests, setAllRequests] = useState([]);
//   const [currentJob, setCurrentJob] = useState(null);
//   const [historyRequests, setHistoryRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const { email } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchRequests = async () => {
//       setLoading(true);
//       try {
//         const requestsRef = collection(FIREBASE_DB, "requests");

//         // Fetch all requests for the babysitter
//         const babysitterQuery = query(
//           requestsRef,
//           where("babysitterDetails.email", "==", email)
//         );
//         const requestsSnap = await getDocs(babysitterQuery);

//         if (!requestsSnap.empty) {
//           const requests = requestsSnap.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));

//           setAllRequests(requests);

//           // Check for current job
//           const activeJob = requests.find(
//             (request) =>
//               request.state === "Accepted" &&
//               new Date(request.startDate) <= new Date()
//           );

//           setCurrentJob(activeJob || null);

//           // Get history requests
//           const history = requests.filter((request) => request.state === "Accepted");
//           setHistoryRequests(history);
//         } else {
//           setAllRequests([]);
//           setCurrentJob(null);
//           setHistoryRequests([]);
//         }
//       } catch (err) {
//         setError("Failed to fetch requests");
//         console.error("Error fetching requests:", err);
//       }
//       setLoading(false);
//     };

//     fetchRequests();
//   }, [email]);

//   const handleUpdateRequestState = async (requestId, newState) => {
//     try {
//       const requestRef = doc(FIREBASE_DB, "requests", requestId);
//       await updateDoc(requestRef, { state: newState });
//       setAllRequests((prevRequests) =>
//         prevRequests.map((request) =>
//           request.id === requestId ? { ...request, state: newState } : request
//         )
//       );
//     } catch (error) {
//       console.error("Error updating request state:", error);
//     }
//   };

//   if (loading) {
//     return <Typography>Loading...</Typography>;
//   }

//   if (error) {
//     return <Typography color="error">{error}</Typography>;
//   }

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         backgroundColor: "#795e53",
//         minHeight: "100vh",
//         margin: -2.5,
//         padding: 0,
//         py: 4,
//       }}
//     >
//       <Container maxWidth="lg" sx={{ mt: 4 }}>
//         <Grid container spacing={4}>
//           {/* Left Column */}
//           <Grid item xs={12} md={4}>
//             <Paper elevation={3} sx={{ p: 3, backgroundColor: "#f3b2ac" }}>
//               <Box sx={{ textAlign: "center" }}>
//                 <Avatar
//                   alt="Babysitter Profile"
//                   src="/static/images/avatar/1.jpg"
//                   sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
//                 />
//                 <Typography variant="h5" gutterBottom>
//                   Babysitter Name
//                 </Typography>
//                 <Typography variant="body1" color="textSecondary">
//                   Email: {email}
//                 </Typography>
//               </Box>
//               <Box sx={{ mt: 3 }}>
//                 <Button
//                   fullWidth
//                   variant="contained"
//                   sx={{
//                     backgroundColor: "#795e53",
//                     "&:hover": { backgroundColor: "#4c3b34" },
//                   }}
//                   onClick={() => navigate(`/babysitter-settings/${email}`)}
//                 >
//                   Edit Profile
//                 </Button>
//               </Box>
//             </Paper>
//           </Grid>

//           {/* Middle Column */}
//           <Grid item xs={12} md={4}>
//             <Paper elevation={3} sx={{ p: 3, backgroundColor: "#f3b2ac" }}>
//               <Typography variant="h6" sx={{ mb: 2 }}>
//                 Current Job
//               </Typography>
//               {currentJob ? (
//                 <Typography>
//                   You are currently working for: {currentJob.parentName} <br />
//                   Start Date: {new Date(currentJob.startDate).toLocaleDateString()}
//                 </Typography>
//               ) : (
//                 <Typography>No current job.</Typography>
//               )}
//             </Paper>

//             {/* Box wrapping All Requests */}
//             <Box sx={{ mt: 4, p: 2, backgroundColor: "#f3b2ac", borderRadius: 2 }}>
//               <Typography variant="h6" sx={{ mb: 2 }}>
//                 All Requests
//               </Typography>
//               {allRequests.length > 0 ? (
//                 allRequests.map((request) => (
//                   <Card key={request.id} sx={{ mb: 2, backgroundColor: "#f3b2ac" }}>
//                     <CardContent>
//                       <Typography variant="body1">Request ID: {request.id}</Typography>
//                       <Typography variant="body1">Status: {request.state}</Typography>
//                       <Typography variant="body1">
//                         Parent Name: {request.parentName}
//                       </Typography>
//                       <Typography variant="body1">
//                         Start Date: {new Date(request.startDate).toLocaleDateString()}
//                       </Typography>
//                       {request.state === "Pending" && (
//                         <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
//                           <Button
//                             variant="contained"
//                             sx={{
//                               backgroundColor: "#795e53",
//                               "&:hover": { backgroundColor: "#4c3b34" },
//                             }}
//                             onClick={() =>
//                               handleUpdateRequestState(request.id, "Accepted")
//                             }
//                           >
//                             Accept
//                           </Button>
//                           <Button
//                             variant="contained"
//                             sx={{
//                               backgroundColor: "#795e53",
//                               "&:hover": { backgroundColor: "#4c3b34" },
//                             }}
//                             onClick={() =>
//                               handleUpdateRequestState(request.id, "Rejected")
//                             }
//                           >
//                             Reject
//                           </Button>
//                         </Box>
//                       )}
//                     </CardContent>
//                   </Card>
//                 ))
//               ) : (
//                 <Typography>No requests found.</Typography>
//               )}
//             </Box>
//           </Grid>

//           {/* Right Column */}
//           <Grid item xs={12} md={4}>
//             {/* Box wrapping History */}
//             <Box sx={{ p: 2, backgroundColor: "#f3b2ac", borderRadius: 2 }}>
//               <Typography variant="h6" sx={{ mb: 2 }}>
//                 History
//               </Typography>
//               {historyRequests.length > 0 ? (
//                 historyRequests.map((request) => (
//                   <Card key={request.id} sx={{ mb: 2, backgroundColor: "#f3b2ac" }}>
//                     <CardContent>
//                       <Typography variant="body1">
//                         Parent Name: {request.parentName}
//                       </Typography>
//                       <Typography variant="body1">
//                         Start Date: {new Date(request.startDate).toLocaleDateString()}
//                       </Typography>
//                       <Typography variant="body1">
//                         Payment:{" "}
//                         {request.payment === "true" ? (
//                           <CheckCircleIcon sx={{ color: "green" }} />
//                         ) : (
//                           <CancelIcon sx={{ color: "red" }} />
//                         )}
//                       </Typography>
//                     </CardContent>
//                   </Card>
//                 ))
//               ) : (
//                 <Typography>No history found.</Typography>
//               )}
//             </Box>
//           </Grid>
//         </Grid>
//       </Container>
//     </Box>
//   );
// };

// export default BabysitterProfile;
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const BabysitterProfile = () => {
  const [allRequests, setAllRequests] = useState([]);
  const [currentJob, setCurrentJob] = useState(null);
  const [historyRequests, setHistoryRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null); // Για το pop-up
  const { email } = useParams();
  const navigate = useNavigate();

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
                onClick={() => navigate(`/babysitter-settings/${email}`)}
              >
                Edit Profile
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Middle Column */}
        <Grid item xs={12} md={4}>
          {/* Current Job */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Current Job
              </Typography>
              {currentJob ? (
                <Typography>
                  You are currently working for: {currentJob.parentName} <br />
                  Start Date:{" "}
                  {new Date(currentJob.startDate).toLocaleDateString()}
                </Typography>
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
                    <Typography variant="body1">
                      Start Date:{" "}
                      {new Date(request.startDate).toLocaleDateString()}
                    </Typography>
                    <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                      {["Pending", "Accepted"].includes(request.state) && (
                        <Button
                          variant="outlined"
                          onClick={() => handleOpenDetails(request)}
                        >
                          View Details
                        </Button>
                      )}
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
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography>No requests found.</Typography>
            )}
          </Grid>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              History
            </Typography>
            {historyRequests.length > 0 ? (
              historyRequests.map((request) => (
                <Card key={request.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="body1">
                      Parent Name: {request.parentName}
                    </Typography>
                    <Typography variant="body1">
                      Start Date:{" "}
                      {new Date(request.startDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body1">
                      Payment Status:{" "}
                      {request.payment === "true" ? "Accepted" : "Rejected"}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenDetails(request)}
                      sx={{ mt: 1 }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography>No history found.</Typography>
            )}
          </Paper>
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

export default BabysitterProfile;

