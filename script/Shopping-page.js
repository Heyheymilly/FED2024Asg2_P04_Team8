document.getElementById('clear-clicked').addEventListener('click', function() {
    // Get all radio buttons
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    
    // Loop through each radio button and uncheck it
    radioButtons.forEach(function(radio) {
        radio.checked = false;
    });
});