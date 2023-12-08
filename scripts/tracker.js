// firebase.auth().onAuthStateChanged(user => {
//     if (user) {
//         currentUser = db.collection("users").doc(user.uid).collection("sleephistory");

//         currentUser.forEach((doc) => {
//         console.log(doc.id, doc.data());

//         }); // Go to the Firestore document of the user
//     };
// });

const addGoal = document.getElementById("Addbutton");
const addGoalPopup = document.getElementById("sleep-goal-popup");

const cancelButton = document.getElementById("cancel-goal");
const confirmButton = document.getElementById("add-goal");
const goalInput = document.getElementById("goal-input");
const goal = document.getElementById("goal");

addGoal.addEventListener("click", function () {
    addGoalPopup.style.display = "block";
});

cancelButton.addEventListener("click", function () {
    addGoalPopup.style.display = "none";
});

confirmButton.addEventListener("click", function () {
    addGoalPopup.style.display = "none";
    goal.placeholder = goalInput.value;
});

function displayhistoryDynamically() {
    let sleepTemplate = document.getElementById("sleepTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 

    firebase.auth().onAuthStateChanged(user => {

        if (user) {

            db.collection("users").doc(user.uid).collection("sleephistory").get()   //the collection called "hikes"
                .then(allSessions => {
                    //var i = 1;  //Optional: if you want to have a unique ID for each hike
                    allSessions.forEach(doc => { //iterate thru each doc
                        var date = doc.id;       // get value of the "name" key
                        var length = doc.data().sleeplength;  // get value of the "details" key
                        let newcard = sleepTemplate.content.cloneNode(true);
                        
                        //update title and text and image
                        newcard.querySelector('#date').innerHTML = date;
                        newcard.querySelector('#length').innerHTML = "Sleep length: " + length;

                        document.getElementById("dates-go-here").appendChild(newcard);

                    })
                })
        }
    })
}

displayhistoryDynamically();