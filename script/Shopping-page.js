
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-analytics.js";
import { getFirestore, updateDoc, getDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
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


var clickedButtonID = "";

const productImages = {
    "sports-shoes-container-api": "/media/sports-shoes.png",
    "basketball-api": "/media/basketball.png",
    "computer-setup-api": "/media/computer-set.png",
    "kitchen-knife-api": "/media/kitchen-knife.png"
};

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
        clickedButtonID = clickedButton.id;
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


async function updateSelectedImage(clickedButtonID) {
    const selectedImageElement = document.querySelector("#selected-item-img-api img");
    
    if (selectedImageElement && productImages[clickedButtonID]) {
        selectedImageElement.src = productImages[clickedButtonID];
        console.log(`Image updated to: ${productImages[clickedButtonID]}`);

        // Save selected product in Firestore
        try {
            await setDoc(doc(db, "selectedItems", "userSelection"), {
                selectedProduct: clickedButtonID
            }, { merge: true });

            console.log(`Firestore updated: ${clickedButtonID} selected`);
        } catch (error) {
            console.error("Error updating Firestore:", error);
        }
    }
}

// Event Listener for Clicks on Product Buttons
document.addEventListener("click", async function(event) {
    if (event.target.closest("button")) { 
        const clickedButton = event.target.closest("button"); 
        clickedButtonID = clickedButton.id;

        if (productImages[clickedButtonID]) {
            updateSelectedImage(clickedButtonID);
        }
    }
});

// Add to Cart
const listingID = "8Ih0eoCr3DfTpiMI9TgU";

function getProductName(itemID) {
    const productNames = {
        "sports-shoes-container-api": "Sports Shoes",
        "basketball-api": "Basketball",
        "computer-setup-api": "Computer Setup",
        "kitchen-knife-api": "Kitchen Knife"
    };
    return productNames[itemID] || "Unknown Product"; // Default value
}

function getProductPrice(itemID) {
    const productPrices = {
        "sports-shoes-container-api": 69,
        "basketball-api": 40,
        "computer-setup-api": 1200,
        "kitchen-knife-api": 25
    };
    return productPrices[itemID] || 0;

}

let lastSelectedProductID = "";

document.addEventListener("click", function(event) {
    const clickedButton = event.target.closest("button");

    if (clickedButton && clickedButton.id !== "add-cart-clicked") { 
        lastSelectedProductID = clickedButton.id.trim().toLowerCase(); 
        console.log(`User selected product: ${lastSelectedProductID}`);
    }
});


async function updateCartCount() {
    const cartRef = doc(db, "listing", listingID);

    try {
        const cartSnap = await getDoc(cartRef);
        if (cartSnap.exists()) {
            const cartData = cartSnap.data();
            
            if (cartData.ItemsAdded && cartData.ItemsAdded.length > 0) {
                const totalQuantity = cartData.ItemsAdded.reduce((sum, item) => sum + (item.quantity || 0), 0);
                
                document.getElementById("cart-item-count-api").textContent = totalQuantity;
                console.log("Cart total quantity updated:", totalQuantity);
            } else {
                document.getElementById("cart-item-count-api").textContent = "0";
            }
        } else {
            document.getElementById("cart-item-count-api").textContent = "0";
        }
    } catch (error) {
        console.error("Error fetching cart count:", error);
    }
}

async function AddToCart() {

    if (!lastSelectedProductID) {
        console.error("No product selected before adding to cart.");
        return;
    }


    console.log(`Adding to cart: ${lastSelectedProductID}`);

    const cartRef = doc(db, "listing", listingID);

    try {
        const cartSnap = await getDoc(cartRef);
        let cartData = cartSnap.exists() ? cartSnap.data() : {};

        if (!cartData.ItemsAdded) {
            cartData.ItemsAdded = [];
        }

        let itemIndex = cartData.ItemsAdded.findIndex(item => item.id === lastSelectedProductID);

        if (itemIndex !== -1) {
            cartData.ItemsAdded[itemIndex].quantity += 1;
        } else {
            cartData.ItemsAdded.push({
                id: lastSelectedProductID,
                name: getProductName(lastSelectedProductID),
                price: getProductPrice(lastSelectedProductID),
                quantity: 1
            });
        }

        await setDoc(cartRef, { ItemsAdded: cartData.ItemsAdded }, { merge: true });

        console.log("Item successfully added to cart.");

        document.getElementById("cart-item-count-api").value = 

        updateCartCount();

        lastSelectedProductID = "";

    } catch (error) {
        console.error("Error adding to cart:", error);
    }
}


document.getElementById("add-cart-clicked").addEventListener('click', AddToCart);
document.addEventListener("DOMContentLoaded", updateCartCount);

