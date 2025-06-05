import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <button onClick={handleLogout} style={{ float: 'right', margin: '10px' }}>
       登出
    </button>
  );
}

export default LogoutButton;
