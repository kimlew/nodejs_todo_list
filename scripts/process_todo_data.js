/*jslint browser: true*/
/*global window*/

/*jslint indent: 2 */
/*jslint todo: true */
/*global isFormFieldFilledIn */

//  *****   TO DO LIST - main script   *****

"use strict"; // Tells js interpreter to use strict mode.

//var todosFromDb = []; // Global permanent array var - for items from db.
//var ulResults;
//var countFound = 0;

// Constructor - stores form data - Retrieves input data using constructor and 
// puts in todoItemObj 
// Note: data will be sent via node.js script to node.js server
function TodoItem(whoFor, task, dateDue="") {
  // dateDue is optional.
  //this.id = id; // Used for index? in LocalStorage before.
  this.whoFor = whoFor;
  this.task = task;
  this.dateDue = dateDue;
  //this.done = false;
}

//   ***** Functions *****
function init() {
  var submitButton = document.getElementById("submitButton");
  submitButton.onclick = getFormData;
  getAllTodoItems();
} // End of init()

function display_submitted_msg(respText) {
  var span = document.getElementById("user_msg");
  span.innerHTML = "The To Do data " + respText + " has been submitted.";
}

function getFormData() {
  var whoFor = document.getElementById("whoFor").value,
    task = document.getElementById("task").value,
    dateDue = document.getElementById("dateDue").value;
    
  var whoForError = "Enter who the task is for.",
    taskError = "Enter the task.",
    dateDueError = "Enter the due date.";
/*
  if (isFormFieldFilledIn(whoFor) === false) {
    // Assign taskError = "Enter who the task is for."; 
    document.getElementById("whoFor_error").innerHTML = whoForError;
    return; // Stops execution of isFormFieldEmpty() function.
  }

  if (isFormFieldFilledIn(task) === false) {
    // Assign taskError = "Enter the task.";
    document.getElementById("task_error").innerHTML = taskError;
    return;
  }
  
  if (isFormFieldFilledIn(dateDue) === false) {
    // Assign dateDueError = "Enter the due date.";
    document.getElementById("dateDue").innerHTML = dateDueError;
    return;
  }
*/
  putFormDataInObj(whoFor, task, dateDue);
} // End of: getFormData()

function putFormDataInObj(whoFor, task, dateDue) {
  var aTodoItem = new TodoItem(whoFor, task, dateDue); // Create object for form data.
  // stringify - takes object and turns into string in JSON
  var aTodoItemAsString = JSON.stringify(aTodoItem);
  
  //console.log("IN putFormDataInObj()");
  //console.log("dateDue is: " + dateDue);
  console.log("aTodoItem is: " + aTodoItem);
  console.log("aTodoItemAsString is: " + aTodoItemAsString);

  // Note: aTodoItem is: [object Object]
  // process_todo_data.js:71 aTodoItemAsString is: {"whoFor":"Boris","task":"buy beer","dateDue":""}

/* Create an XMLHttpRequest object, load it with a URL and HTTP request type,
   along with a handler. Then send request and wait for data to arrive.
   When it does, handler is called.
*/
  // Use XMLHttpRequest - sends string in JSON string format via POST to web server
  // Use XMLHttpRequest constructor - creates new request object
  var xhr = new XMLHttpRequest();
  var url = "url"; // URL for web server to get data from
  
  // Tells request object URL we want it to retrieve & request type to use
  // open - ONLY sets up the request - still have to send()
  // request type stated - so the XMLHttpRequest can verify the connection
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json");
  
  console.log('IN xhr.open(POST, url, true)');
  console.log("xhr is: " + xhr);
  
  // Set up an onload Handler - called when data arrives (vs waiting for data)
  // responseText - property of request object - holds data from HTTP GET retrieval
  xhr.onload = function () {
    if (xhr.readyState === xhr.DONE && xhr.status === 200) {
        display_submitted_msg(xhr.responseText);
        console.log("xhr response & responseText: ", xhr.response, xhr.responseText);
    }
  }; // End of: xhr.onload = function () {

  // send() - tell request to go out and get the data which sends request to web server.
  // Pass null if not sending any data to remote service, i.e., request.send(null);
  xhr.send(aTodoItemAsString);
  console.log("AFTER: xhr.send(aTodoItemAsString)");

} // End of: function putFormDataInObj()
  
function updateList(responseText) {
  var todoListUl = document.getElementById("todoList");
  var todoListObj = JSON.parse(responseText); // Turns JSON into object.
  
  for (var i = 0; i < todoListObj.length; i++) {
    var todoItemFromObj = todoListObj[i];
    var li = document.createElement("li");
    li.setAttribute("class", "todoItem");
    todoListUl.appendChild(li);
  }
  console.log("IN updateList() ");
}
 
function getAllTodoItems() {
    var xhr = new XMLHttpRequest();
    var url = "url"; // URL for web server to get data from.
  
    // open - ONLY sets up: request with a URL & tells request object request 
    // type to use - so the XMLHttpRequest can verify connection
    // HTTP GET request - standard means of retrieving HTTP data
    xhr.open("GET", url);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("x-requested-with", "XMLHttpRequest");
      
    console.log('IN xhr.open(GET, url)');
    console.log("xhr: " + xhr);
    console.log("");
    
/* NEVER makes it past this line - Why? **************************** 

*/

    xhr.onreadystatechange = function () {
      console.log("IN .onreadystatechange BEFORE if");
      console.log("xhr.readyState:", xhr.readyState);
      console.log("xhr status:", xhr.status);
      console.log("xhr.DONE:", xhr.DONE);

// Kim saw it make it in here - but was a status of 4.  maybe with Ctrl-C?
      if (xhr.readyState == xhr.DONE && xhr.status == 200) {     
        if (xhr.responseText) {
          updateList(xhr.responseText);
          //addTodosToPage();
        }
        else {
          console.log("Error: There is NO data.");
        }
      
        display_submitted_msg(xhr.responseText);

        console.log("xhr response:", xhr.response);
        console.log("xhr responseText:", xhr.responseText);
      
      }
    }; // End of: xhr.onreadystatechange = function () {
    
    xhr.send(); // param is null - when NOT sending any data to remote service
} // End of: function getAllTodoItems() {

window.onload = init;
