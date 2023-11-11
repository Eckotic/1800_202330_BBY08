const taskContent = document.getElementById("item-content");
const addItem = document.getElementById("new-item");
const listOfTasks = document.getElementById("task-list");

const user = db.collection("users").doc("hdZ49Qd3r33c9sSlWl2e");
const taskList = user.collection("currentTasks");

// get task docs from firebase and print them all
function printTaskList() {

    //get all of the current tasks
    taskList.get().then((querySnapshot) => {

        //iterates through each task
        querySnapshot.forEach((doc) => {

            //get the description of the task
            let description = doc.data().description;

            //creates new html <li> element
            //with the task description in the innerHTML
            let newTask = document.createElement("li");
            newTask.innerHTML = description;
            newTask.className = "task";
            listOfTasks.appendChild(newTask);
        })
    })
}

printTaskList();

function addTask() {

    let taskDescription = taskContent.value;

    if (taskDescription == "") {
        return;
    }

    user.get().then(doc => {

        let taskNumber = doc.data().taskNumber;

        user.update({
            taskNumber: taskNumber + 1
        });

        ++taskNumber;

        taskList.doc("task".concat(taskNumber)).set({
            checked: false,
            description: taskDescription,
        });

        let newTask = document.createElement("li");
        newTask.innerHTML = taskDescription;
        newTask.className = "task";
        listOfTasks.appendChild(newTask);
        taskContent.value = "";

    });

}

addItem.addEventListener("click", addTask);

function deleteTask() {
    //delete seleceted task or smthng lol
}