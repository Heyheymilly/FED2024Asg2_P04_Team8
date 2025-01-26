const baseUrl = "https://679522c5aad755a134eb4ac2.mockapi.io/api/reward-point-system";
const userID = 1; // Set the user ID to fetch data for
const dayOfTheWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Points for each day of the week
const pointsForDays = {
    Monday: 10,
    Tuesday: 20,
    Wednesday: 30,
    Thursday: 40,
    Friday: 50,
    Saturday: 60,
    Sunday: 70,
};

function fetchUserData() {
    fetch(`${baseUrl}/Users/${userID}`)
        .then(response => response.json())
        .then(userData => {
            console.log('User data fetched:', userData);
            currentDayIndex = dayOfTheWeek.indexOf(userData.currentDay);
            updateUI(userData);
        })
        .catch(error => console.error(`Error fetching data: ${error}`));
}

// Update the user interface
function updateUI(user) {
    const { name, currentDay, currentPoints, pointsForToday } = user;

    document.getElementById('user-info').textContent = 
        `Username: ${name}, Current day: ${currentDay}, Current points: ${currentPoints}, Points for today: ${pointsForToday}`;
    document.getElementById('current-day-display').textContent = 
        `Today is: ${currentDay}`;
}

// Move to the next day
function moveToNextDay() {
    fetch(`${baseUrl}/Users/${userID}`)
        .then(response => response.json())
        .then(userData => {
            // Move to the next day
            currentDayIndex = (dayOfTheWeek.indexOf(userData.currentDay) + 1) % dayOfTheWeek.length;
            const newDay = dayOfTheWeek[currentDayIndex];
            const pointsForToday = pointsForDays[newDay];

            // Update MockAPI with the new day and points
            return fetch(`${baseUrl}/Users/${userID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...userData,
                    currentDay: newDay,
                    pointsForToday: pointsForToday,
                }),
            });
        })
        .then(response => response.json())
        .then(updatedData => {
            console.log('Day moved successfully:', updatedData);
            updateUI(updatedData);
        })
        .catch(error => console.error(`Error updating data: ${error}`));
}

// Collect the reward for the day
function collectReward() {
    fetch(`${baseUrl}/Users/${userID}`)
        .then(response => response.json())
        .then(userData => {
            const { currentPoints, pointsForToday } = userData;

            // Add today's points to the current points
            const updatedPoints = currentPoints + pointsForToday;

            // Update MockAPI with the new points
            return fetch(`${baseUrl}/Users/${userID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...userData,
                    currentPoints: updatedPoints,
                }),
            });
        })
        .then(response => response.json())
        .then(updatedData => {
            console.log('Reward collected successfully:', updatedData);
            updateUI(updatedData);
        })
        .catch(error => console.error(`Error collecting reward: ${error}`));
}

// // Event listeners for buttons
// document.getElementById('next-day-button').addEventListener('click', moveToNextDay);
// document.getElementById('click-for-reward').addEventListener('click', collectReward);

// // Fetch user data on page load
// fetchUserData();

// const baseUrl = "https://679522c5aad755a134eb4ac2.mockapi.io/api/reward-point-system";

// function fetchAllUsersData(){
//     fetch(`${baseUrl}/Users`)
//     .then(response => response.json())
//     .then(userData => {
//         console.log(`Fetched all user data ${userData}`);
//         userData.array.forEach(user => {
            
//         });
//     });
// }

// function UpdateUserDetailUI(){

// }