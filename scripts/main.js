function insertNameFromFirestore() {
    // Check if the user is logged in:
    firebase.auth().onAuthStateChanged(user => {
        if (user) {

            console.log(user.uid); // Let's know who the logged-in user is by logging their UID
            currentUser = db.collection("users").doc(user.uid); // Go to the Firestore document of the user
            currentUser.get().then(userDoc => {
                // Get the user name
                var userName = userDoc.data().name;
                console.log(userName);
                //$("#name-goes-here").text(userName); // jQuery
                var myArray = userName.split(" ");
                document.getElementById("name-goes-here").innerText = myArray[0];
            })

        } else {
            // No user is signed in.
        }
    })
}

insertNameFromFirestore()

function createUserDB(){
    firebase.auth().onAuthStateChanged(user =>{

        if (user){

            let doc = db.collection("users").doc(user.uid);

            doc.get().then( DOC => {
                if (!DOC.exists){
                    console.log("DOES NOT EXIST");
                    doc.set({
                        name: user.displayName,
                        resources: 50
                    });
                    doc.collection("game").doc("farmerCat").set({
                        power: 50,
                        health: 50
                    });
                }
                else{
                    console.log("exists")
                }
            });

            
        }

    });
}

createUserDB();

// Get the elements by their ID
var popupLink = document.getElementById("sleep-button");
var popupWindow = document.getElementById("sleep-popup");
var closeSleepButton = document.getElementById("cancel-sleep-button");
var confirmButton = document.getElementById("confirm-sleep-button");
var ignoreButton1 = document.getElementById("ignore-sleep-popup");
var sessionWindow = document.getElementById("session-popup");
var closeSessionButton = document.getElementById("close-window");
var sleepLogButton = document.getElementById("sleep-log");
var sleepGameButton = document.getElementById("sleep-game");

var endSleepWindow = document.getElementById("end-sleep-popup");
var endSession = document.getElementById("end-session");
var confirmSessionButton = document.getElementById("confirm-end-sleep-button");
var cancelSessionButton = document.getElementById("cancel-end-sleep-button");
var ignoreButton2 = document.getElementById("ignore-end-sleep-popup");

var ignore1 = false;
var ignore2 = false;

sleepLogButton.addEventListener("click", function () {
    sessionWindow.style.display = "none";
});

sleepGameButton.addEventListener("click", function () {
    sessionWindow.style.display = "none";
});

closeSessionButton.addEventListener("click", function () {
    sessionWindow.style.display = "none";
});



// Show the pop-up window when the link is clicked
popupLink.addEventListener("click", function (event) {
    if (ignore1 == false) {
        event.preventDefault();
        popupWindow.style.display = "block";
    } else {
        sleepMode();
    }
});
// Hide the pop-up window when the close button is clicked
closeSleepButton.addEventListener("click", function () {
    popupWindow.style.display = "none";
});

confirmButton.addEventListener("click", function () {
    popupWindow.style.display = "none";
    if (ignoreButton1.checked) {
        ignore1 = true;
    }
    sleepMode();
});

endSession.addEventListener("click", function (event) {
    if (ignore2 == false) {
        event.preventDefault();
        endSleepWindow.style.display = "block";
    } else {
        off();
    }

    const sleepTime = displayTime.split(":");
    const sleepMinutes = sleepTime[1];

    if (sleepMinutes < 20) {
        let sessionWarning = document.getElementById("session-warning");
        sessionWarning.style.display = "block";
        sessionWarning.innerHTML = "Sessions less than 30 minutes will not be logged!"
    }
});

confirmSessionButton.addEventListener("click", function () {
    endSleepWindow.style.display = "none";
    if (ignoreButton2.checked) {
        ignore2 = true;
    }
    off();
})

cancelSessionButton.addEventListener("click", function () {
    endSleepWindow.style.display = "none";
})

function sleepMode() {
    document.getElementById("overlay").style.display = "block";
    startStopwatch();
}

function off() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("sleep-button").innerHTML = "Sleep";
    stopStopwatch();
    finishSession();
    sleepSession();
}

var startTime; // to keep track of the start time
var stopwatchInterval; // to keep track of the interval
var elapsedPausedTime = 0; // to keep track of the elapsed time while stopped
var displayTime // the time of sleep

let startDate;
let endDate;

function startStopwatch() {
    if (!stopwatchInterval) {
        startTime = new Date().getTime() - elapsedPausedTime; // get the starting time by subtracting the elapsed paused time from the current time
        stopwatchInterval = setInterval(updateStopwatch, 1000); // update every second
    }

    const date = new Date();

    let currentDay = String(date.getDate()).padStart(2, '0');

    let currentMonth = String(date.getMonth() + 1).padStart(2, "0");

    let currentYear = date.getFullYear();

    // we will display the date as MM.DD.YYYY 

    startDate = `${currentMonth}.${currentDay}.${currentYear}`; 

}

function stopStopwatch() {
    clearInterval(stopwatchInterval); // stop the interval
    elapsedPausedTime = new Date().getTime() - startTime; // calculate elapsed paused time
    stopwatchInterval = null; // reset the interval variable
    elapsedPausedTime = 0;
}

function updateStopwatch() {
    var currentTime = new Date().getTime(); // get current time in milliseconds
    var elapsedTime = currentTime - startTime; // calculate elapsed time in milliseconds
    var seconds = Math.floor(elapsedTime / 1000) % 60; // calculate seconds
    var minutes = Math.floor(elapsedTime / 1000 / 60) % 60; // calculate minutes
    var hours = Math.floor(elapsedTime / 1000 / 60 / 60); // calculate hours
    displayTime = pad(hours) + ":" + pad(minutes) + ":" + pad(seconds); // format display time
    document.getElementById("sleep-button").innerText = displayTime; // update the display
}

function pad(number) {
    // add a leading zero if the number is less than 10
    return (number < 10 ? "0" : "") + number;
}

function finishSession() {

    // Date object
    const date = new Date();

    let currentDay = String(date.getDate()).padStart(2, '0');

    let currentMonth = String(date.getMonth() + 1).padStart(2, "0");

    let currentYear = date.getFullYear();

    // we will display the date as MM.DD.YYYY 

    endDate = `${currentMonth}.${currentDay}.${currentYear}`;

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(user.uid); // Let's know who the logged-in user is by logging their UID
            currentUser = db.collection("users").doc(user.uid).collection("sleephistory").doc(endDate).set({
                sleeplength: displayTime
            }); // Go to the Firestore document of the user

        }
    })

    console.log("sleep logged!")

}

function sleepSession() {

    sessionWindow.style.display = "block";

    const sleepTime = displayTime.split(":");

    const sleepMinutes = sleepTime[1];
    const sleepHours = sleepTime[0];

    document.getElementById("start-date").innerHTML = "Sleep Date Start: " + startDate;
    document.getElementById("end-date").innerHTML = "Sleep Date End: " + endDate;
    document.getElementById("sleep-length").innerHTML = "Length of Sleep: " + sleepHours + " Hours, " + sleepMinutes + " Minutes ";

}