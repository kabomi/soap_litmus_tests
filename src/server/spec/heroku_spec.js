// test on Heroku
/*global describe, it, expect, spyOn, beforeEach, fs, xit, done, jasmine, afterEach, xdescribe */

"use strict";

(function(){

    var http = require("http");
    var serverUri = "http://berlin5.herokuapp.com/";

    describe("heroku tests", function(){
        it("serves homepage", function (done) {
            var marker = "This is the HomePage";
            httpGet(serverUri, function(response, responseData){
                var foundPage = (responseData.indexOf(marker) !== -1);
                expect(foundPage).toBeTruthy(
                    (response.errno && response.message) ||
                    "home page should contain the following marker: " + marker);
                done();
            });
        });
    });

    //TODO: eliminate duplication with server_spec.js
    function httpGet(url, callback){
        var request = http.get(url);
        request.on("response",
            function(response){
                var responseData = "";
                response.setEncoding("utf8");
                response.on("data", function(chunk){
                    responseData = chunk;
                });
                response.on("end", function(){
                    callback(response, responseData);
                });
            }
        );
        request.on("error",
            function(e){
                callback(e, e.message);
            }
        );
    }

})();