let timeLeft = 60;
let timerInterval;

document.getElementById("startButton").addEventListener("click", function() {
    document.getElementById("startButton").style.display = "none"; // Hide the start button
    document.getElementById("content").style.display = "block"; // Show the question content after countdown starts

    // Start countdown
    timerInterval = setInterval(function() {
        timeLeft--;
        document.getElementById("timer").textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            document.getElementById("content").style.display = "none"; // Hide the content when time is up
            document.getElementById("timeUpMessage").style.display = "block"; // Show the time-up message
            document.getElementById("submitButton").style.display = "block"; // Show the submit button
        }
    }, 1000);
});
