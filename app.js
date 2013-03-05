
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , https = require('https')
  , path = require('path')
  , fs = require('fs')
  , util = require('util')
  , chokidar = require('chokidar')
  , spawn = require('child_process').spawn;


var options = {
    key:  fs.readFileSync('cert.pem'),
    cert: fs.readFileSync('cert.pem')
};

var app = express()
  , server = https.createServer(options, app)
  , io = require('socket.io').listen(server);

app.configure(function(){
  app.set('port', process.env.PORT || 4000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

var saveFile = function(data, filePath) {
    var data = JSON.stringify(data);
    console.log(data);
    fs.writeFile(filePath, data, function(err) {
        if(err) {
            console.log('An error occurred when trying to save file.json');
            console.log(err.message); 
        }
        console.log('file.json saved successfully');
    });
}

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

// initialize the server
server.listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});

io.sockets.on('connection', function(socket) {
    socket.on('project', function(data) {
        var error_count = null
            , status  = null
            , command = [
                '/s', '/c', 
                'msbuild ' + data.solutionPath + ' /m'
            ];

        if(data.projectName !== '') {
            var command = [
                    '/s', '/c', 
                    'msbuild ' + data.solutionPath + ' /m /t:' + data.projectName
                ] ;
        }

        // Log Messages
        util.log('\033[32m'+'info: \033[0m build started');

        var spawnCommand = spawn('cmd', command);
        spawnCommand.stdout.setEncoding('utf8');
        spawnCommand.stdout.on('data', function(data) {
            util.log('\033[32m' + 'info: ' + '\033[0m' + data);
             
            var lines = data.split('\n')
              , success;

            lines.forEach(function(str) {
                if(str.match('Build Succeeded') > -1 ) {
                    success = true;
                } else {
                    success = false;
                }
                
                while(str.indexOf('Time Elapsed') > -1) {
                    if(success === true) {
                        status = "App Build was successful.";
                    } else if(success === false) {
                        status = "App build failed. Please check the log for errors.";
                    } else {
                        status = "You where eaten by a grue. Something went wrong."
                    }

                    socket.emit('message', { 
                        status: status, 
                        log: lines, 
                        success: success,
                        dateCreated: new Date().toUTCString()
                    });
                    break;
                }
            });
        });
    }); 
});


