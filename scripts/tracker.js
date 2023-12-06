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


firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = db.collection("users").doc(user.uid).collection("sleephistory").get();
        console.log(currentUser);
        

    }
})