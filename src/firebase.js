// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration (replace with your own Firebase project details)
const firebaseConfig = {
  apiKey: "AIzaSyDk55rpz91I8E0zKo_T6wiAsz7bQn71_QY",
  authDomain: "my-dashboard-70c52.firebaseapp.com",
  projectId: "my-dashboard-70c52",
  storageBucket: "my-dashboard-70c52.firebasestorage.app",
  messagingSenderId: "1043226853532",
  appId: "1:1043226853532:web:e38a0cb528db754714ad59"
};

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(firebaseApp); // Firebase Authentication
export const firestore = getFirestore(firebaseApp); // Firestore Database

export default firebaseApp;

