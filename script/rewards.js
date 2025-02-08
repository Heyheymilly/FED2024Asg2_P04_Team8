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

// Rewards for consecutive days
const dayRewards = [10, 20, 30, 40, 50, 60, 100]; // Rewards for Day 1 → Day 7

// Function to get today's date as YYYY-MM-DD
function getTodayDate() {
    return new Date().toISOString().split("T")[0]; // Returns 'YYYY-MM-DD'
}

// Function to highlight the correct day's box and update claim buttons
function highlightStreakDay(streakCount, lastClaimedDate) {
    const rewardBoxes = document.querySelectorAll(".rewards-grid .reward");
    let today = getTodayDate();

    rewardBoxes.forEach((reward, index) => {
        reward.classList.remove("active");  
        const button = reward.querySelector(".claim-btn");
        if (button) {
            button.style.display = "none"; 
            button.textContent = "Claim";
            button.classList.remove("claimed"); // Reset previous styles
            button.disabled = false; 
        }
    });

    let streakIndex = Math.max(Math.min(streakCount, 7) - 1, 0);

    if (streakIndex >= 0 && streakIndex < rewardBoxes.length) {
        rewardBoxes[streakIndex].classList.add("active");  
        const activeButton = rewardBoxes[streakIndex].querySelector(".claim-btn");

        if (activeButton) {
            activeButton.style.display = "block";  
            if (lastClaimedDate === today) {
                activeButton.textContent = "Claimed";
                activeButton.classList.add("claimed"); // Add a claimed class
                activeButton.disabled = true; 
                activeButton.style.backgroundColor = "grey";
                activeButton.style.cursor = "not-allowed";
                activeButton.style.color = "white";
                activeButton.style.border = "2px solid darkgray";
            }
        }
    }

    console.log(`Highlighting Day ${streakCount}, setting .active on reward box #${streakIndex + 1}`);
}

// Function to claim a reward
async function claimReward(uid, userData) {
    let today = getTodayDate();

    if (userData.lastClaimedDate === today) {
        console.log("Reward already claimed for today.");
        return;
    }

    let newStreak = (userData.lastClaimedDate === getYesterdayDate()) ? userData.streakCount + 1 : 1;
    if (newStreak > 7) newStreak = 7;

    let earnedPoints = dayRewards[newStreak - 1];
    userData.points += earnedPoints;
    userData.streakCount = newStreak;
    userData.lastClaimedDate = today;

    document.getElementById("coin-display").textContent = `${userData.points} points`;

    const userRef = doc(db, "users", uid);
    try {
        await updateDoc(userRef, {
            points: userData.points,
            streakCount: userData.streakCount,
            lastClaimedDate: userData.lastClaimedDate
        });

        console.log(`✅ Claimed Day ${newStreak} reward: ${earnedPoints} coins`);

        updateClaimButtonUI(newStreak);
    } catch (error) {
        console.error("❌ Error updating Firestore:", error);
    }

    highlightStreakDay(userData.streakCount, today);
    fetchUserData(uid);
}

// Function to update claim button UI after claiming
function updateClaimButtonUI(streakCount) {
    const rewardBoxes = document.querySelectorAll(".rewards-grid .reward");
    let streakIndex = Math.min(streakCount - 1, 6);

    const button = rewardBoxes[streakIndex]?.querySelector(".claim-btn");
    if (button) {
        button.textContent = "Claimed";
        button.classList.add("claimed"); 
        button.disabled = true;
        button.style.backgroundColor = "grey";
        button.style.cursor = "not-allowed";
        button.style.color = "white";
        button.style.border = "2px solid darkgray";
    }
}

// Function to fetch user data and attach event listeners
async function fetchUserData(uid) {
    try {
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            let userData = userDoc.data();

            userData.points = userData.points || 0;
            userData.streakCount = userData.streakCount || 1;
            userData.lastClaimedDate = userData.lastClaimedDate || null;

            console.log("📢 Firestore Data Fetched:", userData);

            document.getElementById("username").textContent = userData.username || "No username found";
            document.getElementById("coin-display").textContent = `${userData.points} points`;

            highlightStreakDay(userData.streakCount, userData.lastClaimedDate);

            document.querySelectorAll(".claim-btn").forEach((button, index) => {
                button.removeEventListener("click", handleClaimClick); 
                button.addEventListener("click", () => handleClaimClick(uid, userData, index + 1));
            });

        } else {
            console.log("🆕 New user detected! Initializing...");
            await updateDoc(userDocRef, {
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

// Event listener handler
function handleClaimClick(uid, userData, day) {
    console.log(`🟢 Claim button clicked for Day ${day}`);
    claimReward(uid, userData);
}

// Function to get yesterday's date as YYYY-MM-DD
function getYesterdayDate() {
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split("T")[0];
}

// Run the script
fetchUserData("YwKm4YUfPgXVqeClrLXs8C59F3o1");
