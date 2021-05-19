//creates a list containing all the user inputs
let taskSections = document.getElementsByClassName("inputs");
let currentCards = document.querySelectorAll(".cards");
let cardSections = document.querySelectorAll(".cardOutputs");


class TaskObject { 
    constructor(taskSections) {
        this.id = TaskManager.cardIds,
        this.name = taskSections[0].value,
        this.description = taskSections[1].value,
        this.assignedTo = taskSections[2].value,
        this.dueDate = taskSections[3].value,
        this.status = taskSections[4].value
    }
}

let TaskManager = {
    cardsList: [],
    cardIds: 0,

    updatelocalstorage() {
        localStorage.setItem("cardsList",JSON.stringify(TaskManager.cardsList))
        localStorage.setItem("cardIds",JSON.stringify(TaskManager.cardIds))
    },
    
    // empties the contents of the input boxes
    emptyInputBoxes() { 
        for (i=0; i < taskSections.length; i++) {
            taskSections[i].value = ""; 
        }
    },

    //verifies that the inputs inserted by the user in the task form are correct: Not Empty and shorter than 20 characters
    //by passing the input through the Number() function, if it's an empty string, or an empty string with a space inside, it'll return zero and be considered invalid.
    validateTaskForm() { 
        errors = []
        let description = taskSections[1].value
        formInputs = [taskSections[0].value, taskSections[2].value, taskSections[3].value, taskSections[4].value]
        errorMessages = ["name invalid, please enter a name that is not empty, and is fewer than than 20 characters", 
        "'Assigned to' invalid, please enter an assignment that is not empty, and is fewer than 20 characters", 
        "Due Date invalid, please enter a Due Date", 
        "status invalid, please enter a status"]
        console.log(formInputs, description)

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
    

    findTargetIdIndex(targetId) { // finds the index of the id given in the parameter
        for(i in TaskManager.cardsList) { //checks through the entire list
            if(TaskManager.cardsList[i].id == targetId) { //if the id is equal to target id
                return i
            }
        }
    },

    fillCard(cardContent) { //fills out a single card and content list, parameter must be an object containing card content
        let card = document.createElement("div"); //defines a new card
        card.innerHTML = `<div class="list-group cards" draggable="true" id="${cardContent.id}">
                            <div class="list-group-item list-group-item-action">
                                <div class="d-flex w-100 justify-space-between">
                                    <h5 class="mb-1 col-6">Task </h5>
                                    <i class="col-3 fas fa-pencil-alt editButton data-toggle="modal" data-target="#newTask" title="Edit task" alt="Edit task"></i>
                                    <i class="col-3 fas fa-trash deleteButton" title="Delete task" alt="Delete Task"></i>
                                </div>
                            </div>
                            <div class="list-group-item list-group-item-action">
                                <div class="d-flex w-100 justify-content-between row">
                                    <h5 class="mb-1 col">name: </h5> 
                                    <p class="name"> ${cardContent.name} </p>
                                </div>
                            </div>
                            <div class="list-group-item list-group-item-action">
                                <div class="d-flex w-100 justify-content-between row">
                                    <h5 class="mb-1 col">description: </h5>
                                <p class="description"> ${cardContent.description} </p>
                                </div>
                            </div>
                            <div class="list-group-item list-group-item-action">
                                <div class="d-flex w-100 justify-content-between row">
                                    <h5 class="mb-1 col">assigned to: </h5>
                                    <p class="assignedTo"> ${cardContent.assignedTo} </p>
                                </div>
                            </div>
                            <div class="list-group-item list-group-item-action">
                                <div class="d-flex w-100 justify-content-between row">
                                    <h5 class="mb-1 col">due date: </h5>
                                <p class="dueDate"> ${cardContent.dueDate} </p>
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
        document.getElementById(cardContent.id).querySelector(".deleteButton").addEventListener("click", () => TaskManager.deleteTask(cardContent)); 
        document.getElementById(cardContent.id).querySelector(".editButton").addEventListener("click", () => TaskManager.editTask(cardContent)); 
        document.getElementById(cardContent.id).addEventListener("dragstart", () => TaskManager.updateTask(cardContent, "status"));
    
    },

    fillCards() { //resets the output html sections back to default and fills all cards.
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

        for (i=0; i < TaskManager.cardsList.length; i++) {
            TaskManager.fillCard(TaskManager.cardsList[i])    
        };
    },

    // Add Task -> adds a task to existing Tasks List and creates a corresponsing card 
	addTask() {
        let newTask = new TaskObject(taskSections)

        let errors = TaskManager.validateTaskForm()
    
        if (errors.length == 0) {
            TaskManager.cardIds++
            $('#taskForm').modal('hide');
            TaskManager.emptyInputBoxes()
            TaskManager.cardsList.push(newTask) //adds current card to the list of cards in the form of an object
            TaskManager.updatelocalstorage()
            TaskManager.fillCards()
    
        } else {
            for (i in errors) {
                alert(errors[i])
            } //makes the error message visible
        }
    },

    // Delete Task -> deletes a task from the Tasks List and deletes it's corresponsing card
    deleteTask(task) {
        TaskManager.cardsList.splice(TaskManager.findTargetIdIndex(task.id), 1)
        TaskManager.updatelocalstorage()
        TaskManager.fillCards()
    },

    // Update task status -> update the task status
    editTask(task) { 

        // cloning and replacing the update button removes any pre-existing event listeners 
        let oldUpdateButton = document.getElementById("updateTaskBtn");
        let newUpdateButton = oldUpdateButton.cloneNode(true);
        oldUpdateButton.parentNode.replaceChild(newUpdateButton, oldUpdateButton);

        // displays the correct buttons and messages, as well as the entire form.
        document.getElementById("errorMessage").style = "display: none;"
        document.getElementById("updateTaskBtn").style = "";
        document.getElementById("addTaskBtn").style = "display: none;";
        $('#taskForm').modal('show');
        
        //
        let card = TaskManager.cardsList[TaskManager.findTargetIdIndex(task.id)]
        console.log(card, TaskManager.cardsList, TaskManager.findTargetIdIndex(task.id))
        taskSections[0].value = card["name"]
        taskSections[1].value = card["description"]
        taskSections[2].value = card["assignedTo"]
        taskSections[3].value = card["dueDate"]
        taskSections[4].value = card["status"]
        
        //
        document.querySelector("#updateTaskBtn").addEventListener("click", function() {
            //
            let validInput = TaskManager.validateTaskForm()
        
            //
            if (validInput) {
                card["name"] = taskSections[0].value
                card["description"] = taskSections[1].value
                card["assignedTo"] = taskSections[2].value
                card["dueDate"] = taskSections[3].value
                card["status"] = taskSections[4].value
                $('#taskForm').modal('hide');
                TaskManager.emptyInputBoxes()
                TaskManager.updatelocalstorage()
                TaskManager.fillCards()    
            } else {
                document.getElementById("errorMessage").style = "" //makes the error message visible
            }
        }); 
    } 
}

//adds a task when the "addtask" button is pressed
document.querySelector("#addTaskBtn").addEventListener("click", TaskManager.addTask); 

document.querySelector("#openModalAdd").addEventListener("click", function() { //makes sure the correct things are visible when the modal is opened to add a task
    TaskManager.emptyInputBoxes()
    document.getElementById("updateTaskBtn").style = "display: none;";
    document.getElementById("addTaskBtn").style = "";
    document.getElementById("errorMessage").style = "display: none;"
});


// retrieving local storage
let cardsListStorage = localStorage.getItem("cardsList")
let cardIdsStorage = localStorage.getItem("cardIds")
console.log(JSON.parse(cardsListStorage), JSON.parse(cardIdsStorage))

if(cardsListStorage){
    TaskManager.cardsList = JSON.parse(cardsListStorage)
    TaskManager.cardIds = JSON.parse(cardIdsStorage)
    TaskManager.fillCards()
} 