// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyArkJ39EwRfEaxIQKyBJ9GnZb11dM0Reis",
    authDomain: "fed2024asg2p04team8.firebaseapp.com",
    databaseURL: "https://fed2024asg2p04team8-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "fed2024asg2p04team8",
    storageBucket: "fed2024asg2p04team8.firebasestorage.app",
    messagingSenderId: "927003390866",
    appId: "1:927003390866:web:a41ff2f994bb3c045c074b",
    measurementId: "G-BXDFK2WDWR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Initialize the Realtime Database

function fetchUserData(uid) {
    const databaseReference = ref(database, `/users/${uid}`); // Use UID to build the database path

    get(databaseReference) // Fetch data from the database
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val(); // Retrieve user data
                console.log("User Data:", userData);

                // Update the username in the DOM
                document.getElementById("username").textContent = userData.username || "No username found";
            } else {
                console.log(`No data found for user UID: ${uid}`);
            }
        })
        .catch((error) => {
            console.error("Error fetching user data:", error);
        });
}

fetchUserData("YwKm4YUfPgXVqeClrLXs8C59F3o1");
