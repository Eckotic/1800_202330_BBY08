const taskContent = document.getElementById("item-content");
const addItem = document.getElementById("new-item");
const listOfTasks = document.getElementById("task-list");

const user = db.collection("users").doc("hdZ49Qd3r33c9sSlWl2e");
const taskList = user.collection("currentTasks");;

function createTask(description) {
    //create new <li> element
    let newTask = document.createElement("li");
    newTask.innerHTML = description;
    //give the <li> element the class task
    newTask.className = "task";

    //creates delete icon
    //adds it to task
    let deleteX = document.createElement("span");
    deleteX.className = 'material-symbols-outlined deleteTask';
    deleteX.innerHTML = "delete";
    newTask.appendChild(deleteX);

    let editTask = document.createElement("span");
    editTask.className = 'material-symbols-outlined editTask';
    editTask.innerHTML = "edit";
    newTask.appendChild(editTask);

    //add the <li> to listOfTasks
    listOfTasks.appendChild(newTask);
}

async function isTaskListEmpty() {
    let count = 0;
    const querySnapshot = await taskList.get();

    querySnapshot.forEach(doc => {
        count++;
    })
    console.log(count);
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

            //creates new html <li> element
            //with the task description in the innerHTML
            createTask(description);
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

function deleteTask() {
    listOfTasks.onclick = (event => {
        if (event.target.classList.contains("deleteTask")) {
            // removes task from the hmtl
            event.target.parentElement.remove();

            // finds where the icons are
            let styleIndex = event.target.parentElement.innerHTML.indexOf("<");
            // gets only the task description
            let taskDescription = event.target.parentElement.innerHTML.substring(0, styleIndex);

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
                console.log(isTaskListEmpty());
                isTaskListEmpty();
            })
        }
    });
}
deleteTask();