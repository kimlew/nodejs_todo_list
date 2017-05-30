/* KIM's starting point - for To Do List */

// For JSLint:
/*jslint node: true */

// For JSHint:
/*jshint strict:false */

//Run JSHint but accept ES6 syntax.
/* jshint esnext: true */

// Test statement: console.log("Hello world")
// Test communic w port: Run express server on port 8080
//app.listen(8080, function(){
//  console.log("Express server is running on port 8080.");
//});

/*
var querystring = require('querystring');
var async = require('async');

//var authenticator = require('./authenticator');
var storage = require('./storage.js');
var config = require('./config');
*/

var pg = require("pg");
//const pg = require('pg'); // ES6 feature 'const'

//var url = require('url');

// FROM: formServer.js - node.js Essent Train
var http = require("http");
var fs = require("fs");

var path = require("path");
var checkMimeType = true;

var port = process.env.PORT || 3001;  // 3001; //TCP port- e.g. 80;
var serverIpAddress = "127.0.0.1"; // Server IP address: localhost

var connectionStr = process.env.DATABASE_URL || 'postgres://localhost:5000/';

http.createServer(function (req, res) { // Called with each request. Callback
  // function passes HTTP req, HTTP res.
  // req and res parameters -in ready state when callback function is invoked.
  console.log("Request received-Am IN http.createServer(function(req, res) ");
  
  if (req.method === "GET") {
    var filename = req.url || "/index.html"; // Defaults to index.html
    // http://localhost:3001 OR http://localhost:3001/ 
    // OR http://localhost:3001/index.html
    
    // Test if filename === /  - which is root URL which is equivalent to index.html
    if (filename === "/") {
       filename = "/index.html"; 
    }
	
    console.log("Method is GET?: ", req.method);
    console.log("URL is: ", req.url);
        
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
        if(exists) {
          console.log("Serving file: " + localPath);
          getFile(localPath, res, mimeType);
        } else {
          console.log("File not found: " + localPath);
          res.writeHead(404);
          res.end();
        }
      });
    } 
    else {
      console.log("Invalid file extension detected: " + ext + " (" + filename + ")")
    }
    
    /* These are taken care of now in getFile() 
    res.writeHead(200, {"Content-Type": "text/html"});
    fs.createReadStream(filename, "UTF-8").pipe(res);
    */
    //var SampleJsonData = JSON.stringify([{"ElementName":"ElementValue"}]);
  } // End of: if (req.method === "GET") {
  
  else if (req.method === "POST") {
    console.log("Method is POST?: ", req.method);
    
    var body = ""; // String that will have POST JSON data added to it in chunks.
    
    req.on("data", function(chunk) {
      console.log("IN req.on - that passes data FOR body with chunks)");
      // body variable - is a JSON string
      // To manipulate it and prepare it for insertion into db: turn into object.
      
      body += chunk;
      console.log("body has: " + body);
    }); // End of req.on("data", function(chunk) {
     
    req.on("end", function() {
      // Since web server only knows how to talk to db - MUST do
      // db stuff from node.js web server side.

      // DO: Remove old HTML stuff and leave body - so just JSON      
      // DO: parse(body), etc. here.
      // DO: Use body var - since it is the data in JSON string format.
      // Use parse() - to make it into an object. Need it in object form
      // to use its object properties - to INSERT INTO the db.
         
      // DO: For DATE: - might be a Date class in standard JavaScript library 
      // with parse date or date validation. Look up: JavaScript date class.
      // DO: Set status code to 400 - if the date format is NOT correct.

      // HTTP header specifying the content type of the response
      // Write the message - with res.write() 
      // End the HTTP server response object - with res.end() - to send/render
      // message to the browser 
      console.log("IN req.on - with end()" );
          
      // Turn var body JSON string - into an object - as prep before going to db.
      var DODataObj = JSON.parse(body);
      console.log("DODataObj is: " + DODataObj);
      
      // DO: Do Validations - on resulting object BEFORE INSERT INTO db
      // DO: INSERT INTO db stuff here.
      // Call  insertFormDataToDb() here
      // insertFormDataToDb();
      
      
      // NICE TO HAVE: Check for if table exists - If not, create a table.
      var createTableQueryStr = 'CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
      pg.defaults.ssl = true;
      
      // Create a new instance of Client to interact with the database.
      // Establish communication with it via the connect() method.
      var client = new pg.Client(connectionStr);
      client.connect();
      
      // SELECT
      pg.connect(connectionStr, function(err, client) {
        if (err) throw err;
          console.log('Connected to Postgres. Getting schemas...');

        // Run a SQL query via the query() method
          client
            .query('SELECT table_schema,table_name FROM information_schema.tables;')
            .on('row', function(row) {
            console.log(JSON.stringify(row));
          });
      });      
          
      // INSERT - With your Postgres server up and running on port 5000, 
      // make a database connection with the pg library:
      var insertQueryStr = "INSERT INTO ";
      var query = client.query(insertQueryStr, function (error, result) {

      
      // i.e., Close communication with client object? via the end() method.
      client.end()
          
      });
      
      // Confirmation that everything before this worked fine.
      res.writeHead(200, {"Content-Type": "text/plain"});
      res.write(body);
      res.end(); // Tells HTTP Protocol - to end the response.
      
      
    }); // End of req.on("end", function() {
    
  } // End of: else if (req.method === "POST") {

}).listen(port /*, serverIpAddress */); // TCP port and server IP address - DON'T 
// exclude 2nd param when deploying to Heroku

//console.log("Web Server running at http://localhost:3000");
//console.log("There is now a server running on http localhost.");
console.log("Starting web server at " + serverUrl + ":" + port);

// insertFormDataToDb()

