const taskContent = document.getElementById("item-content");
const addItem = document.getElementById("new-item");
const listOfTasks = document.getElementById("task-list");
const user = db.collection("users").doc("hdZ49Qd3r33c9sSlWl2e");
const game = db.collection("users").doc("xYwKXL8oCeTrSLyuwjbXYodDhCI2").collection("game").doc("userInfo");
const taskList = user.collection("currentTasks");;

function createTask(description, checked) {
    //create new <li> element
    let newTask = document.createElement("li");
    //give the <li> element the class task
    newTask.className = "task";
    newTask.setAttribute("data-task-id", description);
    newTask.innerHTML = "<div class='task-content'>" + description + "</div>";

    //create checked/unchecked
    let checkedTask = document.createElement("div");
    checkedTask.className = 'material-symbols-outlined checkedTask';

    // updates html to set brightness depending if task is checked/unchecked
    // also changes button icon
    if (!checked) {
        newTask.style.filter = "brightness(100%)";
        checkedTask.innerHTML = "radio_button_unchecked";
    } else {
        newTask.style.filter = "brightness(20%)";
        checkedTask.innerHTML = "radio_button_checked";
    }

    newTask.insertBefore(checkedTask, newTask.children[0]);

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

    // gets the task list collection from the firebase
    const querySnapshot = await taskList.get();

    // checks if the task list is empty; if not, early return.
    if (querySnapshot.size > 0) {
        return;
    }

    // checks if there is a 'no task' message
    // creates one if there isn't
    if (document.getElementById("noTasks") == null) {
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

    let sameTaskCancelled = false;
    let taskDescription = taskContent.value;

    // early return to not allow user to input an empty value
    if (taskDescription == "") {
        // toggles popup when task content is empty
        let popup = document.getElementById("popup-empty-text");
        popup.classList.toggle("popup-visible");
        // make it so popup-visible is toggled off after animation plays
        setTimeout(() => { popup.classList.toggle("popup-visible") }, 7000);
        return;
    }

    // gets currentTasks from firebase
    await taskList.get().then(querySnapshot => {
        //iterates through each document
        querySnapshot.forEach(doc => {
            // checks if the task description equals the taskID in the html
            if (doc.data().description == taskDescription) {
                sameTaskCancelled = true;
            }
        })
        isTaskListEmpty();
    });

    if (sameTaskCancelled) {
        // toggles popup when task content is empty
        let popup = document.getElementById("popup-same-text");
        popup.classList.toggle("popup-visible");
        // make it so popup-visible is toggled off after animation plays
        setTimeout(() => { popup.classList.toggle("popup-visible") }, 7000);
        return;
    }

    // gets taskNumber from firebase
    let doc = await user.get();

    let taskNumber = doc.data().taskNumber;

    // increments taskNumber
    await user.update({
        taskNumber: taskNumber + 1
    })
    taskNumber++

    // creates new task in the firebase
    await taskList.doc("task".concat(taskNumber)).set({
        resourceGained: false,
        checked: false,
        description: taskDescription
    });

    // creates new task in the html
    createTask(taskDescription, false);
    // empties the textbox
    taskContent.value = "";

    // deletes the default message in the situation where no tasks exist
    if (document.getElementById("noTasks") != null) {
        document.getElementById("noTasks").remove();
    }
}
addItem.addEventListener("click", addTask);

function taskActions() {
    listOfTasks.onclick = (event => {

        // gets the button user clicked on; gets the li element if user doesn't click a button
        let clickTarget = event.target;

        if (clickTarget.classList.contains("deleteTask")) {
            // removes task from the hmtl
            clickTarget.parentElement.remove();

            // gets the task-id
            let taskID = clickTarget.parentElement.getAttribute("data-task-id");

            // gets currentTasks from firebase
            taskList.get().then(querySnapshot => {
                //iterates through each document
                querySnapshot.forEach(doc => {
                    // checks if the task description equals the taskID in the html
                    if (doc.data().description == taskID) {
                        // deletes the task from firebase
                        doc.ref.delete();
                        // early return because each task is unique
                        return;
                    }
                })
                isTaskListEmpty();
            })
        } else if (clickTarget.classList.contains("checkedTask")) {

            // gets the li element
            // gets the task-id
            let taskID = clickTarget.parentElement.getAttribute("data-task-id");

            taskList.get().then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    if (doc.data().description == taskID) {
                        /// inverts current checked status
                        let isChecked = doc.data().checked;
                        let resourceGained = doc.data().resourceGained;

                        doc.ref.update({
                            checked: true
                        });

                        // updates html to set brightness depending if task is checked/unchecked
                        // also changes button icon
                        if (isChecked && resourceGained == false) {

                            game.get().then( DOC => {

                                let resources = DOC.data().resources;
                                console.log("added resource")

                                game.update({
                                    resources: resources + 5
                                });
                                doc.ref.update({
                                    resourceGained: true
                                });

                                console.log(resources);

                            });

                            clickTarget.parentElement.style.filter = "brightness(20%)";
                            clickTarget.innerHTML = "radio_button_checked";
                        }
                    }
                });
            });
        }
    });
}
taskActions();