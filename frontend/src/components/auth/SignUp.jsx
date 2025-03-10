import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css'; // Asigură-te că ai importat fișierul CSS corect

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/auth/signup', { email, username, password });
      alert('Account created successfully!');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'Sign Up error');
    }
  };

  return (
    <div className="signup-container"> {/* Classă personalizată */}
      <form onSubmit={handleSignUp} className="signup-form"> {/* Classă personalizată pentru formular */}
        <h2>Create Account</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="signup-input"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="signup-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="signup-input"
          required
        />
        <button type="submit" className="signup-button">
          Sign Up
        </button>
        <p>
          Already have an account?{' '}
          <button className="login-button" onClick={() => navigate('/login')}>
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
