import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';

const ConfirmDetails = ({ userData }) => (
    <div>
        <Typography variant="h6">Confirm your details</Typography>
        <Typography>{`Name: ${userData.firstName} ${userData.lastName}`}</Typography>
        <Typography>{`Email: ${userData.email}`}</Typography>
        <Typography>{`Address: ${userData.address}, ${userData.area}, ${userData.postalCode}`}</Typography>
        <Typography>{`AMKA: ${userData.amka}`}</Typography>
        <Typography>{`Extra Info: ${userData.extraInfo}`}</Typography>
        <Typography>{`Document Uploaded: ${userData.document ? 'Yes' : 'No'}`}</Typography>
        <Typography>{`Photo Uploaded: ${userData.photo ? 'Yes' : 'No'}`}</Typography>
    </div>
);

export default function Register() {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        birthDate: '',
        email: '',
        password: '',
        address: '',
        area: '',
        postalCode: '',
        amka: '',
        extraInfo: '',
        photo: null,
        document: null
    });
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleNext = () => {
        if (step === 2) {
            if (validateFormData()) {
                handleConfirmRegistration();
            } else {
                alert('Please fill all the required fields.');
            }
        } else {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        setUserData({ ...userData, [name]: files ? files[0] : value });
    };

    const handleConfirmRegistration = async () => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, userData.email, userData.password);
            console.log("Firebase Auth User created:", userCredential.user.uid);

            const userRef = doc(FIREBASE_DB, "users", userCredential.user.uid);
            const userInfo = {
                ...userData,
                documentUploaded: !!userData.document,
                photo: userData.photo ? `photos/${userData.photo.name}` : null
            };

            await setDoc(userRef, userInfo);
            console.log("User data saved to Firestore successfully!");
            navigate('/profile');
        } catch (error) {
            console.error("Error in user registration or data saving:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main">
            <Typography component="h1" variant="h5">Register</Typography>
            <form onSubmit={(e) => e.preventDefault()}>
                {step === 0 && (
                    <>
                        <TextField label="First Name" name="firstName" value={userData.firstName} onChange={handleChange} required />
                        <TextField label="Last Name" name="lastName" value={userData.lastName} onChange={handleChange} required />
                        <TextField label="Email" type="email" name="email" value={userData.email} onChange={handleChange} required />
                        <TextField label="Password" type="password" name="password" value={userData.password} onChange={handleChange} required />
                        <TextField label="Address" name="address" value={userData.address} onChange={handleChange} required />
                        <TextField label="Area" name="area" value={userData.area} onChange={handleChange} required />
                        <TextField label="Postal Code" name="postalCode" value={userData.postalCode} onChange={handleChange} required />
                        <TextField label="AMKA" name="amka" value={userData.amka} onChange={handleChange} required />
                    </>
                )}
                {step === 1 && (
                    <>
                        <TextField label="Extra Information" name="extraInfo" value={userData.extraInfo} onChange={handleChange} multiline rows={4} />
                        <TextField type="file" name="document" onChange={handleChange} inputProps={{ accept: "application/pdf" }} />
                        <TextField type="file" name="photo" onChange={handleChange} inputProps={{ accept: "image/*" }} />
                    </>
                )}
                {step === 2 && <ConfirmDetails userData={userData} />}
                <Button onClick={handleBack} disabled={step === 0}>Back</Button>
                <Button onClick={handleNext}>
                    {step === 2 ? 'Confirm & Register' : 'Next'}
                </Button>
                {loading && <CircularProgress />}
            </form>
        </Container>
    );
}

