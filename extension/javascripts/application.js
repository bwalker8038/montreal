Montreal = {};

Montreal.Project = (function ($) {
    var properties = { 
        solutionPath: function() {
            return $('#solution-path').val();
        },

        projectName: function() {
            return $('#specific-project').val();
        }
    };

    var methods = {
        init: function() {
            methods.buildSolution();
        },

        buildSolution: function() {
            $('#build-project').on('click', function(e) {
                var data = {
                    solutionPath: properties.solutionPath(),
                    projectName:  properties.projectName()
                };

                Socket.postTask(data);
            });
        },

        saveOptions: function() {
            chrome.storage.sync.set({
                'buildSoution': properties.solutionPath(), 
                'projectName':  properties.projectName()
            }, function() {
                console.log("build options saved");
            });
        }
    };

    return {
        init: methods.init
    };
}(jQuery));


$(document).ready(function() {
    Montreal.Project.init();
});
