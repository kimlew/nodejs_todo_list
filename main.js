
//var hello = require('./hello');
//hello.world();

var exec = require("child_process").exec;

/*
exec("git version", function(err, stdout) {
  if (err) {
    throw err;
  }
  
  console.log("Git Version Executed");
  console.log(stdout);
});
*/

/*
exec("ls", function(err, stdout) {
  if (err) {
    throw err;
  }
  
  console.log("Listing Finished");
  console.log(stdout);
});
*/
//exec("open -a Terminal .");
//exec("open http://www.kimlew.com");
exec("open http://localhost:3001/index.html");