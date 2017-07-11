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
  var clearListButton = document.getElementById("clearListButton");
  
  if (clearListButton.onclick) {
    deleteList();
  }
  
  getAllTodoItems();
  submitButton.onclick = getFormData;

} // End of init()

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
  // XMLHttpRequest object - built into all modern browsers-to request data from a server
  // Use XMLHttpRequest - to send string in JSON string format via POST to web server
  // Use XMLHttpRequest constructor - to create new request object
  var xhr = new XMLHttpRequest();
  var url = "url"; // URL for web server to get data from 
  // url - a DOMString representing the URL to send the request to.
  
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
        display_submitted_msg(xhr.responseText); //whoFor, task, dateDue);
        //console.log("xhr response & responseText: ", xhr.response, xhr.responseText);
    }
  }; // End of: xhr.onload = function () {

  // send() - tell request to go out and get the data which sends request to web server.
  // Pass null if not sending any data to remote service, i.e., request.send(null);
  xhr.send(aTodoItemAsString);
  console.log("AFTER: xhr.send(aTodoItemAsString)");

} // End of: function putFormDataInObj()
  
function display_submitted_msg(respText) { //whoFor, task, dateDue) {
  var submitTodoObj = JSON.parse(respText);
  
  var span = document.getElementById("user_msg");
  span.innerHTML = " The To Do data for " + 
      submitTodoObj.whoFor + " to " + 
      submitTodoObj.task + " before " +
      submitTodoObj.dateDue + " has been submitted.";
}

function updateList(respTextFromGet) {      
  /* Take the data received back from XMLHttpRequest object (which is a JSON 
     string) and convert it into a true JavaScript object. Loop through resulting
     array and add new elements to the DOM, 1 per item in the array. */ 
  
  //console.log("respTextFromGet: ", respTextFromGet);
  
  var todoListUl = document.getElementById("todoList");
  var todoListObj = JSON.parse(respTextFromGet); // Turns JSON into an array object.
  
  console.log("todoListObj: ", todoListObj);
  
  for (var i = 0; i < todoListObj.length; i++) {
    var todoItemFromArrObj = todoListObj[i];
    var li = document.createElement("li");
    
    // Sets the value of todoItem to the li element.
    li.setAttribute("class", "todoItem");
    
    // Add todoItemFromArrObj somehow to li.
    li.innerHTML = todoItemFromArrObj.who_for + " must " + 
      todoItemFromArrObj.task + " before " +
      todoItemFromArrObj.date_due;
    
    todoListUl.appendChild(li);
    
    //console.log("todoItemFromArrObj: ", todoItemFromArrObj);
    //console.log("li is: ", li.value);
  }
  //console.log("IN updateList() ");
}
 
function getAllTodoItems() {
    var xhr = new XMLHttpRequest();
    var url = "url"; // URL for web server to get data from.
  
    // open - ONLY sets up: request with a URL & tells request object request 
    // type to use - so the XMLHttpRequest can verify connection
    // HTTP GET request - standard means of retrieving HTTP data

// Load xhr with a URL and HTTP request type, along with a handler
    xhr.open("GET", url);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("x-requested-with", "XMLHttpRequest");
      
    console.log('IN xhr.open(GET, url)');
    console.log("xhr: " + xhr);
    console.log("");

    xhr.onreadystatechange = function () {
      console.log("IN .onreadystatechange BEFORE if");
      console.log("xhr.readyState:", xhr.readyState);
      console.log("xhr.DONE:", xhr.DONE, " xhr.status:", xhr.status);
      /* Full list of readyState values:
          State  Description
          0      The request is not initialized
          1      The request has been set up
          2      The request has been sent
          3      The request is in process
          4      The request is complete  */

      if (xhr.readyState == 4 && xhr.status == 200) { 
      //if (xhr.readyState == xhr.DONE && xhr.status == 200) {    

        if (xhr.responseText) {
          updateList(xhr.responseText);
        }
        else {
          console.log("Error: There is NO data.");
        }

        //console.log("xhr response:", xhr.response);
        console.log("xhr responseText:", xhr.responseText);
      }
    }; // End of: xhr.onreadystatechange = function () {
    
    xhr.send(); // Send the request and wait for the data to arrive. 
    // When the data arrives, the handler is called.
    // Note: request.send(null); Use null when NOT sending data to remote service.

} // End of: function getAllTodoItems() {

function deleteList() {
  var xhr = new XMLHttpRequest();
  var url = "url"; // URL for web server to get data from 
  // url - a DOMString representing the URL to send the request to.
  
  // Tells request object URL we want it to retrieve & request type to use
  // open - ONLY sets up the request - still have to send()
  // request type stated - so the XMLHttpRequest can verify the connection
  xhr.open("DELETE", url, true);
  xhr.setRequestHeader("Content-type", "application/json");
  
  console.log("IN xhr.open(DELETE, url, true) AND xhr is: " + xhr);
  
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
  xhr.send();
  console.log("AFTER: xhr.send()");

} // End of: function deleteList()

window.onload = init;
