// Import necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc 
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

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
const db = getFirestore(app); 

// Handle Sign-Up Button Click
document.getElementById("submit-clicked").addEventListener("click", async (event) => {
  event.preventDefault(); 

  // **Retrieve input values**
  const email = document.getElementById("emailPhoneNumber").value.trim();
  const password = document.getElementById("password").value.trim();
  const reenterPassword = document.getElementById("re-enter-password").value.trim();
  const username = email.split("@")[0]; // **Extract username from email (or add username input)**

  // **Validation Checks**
  if (!email || !password || !reenterPassword) {
    alert("Please fill in all fields.");
    return;
  }
  
  if (password !== reenterPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    // **Create user in Firebase Authentication**
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // **Generate Default User Data**
    const userData = {
      uid: user.uid,
      email: email,
      username: username,
      faceID: false,
      twoFactorAuth: false,
      lastClaimedDate: new Date().toISOString().split("T")[0], // **Today's Date**
      membership: "Regular",
      points: 0, // **Default points**
      streakCount: 1, // **Start at Day 1**
      password: password, // **⚠️ Storing passwords in Firestore is NOT recommended!**
    };

    // **Store user details in Firestore**
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, userData);

    alert(`✅ User registered successfully: ${user.email}`);
    console.log("🔥 User added to Firestore:", userData);

    // Redirect to homepage after signup
    window.location.href = "/home.html";

  } catch (error) {
    console.error("❌ Error during sign-up:", error);
    alert(`⚠️ Error: ${error.message}`);
  }
});
