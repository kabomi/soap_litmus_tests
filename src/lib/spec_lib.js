"use strict";

(function(){

    var http = require("http");

    function httpGet(url, responseCallback, errorCallback){
        var request = http.get(url);
        request.on("response",
            function(response){
                var responseData = "";
                response.setEncoding("utf8");
                response.on("data", function(chunk){
                    responseData = chunk;
                });
                response.on("end", function(){
                    responseCallback(response, responseData);
                });
            }
        );
        request.on("error",
            function(e){
                if(typeof errorCallback === 'function')
                    errorCallback(e, e.message);
            }
        );
    }
    function httpPost(data, responseCallback, errorCallback){
        var options = { 
            hostname: 'localhost',
            port: 3000,
            path: '/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        var request = http.request(options);
        request.on("response",
            function(response){
                var responseData = "";
                response.setEncoding("utf8");
                response.on("data", function(chunk){
                    console.log(chunk);
                    responseData = chunk;
                });
                response.on("end", function(){
                    console.log("end");
                    responseCallback(response, responseData);
                });
            }
        );
        request.on("error",
            function(e){
                if(typeof errorCallback === 'function')
                    errorCallback(e, e.message);
            }
        );
        request.write(JSON.stringify(data));
        request.end();
    }

    exports.httpGet = httpGet;
    exports.httpPost = httpPost;
})();