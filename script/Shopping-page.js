
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-analytics.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const productIDs = ['sports-shoes-container-api', 'basketball-api', 'computer-setup-api', 'kitchen-knife-api'];



document.getElementById('clear-clicked').addEventListener('click', function() {
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    
    radioButtons.forEach(function(radio) {
        radio.checked = false;
    });
});

document.getElementById("view-cart-clicked").addEventListener('click', function(){
    window.location.href = "/html/Checkout.html";
});




document.addEventListener("click", async function(event) {
    if (event.target.closest("button")) { 
        const clickedButton = event.target.closest("button"); 

        document.querySelectorAll("button").forEach(btn => btn.style.border = "");
    
        clickedButton.style.border = "2px solid grey";
        const clickedButtonID = clickedButton.id;
        console.log(`User clicked on: ${clickedButtonID}`);

        try {
            await setDoc(doc(db, "selectedItems", "userSelection"), { 
                selectedProduct: clickedButtonID 
            }, { merge: true });

            console.log(`Firestore updated: ${clickedButtonID} selected`);
        } catch (error) {
            console.error("Error updating Firestore:", error);
        }
    }
});