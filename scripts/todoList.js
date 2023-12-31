const taskContent = document.getElementById("item-content");
const addItem = document.getElementById("new-item");
const listOfTasks = document.getElementById("task-list");

/**
 * Creates a new task in the HTML.
 * 
 * Takes user input or data from the firestore and creates a list element.
 * Inside the list element is a div element that contains the contents of the task.
 * Adds a checked icon and delete icon to the div element.
 * Appends the list element to the HTML.
 * 
 * @param {String}  description content of a task
 * @param {boolean} checked     state of task completion
 */
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

/**
 * Prints a "No Task" message to the HTML.
 * 
 * Checks the size of the task list in the firestore.
 * If greater than zero, return;
 * Otherwise, create a list element that contains a message
 * informing the user that they have no task.
 */
async function isTaskListEmpty() {
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            let uid = db.collection("users").doc(user.uid);
            // gets the task list collection from the firebase
            const querySnapshot = await uid.collection("currentTasks").get();

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
        } else {
            return;
        }
    });

}

/** 
 * Prints all tasks to the HTML.
 * 
 * Gets task documents from firebase and assigns their description and checked status
 * as the parametres when invokng the createTask function.
 */
function printTaskList() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            isTaskListEmpty();
            let uid = db.collection("users").doc(user.uid);
            //get all of the current tasks
            uid.collection("currentTasks").get().then(querySnapshot => {

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
        } else {
            return;
        }
    });
}
printTaskList();

/**
 * Adds a task to the HTML and firestore.
 * 
 * Checks if user has inputted into the textbox and if the task already exists.
 * If so, then show a popup informing the user.
 * If not, then check if the "No Tasks" message exists in the HTML and deletes it.
 * Invokes the createTask function, checked is false and the description is the user input.
 * Creates a new document and stores the task in the firestore.
 */
function addTask() {
    firebase.auth().onAuthStateChanged(async (curUser) => {
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

        if (curUser) {
            let user = db.collection("users").doc(curUser.uid);
            let taskList = user.collection("currentTasks");
            // gets currentTasks from firebase
            await taskList.get().then(querySnapshot => {
                //iterates through each document
                querySnapshot.forEach(doc => {
                    // checks if the task description equals the taskID in the html
                    if (doc.data().description == taskDescription) {
                        sameTaskCancelled = true;
                    }
                })
                //isTaskListEmpty();
            });

            if (sameTaskCancelled) {
                // toggles popup when task content is empty
                let popup = document.getElementById("popup-same-text");
                popup.classList.toggle("popup-visible");
                // make it so popup-visible is toggled off after animation plays
                setTimeout(() => { popup.classList.toggle("popup-visible") }, 7000);
                return;
            }

            // deletes the default message in the situation where no tasks exist
            if (document.getElementById("noTasks") != null) {
                document.getElementById("noTasks").remove();
            }

            // creates new task in the html
            createTask(taskDescription, false);
            // empties the textbox
            taskContent.value = "";
            // gets taskNumber from firebase
            let doc = await user.get();
            let taskNumber = doc.data().taskNumber;

            // increments taskNumber
            await user.update({
                taskNumber: firebase.firestore.FieldValue.increment(1)
            });
            taskNumber++

            // creates new task in the firebase
            taskList.doc("task".concat(taskNumber)).set({
                resourceGained: false,
                checked: false,
                description: taskDescription
            });
        } else {
            return;
        }
    });
}
addItem.addEventListener("click", addTask);

/**
 * Deletes task or checks task depending on which button is pressed.
 * 
 * Checks if the user has clicked on a task, then determines if they 
 * pressed on either the delete button or check task button.
 * If the delete button is pressed, then remove the task from the HTML and firestore,
 * then check how many tasks the user has; invokes the isTaskListEmpty function.
 * If the check task button is pressed, then change the brightness of the task, mark it as
 * complete in the firestore, and reward the user with resources.
 */
function taskActions() {
    listOfTasks.onclick = (event => {

        firebase.auth().onAuthStateChanged((curUser) => {
            if (curUser) {
                let user = db.collection("users").doc(curUser.uid);
                let taskList = user.collection("currentTasks");
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
                                isTaskListEmpty();
                                // early return because each task is unique
                                return;
                            }
                        })
                    })
                } else if (clickTarget.classList.contains("checkedTask")) {
                    // gets the li element
                    // gets the task-id
                    let taskID = clickTarget.parentElement.getAttribute("data-task-id");
                    let game = user.collection("game").doc("userInfo");
                    taskList.get().then(querySnapshot => {
                        querySnapshot.forEach(doc => {
                            if (doc.data().description == taskID) {
                                let isChecked = true;
                                let resourceGained = doc.data().resourceGained;

                                doc.ref.update({
                                    checked: true
                                });

                                // updates html to set brightness depending if task is checked/unchecked
                                // also changes button icon
                                if (isChecked && resourceGained == false) {
                                    game.get().then(DOC => {

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
            } else {
                return;
            }
        });

    });
}
taskActions();