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
function TodoItem(forWho, task, dueDate="") {
  // dueDate is optional.
  //this.id = id; // Used for index? in LocalStorage before.
  this.forWho = forWho;
  this.task = task;
  this.dueDate = dueDate;
  //this.done = false;
}

//   ***** Functions *****
function init() {
  var submitButton = document.getElementById("submitButton");
  submitButton.onclick = getFormData;
} // End of init()

function getFormData() {
  var forWho = document.getElementById("forWho").value,
    task = document.getElementById("task").value,
    forWhoError = "Enter who the task is for.",
    taskError = "Enter the task.";

  if (isFormFieldFilledIn(forWho) === false) {
    // let taskError = "Enter who the task is for."; 
    document.getElementById("forWho_error").innerHTML = forWhoError;
    return; // Stops execution of isFormFieldEmpty() function.
  }
  document.getElementById("forWho_error").innerHTML = "";

  if (isFormFieldFilledIn(task) === false) {
    // let taskError = "Enter the task.";
    document.getElementById("task_error").innerHTML = taskError;
    return;
  
  if (isFormFieldFilledIn(dueDate) === false) {
    // let taskError = "Enter the due date.";
    document.getElementById("dueDate").innerHTML = taskError;
    return;
    
  }
  document.getElementById("task_error").innerHTML = "";

  putFormDataInObj(forWho, task);
} // End of: getFormData()

function putFormDataInObj(forWho, task) {
  console.log("YOU have made it into putFormDataInObj()");
  
  // Create object for form data.
  var aTodoItem = new TodoItem(forWho, task);
  console.log("aTodoItem is: " + aTodoItem);
  
  //stringify - takes object and turns into string
  var aTodoItemAsString = JSON.stringify(aTodoItem);
  console.log("aTodoItemAsString is: " + aTodoItemAsString);

  // Note: aTodoItem is: [object Object]
  // process_todo_data.js:71 aTodoItemAsString is: {"forWho":"Boris","task":"buy beer","dueDate":""}

/* Create an XMLHttpRequest object, load it with a URL and HTTP
  request type, along with a handler. Then send the request and wait for
  the data to arrive. When it does, the handler is called.
*/
  // Use XMLHttpRequest - to send string that is in JSON string format 
  // via POST to web server.
  // Use the XMLHttpRequest constructor - to create a new request object.
  var xhr = new XMLHttpRequest();
  console.log("xhr: " + xhr);
  var url = "url"; // This would be URL for web server to get data from.
  // var url = "http://someserver.com/data.json";
  
  // Tells the request object which URL we want it to retrieve
  // along with the kind of request it should use - use the standard
  // HTTP GET request. To do this, use the request object’s open method.

  // open - just sets up the request with a URL & tells the request object
  // the kind of request to use so the XMLHttpRequest can verify the connection
  // HTTP GET request - the standard means of retrieving HTTP data.
  xhr.open("POST", url, true); // request.open("GET", url);
  xhr.setRequestHeader("Content-type", "application/json");
  console.log('AFTER xhr.open(POST, url, true) AND xhr.setRequestHeader');
  
  /*
  // This might be for AJAX request and response.
  xhr.onreadystatechange = function () { 
      if (xhr.readyState == 4 && xhr.status == 200) {
          var json = JSON.parse(xhr.responseText);
          // Data received from server, is in JSON format. Use: JSON.parse
          // - to turn string of JSON text into JavaScript object
          console.log(json.email + ", " + json.password)
      }
  }
  */
  // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseText
  // Set up an onload Handler - is called when the data arrives (instead
  //  of just waiting for the data.
  // Handler checks: If DONE, i.e., if return code is 200/OK, continue.
  // responseText property of request object - holds data from 
  /// the HTTP GET retrieval.
  xhr.onload = function () {
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200) {
        display_submitted_msg(responseText);
        console.log("xhr response is:", xhr.response);
        console.log("xhr responseText is:", xhr.responseText);
      }
    }
  }; // End of: xhr.onload = function () {

  // Tell the request to go out and get the data with send()
  // which sends request to web server.
  // Pass null if not sending any data to the remote service.
  // i.e., request.send(null);
  xhr.send(aTodoItemAsString);
  console.log("AFTER: xhr.send(aTodoItemAsString)");

} // End of: function putFormDataInObj()

function display_submitted_msg(responseText) {
  var span = document.getElementById("user_msg");
  span.innerHTML = "The To Do data has been submitted.";
}
window.onload = init;