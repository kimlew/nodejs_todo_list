/*jslint browser: true*/
/*global window*/

/*jslint indent: 2 */
/*jslint todo: true */
/*global isFormFieldFilledIn */

//  *****   TO DO LIST - main script   *****

"use strict"; // Tells js interpreter to use strict mode.

var objectWithAllTodos; // Declare as a global object so accessible by any function.
var searchResultsList;

// Constructor - stores form data - Retrieves input data using constructor and 
// puts in todoItemObj 
// Note: data will be sent via node.js script to node.js server
function TodoItem(whoFor, task, dateDue="") {
  // dateDue is optional.
  //this.id = id; // Used for index? in LocalStorage before.
  this.whoFor = whoFor;
  this.task = task;
  this.dateDue = dateDue;
}

/***** FUNCTIONS *****/
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
  // Create object for form data.
  var aTodoItem = new TodoItem(whoFor, task, dateDue);
  
  // stringify() - takes object and turns into string in JSON
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
        
        window.location.reload(true); // Reloads entire page - ideal for AJAX
        // set to 'true' reloads a fresh copy from the server
        // otherwise, serves page from cache.
        
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
  
  var span = document.getElementById("submitted_item_msg");
  span.innerHTML = " The To Do data for " + 
      submitTodoObj.whoFor + " to " + 
      submitTodoObj.task + " before " +
      submitTodoObj.dateDue + " has been submitted.";
}

function display_updated_msg(respText) {
  console.log("respText HAS: ", respText); 
  // respText HAS:  {"todo_id":24,"done":0}
  
  var doneStatus = "";
  var updateTodoObj = JSON.parse(respText);
  console.log("CONTAINED IN updateTodoObj: ", updateTodoObj);
  
  if (updateTodoObj.done == 0) {
    doneStatus = "To Do";
  }
  else { // respText.done == 1
    doneStatus = "Done";
  }
  console.log("doneStatus is: ", doneStatus);
  
  var span = document.getElementById("updated_item_msg");
  alert(" The status has changed to: " + doneStatus);
} // End of: display_updated_msg()

function display_search_result_msg(aMsg) {
  var span = document.getElementById("search_result_msg");
  span.innerHTML = aMsg;
}

function displaySingleToDo(aTodoItemFromObj, li) {
  // Format date. Was: 2017-07-12T06:00:00.000Z
  var dateDue = aTodoItemFromObj.date_due;
  var dateDueSubstr = dateDue.substr(0,10); // +' '+ dateDue.substr(11,8);

  // Add todoItemFromArrObj somehow to li.
  li.innerHTML = aTodoItemFromObj.who_for + " must " + 
    aTodoItemFromObj.task + " - before the end of " + dateDueSubstr;
    
  //return li.innerHTML;
}

function updateList(respTextFromGet) {      
  /* Take the data received back from XMLHttpRequest object (which is a JSON 
     string) and convert it into a JavaScript object. Loop through resulting
     array and add new elements to the DOM, 1 per item in the array. */ 
  
  //console.log("respTextFromGet: ", respTextFromGet);
  
  var todoListUl = document.getElementById("todoList");
  
  // Turn JSON into an array-like object.
  objectWithAllTodos = JSON.parse(respTextFromGet); 
  
  console.log("objectWithAllTodos: ", objectWithAllTodos);
  
  for (var i = 0; i < objectWithAllTodos.length; i++) {
    var todo_id;
    var done;
    var aTodoItemFromObj = objectWithAllTodos[i]; // Is specific todo_id from db.
    
    console.log("ITEM AT " + i + " : ", objectWithAllTodos[i]);
    console.log("aTodoItemFromObj is: ", aTodoItemFromObj);
    
    var li = document.createElement("li");  
    
    // Set todoItem.id to li's id. 
    // Needed to correctly identify individual list item
    // li - is parent element for spanIsDone
    li.setAttribute("id", aTodoItemFromObj.todo_id);
    
    // Create spanIsDone to initially style the empty checkbox & checkmark in 
    // checkbox. Get current aTodoItemFromObj.done & display blank checkbox OR
    // checked checkbox depending on what it is.
    var spanIsDone = document.createElement("span");
    
    console.log("li HAS: ", li);
    console.log("aTodoItemFromObj.todo_id HAS: ", aTodoItemFromObj.todo_id);
    console.log("aTodoItemFromObj.done HAS:", aTodoItemFromObj.done);
    
    if (aTodoItemFromObj.done == 0) {
      spanIsDone.setAttribute("class", "todo"); // Set for styling of blank checkbox.
      spanIsDone.innerHTML = "&#x25a2;&nbsp;To Do:&nbsp;";
      // Leave text colour as li colour
      // li.setAttribute("class", "todoLi");
    }
    else { // == 1
      spanIsDone.setAttribute("class", "done"); // Set for styling of checkmark.
      spanIsDone.innerHTML = "&#10004;&nbsp;&nbsp;Done:&nbsp;"; //&#9745;
      // Set li class to grey - to de-emphasize in list
      li.setAttribute("class", "done_li");
    }   
        
    displaySingleToDo(aTodoItemFromObj, li);

    todoListUl.appendChild(li);
    li.prepend(spanIsDone); // Creates spanIsDone span & links it to li
    
    console.log("li after PREPEND HAS: ", li);
    console.log("CHILD: ", li.firstElementChild);
    
    // AT this pt: mid thru loop - so spanIsDone's done value for indiv item 
    // Want: Clickable spanIsDone checkbox - starts blank
    // If spanIsDone is clicked && current spanIsDone.done value !=
    // done column value from db passed in as argument(aTodoItemFromObj.done)
    // then execute updateDb()
    
    // spanIsDone.onclick - with anonymous function to pass in click event data 
    // with changed done value 
    spanIsDone.onclick = function(clickEventData) {  
      // Create 3 local variables from click event & target - for use ONLY inside 
      // this anonymous function - for the clicked span - to get clicked done status
      // Do NOT reference aTodoItemFromObj inside this anonymous function 
      // - since it has done status from db
      // Then get id associated to parent element, li. Use that id - for new
      // done status. Change spanIdDone based on that status.

      var clickedSpan = clickEventData.target;
      var clickedSpanParentId = clickedSpan.parentElement.id; // id here is a DOM id
      
 // Want: span attribute of "class" to see if value is "todo" or "done" 
 // Goal: toggle back to To Do status
     
      var clickedSpanAttribVal = clickedSpan.getAttribute("class");
      //B4: var clickedSpanIsDoneStatus = clickedSpanIsDone.parentElement.done;

      console.log("CLICKED span ID & CLASS ATTR:", clickedSpanParentId, clickedSpanAttribVal);
            
      // CHECK what spanIsDone NOW from the most recent CLICK has
      // Then convert clickedSpanAttribVal value of "todo", "done" TO 0, 1 
      // so in correct form for db.
      var convertedSpanAttribValue;
      
      if (clickedSpanAttribVal == "done") { // So change it to "todo"
      // B4: if (clickedSpanIsDoneStatus == 0) {
        clickedSpan.setAttribute("class", "todo"); // Set for styling of blank checkbox.
        clickedSpan.innerHTML = "&#x25a2;&nbsp;To Do: ";
        
        // Set class to li.done - to change text to Med Grey
        // clickedLiElem.setAttribute("class", "done");
        
        convertedSpanAttribValue = 0;
      }
      else { // == "todo" So change it to "done"
        clickedSpan.setAttribute("class", "done"); // Set for styling of checkmark.
        clickedSpan.innerHTML = "&#10004;&nbsp;&nbsp;Done: &nbsp;"; //#9745; Note: Replaced some &nbsp;
        convertedSpanAttribValue = 1;
      }
      
      console.log("VALUE OF span ID & CONVERTED CLASS ATTR:", clickedSpanParentId, convertedSpanAttribValue);
      
      prepAndSendToWebServerForDb(clickedSpanParentId, convertedSpanAttribValue);
    }; // End of: spanIsDone.onclick = function() {
    
    //updateDb(todo_id, done);
    
  } // End of: for loop
  
} // End of: updateList()

function prepAndSendToWebServerForDb(clickedSpanParentId, convertedSpanAttribValue) {
  console.log("IN prepAndSendToWebServerForDb()" );
  
  // NEED: Create JSON object with changed data sorta like: aTodoItem.done = true
  // to send with xhr request "body" not "header" - to be processed by web_server.js
  // stringify() - takes object and turns into string in JSON
  
  // Now: Using convertedSpanAttribValue with value of "todo" or "done" vs 0 or 1
  // B4: condition ? exprTrue : exprFalse
  // B4: If condition true, ternary operator evaluates exprTrue. 
  // B4: Otherwise evaluates to exprFalse.
  // Note: If done is undefined - interpreted as 0
  var doneToUpdateObj = { todo_id: clickedSpanParentId, done: convertedSpanAttribValue };
  doneToUpdateObj = JSON.stringify(doneToUpdateObj);
  
  console.log("OBJ for DB is: " + doneToUpdateObj);

/* Create an XMLHttpRequest object, load it with a URL and HTTP request type,
   along with a handler. Then send request and wait for data to arrive.
   When it does, handler is called.
*/
  // XMLHttpRequest obj - built into all modern browsers-to request data from a server
  // Use XMLHttpRequest - to send string in JSON string format via POST to web server
  // Use XMLHttpRequest constructor - to create new request object
  var xhr = new XMLHttpRequest();
  var url = "url"; // a DOMString representing the URL - to send data to & get 
  // data from web server
  
  // State request type - so the XMLHttpRequest can verify the connection
  // Tells request object URL what retrieve & request type to use
  // open - ONLY sets up the request - still MUST use send()
  xhr.open("PUT", url, true); // Note: For UPDATE, use PUT.
  xhr.setRequestHeader("Content-type", "application/json");
  
  // console.log("xhr is: " + xhr);
  
  // Set up an onload Handler - called when data arrives (vs waiting for data)
  // responseText - property of request object - holds data from HTTP GET retrieval
  xhr.onload = function () {
    if (xhr.readyState === xhr.DONE && xhr.status === 200) {
        window.location.reload(true); // Reloads entire page - ideal for AJAX
        // set to 'true' reloads a fresh copy from the server
        // otherwise, serves page from cache.
        
        display_updated_msg(xhr.responseText); // User message of Done status
        //console.log("xhr response & responseText: ", xhr.response, xhr.responseText);
    }
  }; // End of: xhr.onload = function () {

  // send() - tells request to go & get the data that sends request to web server
  // Pass null - if not sending any data to remote service, e.g., request.send(null); 
  xhr.send(doneToUpdateObj);
  console.log("AFTER: xhr.send(doneToUpdateObj)");
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
        //console.log("xhr responseText:", xhr.responseText);
      }
    }; // End of: xhr.onreadystatechange = function () {
    
    xhr.send(); // Send the request and wait for the data to arrive. 
    // When the data arrives, the handler is called.
    // Note: request.send(null); Use null when NOT sending data to remote service.

} // End of: function getAllTodoItems() {

function deleteList() {
  var xhr = new XMLHttpRequest();
  var url = "url"; // URL for web server to get data from 
  // url - a DOMString representing the URL to send the request to
  
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
        //display_deleted_msg(xhr.responseText);
        console.log("xhr response & responseText: ", xhr.response, xhr.responseText);
    }
  }; // End of: xhr.onload = function () {

  // send() - tell request to go out and get the data which sends request to web server.
  // Pass null if not sending any data to remote service, i.e., request.send(null);
  xhr.send();
  console.log("AFTER: xhr.send()");

} // End of: function deleteList()

function getSearchAndTrim() {
  var searchTermToTrim = document.getElementById("searchTerm").value;
  var searchTerm = searchTermToTrim.trim();
  compareSearchTermToList(searchTerm);
}

function compareSearchTermToList(searchTerm) {
  // Empty the ul, searchResultsList - if it has contents, delete ALL li 
  // elements so empty ul at start of comparison for search.
  if ( !(searchResultsList == null) ) {
    while (searchResultsList.firstChild) {
      searchResultsList.removeChild(searchResultsList.firstChild);
    }
  }
  
  var searchCount = 0; // Initialize searchCount locally to 0 - so per search
  // Check searchTerm against all items in objectWithAllTodos
  for (var i = 0; i < objectWithAllTodos.length; i++) {
    var aTodoItemFromObj = objectWithAllTodos[i];
    
    //console.log("ITEM at " + i + " : ");
    //console.log(objectWithAllTodos[i]);
    
    // Create case INsensitive regex to use for comparison based on who_for & task
    var re = new RegExp(searchTerm, "i");
    
    if (aTodoItemFromObj.who_for.match(re) || aTodoItemFromObj.task.match(re)) {
      //console.log("aTodoItemFromObj.who_for is: " + aTodoItemFromObj.who_for);
      //console.log("aTodoItemFromObj.task is: " + aTodoItemFromObj.task);
      addSearchResultToPage(aTodoItemFromObj);
      searchCount++;
    }
    
    if (searchCount == 0) {
      display_search_result_msg("No match found.");
    }
    else {
      display_search_result_msg(searchCount + " matches found.");
    }
    
  } // End of: for()
  
} // End of: compareSearchTermToList()

function addSearchResultToPage(aTodoItemFromObj) {
  searchResultsList = document.getElementById("searchResultsList");
  var searchListFrag = document.createDocumentFragment();
  var liSearchResult = document.createElement("li");
  
  displaySingleToDo(aTodoItemFromObj, liSearchResult);
  searchListFrag.appendChild(liSearchResult);
  searchResultsList.appendChild(searchListFrag);
}

function init() {
  var submitButton = document.getElementById("submitButton");
  var clearListButton = document.getElementById("clearListButton");
  var searchButton = document.getElementById("searchButton");
  
  getAllTodoItems();
  
  // Check to see if these button clicks are defined and if so, reference the
  // respective function.
  submitButton.onclick = getFormData;
  clearListButton.onclick = deleteList;
  searchButton.onclick = getSearchAndTrim;

} // End of init()

window.onload = init;
