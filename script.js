//creates a list containing all the user inputs, this refers to the tags themselves, not the values within.
let taskSections = [nameInput, descriptionInput, assignedToInput, dueDateInput, statusInput] = document.getElementsByClassName("inputs");

//create a new task object using the user's input
class Task { 
    constructor() {
        this.id = TaskManager.taskId,
        this.name = nameInput.value,
        this.description = descriptionInput.value,
        this.assignedTo = assignedToInput.value,
        this.dueDate = dueDateInput.value,
        this.status = statusInput.value
    }
}

let TaskManager = {
    tasksList: [],
    taskId: 0,


    updatelocalstorage() {
        localStorage.setItem("tasksList",JSON.stringify(TaskManager.tasksList))
        localStorage.setItem("taskId",JSON.stringify(TaskManager.taskId))
    },

    emptyInputBoxes() { 
        for (i in taskSections) {
            taskSections[i].value = ""; 
        }
    },

    /* returns a list containing all the error messages that need to be displayed
    by passing the input through the Number() function:
    if it's an empty string, or an empty string with space(s) inside it'll return zero and be considered invalid. */
    validateTaskForm() { 
        errors = []
        let description = descriptionInput.value
        formInputs = [nameInput.value, assignedToInput.value, dueDateInput.value, statusInput.value]
        errorMessages = ["Name invalid, please enter a name that is not empty, and is fewer than than 20 characters", 
        "'Assigned to' invalid, please enter an assignment that is not empty, and is fewer than 20 characters", 
        "Due Date invalid, please enter a due date", 
        "Status invalid, please enter a status"]

        for (i in formInputs) {
            if (Number(formInputs[i]) == 0 || formInputs[i].length > 20) {
                errors.push(errorMessages[i]);
            }
        };
        if (Number(description) == 0 || description.length < 20) {
            errors.splice(1, 0, "Description invalid, please enter a description that is greater than 20 characters")
        }

        return errors
    },
    // cloning and replacing the update button to remove any pre-existing event listeners
    refreshUpdateButton() {  
        let oldUpdateButton = document.getElementById("updateTaskBtn");
        let newUpdateButton = oldUpdateButton.cloneNode(true);
        oldUpdateButton.parentNode.replaceChild(newUpdateButton, oldUpdateButton);
    },

    //displays the form in a manner ready to update the task. 
    displayUpdateForm() {
        document.getElementById("updateTaskBtn").style = "";
        document.getElementById("addTaskBtn").style = "display: none;";
        $('#taskForm').modal('show');
    },

    //updates the input form to contain the contents of the task being edited
    fillUpdateForm(task) {
        nameInput.value = task["name"]
        descriptionInput.value = task["description"]
        assignedToInput.value = task["assignedTo"]
        dueDateInput.value = task["dueDate"]
        statusInput.value = task["status"]
    },

    // finds the index of the id given in the parameter using a binary search, since the list will always have indexes in order
    findTargetIdIndex(targetId, start, end) {                    
        if (start > end) return false;

        let mid = ((start + end)/2);

        if (TaskManager.tasksList[mid] === targetId) return true;
                
        if(TaskManager.tasksList[mid] > targetId) {
            return TaskManager.findTargetIdIndex(targetId, start, mid-1);
        }
        else {
            return TaskManager.findTargetIdIndex(targetId, mid+1, end);
        }
    },

    //fills out a single task and content list, parameter must be an object containing task content
    displayCard(task) { 
        let card = document.createElement("div"); //defines a new card
        card.innerHTML = `<div class="list-group cards bg-light" id="${task.id}">
                            <div class="list-group-item list-group-item-action">
                                <div class="d-flex w-100 justify-space-between ">
                                    <h5 class="mb-1 col-6">Task </h5>
                                    <i class="col-3 fas fa-pencil-alt editButton data-toggle="modal" data-target="#newTask" title="Edit task" alt="Edit task"></i>
                                    <i class="col-3 fas fa-trash deleteButton" title="Delete task" alt="Delete Task"></i>
                                </div>
                            </div>
                            <div class="list-group-item list-group-item-action">
                                <div class="d-flex w-100 justify-content-between row">
                                    <h5 class="mb-1">Name: </h5> 
                                    <p class="name col"> ${task.name} </p>
                                </div>
                            </div>
                            <div class="list-group-item list-group-item-action">
                                <div class="d-flex w-100 justify-content-between row">
                                    <h5 class="mb-1">Description: </h5>
                                    <p class="description col" style="word-wrap: break-word;"> ${task.description} </p>
                                </div>
                            </div>
                            <div class="list-group-item list-group-item-action">
                                <div class="d-flex w-100 justify-content-between row">
                                    <h5 class="mb-1">Assigned to: </h5>
                                    <p class="assignedTo col"> ${task.assignedTo} </p>
                                </div>
                            </div>
                            <div class="list-group-item list-group-item-action">
                                <div class="d-flex w-100 justify-content-between row">
                                    <h5 class="mb-1">Due date: </h5>
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
    
    },

    //resets the output html sections back to default and fills all cards.
    displayCards() { 
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

    // adds a task to existing Tasks List and creates a corresponsing card 
	addTask() {
        let newTask = new Task(taskSections)

        let errors = TaskManager.validateTaskForm()
    
        if (errors.length == 0) {
            TaskManager.taskId++
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

    // deletes a task from the Tasks List and deletes it's corresponsing card
    deleteTask(task) {
        TaskManager.tasksList.splice(TaskManager.findTargetIdIndex(task.id, 0, TaskManager.tasksList.length - 1), 1)
        TaskManager.updatelocalstorage()
        TaskManager.displayCards()
    },

    //puts the changes made to a task by the user into effect
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

    // opens and prepares the form for the user to edit a task. 
    editTask(task) { 

        TaskManager.refreshUpdateButton()
        TaskManager.displayUpdateForm()
        
        TaskManager.fillUpdateForm(task)
        
        document.querySelector("#updateTaskBtn").addEventListener("click", () => TaskManager.updateTask(task))
    } 
}

//adds a task when the "addtask" button is pressed
document.querySelector("#addTaskBtn").addEventListener("click", TaskManager.addTask); 

//makes sure the correct things are visible when the modal is opened to add a task
document.querySelector("#openModalAdd").addEventListener("click", function() { 
    TaskManager.emptyInputBoxes()
    document.getElementById("updateTaskBtn").style = "display: none;";
    document.getElementById("addTaskBtn").style = "";
});

// retrieving local storage
let tasksListStorage = localStorage.getItem("tasksList")
let taskIdStorage = localStorage.getItem("taskId")

//if local storage is found, updates the task managers corresponding attributes and displays local storage's content
if(tasksListStorage){
    TaskManager.tasksList = JSON.parse(tasksListStorage)
    TaskManager.taskId = JSON.parse(taskIdStorage)
    TaskManager.displayCards()
} 