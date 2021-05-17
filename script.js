let taskSections = document.getElementsByClassName("inputs");
let currentCards = document.querySelectorAll(".cards")
let cardSections = document.querySelectorAll(".cardOutputs") 
let i

class TaskManager {
    constructor() {
        this.cardsList = []
        this.cardIds = 0
    }

    // empties the contents of the input boxes
    emptyInputBoxes() { 
        for (i=0; i < taskSections.length; i++) {
            taskSections[i].value = ""; 
        }
    };

    //verifies that the inputs inserted by the user in the task form are correct: Not Empty and shorter than 20 characters
    //by passing the input through the Number() function, if it's an empty string, or an empty string with a space inside, it'll return zero and be considered invalid.
    validateTaskForm(validInput) { 

        for (i=0; i < taskSections.length; i++) {
            if (Number(taskSections[i].value) == 0 || taskSections[i].value.length > 20) {
                validInput = false;
            }
        };

        return validInput
    };
    
    // Get Tasks -> returns the list of ALL tasks
	getAllTasks() {
        return this.cardsList
    };

    // creates an object out of the users input, and a preset id
    createTaskObject(taskSections) { 
        return {
            id: this.cardIds,
            name: taskSections[0].value,
            description: taskSections[1].value,
            assignedTo: taskSections[2].value,
            dueDate: taskSections[3].value,
            status: taskSections[4].value
        };
    }
    
    findTargetIdIndex(taskId) { // finds the index of the id given in the parameter
        for(var i = 0; i < this.getAllTasks().length; i += 1) { //checks through the entire list
            if(this.getAllTasks()[i].id === Number(taskId)) { //if the id is equal to target id
                return i
            }
        }
    };

    fillCard(cardContent) { //fills out a single card and content list, parameter must be an object containing card content
        let card = document.createElement("div"); //defines a new card
        card.innerHTML = `<div class="list-group cards" draggable="true" id="${cardContent.id}">
                            <div class="list-group-item list-group-item-action">
                                <div class="d-flex w-100 justify-space-between">
                                    <h5 class="mb-1 col-6">Task </h5>
                                    <i class="col-3 fas fa-pencil-alt editButton data-toggle="modal" data-target="#newTask"></i>
                                    <i class="col-3 fas fa-trash deleteButton" ></i>
                                </div>
                            </div>
                            <div class="list-group-item list-group-item-action">
                                <div class="d-flex w-100 justify-content-between row">
                                    <h5 class="mb-1 col">name: </h5> 
                                    <p class="mb-1 col"> ${cardContent.name} </p>
                                </div>
                            </div>
                            <div class="list-group-item list-group-item-action">
                                <div class="d-flex w-100 justify-content-between row">
                                    <h5 class="mb-1 col">description: </h5>
                                <p class="mb-1 col"> ${cardContent.description} </p>
                                </div>
                            </div>
                            <div class="list-group-item list-group-item-action">
                                <div class="d-flex w-100 justify-content-between row">
                                    <h5 class="mb-1 col">assigned to: </h5>
                                    <p class="mb-1 col"> ${cardContent.assignedTo} </p>
                                </div>
                            </div>
                            <div class="list-group-item list-group-item-action">
                                <div class="d-flex w-100 justify-content-between row">
                                    <h5 class="mb-1 col">due date: </h5>
                                <p class="mb-1 col"> ${cardContent.dueDate} </p>
                                </div>
                            </div>
                        </div>`
        let contentListElem = document.createElement("div"); //defines a new element in the content list
        contentListElem.innerHTML = `<div class="list-group-item list-group-item-action" id="${cardContent.id}contentList">
                                    <div class="d-flex w-100 justify-content-between">
                                        <h5 class="mb-1">Task for: ${cardContent.name}</h5>
                                        <small>Due: ${cardContent.dueDate}</small>
                                    </div>
                                    <small>Status: ${cardContent.status}</small>
                                </div>`
        
        document.getElementById(cardContent.status).appendChild(card); //adds new card to the status output section for every card in the list
        document.getElementById("contentListGroup").appendChild(contentListElem); 
        document.getElementById(cardContent.id).querySelector(".deleteButton").addEventListener("click", () => this.deleteTask(cardContent)); 
        document.getElementById(cardContent.id).querySelector(".editButton").addEventListener("click", () => this.editTask(cardContent)); 
        document.getElementById(cardContent.id).addEventListener("dragstart", () => this.updateTask(cardContent, "status"));
    
    };

    fillCards() { //fills all cards. will be used when working with local storage.
        document.getElementById("toDoOutput").innerHTML = ` <div class="col-xl-2 col-lg-3 col-sm-5 col-8 cardSections" id="TODO">
                                                                <h3>To Do</h3>
                                                            </div>
                                                            <div class="col-xl-2 col-lg-3 col-sm-5 col-8 cardSections" id="INPROGRESS">
                                                                <h3>In Progress</h3>
                                                            </div>
                                                            <div class="col-xl-2 col-lg-3 col-sm-5 col-8 cardSections" id="REVIEW">
                                                                <h3>Under Review</h3>
                                                            </div>
                                                            <div class="col-xl-2 col-lg-3 col-sm-5 col-8 cardSections" id="DONE">
                                                                <h3>Done</h3>
                                                            </div>`
        document.getElementById("contentListGroup").innerHTML = ""


        for (i=0; i < this.getAllTasks().length; i++) {
            this.fillCard(this.getAllTasks()[i])    
        };
    };

    // Add Task -> adds a task to existing Tasks List and creates a corresponsing card 
	addTask(newTask) {
        this.getAllTasks().push(newTask) //adds current card to the list of cards in the form of an object
        this.fillCards()
    }

    // Delete Task -> deletes a task from the Tasks List and deletes it's corresponsing card
    deleteTask(task) {
        this.getAllTasks().splice(this.findTargetIdIndex(task.id), 1)
        this.fillCards()
    }

    // Update task status -> update the task status
    editTask(task) { 

        // cloning and replacing the update button removes any and all pre-existing event listeners 
        let oldUpdateButton = document.getElementById("updateTaskBtn");
        let newUpdateButton = oldUpdateButton.cloneNode(true);
        oldUpdateButton.parentNode.replaceChild(newUpdateButton, oldUpdateButton);

        // displays the correct buttons and messages, as well as the entire form.
        document.getElementById("errorMessage").style = "display: none;"
        document.getElementById("updateTaskBtn").style = "";
        document.getElementById("addTaskBtn").style = "display: none;";
        $('#taskForm').modal('show');
        
        //
        let card = this.getAllTasks()[this.findTargetIdIndex(task.id)]
        taskSections[0].value = card["name"]
        taskSections[1].value = card["description"]
        taskSections[2].value = card["assignedTo"]
        taskSections[3].value = card["dueDate"]
        taskSections[4].value = card["status"]
        
        //
        document.querySelector("#updateTaskBtn").addEventListener("click", function() { 
            //
            let newTask = TaskManager1.createTaskObject(taskSections)
        
            //
            let validInput = true;
            validInput = TaskManager1.validateTaskForm(validInput)
        
            //
            if (validInput) {
                card["name"] = taskSections[0].value
                card["description"] = taskSections[1].value
                card["assignedTo"] = taskSections[2].value
                card["dueDate"] = taskSections[3].value
                card["status"] = taskSections[4].value
                $('#taskForm').modal('hide');
                TaskManager1.emptyInputBoxes()
            } else {
                document.getElementById("errorMessage").style = "" //makes the error message visible
            }
            TaskManager1.fillCards()
        }); 
        
        
    }; 
}

let TaskManager1 = new TaskManager()

document.querySelector("#addTaskBtn").addEventListener("click", function() { //adds a task when the "addtask" button is pressed
    let newTask = TaskManager1.createTaskObject(taskSections)

    let validInput = true;

    validInput = TaskManager1.validateTaskForm(validInput)

    if (validInput) {
        TaskManager1.addTask(newTask) //adds current card to the list of cards in the form of an object, returns that object to here
        TaskManager1.cardIds++
        $('#taskForm').modal('hide');
        TaskManager1.emptyInputBoxes()
    } else {
        document.getElementById("errorMessage").style = "" //makes the error message visible
    }
    TaskManager1.fillCards()
}); 

document.querySelector("#openModalAdd").addEventListener("click", function() { //makes sure the correct things are visible when the modal is opened to add a task
    TaskManager1.emptyInputBoxes()
    document.getElementById("updateTaskBtn").style = "display: none;";
    document.getElementById("addTaskBtn").style = "";
    document.getElementById("errorMessage").style = "display: none;"
});