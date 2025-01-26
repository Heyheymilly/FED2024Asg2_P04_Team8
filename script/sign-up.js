// Import necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Firebase configuration (replace this with your Firebase project configuration)
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

// Handle sign-up form submission
document.querySelector(".signup-btn").addEventListener("click", async (event) => {
  event.preventDefault(); // Prevent default form submission

  // Get user input
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const reenterPassword = document.getElementById("reenter-password").value;

  // Validate passwords match
  if (password !== reenterPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    // Create user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    alert(`User registered successfully with email: ${user.email}`);
    console.log("User created:", user);
  } catch (error) {
    // Handle errors
    console.error("Error during sign-up:", error);
    alert(`Error: ${error.message}`);
  }
});
