// http://nodeguide.com/beginner.html
// node.js program - to use node.js as web server on Mac.
// node.js IS the web server. 
// Run my JavaScript program on that web server
// Lola suggested: port 3001 - since 8080 like tutorial
// states is standard but already used by Apache.

 
// Includes the http core module. Assigns it to var http.
var http = require('http');

// Create server by calling http.createServer. 
// The argument passed into this call is a closure
// called whenever an http request comes in.
var server = http.createServer(function(req, res) {
  res.writeHead(200);
  res.end('node.js server has been created - There is an HTTP connection now.');
});

// Tells node.js the port on which to run server. 
// To run on port 80, your program needs to be executed as root.
server.listen(3001); 



