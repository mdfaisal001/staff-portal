

import React, {useEffect} from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SignUpPage from './pages/SignUpPage';
import {auth} from './firebase';
import {onAuthStateChanged} from 'firebase/auth';
import {Navigate, Outlet, useRoutes} from 'react-router-dom';

// ? Protected Routes
const ProtectedRoutes = () => {
  // ? Check if user is logged in
  const user = localStorage.getItem('user');

  return user ? <Outlet /> : <Navigate to="/" />;
};

// ? Homepage redirect
const HomeRedirect = () => {
  // ? Get user from local storage
  const shopUser = JSON.parse(localStorage.getItem('user'));

  console.log('shopUser:', shopUser);

  // ? Redirect based on user
  return shopUser ? <Navigate to="/dashboard" /> : <Outlet />;
};

const InternalPages = () => {
  useEffect(() => {
    // Firebase authentication state listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // ? Save logged in user local storage
      localStorage.setItem('user', JSON.stringify(currentUser));
    });

    // Cleanup the listener
    return () => unsubscribe();
  }, []);

  return useRoutes([
    {
      element: <HomeRedirect />,

      children: [
        {
          path: '/',
          element: <Login />,
        },
        {
          path: '/signup',
          element: <SignUpPage />,
        },
      ],
    },

    {
      element: <ProtectedRoutes />,

      children: [
        {
          path: '/dashboard',
          element: <Dashboard />,
        },
      ],
    },
  ]);
};

export default InternalPages;
