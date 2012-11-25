window.socket = io.connect();

Montreal = {};

Montreal.File = {
    pathToWatch: function() {
        return $('#watch-path').val();
    },

    projectPath: function() {
        return $('#project-path').val();
    },

    buildSpecificProject: function() {
        if($('#build-single-project').prop('checked')) {
            return true;
        } else {
            return false;
        }
    },

    specificProjectPath: function() {
        if(Montreal.File.buildSpecificProject() === true) {
            return $('#specific-project').val();
        } else {
            return null;
        }
    },

    activeState: function() {
        return false;
    }
};

$(document).ready(function() {
    
    $('#build-single-project').on('click', function() {
        if( $(this).is(':checked')) {
            $('#specific-project').show();
        } else {
            $('#specific-project').hide();
            $('#specific-project').val(null);
        }
    });

    $('#watch-project').on('click', function() {
        Montreal.File.activeState = function() {
            return true;
        };

        $('#options-container').slideUp();
        $('#unwatch-project').show();
        $('#watch-project').hide();

        socket.emit('file', {
            pathToWatch: Montreal.File.pathToWatch(),
            projectPath: Montreal.File.projectPath(),
            specificProjectPath: Montreal.File.specificProjectPath(),
            activeState: Montreal.File.activeState()

        });
    });

    $('#unwatch-project').on('click', function() {
        Montreal.File.activeState = function() {
            return false;
        };

        $('#options-container').slideDown();
        $('#watch-project').show();
        $('#unwatch-project').hide();

        socket.emit('unwatch', {
            activeState: Montreal.File.activeState()
        });
    });
    
    var source = $('#message-template').html(),
        template = Handlebars.compile(source);

    socket.on('message', function(data) {
        if(Montreal.File.activeState() === true) {
            console.log(data.log);
            var html = template(data);
            $('#message-list').append(html);
        }
    });

});
