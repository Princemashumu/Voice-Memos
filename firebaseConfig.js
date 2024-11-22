// Import Firebase SDK modules
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"; // For file uploads and downloads

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCIYK60-qXsGs_7_XO9-KmSygzZ5wk6d8",
  authDomain: "voice-memos-2b296.firebaseapp.com",
  projectId: "voice-memos-2b296",
  storageBucket: "voice-memos-2b296.appspot.com",
  messagingSenderId: "492632608683",
  appId: "1:492632608683:web:50cad3db015949227c8cee",
  measurementId: "G-BJPXMSTZZ4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app); // Initialize Firebase Storage

export { app, storage }; // Export initialized app and storage for use in the project
