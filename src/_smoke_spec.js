// launch the server in the same way that it happens in production
// get a page
// confirm that we got something
/*global describe, it, expect, spyOn, beforeEach, fs, xit, done, jasmine, afterEach, xdescribe */

"use strict";

(function(){

    var child_process = require("child_process");
    var httpGet = require("./lib/spec_lib").httpGet;
    var process;
    var port = "8080";
    var serverUri = "http://localhost:" + port + "/";
    var nodeArgs = ["src/server/berlin",  port];
    var casperProcess;

    describe("smoke tests", function(){

        afterEach(function(done){
            process.on("exit", function(code, signal){
                done();
            });
            process.kill();
        });
        it("runs the server and retrieves homepage", function (done) {
            var marker = "This is the HomePage";
            runServer(nodeArgs, function(){
                httpGet(serverUri, function(response, responseData){
                    var foundPage = (responseData.indexOf(marker) !== -1);
                    expect(foundPage).toBeTruthy("home page should contain the following marker: " + marker);
                    done();
                });
            });
        });
        it("retrieves 404 Page", function (done) {
            var marker = "This is the 404 Page";
            runServer(nodeArgs, function(){
                httpGet(serverUri + "unexistant.html", function(response, responseData){
                    var foundPage = (responseData.indexOf(marker) !== -1);
                    expect(response.statusCode).toBe(404);
                    expect(foundPage).toBeTruthy("404 page should contain the following marker: " + marker);
                    done();
                });
            });
        });
    });

    describe("casper tests", function(){

        afterEach(function(done){
            process.on("exit", function(code, signal){
                done();
            });
            process.kill();
        });

        it("passes all e2e/acceptance tests", function(done){
            runServer(nodeArgs, function(){
                casperProcess = child_process.spawn("casperjs", ["test", "src/casper_login_spec.js"], { stdio: "inherit" });
                casperProcess.on("exit", function(code){
                    var msg;
                    if(code !== 0) msg = "Finish casper tests with code: " + code;
                    done(msg);
                });
            });
        });
    });
    function runServer(nodeArgs, callback){
        process = child_process.spawn("node", nodeArgs);
        process.stdout.setEncoding("utf8");
        process.stdout.on("data", function(chunk){
            if(chunk.trim() === "Server started") callback();
        });
        process.stderr.on("data", function(chunk){
            console.log("server stderr: " + chunk);
        });
    }
    
})();