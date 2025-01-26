// Import necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, onAuthStateChanged, updatePassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

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
const db = getFirestore(app); // Initialize Firestore

// Load user data once
async function loadUserData() {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const docRef = doc(db, "users", user.uid); // Firestore document reference
    const docSnap = await getDoc(docRef); // Get document snapshot

    if (docSnap.exists()) {
      const data = docSnap.data();
      // Update UI with Firestore data
      document.getElementById("username").value = data.username || "";
      document.getElementById("membership-plan").innerText = data.membership || "Regular";
      document.getElementById("two-factor-auth").checked = data.twoFactorAuth || false;
      document.getElementById("face-id").checked = data.faceID || false;
    } else {
      console.log("No such document in Firestore!");
    }
  } catch (error) {
    console.error("Error loading user data:", error);
  }
}

// Update Username
document.getElementById("update-username").addEventListener("click", async () => {
  try {
    const username = document.getElementById("username").value;
    const user = auth.currentUser;

    if (user) {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, { username });
      alert("Username updated successfully!");
    }
  } catch (error) {
    console.error("Error updating username:", error);
    alert("Failed to update username.");
  }
});

// Update Password
document.getElementById("update-password").addEventListener("click", async () => {
  try {
    const newPassword = document.getElementById("password").value;
    const user = auth.currentUser;

    if (user) {
      await updatePassword(user, newPassword);
      alert("Password updated successfully!");
    }
  } catch (error) {
    console.error("Error updating password:", error);
    alert("Failed to update password.");
  }
});

// Update Membership Plan
document.getElementById("update-plan").addEventListener("click", async () => {
  try {
    const user = auth.currentUser;

    if (user) {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, { membership: "Premium" });
      alert("Membership upgraded to Premium!");
      document.getElementById("membership-plan").innerText = "Premium";
    }
  } catch (error) {
    console.error("Error updating membership:", error);
    alert("Failed to update membership.");
  }
});

// Initialize and listen for authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadUserData(); // Load user data once
  } else {
    alert("Please log in to access your account settings.");
  }
});
