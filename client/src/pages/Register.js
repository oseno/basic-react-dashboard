import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('FrontDesk');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('Register button clicked with email:', email, 'role:', role, 'payload:', { email, password, role });
    try {
      console.log('Sending registration request to: https://6521-102-212-209-61.ngrok-free.app/api/auth/register');
      const res = await axios.post('https://6521-102-212-209-61.ngrok-free.app/api/auth/register', { email, password, role });
      console.log('Registration response:', res.data);
      localStorage.setItem('token', res.data.token);
      const userRole = res.data.role;
      console.log('Registration successful, role:', userRole);
      if (userRole === 'Admin') {
        navigate('/admin');
      } else if (userRole === 'FrontDesk') {
        navigate('/frontdesk');
      } else if (userRole === 'Doctor') {
        navigate('/doctor');
      } 
      else {
        console.error('Unknown role received:', userRole);
        navigate('/login');
      }
    } catch (err) {
      console.log('Registration error details:', err.response?.data, 'Status:', err.response?.status, 'Full error:', err);
      alert(err.response?.data?.msg || 'Registration failed. Email may already be in use or role is invalid.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Role: </label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="FrontDesk">Front Desk</option>
            <option value="Admin">Admin</option>
            <option value="Doctor">Doctor</option>
          </select>
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>Register</button>
      </form>
      <p style={{ marginTop: '10px' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;