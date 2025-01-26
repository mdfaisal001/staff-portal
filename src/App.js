import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Students from './pages/Student';
import SignUpPage from './pages/SignUpPage';
import Sidebar from './pages/Sidebar';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    console.log("User logged out");
    // Clear user session
    auth.signOut();
    setUser(null);
    window.location.href = '/';
  };

  useEffect(() => {
    // Firebase authentication state listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup the listener
    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/SignUpPage" element={<SignUpPage />} />
        

        {/* Protected Routes */}
        <Route
          path="/Student"
          element={
            user ? (
              <div style={{ display: 'flex', height: '100vh' }}>
                <Sidebar onLogout={handleLogout} />
                <div style={{ flexGrow: 1, padding: '20px' }}>
                  <Students />
                </div>
              </div>
            ) : (
              <Login />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
