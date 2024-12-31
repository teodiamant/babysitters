import React, { useState, useEffect } from 'react';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function EditBabysitterProfile() {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const user = FIREBASE_AUTH.currentUser;
            if (!user) {
                navigate('/'); // Redirect to home if no user is logged in
                return;
            }

            try {
                const userDoc = await getDoc(doc(FIREBASE_DB, 'babysitters', user.uid));
                if (userDoc.exists()) {
                    setFormData(userDoc.data());
                } else {
                    console.error('No user data found.');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const user = FIREBASE_AUTH.currentUser;
            if (user) {
                const userDocRef = doc(FIREBASE_DB, 'babysitters', user.uid);
                await updateDoc(userDocRef, formData);
                alert('Profile updated successfully!');
                navigate('/profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <form onSubmit={handleSave}>
            <h1>Edit Babysitter Profile</h1>
            <div>
                <label>First Name:</label>
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName || ''}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label>Last Name:</label>
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName || ''}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label>Gender:</label>
                <input
                    type="text"
                    name="gender"
                    value={formData.gender || ''}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label>Phone Number:</label>
                <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber || ''}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label>Experience:</label>
                <input
                    type="number"
                    name="experience"
                    value={formData.experience || ''}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label>Bio:</label>
                <textarea
                    name="bio"
                    value={formData.bio || ''}
                    onChange={handleInputChange}
                />
            </div>
            <button type="submit">Save</button>
        </form>
    );
}
