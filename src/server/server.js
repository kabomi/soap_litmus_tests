"use strict";

(function(){
    var VERSION = 0.1;
	var self = {};
    var express;
    var app;
    var _server;
    var util = require('../lib/server_lib');
    var fs = require("fs");
    var http = require("http");

	self.version = VERSION;
    function init(options){
        express = require('express');
        app = express();
        app.use(express.urlencoded());
        self.app = app;
        self.port = options.port;
        self.mainFile = options.mainFile;
        self.notFoundFile = options.notFoundFile;

        app.use(function (req, res, next) {
	// Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
// Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

	next();
	});
	setRoutes();

        self.start = function(callback){
            if(util.isNumber(self.port)){
                _server = app.listen(self.port, callback);
            }else{
                throw "Invalid port";
            }
        };
        self.stop = function(callback){
            if(_server){
                try{
                    _server.close(callback);
                }catch(ex){
                    throw ex;
                }
            }else{
                throw "Server must be started";
            }
        };
        self.get = function(url, callback){
            try{
                return http.get(url, callback);
            }catch(ex){
                console.log("Error:" + ex.message);
                throw ex;
            }
        };


        return self;
    }

    function setRoutes(){

        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

        app.post('/login', function(req, res){
            console.log("app.post");
            res.json({user: 'test'});
            res.end();
        });

        function sendFile (url, req, res){
            fs.exists(url, function(exists){
                if(exists){
                    fs.readFile(url, function (err, data) {
                        if (err){
                            sendFileNotFound(req, res);
                        }else{
                            res.end(data);
                        }
                    });
                }else{
                    sendFileNotFound(req, res);
                }
            });
        }
        function sendFileNotFound(req, res){
            res.statusCode = 404;
            fs.readFile(self.notFoundFile, function (err, data) {
                if (err){
                    res.end();
                }else{
                    res.end(data);
                }
            });
        }
    }

    exports.init = init;
})();
