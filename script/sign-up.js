// Import necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArkJ39EwRfEaxIQKyBJ9GnZb11dM0Reis",
  authDomain: "fed2024asg2p04team8.firebaseapp.com",
  databaseURL: "https://fed2024asg2p04team8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fed2024asg2p04team8",
  storageBucket: "fed2024asg2p04team8.firebasestorage.app",
  messagingSenderId: "927003390866",
  appId: "1:927003390866:web:a41ff2f994bb3c045c074b",
  measurementId: "G-BXDFK2WDWR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

// Handle sign-up form submission
document.querySelector(".signup-btn").addEventListener("click", async (event) => {
  event.preventDefault(); // Prevent default form submission

  // Get user input
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const reenterPassword = document.getElementById("reenter-password").value;
  const username = document.getElementById("username").value; // New username input field

  // Validate inputs
  if (!email || !password || !username) {
    alert("Please fill in all fields.");
    return;
  }

  // Validate passwords match
  if (password !== reenterPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    // Create user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Add the user's profile to Firestore
    const userDocRef = doc(db, "users", user.uid); // Reference to Firestore document
    await setDoc(userDocRef, {
      username: username, // Use dynami c username
      email: email,
      followers: 0,
      following: 0,
      membership: "Regular", // Default membership
      twoFactorAuth: false, // Default 2FA setting
      faceID: false, // Default Face ID setting
      password: password,
    });

    alert(`User registered successfully with email: ${user.email}`);
    console.log("User created in Authentication and Firestore:", user);
  } catch (error) {
    // Handle errors
    console.error("Error during sign-up:", error);
    alert(`Error: ${error.message}`);
  }
});
