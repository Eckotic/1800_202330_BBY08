function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            console.log(user.uid); //print the uid in the browser console
            console.log(user.displayName);  //print the user name in the browser console
            var myArray = user.displayName.split(" ");
            var userName = myArray[0];

            //method #1:  insert with JS
            document.getElementById("name-goes-here").innerText = userName;

        } else {
            // No user is signed in.
        }
    });
}
getNameFromAuth(); //run the function

// Get the elements by their ID
var popupLink = document.getElementById("sleep-button");
var popupWindow = document.getElementById("popup-window");
var closeButton = document.getElementById("cancel-button");
var confirmButton = document.getElementById("confirm-button");
var ignoreButton = document.getElementById("ignore-popup");

var ignore = false;

// Show the pop-up window when the link is clicked
popupLink.addEventListener("click", function (event) {
    if (ignore == false) {
        event.preventDefault();
        popupWindow.style.display = "block";
    }   else {
        sleepMode();
    }
});
// Hide the pop-up window when the close button is clicked
closeButton.addEventListener("click", function () {
    popupWindow.style.display = "none";
});

confirmButton.addEventListener("click", function () {
    popupWindow.style.display = "none";
    if (ignoreButton.checked) {
        ignore = true;
    }
    sleepMode();
});

function sleepMode() {
    document.getElementById("overlay").style.display = "block";
    startStopwatch();
}

function off() {
    document.getElementById("overlay").style.display = "none";
    stopStopwatch();
}

var startTime; // to keep track of the start time
var stopwatchInterval; // to keep track of the interval
var elapsedPausedTime = 0; // to keep track of the elapsed time while stopped

function startStopwatch() {
  if (!stopwatchInterval) {
    startTime = new Date().getTime() - elapsedPausedTime; // get the starting time by subtracting the elapsed paused time from the current time
    stopwatchInterval = setInterval(updateStopwatch, 1000); // update every second
  }
}

function stopStopwatch() {
  clearInterval(stopwatchInterval); // stop the interval
  elapsedPausedTime = new Date().getTime() - startTime; // calculate elapsed paused time
  stopwatchInterval = null; // reset the interval variable
}

function updateStopwatch() {
    var currentTime = new Date().getTime(); // get current time in milliseconds
    var elapsedTime = currentTime - startTime; // calculate elapsed time in milliseconds
    var seconds = Math.floor(elapsedTime / 1000) % 60; // calculate seconds
    var minutes = Math.floor(elapsedTime / 1000 / 60) % 60; // calculate minutes
    var hours = Math.floor(elapsedTime / 1000 / 60 / 60); // calculate hours
    var displayTime = pad(hours) + ":" + pad(minutes) + ":" + pad(seconds); // format display time
    document.getElementById("sleep-button").innerText = displayTime; // update the display
}
  
  function pad(number) {
    // add a leading zero if the number is less than 10
    return (number < 10 ? "0" : "") + number;
  }