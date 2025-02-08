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

// Rewards per day
const dayRewards = [10, 20, 30, 40, 50, 60, 100];

// Function to get today's date as YYYY-MM-DD
function getTodayDate() {
    return new Date().toISOString().split("T")[0];
}

// Function to disable the claim button
function disableClaimButton() {
    let claimButton = document.getElementById("claim-reward-clicked");
    if (claimButton) {
        claimButton.textContent = "Claimed";
        claimButton.disabled = true;
        claimButton.style.backgroundColor = "grey";
        claimButton.style.cursor = "not-allowed";
        claimButton.style.color = "white";
        claimButton.style.border = "2px solid darkgray";
    }
}

// Function to fetch user data from Firestore
async function fetchUserData(uid) {
    try {
        const userRef = doc(db, "users", uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            let userData = userDoc.data();
            userData.points = userData.points || 0;
            userData.streakCount = userData.streakCount || 1;
            userData.lastClaimedDate = userData.lastClaimedDate || null;

            console.log("📢 Firestore Data Fetched:", userData);

            // 🔥 Update the coin count dynamically
            document.getElementById("coin-count").textContent = userData.points + " Coins";

            // ✅ Disable claim button if already claimed today
            if (userData.lastClaimedDate === getTodayDate()) {
                disableClaimButton();
            } else {
                let claimButton = document.getElementById("claim-reward-clicked");
                if (claimButton) {
                    claimButton.addEventListener("click", () => claimReward(uid));
                }
            }

        } else {
            console.log("🆕 New user detected! Initializing...");
            await updateDoc(userRef, {
                points: 0,
                streakCount: 1,
                lastClaimedDate: null
            });
            fetchUserData(uid);
        }
    } catch (error) {
        console.error("❌ Error Fetching User Data:", error);
    }
}

// Function to claim a reward
async function claimReward(uid) {
    let today = getTodayDate();
    const userRef = doc(db, "users", uid);

    // 🔥 Fetch latest Firestore data **right before allowing claim**
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
        console.log("⚠️ User not found in Firestore!");
        return;
    }

    let userData = userDoc.data();

    // 🚨 Final Check: Prevent multiple claims even if UI didn't update correctly
    if (userData.lastClaimedDate === today) {
        console.log("⚠️ Reward already claimed today!");
        disableClaimButton();
        return;
    }

    // Update streak (resets if a day is skipped)
    let newStreak = (userData.lastClaimedDate === getTodayDate()) ? userData.streakCount + 1 : 1;
    if (newStreak > 7) newStreak = 7;

    let earnedPoints = dayRewards[newStreak - 1];
    userData.points += earnedPoints;
    userData.streakCount = newStreak;
    userData.lastClaimedDate = today;

    // 🔥 Instantly update UI
    document.getElementById("coin-count").textContent = userData.points + " Coins";

    try {
        await updateDoc(userRef, {
            points: userData.points,
            streakCount: userData.streakCount,
            lastClaimedDate: userData.lastClaimedDate
        });

        console.log(`✅ Claimed Day ${newStreak} reward: ${earnedPoints} coins`);

        // ✅ Disable the claim button after claiming
        disableClaimButton();

    } catch (error) {
        console.error("❌ Error updating Firestore:", error);
    }
}

// Run the script
fetchUserData("YwKm4YUfPgXVqeClrLXs8C59F3o1");
