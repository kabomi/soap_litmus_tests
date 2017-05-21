"use strict";

// This spike shows how to get a URL using Node's EXPRESS module.

(function(){
	console.log("Running Spike");
    var PORT = 3000;
	var express = require('express');
    var app = express();
    app.get("/", function(req, res){
        console.log("Got response: " + res.statusCode);
        res.end();
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
    app.listen(PORT);
})();