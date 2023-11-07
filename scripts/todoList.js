const firebaseConfig = {
    apiKey: "AIzaSyBxhD1zOR93QED5tJgatsA_GVjLMCZeQr4",
    authDomain: "eepy-world.firebaseapp.com",
    projectId: "eepy-world",
    storageBucket: "eepy-world.appspot.com",
    messagingSenderId: "260046467348",
    appId: "1:260046467348:web:e4e5be404c4ea19fba9201"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const taskContent = document.querySelector(".item-content");
const addItem = document.querySelector(".new-item");
const listOfTasks = document.querySelector(".task-list");
var taskNum = 0;

function addTask() {
    taskNum++;
    let newTask = document.createElement("div");
    let taskText = taskContent.value;
    newTask.innerHTML = taskText;
    newTask.className = "task";
    taskContent.value = "";
    listOfTasks.appendChild(newTask);
    
    db.collection("users").doc("hdZ49Qd3r33c9sSlWl2e").collection("currentTasks").doc("task".concat(taskNum)).set({
        checked: false,
        description: String(taskText),
    })

    // db.collection("users").doc("hdZ49Qd3r33c9sSlWl2e").collection("currentTasks").doc("task0").set({
    //     checked: false,
    //     description: taskText,
    // })
}

addItem.addEventListener("click", addTask());
