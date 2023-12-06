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


const day1 = document.getElementById("day-1");
const length1 = document.getElementById("length-1");
const day2 = document.getElementById("day-2");
const length2 = document.getElementById("length-2");
const day3 = document.getElementById("day-3");
const length3 = document.getElementById("length-3");
const day4 = document.getElementById("day-4");
const length4 = document.getElementById("length-4");

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = db.collection("users").doc(user.uid).collection("sleephistory");

        currentUser.doc("11.28.2023").get().then(userDoc => {
            day1.innerHTML = "Date: 11.28.2023";
            length1.innerHTML = "Sleep Length: " + userDoc.data().sleeplength;


        })

        currentUser.doc("11.29.2023").get().then(userDoc => {
            day2.innerHTML = "Date: 11.29.2023";
            length2.innerHTML = "Sleep Length: " + userDoc.data().sleeplength;
        })

        currentUser.doc("12.05.2023").get().then(userDoc => {

            day3.innerHTML = "Date: 12.05.2023";
            length3.innerHTML = "Sleep Length: " + userDoc.data().sleeplength;

        })

        currentUser.doc("12.06.2023").get().then(userDoc => {
            day4.innerHTML = "Date: 12.06.2023";
            length4.innerHTML = "Sleep Length: " + userDoc.data().sleeplength;

        })

    };
});