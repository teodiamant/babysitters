import React, { useEffect, useState, useCallback } from 'react';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const [email, setEmail] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [amka, setAmka] = useState('');
    const [firstName, setFirstName] = useState('');
    const [age, setAge] = useState('');
    const [formMessage, setFormMessage] = useState('');
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            if (user) {
                setEmail(user.email);
                setUserId(user.uid);
            } else {
                setEmail(null);
                setUserId(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const fetchUserData = useCallback(async () => {
        if (!userId) return; // Early exit if userId is not set
        try {
            const q = query(collection(FIREBASE_DB, 'user'), where('userId', '==', userId));
            const querySnapshot = await getDocs(q);
            const users = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUserData(users);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }, [userId]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const handleLogout = async () => {
        try {
            await signOut(FIREBASE_AUTH);
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormMessage('');

        try {
            const payload = {
                amka,
                firstName,
                age: parseInt(age, 10),
                userId,
                createdAt: new Date(),
            };

            await addDoc(collection(FIREBASE_DB, 'user'), payload);
            setFormMessage('Data submitted successfully!');
            setAmka('');
            setFirstName('');
            setAge('');
            fetchUserData(); // Refresh user data after submission
        } catch (error) {
            console.error('Error adding document:', error);
            setFormMessage('Error submitting data. Please try again.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='profile'>
            <h1>Welcome</h1>
            {email ? <p>Your email: {email}</p> : <p>No user logged in</p>}
            <button onClick={handleLogout}>Logout</button>
            <h2>Submit User Data</h2>
            <form onSubmit={handleFormSubmit} className="data-form">
                <div className="form-row">
                    <label>AMKA:</label>
                    <input
                        type="number"
                        value={amka}
                        onChange={(e) => setAmka(e.target.value)}
                        required
                    />
                </div>
                <div className="form-row">
                    <label>First Name:</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-row">
                    <label>Age:</label>
                    <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
                {formMessage && <p>{formMessage}</p>}
            </form>
            <h2>User Data</h2>
            {userData.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>AMKA</th>
                            <th>First Name</th>
                            <th>Age</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userData.map((user) => (
                            <tr key={user.id}>
                                <td>{user.amka}</td>
                                <td>{user.firstName}</td>
                                <td>{user.age}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No user data found</p>
            )}
        </div>
    );
}
