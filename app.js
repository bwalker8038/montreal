
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , util = require('util')
  , chokidar = require('chokidar')
  , spawn = require('child_process').spawn;


var app = express()
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
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
    socket.on('file', function(data) {
        console.log(data);

        var pathToWatch = data.pathToWatch
          , projectPath = data.ProjectPath
          , specificProjectPath = data.specificProjectPath
          , activeState = data.activeState
          , command = 'ls'
          , connectionNumber = 

          console.log(data)
          /*
          , command = "msbuild " + ProjectPath + " /m";
          if(specificProjectPath !== null) {
              command = command + " /t:" + specificProjectPath;
          }
          */

          var watcher = chokidar.watch(pathToWatch, {persistent: true});

          if(activeState === true ) {

                util.log('\033[32m'+'info: ' + '\033[0m' + pathToWatch + ' is being watched');
                   
                watcher.on('change', function(path) { 
                    util.log('\033[32m' +'info: '+ '\033[0m' + path + ' has updated');
                    
                    var spawnCommand = spawn(command);
                    spawnCommand.stdout.setEncoding('utf8');
                    spawnCommand.stdout.on('data', function(data) {
                        util.log('\033[32m' + 'info: ' + '\033[0m' + data);
                        
                        var lines = data.split('\n')
                          , error_count
                          , status;
                        
                        lines.forEach(function(str) {
                            if(str.match('not found') !== null) {
                                error_count += 1;
                            }
                        });

                        if(error_count > 0 ) {
                            status = "App Build Failed. Please Check the Error Log.";
                        } else {
                            status = "App Build was Successful.";
                        }

                        socket.emit('message', {status: status, log:data, dateCreated: new Date()});
                        util.log('\033[32m' + 'info: ' + '\033[0m' + status);
                        socket.on('unwatch', function(data) {
                            if(data.activeState === false) {
                                util.log('\033[32m' + 'info: ' + '\033[0m' + 'shutting down watcher and spawnCommand Process');
                                watcher.close();
                                spawnCommand.kill();
                            }
                        });
                    });
                });
          }
        }); 
});


