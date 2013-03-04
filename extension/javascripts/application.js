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
            return $('#message-template').html();
        },

        template: function() {
            return Handlebars.compile(view.source());
        }
    };

    var methods = {
        init: function() {
            methods.buildSolution();
            methods.messageListener();
            methods.showOptions();
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
                var source = $('#message-template').html(),
                    template = Handlebars.compile(source),
                    html = template(data);

                $('#message-list').fadeIn(250, function() {
                   $(this).append(html); 
                });
                console.log(data);
            });
        },

        showOptions: function() {
            $('#show-options').on('click', function(e) {
                e.preventDefault();
                $('#options-container').slideDown();
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
