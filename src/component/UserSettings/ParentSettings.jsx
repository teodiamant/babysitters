import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../../config/firebase";
import { useParams } from "react-router-dom";

const ParentSettings = () => {
  const { email } = useParams(); // Get email from URL params
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    profilePicture: "",
  });
  const [documentId, setDocumentId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchParentData = async () => {
      try {
        const parentQuery = query(
          collection(FIREBASE_DB, "parents"),
          where("email", "==", email)
        );
        const parentSnapshot = await getDocs(parentQuery);

        if (!parentSnapshot.empty) {
          const parentDoc = parentSnapshot.docs[0];
          setFormData(parentDoc.data());
          setDocumentId(parentDoc.id); // Save the document ID
        } else {
          setError("Parent data not found.");
        }
      } catch (err) {
        console.error("Error fetching parent data:", err);
        setError("Failed to load parent data.");
      }
    };

    fetchParentData();
  }, [email]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage("");
    setError("");
    try {
      const docRef = doc(FIREBASE_DB, "parents", documentId);
      await updateDoc(docRef, formData);
      setSuccessMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 5,
        pb: 3,
        pt: 2,
        borderRadius: 2,
        boxShadow: 2,
        textAlign: "center",
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h5" sx={{ mb: 3 }}>
        Parent Settings
      </Typography>
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="First Name"
        name="firstName"
        value={formData.firstName}
        onChange={handleInputChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Last Name"
        name="lastName"
        value={formData.lastName}
        onChange={handleInputChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Typography variant="body1" sx={{ mb: 1 }}>
        Upload Profile Picture (Base64):
      </Typography>
      <TextField
        type="file"
        name="profilePicture"
        onChange={handleFileChange}
        InputProps={{ accept: "image/*" }}
        fullWidth
        sx={{ mb: 2 }}
      />
      {formData.profilePicture && (
        <Box
          component="img"
          src={formData.profilePicture}
          alt="Profile Preview"
          sx={{
            width: "100%",
            maxWidth: 200,
            borderRadius: "50%",
            mt: 2,
            border: "2px solid #004951",
          }}
        />
      )}

      <Button
        variant="contained"
        onClick={handleSave}
        sx={{ bgcolor: "#795e53", "&:hover": { bgcolor: "#4c3b34" }, mt: 3 }}
        fullWidth
        disabled={saving}
      >
        {saving ? <CircularProgress size={24} /> : "Save Changes"}
      </Button>
    </Container>
  );
};

export default ParentSettings;
