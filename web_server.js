/* To Do List */

// For JSLint:
/*jslint node: true */

// For JSHint:
/*jshint strict:false */

//Run JSHint but accept ES6 syntax.
/* jshint esnext: true */

// Test communic w port: Run express server on port 8080
//app.listen(8080, function(){
//  console.log("Express server is running on port 8080.");
//});

/*
var url = require('url');
var querystring = require('querystring');
var async = require('async');

var authenticator = require('./authenticator');
var storage = require('./storage.js');
var config = require('./config');
*/

var pg = require("pg");
pg.defaults.ssl = false; // Set to false for local till I know how to configure
// Postgres to use SSL locally.
// Sort of like HTTPS - but for communication with your database
// Might be a standard on Heroku and most PROD environs
// Note: To run on Heroku, set to true for a secure
// way to communicate. Locally, it doesn't matter (and I didn't set up to use
// SSL on my local - which depends on how my Postgres is installed & my web
// server talks to Postgres, i.e., is the way it talks encrypted or not.

// FROM: formServer.js - node.js Essent Train
var http = require("http");
var fs = require("fs");

var path = require("path");
var checkMimeType = true;

var port = process.env.PORT || 3001;  // 3001; //TCP port-e.g. 80;
var serverIpAddress = "127.0.0.1"; // Server IP address: localhost

var connectionStr = process.env.DATABASE_URL || 'postgres://localhost:5432/nodejs_todo_list';
// Heroku sets up the 1st choice to use Postgres. The 2nd one is the URL I 
// state for Postgres.

/***** FUNCTIONS *****/
function sendRegularRequest(connectionStr, req, res) {
  // IS regular request - read file - For GETting a FILE

  var filename = req.url || "/index.html"; // Defaults to index.html
  // http://localhost:3001 OR http://localhost:3001/ OR
  // http://localhost:3001/index.html

  // Test if filename === /. / is root URL and is equivalent to index.html
  if (filename === "/") {
     filename = "/index.html"; 
  }

  console.log("Method is GET: ", req.method, " URL is: ", req.url);
  
  var ext = path.extname(filename);
  var localPath = __dirname;

  var validExtensions = {
          ".html" : "text/html",
          ".js": "application/javascript",
          ".css": "text/css",
          ".txt": "text/plain",
          ".jpg": "image/jpeg",
          ".gif": "image/gif",
          ".png": "image/png",
          ".woff": "application/font-woff",
          ".woff2": "application/font-woff2",
          ".ico": "image/x-icon"
  };

  var validMimeType = true;
  var mimeType = validExtensions[ext];

  if (checkMimeType) {
    validMimeType = validExtensions[ext] != undefined;
  }

  if (validMimeType) {
    localPath += filename;

    fs.exists(localPath, function(exists) {
      if (exists) {
        console.log("Serving file: " + localPath);
        getFile(localPath, res, mimeType);
      } 
      else {
        console.log("File not found: " + localPath);
        res.writeHead(404);
        res.end();
      }
    }); // End of:fs.exists(localPath, function(exists) {
  } // End of: if (validMimeType) {

  else {
    console.log("Invalid file extension detected: " + ext + " (" + filename + ")")
  }
} // End of: sendRegularRequest(connectionStr, req, res)

function sendAjaxRequest(connectionStr, req, res) {
  // IS AJAX request - since header contains XMLHttpRequest in x-requested-with
  // GET - related to writing to JSON file with new todo data, i.e, GET data 
  // from db
  // After database created, run SELECT query - to test connection to & retrieval
  // from db - to display To Do List
  
  console.log("MADE it past line with: x-requested-with ");
  
  pg.connect(connectionStr, function(err, client) {
    var results = [];
    var selectQueryStr = 'SELECT * FROM todo_list_tb ORDER BY date_due DESC, who_for;'

    if (err) throw err;
    console.log('Connected to Postgres.');

    // Run a SQL query via the query() method
    client
      .query(selectQueryStr)
    
      .on('row', function(row) { // Stream results back.  
        console.log("IN GET " + JSON.stringify(row));
      
        results.push(row);
        //results += row;  // += is turning the result into a string DAMMIT!
        
        console.log("RESULTS has: " + results);
        return results; // Returns to client results array with data as JSON.
      
      })   
    
      // Confirms everything before this worked.
      // After all data is returned, close connection.
      .on('end', () => {
        console.log("Attempting to send results:", JSON.stringify(results));
        console.log("About to write the head");
      
        res.writeHead(200, {"Content-Type": "application/json"});
        console.log("Wrote the head");
      
        res.write(JSON.stringify(results));
        console.log("Wrote the results");
      
        res.end(); // Tells HTTP Protocol - to end the response
        console.log("End of response");
      
        client.end();
      }); // End of: .on('end', () => {
    
  });  // End of: pg.connect(connectionStr, function(err, client) {
} // End of: sendAjaxRequest()

function connAndInsertToDb(connectionStr, req, res) {
  console.log("Method is POST: ", req.method);
  
  // body - variable is a JSON string
  // String that will have POST JSON data added to it in chunks.
  var body = ""; 
  
  req.on("data", function(chunk) {
    console.log("IN req.on - that passes data FOR body with chunks)");
    // To manipulate body and prepare it for insertion into db
    // Later: Entire concatenated string turned into object
    
    body += chunk;
    console.log("body has: " + body);
  }); // End of req.on("data", function(chunk) {
   
  req.on("end", function() {
    // DO ALL db stuff on node.js web server side - since ONLY web server knows
    // how to talk to db 
       
    // DO: For DATE: - might be a Date class in standard JavaScript library 
    // with parse date or date validation. Look up: JavaScript date class.
    // DO: Set status code to 400 - if the date format is NOT correct.

    console.log("IN req.on - with end()" );
        
    // Convert body JSON string into object with properties - as prep for 
    // INSERT to db
    var dataObj = JSON.parse(body);
    console.log("dataObj is: " + dataObj);
    
    // DO: Do Validations - on resulting object BEFORE INSERT INTO db

// TEST db connection - after database created, run SELECT query
/*      pg.connect(connectionStr, function(err, client) {
      var selectQueryStr = 'SELECT * FROM todo_list_tb;'
      
      if (err) throw err;
      console.log('Connected to Postgres.');

      // Run a SQL query via the query() method
      client
        .query(selectQueryStr)
        .on('row', function(row) {
          console.log("IN POST " + JSON.stringify(row));
        });
    });  // End of: pg.connect(connectionStr, function(err, client) {     
*/      
 
    /*** INSERT ***/
    // With Postgres server up and running on port 5000, make database
    // connection with the pg library.
    // Create a new instance of the database Client to interact with database.
    // Establish communication it via the connect() method.
    // Client is similar to:: dbConnection variable 

    pg.connect(connectionStr, function(err, client) {
      var insertQueryStr = 
      "INSERT INTO todo_list_tb (who_for, task, date_due) VALUES ('" + 
       dataObj.whoFor + 
       "', '" +
       dataObj.task +
       "', '" +
       dataObj.dateDue +
       "');"
       
      if (err) throw err;
      console.log('Connected to Postgres.');

      // Doing an INSERT
      client.query(insertQueryStr);
    }); // End of pg.connect() {
    
    // Add to header - to confirm that all code before this point worked
    // HTTP header - specifies the content type of the response
    // Write the message - with res.write() 
    // End the HTTP server response object - with res.end() - to send/render
    // message to the browser 
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write(body);
    res.end(); // Tells HTTP Protocol - to end the response.
  }); // End of req.on("end", function() { 

} // End of: connAndInsertToDb()

function connAndUpdateInDb(connectionStr, req, res) {
  console.log("In UPDATE: ", req.method);
    
  var body = ""; 
  
  // Manipulate body and prepare it for insertion into db
  // Passes data FOR body with chunks
  // Later: Entire concatenated string - turned into object
  req.on("data", function(chunk) {
    body += chunk;
    console.log("BODY has: " + body);
  }); // End of req.on("data", function(chunk) {
  
  // Convert body JSON string into object with properties t0 prep for db UPDATE 
  req.on("end", function() {
    var dataObj = JSON.parse(body);
    console.log("dataObj is: " + dataObj);
  
    pg.connect(connectionStr, function(err, client) {
      var insertQueryStr = 
      "UPDATE todo_list_tb (done) VALUES ('" + dataObj.done + "');"
       
      if (err) throw err;
      console.log('Connected to Postgres.');

      // Doing an INSERT
      client.query(insertQueryStr);
    }); // End of pg.connect() {
    
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write(body);
    res.end(); // Tells HTTP Protocol - to end the response.
  }); // End of req.on("end", function() { 
  
} // End of: connAndUpdateInDb()

function connAndDeleteFromDb(connectionStr, req, res) {
    console.log("Method is DELETE: ", req.method);

    pg.connect(connectionStr, function(err, client) {
      console.log("INSIDE pg.connect() of DELETE");
      
      var deleteQueryStr = "DELETE FROM todo_list_tb;";
      client.query(deleteQueryStr);
    }); // End of pg.connect() {

    req.on("end", function() {
      console.log("INSIDE req.on() of DELETE"); 
      
      // Add to header - to confirm that all code before this point worked
      res.writeHead(200, {"Content-Type": "text/plain"});
      res.end(); // Tells HTTP Protocol - to end the response
    }); // End of req.on("end", function() {
} // End of: connAndDeleteFromDb()

function getFile(localPath, res, mimeType) {
	fs.readFile(localPath, function(err, contents) {
		if (!err) {
			res.setHeader("Content-Length", contents.length);
			if (mimeType != undefined) {
				res.setHeader("Content-Type", mimeType);
			}
			res.statusCode = 200;
			res.end(contents);
		} 
		else {
			res.writeHead(500);
			res.end();
		}
	}); // End of: fs.readFile(localPath, function(err, contents) {
} // End of: function getFile(localPath, res, mimeType) {

/***** The MAIN function with all other function calls *****/
http.createServer(function (req, res) { // Called with each request.
  // Callback function passes HTTP req, HTTP res.
  // req and res parameters - in ready state when callback function is invoked
  
  console.log("req.method is: ", req.method);
  console.log("req.url is:    ", req.url);
  console.log("req.headers is %o: ", req.headers);
  
  if (req.method === "GET") {
    // Determine if AJAX request or normal request, e.g., file.
    // AJAX request - if 'XMLHttpRequest' in req.headers["x-requested-with"]
    // Regular request - if NO 'XMLHttpRequest' in req.headers["x-requested-with"]
    
    if (req.headers["x-requested-with"] == 'XMLHttpRequest') {
      sendAjaxRequest(connectionStr, req, res);
    }
    else { // req.headers["x-requested-with"] != 'XMLHttpRequest'
      sendRegularRequest(connectionStr, req, res);
    }   
  } // End of: if (req.method === "GET") {
  
  // With changes on client-side, req.url will now have diff values depending on
  // whether button click is: Submit (POST method) or Clear To Do List (DELETE) 
  else if (req.method === "POST") {
    connAndInsertToDb(connectionStr, req, res);
  } // End of: else if (req.method === "POST") {
  
  else if (req.method === "UPDATE") {
    connAndUpdateInDb(connectionStr, req, res);
  } // End of: else if (req.method === "POST") {
  
  else if (req.method === "DELETE") {
    connAndDeleteFromDb(connectionStr, req, res);
  } // End of: else if (req.method === "DELETE") {
  
}).listen(port /*, serverIpAddress */); 
// TCP port and server IP address - DON'T exclude 2nd param when deploying 
// to Heroku

//console.log("TEST-Web Server running at localhost at http://localhost:3000");
console.log("Starting web server at: " + port);
