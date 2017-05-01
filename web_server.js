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

var port = 3001; //8000;
var serverUrl = "127.0.0.1"; // server IP: localhost

http.createServer(function(req, res) {
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
  }
  else if (req.method === "POST") {
    console.log("Method is POST?: ", req.method);
    
    var body = "";
    
    req.on("data", function(chunk) {
      console.log("IN req.on('data', function(chunk))");
      body += chunk;
      console.log("body has: " + body);

    });
    
     
    req.on("end", function() {
      // parse(body), etc. here.
      // Do validations on the resulting object BEFORE it is INSERT into db
      // Do the database INSERT stuff here.
      // There might be a Date class in standard JavaScript library with 
      // parse date or date validation thing in Look up: JavaScript date class.
      // I should set status code 400 if the date format is incorrect.
      
      // TODO:  Take out HTML stuff and leave body - so just JSON
      // Since web server only knows how to talk to database - Must do
      // database stuff from node.js web server side.
      // Use body var - since it is the data in JSON format - and get 
      // parse() - that makes it into an object - need it in object form
      // to be able to use object's properties to insert it into the db.
      // 
      
      res.writeHead(200, {"Content-Type": "text/html"});

      console.log("IN req.on('end', function()) w body in HTML");

      res.end();
      
    }); // End of req.on("end", function() {
  } // End of else if (req.method === "POST") {
  
}).listen(port, serverUrl);

//console.log("Web Server running at http://localhost:3000");
//console.log("There is now a server running on http localhost.");
console.log("Starting web server at " + serverUrl + ":" + port);

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
