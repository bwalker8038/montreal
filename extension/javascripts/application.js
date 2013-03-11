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
            methods.loadOptions();
        },

        buildSolution: function() {
            $('#build-project').on('click', function(e) {
                var data = {
                    solutionPath: properties.solutionPath(),
                    projectName:  properties.projectName()
                };

                Socket.postTask(data);
                methods.saveOptions();
            });
        },

        saveOptions: function() {
            chrome.storage.sync.set({
                'buildSoution': properties.solutionPath(), 
                'projectName':  properties.projectName()
            }, function() {
                console.log("build options saved");
            });
        },

        loadOptions: function() {
            var $project = $('#specific-project'),
                $path    = $('#solution-path');

            chrome.storage.local.get(['buildSolution', 'projectName'], function(data) {
                if(data.length > 0) {
                    $path.val(data.buildSolution);
                    $project.val(data.projectName);
                }
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
