


import React from 'react';
import Sidebar from './Sidebar';
import StudentPage from './Student';
import {auth} from '../firebase';

const Dashboard = () => {
  const handleLogout = () => {
    console.log('User logged out');

    // Clear user session
    auth.signOut();

    // Remove user from local storage
    localStorage.removeItem('user');

    // Redirect to login page
    window.location.href = '/';
  };

  return (
    <div style={{display: 'flex', height: '100vh'}}>
      <Sidebar onLogout={handleLogout} />

      <div style={{flexGrow: 1, padding: '20px'}}>
        <StudentPage />
      </div>
    </div>
  );
};

export default Dashboard;
