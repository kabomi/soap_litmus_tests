
(function(){

    "use strict";
    var port = parseInt(process.argv[2]);
    var contentDir = "src/server/content/";
    var server = require("./server").init({
        port: port,
        mainFile: contentDir + 'index.html',
        notFoundFile: contentDir + '404.html'});

    server.start(function(){
        console.log("Server started");
    });
}());