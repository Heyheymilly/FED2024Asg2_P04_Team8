// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyArkJ39EwRfEaxIQKyBJ9GnZb11dM0Reis",
    authDomain: "fed2024asg2p04team8.firebaseapp.com",
    projectId: "fed2024asg2p04team8",
    storageBucket: "fed2024asg2p04team8.appspot.com",
    messagingSenderId: "927003390866",
    appId: "1:927003390866:web:a41ff2f994bb3c045c074b",
    measurementId: "G-BXDFK2WDWR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// **🔥 Replace with dynamic user ID when authentication is implemented**
const USER_ID = "YwKm4YUfPgXVqeClrLXs8C59F3o1"; 

// **📌 Function to fetch user data & update coin counter**
async function fetchUserData() {
    try {
        const userRef = doc(db, "users", USER_ID);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            let userData = userDoc.data();
            let points = userData.points || 0; // Default to 0 if undefined

            console.log(`✅ Fetched User Coins: ${points}`);
            
            // Update the UI coin counter dynamically
            updateCoinCounter(points);

            // Attach event listener to claim button
            const claimButton = document.getElementById("claim-reward-clicked");
            if (claimButton) {
                claimButton.addEventListener("click", () => claimReward(userData));
            }
        } else {
            console.log("❌ User not found in Firebase.");
        }
    } catch (error) {
        console.error("❌ Error fetching user data:", error);
    }
}

// **📌 Function to update coin counter UI**
function updateCoinCounter(points) {
    const coinCounter = document.getElementById("coin-count");
    if (coinCounter) {
        coinCounter.textContent = points; 
    }
}

// **📌 Function to claim the reward & update Firebase**
async function claimReward(userData) {
    try {
        let newPoints = userData.points ? userData.points + 10 : 10; // Add 10 coins when claiming

        // Update UI instantly
        updateCoinCounter(newPoints);
        updateClaimButtonUI();

        // Update Firestore with new points
        const userRef = doc(db, "users", USER_ID);
        await updateDoc(userRef, { points: newPoints });

        console.log(`✅ Reward claimed. New coin count: ${newPoints}`);
    } catch (error) {
        console.error("❌ Error claiming reward:", error);
    }
}

// **📌 Function to update claim button UI after clicking**
function updateClaimButtonUI() {
    const claimButton = document.getElementById("claim-reward-clicked");
    if (claimButton) {
        claimButton.textContent = "Claimed!";
        claimButton.disabled = true;
        claimButton.style.backgroundColor = "grey"; 
        claimButton.style.cursor = "not-allowed";
        claimButton.style.color = "white";
        claimButton.style.border = "2px solid darkgray";
    }
}

// **🔥 Run Script on Page Load**
fetchUserData();
