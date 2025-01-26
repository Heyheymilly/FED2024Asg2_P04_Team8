// Import necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Firebase configuration (replace with your Firebase project details)
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

// Handle login button click
const loginButton = document.querySelector(".login-btn");
loginButton.addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent form submission

    // Get email and password inputs
    const emailInput = document.getElementById("email").value;
    const passwordInput = document.getElementById("password").value;

    // Validate input fields
    if (!emailInput || !passwordInput) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        // Attempt to sign in with Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, emailInput, passwordInput);
        const user = userCredential.user;

        // Successful login
        alert(`Welcome back, ${user.email}!`);
        console.log("User logged in successfully:", user);

        // Redirect to another page (e.g., profile page)
        window.location.href = "profile.html";
    } catch (error) {
        // Handle errors during login
        console.error("Error logging in:", error);

        switch (error.code) {
            case "auth/user-not-found":
                alert("No account found with this email. Please check or sign up.");
                break;
            case "auth/wrong-password":
                alert("Incorrect password. Please try again.");
                break;
            case "auth/too-many-requests":
                alert("Too many login attempts. Please try again later.");
                break;
            default:
                alert("Login failed. Please try again later.");
        }
    }
});
