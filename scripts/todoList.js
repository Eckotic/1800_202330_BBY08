const taskContent = document.querySelector(".item-content");
const addItem = document.querySelector(".new-item");
const taskList = document.querySelector(".task-list");

function addTask() {
    let newTask = document.createElement("div");
    newTask.textContent = taskContent.value;
    newTask.className = "task";
    taskContent.value = "";
    taskList.appendChild(newTask);
}

addItem.addEventListener("click", function (event) {
    addTask();
});