// Firebase Configuration - Atiq Super Store
// Firebase SDK is loaded via CDN in HTML files

const firebaseConfig = {
  apiKey: "AIzaSyDVqDrZFIv4hqypunTS9haw0aJVWe_6qvc",
  authDomain: "bq-store-95fd9.firebaseapp.com",
  projectId: "bq-store-95fd9",
  storageBucket: "bq-store-95fd9.firebasestorage.app",
  messagingSenderId: "827167333022",
  appId: "1:827167333022:web:d06b0a62dc7eb5fb70798f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get references to services (global)
const auth = firebase.auth();
const db = firebase.firestore();