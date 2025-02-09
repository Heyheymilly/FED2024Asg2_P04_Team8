// ✅ Ensure Firebase is Loaded Before Initializing
if (typeof firebase === "undefined") {
    console.error("❌ Firebase SDK is missing. Check your HTML script order.");
} else {
    console.log("✅ Firebase Loaded Successfully");

    // ✅ Initialize Firebase (No `export` Needed)
    firebase.initializeApp({
        apiKey: "AIzaSyArkJ39EwRfEaxIQKyBJ9GnZb11dM0Reis",
        authDomain: "fed2024asg2p04team8.firebaseapp.com",
        databaseURL: "https://fed2024asg2p04team8-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "fed2024asg2p04team8",
        storageBucket: "fed2024asg2p04team8.appspot.com",
        messagingSenderId: "927003390866",
        appId: "1:927003390866:web:a41ff2f994bb3c045c074b",
        measurementId: "G-BXDFK2WDWR",
    });

    // ✅ Set Global Firebase Variables
    window.db = firebase.firestore();
    window.auth = firebase.auth();
}
