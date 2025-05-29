import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{ background: '#333', color: 'white', padding: '10px' }}>
      <h1>Doctor's Office Dashboard</h1>
      {token && <button onClick={handleLogout} style={{ float: 'right' }}>Logout</button>}
    </nav>
  );
};

export default Navbar;