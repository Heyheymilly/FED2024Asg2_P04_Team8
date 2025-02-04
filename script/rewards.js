// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";


// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyArkJ39EwRfEaxIQKyBJ9GnZb11dM0Reis",
    authDomain: "fed2024asg2p04team8.firebaseapp.com",
    projectId: "fed2024asg2p04team8",
    storageBucket: "fed2024asg2p04team8.firebasestorage.app",
    messagingSenderId: "927003390866",
    appId: "1:927003390866:web:a41ff2f994bb3c045c074b",
    measurementId: "G-BXDFK2WDWR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore


const dayRewardDict = {
    "Monday" : 10,
    "Tuesday" : 20,
    "Wednesday" : 30,
    "Thursday" : 20,
    "Friday" : 10,
    "Saturday" : 40,
    "Sunday" : 20
};

var today = "Monday";

function claimButtonClicked(id, userData) {
    if (userData.collectRewardCount < 1) {
        

        // Update local points and collectRewardCount
        userData.points += dayRewardDict[today];
        userData.collectRewardCount += 1;

        console.log(`Updated Points: ${userData.points}`);
        console.log(`Updated collectRewardCount: ${userData.collectRewardCount}`);

        // Update Firestore with both fields
        const userRef = doc(db, "users", id);
        updateDoc(userRef, {
            points: userData.points,
            collectRewardCount: userData.collectRewardCount
        })
        .then(() => {
            console.log("Points and collectRewardCount updated successfully in Firestore!");
        })
        .catch((error) => {
            console.error(`Error updating Firestore: ${error}`);
        });

        // Update points display in the DOM
        const coinDisplay = document.getElementById("coin-display");
        coinDisplay.textContent = `${userData.points} points` || "error";
    } 
    const button = document.getElementById("claim-btn");
        button.classList.add('clicked');
        button.disabled = true;
}

function Main(){


    async function fetchUserData(uid) {
        try {
            const userDocRef = doc(db, "users", uid); // Reference to the user document
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data(); // Retrieve user data
                console.log("User Data:", userData);

                // Update the username in the DOM
                const usernameElement = document.getElementById("username");
                usernameElement.textContent = userData.username || "No email found";
                const coinElement = document.getElementById("coin-display");
                coinElement.textContent = `${userData.points} points` || "0 points";

               document.getElementById("claim-btn").addEventListener('click', claimButtonClicked.bind(null, uid, userData))
                console.log(`RAN AND ${userData.collectRewardCount}`);

                
            } else {
                console.log(`No data found for user UID: ${uid}`);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }
    fetchUserData("YwKm4YUfPgXVqeClrLXs8C59F3o1");
}

Main();
