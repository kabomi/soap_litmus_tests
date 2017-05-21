"use strict";

// This spike shows how to serve a file using Node's EXPRESS module.

(function(){
	console.log("Running Spike");
    var PORT = 3000;
	var express = require('express');
    var app = express();
    var fs = require("fs");

    app.get("/", function(req, res){
        console.log("Received request");

        fs.readFile("file.html", function (err, data) {
            if (err) throw err;
                res.end(data);
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
    app.listen(PORT);
})();