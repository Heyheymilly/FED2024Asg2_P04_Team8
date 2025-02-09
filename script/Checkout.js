
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
const db = getFirestore(app);

const userID = "IARIMHcZUjMSHMFNDzXC2mzY98l2";


async function LoadCoinBar() {
    const userRef = doc(db, "users", userID);

    try {
        const userSnap = await getDoc(userRef);

        if(userSnap.exists()) {
            const userData = userSnap.data();

            const userPoints = userData.points || "No points";

            const coinBarID = document.getElementById("coin-bar-api");

            coinBarID.textContent = userPoints;
            console.log(`points value retrieved: ${userPoints}`);

        } else {
            console.log("No userSnap for this user");
        }

    } catch(error) {
        console.error(`Error fetching user coins ${error}`)
    }
}
document.addEventListener("DOMContentLoaded", LoadCoinBar);


async function fetchUserLocation() {
    const userRef = doc(db, "users", userID);
    
    try {
        const userSnap = await getDoc(userRef);

        if(userSnap.exists()) {
            const userData = userSnap.data();

            const userLocation = userData.location || "No location set";
         
            document.getElementById("delivery-info-api").innerHTML = userLocation;
            console.log(`User location retrieved: ${userLocation}`);

        } else  {
            console.log("No location found for this user.");
        }
    } catch(error) {
        console.error("Error fetching user location", error);
    }
}

document.addEventListener("DOMContentLoaded", fetchUserLocation);

const listingID = "8Ih0eoCr3DfTpiMI9TgU";

async function retrieveCartItem() {
    const listRef = doc(db, "listing", listingID);

    const itemImgLinkDict = {
        'computer-setup-api' : '/media/computer-set.png',
        'basketball-api' : '/media/basketball.png',
        'kitchen-knife-api' : '/media/kitchen-knife.png',
        'sports-shoes-container-api' : '/media/sports-shoes.png'
    };

    try {
        const listSnap = await getDoc(listRef);

        if (listSnap.exists()) {
            const listData = listSnap.data();

            const totalQuantity = listData.ItemsAdded 
            ? listData.ItemsAdded.reduce((sum, item) => sum + (item.quantity || 0), 0)
            : 0;

            if (totalQuantity > 0) {
                const container = document.getElementById("item-column-container-api");

                document.getElementById("item-column-container-api").style.display= "block";
                
                listData.ItemsAdded.forEach(item => {
                    if (itemImgLinkDict[item.id]){
                            const itemDiv = document.createElement("div");
                            itemDiv.classList.add("item-column-css");

                            itemDiv.innerHTML =` 
                                <input type="checkbox" class="item-checkbox-api">
                                <div class="col-desc-css">
                                    <div class="name-image-css">
                                        <img src="${itemImgLinkDict[item.id]}" width="100" height="100" alt="${item.name}">
                                        <div class="inter">${item.name}</div>
                                    </div>
                                    
                                    <div class="voucher-css jaro">10% off</div>
                                    <div class="price-css inter" data-price="${item.price}">Price: $${item.price.toFixed(2)}
                                        <hr>
                                    </div>
                                    <div id="message-container-css">
                                        <button class="aoboshi-one-regular">Message for supplier</button>
                                    </div>

                                    <div><hr></div>

                                    <div class="aoboshi-one-regular" id="quantity-detail">
                                        <div class="inter">Order Quantity</div> 
                                        <div class="inter order-quantity-api" id="quantity-count-api">${item.quantity}</div>
                                    </div>
                                </div>
                            </div>`; // item to add inside the item-column-container

                            container.appendChild(itemDiv); // Append it as a child / nested around the
                        }
                    });

                    console.log("Cart item is successfully added!");


                    document.querySelector("item-column-css input")

                } else {
                    document.getElementById("item-column-container-api").style.display= "none";
                    return;
                    }
            }   else {
                    console.log(`No list data record`);
                }
    }   catch(error) {
            console.log(`error: ${error}`);
    }
}

document.addEventListener("DOMContentLoaded", retrieveCartItem);

async function PointDiscount() {

    const userRef = doc(db, "users", userID);
    
    try {
        const userSnap = await getDoc(userRef);
        
        if(userSnap.exists()) {

            const userData = userSnap.data();
            const availablePoints = userData.points || "0";

            let coinInput = parseInt(document.getElementById("coin-use-value-api").value) || 0;

            if(coinInput > availablePoints) {
                alert(`You have used ${coinInput - availablePoints} more than the points you currently have, please try again!`);
                return 0;
            }

            await updateDoc(userRef, { points: availablePoints - coinInput});

            const coinDiscount = coinInput / 100;

            console.log(`User used ${availablePoints - coinInput} coins for a discount.`);
            console.log(`User will receive $${coinDiscount} discount`);

            return coinDiscount;

        } else {
            console.log("No userSnap for this user");
            return 0;
        }

    } catch(error) {
        console.error(`Error fetching coin, no discount will be included; Error: ${error}`);
        return 0;
    }
}

async function updateTotalPrice() {

    const shippingCostPerItem = 5;
    let totalMerchandise = 0;
    let totalShippingPrice = 0;
    
    const check_checkbox = document.querySelectorAll(".item-checkbox-api");

    check_checkbox.forEach(checkBox => {
        if(checkBox.checked) {
            const itemDiv = checkBox.closest(".item-column-css");

            const price = parseFloat(itemDiv.querySelector(".price-css").dataset.price);
            const quantity = parseInt(itemDiv.querySelector(".order-quantity-api").textContent);

            totalMerchandise += price * quantity;
            totalShippingPrice += shippingCostPerItem * quantity;
        }
    });

    let totalPayment = totalMerchandise + totalShippingPrice;

    totalPayment = Math.max(totalPayment, 0);

    document.getElementById("merchandise-subtotal-api").textContent =  `$${totalMerchandise}`;
    document.getElementById("shipping-subtotal-api").textContent = `$${totalShippingPrice}`;
    document.getElementById("total-payment-api").textContent = `$${totalPayment}`;
}

async function applyCoinDiscount() {
    let coinDiscount = await PointDiscount();

    let totalPayment = parseFloat(document.getElementById("total-payment-api").textContent.replace("$",""));
    totalPayment -= coinDiscount;

    totalPayment = Math.max(totalPayment, 0);

    document.getElementById("coin-discount-api").textContent = `$${coinDiscount.toFixed(2)}`;
    document.getElementById("total-payment-api").textContent = `$${totalPayment.toFixed(2)}`;
}
document.getElementById("use-coin-clicked-api").addEventListener("click", applyCoinDiscount);


document.addEventListener("change", function(event){
    if(event.target.classList.contains("item-checkbox-api")) {
        updateTotalPrice();
    }
});

