jQuery(function(){

    RedLocomotive({
        "baseUrl": '../../'
    }, function (E) {
        E.require('tests', function () {
            E.tests.create('#test', [
                {
                    "label": "loader module has loaded:",
                    "test": function(){ return typeof E.loader === "object" }
                },
                {
                    "label": "Core module has loaded:",
                    "test": function(){ return typeof E.core === "object" }
                },
                {
                    "label": "External tests module has loaded:",
                    "test": function(){ return typeof E.tests === "object" }
                }
            ]);
        });
    });
    
});