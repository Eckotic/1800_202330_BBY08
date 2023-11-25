const taskContent = document.getElementById("item-content");
const addItem = document.getElementById("new-item");
const listOfTasks = document.getElementById("task-list");

const user = db.collection("users").doc("hdZ49Qd3r33c9sSlWl2e");
console.log(user);
const taskList = user.collection("currentTasks");;

function createTask(description, checked) {
    //create new <li> element
    let newTask = document.createElement("li");
    //give the <li> element the class task
    newTask.className = "task";
    newTask.innerHTML = "<div class='task-content'>" + description + "</div>";

    //create checked/unchecked
    let checkedTask = document.createElement("div");
    checkedTask.className = 'material-symbols-outlined checkedTask';

    if (!checked) {
        newTask.style.filter = "brightness(100%)";
        checkedTask.innerHTML = "radio_button_unchecked";
    } else {
        newTask.style.filter = "brightness(20%)";
        checkedTask.innerHTML = "radio_button_checked";
    }

    newTask.insertBefore(checkedTask, newTask.children[0]);

    // let editTask = document.createElement("div");
    // editTask.className = 'material-symbols-outlined editTask';
    // editTask.innerHTML = "edit";
    // newTask.appendChild(editTask);

    //creates delete icon
    //adds it to task
    let deleteX = document.createElement("div");
    deleteX.className = 'material-symbols-outlined deleteTask';
    deleteX.innerHTML = "delete";
    newTask.appendChild(deleteX);


    //add the <li> to listOfTasks
    listOfTasks.appendChild(newTask);
}

async function isTaskListEmpty() {
    let count = 0;
    const querySnapshot = await taskList.get();

    querySnapshot.forEach(doc => {
        count++;
    })

    if (count < 1 && document.getElementById("noTasks") == null) {
        let newTask = document.createElement("li");
        newTask.innerHTML = "You have no tasks!";
        //give the <li> element the class task
        newTask.setAttribute('id', 'noTasks');
        listOfTasks.appendChild(newTask);
    }
}

// get task docs from firebase and print them all
function printTaskList() {
    isTaskListEmpty();
    //get all of the current taskss
    taskList.get().then(querySnapshot => {

        //iterates through each task
        querySnapshot.forEach(doc => {

            //get the description of the task
            let description = doc.data().description;
            let checked = doc.data().checked;

            //creates new html <li> element
            //with the task description in the innerHTML
            createTask(description, checked);
        })
    });
}
printTaskList();

async function addTask() {
    // gets the string inside taskContent
    let taskDescription = taskContent.value;

    // early return to not allow user to input an empty value
    if (taskDescription == "") {
        // should add message telling user to input text
        return;
    }

    // gets taskNumber
    const doc = await user.get();
    let taskNumber = doc.data().taskNumber;

    // increments taskNumber
    await user.update({
        taskNumber: taskNumber + 1
    })
    taskNumber++

    // creates new task in the firebase
    await taskList.doc("task".concat(taskNumber)).set({
        checked: false,
        description: taskDescription
    });

    // creates new task in the html
    createTask(taskDescription);
    // empties the textbox
    taskContent.value = "";

    // deletes the default message in the situation where no tasks exist
    try {
        document.getElementById("noTasks").remove();
    } catch {
        console.log("ELEMENT WITH 'noTask' ID DOES NOT EXIST");
    }
}
addItem.addEventListener("click", addTask);

// this not working cuz i be assigning two events to a single object
// function completeTask() {
//     listOfTasks.onclick = (event => {
//         console.log(event.target.classList.contains("checkedTask"))
//         if (event.target.classList.contains("checkedTask")) {

//             // finds where the delete and edit icons are
//             let styleIndex = event.target.parentElement.innerHTML.indexOf('<div class="material-symbols-outlined deleteTask">');
//             // gets only the checked icon and task description
//             let taskDescription = event.target.parentElement.innerHTML.substring(0, styleIndex);

//             // removes checked icon
//             taskDescription = taskDescription.replace('<div class="material-symbols-outlined checkedTask">', '');
//             taskDescription = taskDescription.replace('d</div>');

//             // gets only the task description; gets rid of the div wrapping around it
//             styleIndex = taskDescription.indexOf('>');
//             taskDescription = taskDescription.substring(styleIndex + 1);
//             styleIndex = taskDescription.indexOf('<');
//             taskDescription = taskDescription.substring(0, styleIndex);

//             taskList.get().then(querySnapshot => {
//                 querySnapshot.forEach(doc => {
//                     if (doc.data().description == taskDescription) {
//                         // variable is named 'c' for now, change later
//                         let c = doc.data().checked;
//                         console.log(c);
//                     }
//                 });
//             });
//         }
//         isTaskListEmpty();
//     });
// }
// listOfTasks.addEventListener("click", completeTask);

function taskActions() {
    listOfTasks.onclick = (event => {
        console.log("delete: ", event.target.classList.contains("deleteTask"));
        console.log("check: ", event.target.classList.contains("checkedTask"))
        if (event.target.classList.contains("deleteTask")) {
            // removes task from the hmtl
            event.target.parentElement.remove();

            // finds where the delete and edit icons are
            let styleIndex = event.target.parentElement.innerHTML.indexOf('<div class="material-symbols-outlined deleteTask">');
            // gets only the checked icon and task description
            let taskDescription = event.target.parentElement.innerHTML.substring(0, styleIndex);

            // removes checked icon
            taskDescription = taskDescription.replace('<div class="material-symbols-outlined checkedTask">', '');
            taskDescription = taskDescription.replace('d</div>');

            // gets only the task description; gets rid of the div wrapping around it
            styleIndex = taskDescription.indexOf('>');
            taskDescription = taskDescription.substring(styleIndex + 1);
            styleIndex = taskDescription.indexOf('<');
            taskDescription = taskDescription.substring(0, styleIndex);

            // gets currentTasks from firebase
            taskList.get().then(querySnapshot => {
                //iterates through each document
                querySnapshot.forEach(doc => {
                    // checks if the task description equals the task description in the html
                    if (doc.data().description == taskDescription) {
                        // deletes the task from firebase
                        doc.ref.delete();
                        // early return because each task is unique
                        return;
                    }
                })
                isTaskListEmpty();
            })
        } else if (event.target.classList.contains("checkedTask")) {
            // finds where the delete and edit icons are
            let styleIndex = event.target.parentElement.innerHTML.indexOf('<div class="material-symbols-outlined deleteTask">');
            // gets only the checked icon and task description
            let taskDescription = event.target.parentElement.innerHTML.substring(0, styleIndex);

            // removes checked icon
            taskDescription = taskDescription.replace('<div class="material-symbols-outlined checkedTask">', '');
            taskDescription = taskDescription.replace('d</div>', '');

            // gets only the task description; gets rid of the div wrapping around it
            styleIndex = taskDescription.indexOf('>');
            taskDescription = taskDescription.substring(styleIndex + 1);
            styleIndex = taskDescription.indexOf('<');
            taskDescription = taskDescription.substring(0, styleIndex);

            taskList.get().then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    if (doc.data().description == taskDescription) {
                        // variable is named 'c' for now, change later
                        let newChecked = !doc.data().checked;
                        doc.ref.update({
                            checked: newChecked
                        });

                        // updates html to set brightness depending if task is checked/unchecked
                        if (!newChecked) {
                            event.target.parentElement.style.filter = "brightness(100%)";
                            event.target.innerHTML = "radio_button_unchecked";
                        } else {
                            event.target.parentElement.style.filter = "brightness(20%)";
                            event.target.innerHTML = "radio_button_checked";
                        }
                    }
                });
            });
        }
    });
}
taskActions();