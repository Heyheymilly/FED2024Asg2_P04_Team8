import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyArkJ39EwRfEaxIQKyBJ9GnZb11dM0Reis",
    authDomain: "fed2024asg2p04team8.firebaseapp.com",
    databaseURL: "https://fed2024asg2p04team8-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "fed2024asg2p04team8",
    storageBucket: "fed2024asg2p04team8.appspot.com",
    messagingSenderId: "927003390866",
    appId: "1:927003390866:web:a41ff2f994bb3c045c074b",
    measurementId: "G-BXDFK2WDWR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM fully loaded and parsed");

    const loginButton = document.getElementById("submit-clicked");
    const lottieContainer = document.getElementById("lottie-animation");

    if (!loginButton) {
        console.error("❌ Login button not found!");
        return;
    }

    // ✅ Initialize Lottie
    const animation = lottie.loadAnimation({
        container: lottieContainer, // The HTML container where animation will run
        renderer: "svg",
        loop: true,
        autoplay: false,
        path: "https://lottie.host/6b9e8e0d-e082-406c-8d8f-b311c6bae4eb/qDwEoq7EsD.lottie", // Replace with your own animation URL
    });

    loginButton.addEventListener("click", async (event) => {
        event.preventDefault();
        console.log("✅ Login button clicked!");

        const emailInput = document.getElementById("email").value.trim();
        const passwordInput = document.getElementById("password").value.trim();

        if (!emailInput || !passwordInput) {
            alert("⚠️ Please fill in all fields.");
            return;
        }

        // ✅ Show Lottie Animation
        lottieContainer.style.display = "block";
        animation.play();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, emailInput, passwordInput);
            const user = userCredential.user;
            alert(`🎉 Welcome back, ${user.email}!`);
            console.log("✅ User logged in successfully:", user);

            // ✅ Hide Lottie Animation on success
            animation.stop();
            lottieContainer.style.display = "none";

            // ✅ Redirect to home page
            window.location.href = "home-page.html";
        } catch (error) {
            console.error("❌ Error logging in:", error);
            alert(error.message);

            // ✅ Stop & Hide Lottie Animation on failure
            animation.stop();
            lottieContainer.style.display = "none";
        }
    });
});
