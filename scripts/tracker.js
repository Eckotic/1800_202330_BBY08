//Get all elements by id
const addGoal = document.getElementById("Addbutton");
const addGoalPopup = document.getElementById("sleep-goal-popup");

const cancelButton = document.getElementById("cancel-goal");
const confirmButton = document.getElementById("add-goal");
const goalInput = document.getElementById("goal-input");
const goal = document.getElementById("goal");

//Display sleep goal window
addGoal.addEventListener("click", function () {
    addGoalPopup.style.display = "block";
});

//Close sleep goal window
cancelButton.addEventListener("click", function () {
    addGoalPopup.style.display = "none";
});

//Close sleep goal window and change placeholder to user's new sleep goal
confirmButton.addEventListener("click", function () {
    addGoalPopup.style.display = "none";
    goal.placeholder = goalInput.value;
});

//Display all of the user's sleep history
function displayhistoryDynamically() {
    let sleepTemplate = document.getElementById("sleepTemplate");

    firebase.auth().onAuthStateChanged(user => {

        if (user) {

            db.collection("users").doc(user.uid).collection("sleephistory").get() 
                .then(allSessions => {

                    allSessions.forEach(doc => {
                        var date = doc.id;  
                        var length = doc.data().sleeplength; 
                        let newcard = sleepTemplate.content.cloneNode(true);
                        
                        newcard.querySelector('#date').innerHTML = date;
                        newcard.querySelector('#length').innerHTML = "Sleep length: " + length;

                        document.getElementById("dates-go-here").appendChild(newcard);

                    })
                })
        }
    })
}

displayhistoryDynamically(); //run the function