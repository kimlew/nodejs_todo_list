/* KIM's starting point - for To Do List */
/* Create an express.js - Hello World server */
/* jshint esnext: true */
/* Run jshint but accept ES6 syntax */

// Test statement: console.log("Hello world")
// Test communic w port: Run express server on port 8080
//app.listen(8080, function(){
//  console.log("Express server is running on port 8080.");
//});

/*
// Require express and create an express app
var express = require('express');
var app = express();

var url = require('url');

// By default, express does NOT parse the body so we need this additional middleware 
var bodyParser = require('body-parser');

var querystring = require('querystring');
var async = require('async');

//var authenticator = require('./authenticator');
var storage = require('./storage.js');
var config = require('./config');
*/

// FROM: formServer.js - node.js Essent Train
var http = require("http");
var fs = require("fs");

var path = require("path");
var checkMimeType = true;

var port = process.env.PORT || 3001;  // 3001; //TCP port- e.g. 80;
var serverUrl = "127.0.0.1"; // Server address/Server IP: localhost

http.createServer(function(req, res) { // Called with each request. Callback 
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
      // TODO: parse(body), etc. here.
      // TODO:  Use body var - since it is the data in JSON string format.
      // Use parse() - to make it into an object. Need it in object form
      // to use its object properties - to INSERT INTO the db.
      
      // TODO: Remove HTML stuff and leave body - so just JSON
      // TODO: Validations on the resulting object BEFORE it is INSERT into db
      // TODO: database INSERT stuff here.
      // Since web server only knows how to talk to database - Must do
      // database stuff from node.js web server side.
      
      // TODO: For date: There might be a Date class in standard JavaScript library 
      // with parse date or date validation. Look up: JavaScript date class.
      // TODO: Set status code to 400 - if the date format is NOT correct.

      // HTTP header specifying the content type of the response
      // Write the message - with res.write() 
      // End the HTTP server response object - with res.end() - to send/render
      // message to the browser 
      console.log("IN req.on - with end()" );
          
      makeJsonIntoObj(body);
      //todoDataObj = JSON.parse(body);
      //console.log("todoDataObj is: " + todoDataObj);
      
      res.writeHead(200, {"Content-Type": "text/plain"});
      res.write(body);
      res.end(); // Tells HTTP Protocol - to end the response.
    }); // End of req.on("end", function() {

    
  } // End of: else if (req.method === "POST") {
  
}).listen(port, serverUrl); // TCP port and server address

//console.log("Web Server running at http://localhost:3000");
//console.log("There is now a server running on http localhost.");
console.log("Starting web server at " + serverUrl + ":" + port);

// Turn var body JSON string - into an object - as prep before going to db.
function makeJsonIntoObj(body) {
  todoDataObj = JSON.parse(body);
  console.log("todoDataObj is: " + todoDataObj);
  
}

function getFile(localPath, res, mimeType) {
	fs.readFile(localPath, function(err, contents) {
		if(!err) {
			res.setHeader("Content-Length", contents.length);
			if (mimeType != undefined) {
				res.setHeader("Content-Type", mimeType);
			}
			res.statusCode = 200;
			res.end(contents);
		} else {
			res.writeHead(500);
			res.end();
		}
	});
}
