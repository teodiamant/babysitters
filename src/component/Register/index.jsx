import React, { useState } from 'react';
import './index.css'
import { FIREBASE_AUTH } from '../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // Add this import

export default function Register(){

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  async function SignUp(event) {
    event.preventDefault(); // Prevent default form submission
    
    setLoading(true);

    // Client-side validation
    if (!email || !password) {
      alert('Please fill in all fields.');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      alert('Password should be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      console.log('User registered:', res.user);
      navigate('/'); // Redirect on success
    } catch (error) {
      // User-friendly error handling
      if (error.code === 'auth/email-already-in-use') {
        alert('This email is already in use.');
      } else if (error.code === 'auth/weak-password') {
        alert('Password should be at least 6 characters long.');
      } else {
        alert('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }
  

  return (
    <div className="register">
      <form onSubmit={SignUp} className="register-container">
        <h2>Register</h2>
        <div className="register-row">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="register-row">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating user...' : 'Register'}
        </button>
        <a href="/">Already have an Account?</a>
      </form>
    </div>
  );
}