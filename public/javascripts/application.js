window.socket = io.connect();

Montreal = {};

Montreal.Project = (function ($, socket, Handlebars) {
    var properties = { 
        solutionPath: function() {
            return $('#solution-path').val();
        },

        projectName: function() {
            return $('#specific-project').val();
        }
    };

    var view = {
        source: function() {
            return $('message-template').html();
        },

        template: function() {
            return Handlebars.compile(view.source());
        }
    };

    var methods = {
        init: function() {
            methods.buildSolution();
            methods.messageListener();
        },

        buildSolution: function() {
            $('#build-project').on('click', function(e) {
                socket.emit('project', {
                    solutionPath: properties.solutionPath(),
                    projectName: properties.projectName()
                });

                $('#options-container').slideUp();
            });
        },

        messageListener: function() {
            socket.on('message', function(data) {
                //var html = view.template(data);
                //$('#message-list').append(html);
                 console.log(data);
                if(data.success === true) {
                    $('#options-container').slideDown();
                }
            });
        }
    };

    return {
        init: methods.init
    };
}(jQuery, socket, Handlebars));


$(document).ready(function() {
    Montreal.Project.init();
});
