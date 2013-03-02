var spawn = require('child_process').spawn
  , util = require('util')
  , path = require('path')
  , fs = require('fs');


var buildSolution = function(pathToSolution) {
	var command =  ['/s', '/c', 'msbuild ' + pathToSolution + '/m'];
	  , spawnCommand = spawn('cmd', command);

	spawnCommand.stdout.setEncoding('utf8');
	spawnCommand.stdout.on('data', function(data) {
	    util.log('\033[32m' + 'info: ' + '\033[0m' + data);
	     
	    var lines = data.split('\n')
	      , error_count
	      , status;
	    
	    lines.forEach(function(str) {
n	        if(str.match('not found') !== null) {
	            error_count += 1;
	        }
	    });

	    if(error_count > 0 ) {
	        status = "App Build Failed. Please Check the Error Log.";
	    } else {
	        status = "App Build was Successful.";
	    }
		util.log('\033[32m' + 'info: ' + '\033[0m' + status);
	});
};

