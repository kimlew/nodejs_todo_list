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

// Constructor - Retrieve input data using constructor and put in todoItemObj 
// - stores form data. Note: data will be sent to PHP script on server.
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
  console.log("dateDue is: " + dateDue);
  console.log("YOU have made it into putFormDataInObj()");
  
  // Create object for form data.
  var aTodoItem = new TodoItem(whoFor, task, dateDue);
  console.log("aTodoItem is: " + aTodoItem);
  
  //stringify - takes object and turns into string
  var aTodoItemAsString = JSON.stringify(aTodoItem);
  console.log("aTodoItemAsString is: " + aTodoItemAsString);

  // Note: aTodoItem is: [object Object]
  // process_todo_data.js:71 aTodoItemAsString is: {"whoFor":"Boris","task":"buy beer","dateDue":""}

/* Create an XMLHttpRequest object, load it with a URL and HTTP
  request type, along with a handler. Then send the request and wait for
  the data to arrive. When it does, the handler is called.
*/
  // Use XMLHttpRequest - to send string that is in JSON string format 
  // via POST to web server.
  // Use the XMLHttpRequest constructor - to create a new request object.
  var xhr = new XMLHttpRequest();
  var url = "url"; // URL for web server to get data from.
  // var url = "http://someserver.com/data.json";
  
  // Tells the request object which URL we want it to retrieve
  // along with the kind of request it should use
  // open - just sets up the request with a URL & tells the request object
  // the kind of request to use so the XMLHttpRequest can verify the connection
  // HTTP GET request - the standard means of retrieving HTTP data.
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json");
  
  console.log("xhr is: " + xhr);
  console.log('AFTER xhr.open(POST, url, true) AND xhr.setRequestHeader\n');
  
  // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseText
  // Set up an onload Handler - is called when the data arrives (instead of
  // waiting for the data. Handler checks: If DONE, i.e., if return code is 
  // 200/OK, then continue.
  // request object's responseText property - holds data from HTTP GET retrieval
  xhr.onload = function () {
    if (xhr.readyState === xhr.DONE && xhr.status === 200) {
        display_submitted_msg(xhr.responseText);
        console.log("xhr response is:", xhr.response);
        console.log("xhr responseText is:", xhr.responseText);
    }
  }; // End of: xhr.onload = function () {

  // Tell the request to go out and get the data with send()
  // which sends request to web server.
  // Pass null if not sending any data to the remote service.
  // i.e., request.send(null);
  xhr.send(aTodoItemAsString);
  console.log("AFTER: xhr.send(aTodoItemAsString)");

} // End of: function putFormDataInObj()

  // Probably for AJAX request and response.
  /*xhr.onreadystatechange = function () { 
      if (xhr.readyState == 4 && xhr.status == 200) {
          var todo_object = JSON.parse(xhr.responseText);
          // Data received from server, is in JSON format. Use: JSON.parse
          // - to turn string of JSON text into JavaScript object
          console.log(:todo_object is: " + todo_object)
      }
  }
  */
  
function updateList(responseText) {
  var todoListDiv = document.getElementById("todoList");
  var todoListObj = JSON.parse(responseText); // Turns JSON into object.
}
 
function getAllTodoItems() {
  var xhr = new XMLHttpRequest();
  var url = "url"; // URL for web server to get data from.
  
  // open - just sets up the request with a URL & tells the request object
  // the kind of request to use so the XMLHttpRequest can verify the connection
  // HTTP GET request - the standard means of retrieving HTTP data
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-type", "application/json");
  
  console.log("xhr is: " + xhr);
  console.log('AFTER xhr.open(GET, url, true) AND xhr.setRequestHeader\n');

  xhr.onload = function () {
    if (xhr.readyState === xhr.DONE && xhr.status === 200) {
        display_submitted_msg(xhr.responseText);
        console.log("xhr response is:", xhr.response);
        console.log("xhr responseText is:", xhr.responseText);
        
        // Pass xhr.responseText to updateList(). 
        updateList(xhr.responseText);  
    }
    xhr.send(null); // Since not sending any data to the remote service.
  }; // End of: xhr.onload = function () {

} // End of: function getAllTodoItems() {

window.onload = init;
