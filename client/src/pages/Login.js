import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Login button clicked with email:', email);
    try {
      const res = await axios.post('https://6521-102-212-209-61.ngrok-free.app/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      const role = res.data.role;
      console.log('Login successful, role:', role);
      if (role === 'Admin') {
        navigate('/admin');
      } else if (role === 'FrontDesk') {
        navigate('/frontdesk');
      }  else if (role === 'Doctor') {
        navigate('/doctor');
      } else {
        console.error('Unknown role received:', role);
        navigate('/login');
      }
    } catch (err) {
      console.log('Login error:', err.response?.data);
      alert(err.response?.data?.msg || 'Login failed. Check your email and password.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit" style={{ marginTop: '10px' }}>Login</button>
      </form>
      <p style={{ marginTop: '10px' }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;