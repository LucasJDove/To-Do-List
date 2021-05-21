//creates a list containing all the user inputs, this refers to the tags themselves, not the values within.
let taskSections = [nameInput, descriptionInput, assignedToInput, dueDateInput, statusInput] = document.getElementsByClassName("inputs");
console.log(nameInput)

let colourKey = {
    toDo: "danger",
    inProgress: "warning",
    review: "success",
    completed: "info",
}


//create a new task object using the user's input
class Task { 
    constructor(taskSections) {
        this.id = TaskManager.taskIds,
        this.name = nameInput.value,
        this.description = descriptionInput.value,
        this.assignedTo = assignedToInput.value,
        this.dueDate = dueDateInput.value,
        this.status = statusInput.value
    }
}

let TaskManager = {
    tasksList: [],
    taskIds: 0,

    updatelocalstorage() {
        localStorage.setItem("tasksList",JSON.stringify(TaskManager.tasksList))
        localStorage.setItem("taskIds",JSON.stringify(TaskManager.taskIds))
    },
    
    // empties the contents of the input boxes
    emptyInputBoxes() { 
        for (i in taskSections) {
            taskSections[i].value = ""; 
        }
    },

    //verifies that the inputs inserted by the user in the task form are correct: Not Empty and shorter than 20 characters
    //by passing the input through the Number() function, if it's an empty string, or an empty string with a space inside, it'll return zero and be considered invalid.
    validateTaskForm() { 
        errors = []
        let description = descriptionInput.value
        formInputs = [nameInput.value, assignedToInput.value, dueDateInput.value, statusInput.value]
        errorMessages = ["name invalid, please enter a name that is not empty, and is fewer than than 20 characters", 
        "'Assigned to' invalid, please enter an assignment that is not empty, and is fewer than 20 characters", 
        "Due Date invalid, please enter a Due Date", 
        "status invalid, please enter a status"]

        for (i in formInputs) {
            if (Number(formInputs[i]) == 0 || formInputs[i].length > 20) {
                errors.push(errorMessages[i]);
            }
        };
        if (description.length < 20) {
            errors.splice(1, 0, "description invalid, please enter a description that is greater than 20 characters")
        }

        return errors
    },
    
    refreshUpdateButton() { // cloning and replacing the update button removes any pre-existing event listeners 
        let oldUpdateButton = document.getElementById("updateTaskBtn");
        let newUpdateButton = oldUpdateButton.cloneNode(true);
        oldUpdateButton.parentNode.replaceChild(newUpdateButton, oldUpdateButton);
    },

    displayUpdateForm() {
        document.getElementById("updateTaskBtn").style = "";
        document.getElementById("addTaskBtn").style = "display: none;";
        $('#taskForm').modal('show');
    },

    fillUpdateForm(task) {
        nameInput.value = task["name"]
        descriptionInput.value = task["description"]
        assignedToInput.value = task["assignedTo"]
        dueDateInput.value = task["dueDate"]
        statusInput.value = task["status"]
    },

    findTargetIdIndex(targetId) { // finds the index of the id given in the parameter
        for (i in TaskManager.tasksList) { //checks through the entire list
            if(TaskManager.tasksList[i].id == targetId) { //if the id is equal to target id
                return i
            }
        }
    },

    displayCard(task) { //fills out a single task and content list, parameter must be an object containing task content
        let card = document.createElement("div"); //defines a new card
        card.innerHTML = `<div class="list-group cards bg-${colourKey[task.status]}" id="${task.id}">
                            <div class="list-group-item list-group-item-action">
                                <div class="d-flex w-100 justify-space-between ">
                                    <h5 class="mb-1 col-6">Task </h5>
                                    <i class="col-3 fas fa-pencil-alt editButton data-toggle="modal" data-target="#newTask" title="Edit task" alt="Edit task"></i>
                                    <i class="col-3 fas fa-trash deleteButton" title="Delete task" alt="Delete Task"></i>
                                </div>
                            </div>
                            <div class="list-group-item list-group-item-action">
                                <div class="d-flex w-100 justify-content-between row">
                                    <h5 class="mb-1 col">Name: </h5> 
                                    <p class="name col"> ${task.name} </p>
                                </div>
                            </div>
                            <div class="list-group-item list-group-item-action">
                                <div class="d-flex w-100 justify-content-between row">
                                    <h5 class="mb-1 col">Description: </h5>
                                    <p class="description col" style="word-wrap: break-word;"> ${task.description} </p>
                                </div>
                            </div>
                            <div class="list-group-item list-group-item-action">
                                <div class="d-flex w-100 justify-content-between row">
                                    <h5 class="mb-1 col">Assigned to: </h5>
                                    <p class="assignedTo col"> ${task.assignedTo} </p>
                                </div>
                            </div>
                            <div class="list-group-item list-group-item-action">
                                <div class="d-flex w-100 justify-content-between row">
                                    <h5 class="mb-1 col">Due date: </h5>
                                <p class="dueDate col"> ${task.dueDate} </p>
                                </div>
                            </div>
                        </div>`

        
        let contentListElem = document.createElement("div"); //defines a new element in the content list
        contentListElem.innerHTML = `<div class="list-group-item list-group-item-action" id="${task.id}contentList">
                                    <div class="d-flex w-100 justify-content-between">
                                        <h5 class="mb-1">Task for: ${task.name}</h5>
                                        <small>Due: ${task.dueDate}</small>
                                    </div>
                                    <small>Status: ${task.status}</small>
                                </div>`
        
        document.getElementById(task.status).appendChild(card); //adds new card to the status output section for every card in the list
        document.getElementById("contentListGroup").appendChild(contentListElem); 
        document.getElementById(task.id).querySelector(".deleteButton").addEventListener("click", () => TaskManager.deleteTask(task)); 
        document.getElementById(task.id).querySelector(".editButton").addEventListener("click", () => TaskManager.editTask(task)); 
        document.getElementById(task.id).addEventListener("dragstart", () => TaskManager.updateTask(task, "status"));
    
    },

    displayCards() { //resets the output html sections back to default and fills all cards.
        document.getElementById("toDoOutput").innerHTML = ` <div class="col-xl-2 col-lg-3 col-sm-5 col-8 taskSections" id="TODO">
                                                                <h3>To Do</h3>
                                                            </div>
                                                            <div class="col-xl-2 col-lg-3 col-sm-5 col-8 taskSections" id="INPROGRESS">
                                                                <h3>In Progress</h3>
                                                            </div>
                                                            <div class="col-xl-2 col-lg-3 col-sm-5 col-8 taskSections" id="REVIEW">
                                                                <h3>Under Review</h3>
                                                            </div>
                                                            <div class="col-xl-2 col-lg-3 col-sm-5 col-8 taskSections" id="DONE">
                                                                <h3>Done</h3>
                                                            </div>`
        document.getElementById("contentListGroup").innerHTML = ""

        for (i in TaskManager.tasksList) {
            TaskManager.displayCard(TaskManager.tasksList[i])    
        };
    },

    // Add Task -> adds a task to existing Tasks List and creates a corresponsing card 
	addTask() {
        let newTask = new Task(taskSections)

        let errors = TaskManager.validateTaskForm()
    
        if (errors.length == 0) {
            TaskManager.taskIds++
            $('#taskForm').modal('hide');
            TaskManager.emptyInputBoxes()
            TaskManager.tasksList.push(newTask) //adds current card to the list of cards in the form of an object
            TaskManager.updatelocalstorage()
            TaskManager.displayCards()
    
        } else {
            for (i in errors) {
                alert(errors[i])
            } 
        }
    },

    // Delete Task -> deletes a task from the Tasks List and deletes it's corresponsing card
    deleteTask(task) {
        TaskManager.tasksList.splice(TaskManager.findTargetIdIndex(task.id), 1)
        TaskManager.updatelocalstorage()
        TaskManager.displayCards()
    },

    updateTask(task) {
        let errors = TaskManager.validateTaskForm()
        
        //
        if (errors.length == 0) {
            task["name"] = nameInput.value
            task["description"] = descriptionInput.value
            task["assignedTo"] = assignedToInput.value
            task["dueDate"] = dueDateInput.value
            task["status"] = statusInput.value
            $('#taskForm').modal('hide');
            TaskManager.emptyInputBoxes()
            TaskManager.updatelocalstorage()
            TaskManager.displayCards()    
        } else {
            for (i in errors) {
                alert(errors[i])
            }
        }

    },

    // Update task -> update a task object and updates it's corresponsing card
    editTask(task) { 

        TaskManager.refreshUpdateButton()
        TaskManager.displayUpdateForm()
        
        task = TaskManager.tasksList[TaskManager.findTargetIdIndex(task.id)]

        TaskManager.fillUpdateForm(task)
        
        document.querySelector("#updateTaskBtn").addEventListener("click", () => TaskManager.updateTask(task))
    } 
}

//adds a task when the "addtask" button is pressed
document.querySelector("#addTaskBtn").addEventListener("click", TaskManager.addTask); 

document.querySelector("#openModalAdd").addEventListener("click", function() { //makes sure the correct things are visible when the modal is opened to add a task
    TaskManager.emptyInputBoxes()
    document.getElementById("updateTaskBtn").style = "display: none;";
    document.getElementById("addTaskBtn").style = "";
});

// retrieving local storage
let tasksListStorage = localStorage.getItem("tasksList")
let taskIdsStorage = localStorage.getItem("taskIds")

if(tasksListStorage){
    TaskManager.tasksList = JSON.parse(tasksListStorage)
    TaskManager.taskIds = JSON.parse(taskIdsStorage)
    TaskManager.displayCards()
} 



