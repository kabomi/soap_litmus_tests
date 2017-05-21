/*global describe, it, expect, spyOn, beforeEach, fs, xit, done, jasmine, afterEach, xdescribe */

"use strict";

(function(){

    var pkg = require('../../../package');
    var TEMP_DIR = pkg.tempDirs.root + pkg.tempDirs.test;
    var TEST_FILE = TEMP_DIR + "/test.html";
    var TEST_FILE_404 = TEMP_DIR + "/test404.html";
    var PORT = 3000;
    var SERVER_URI = "http://localhost:" + PORT + "/";


    var server;
    var fs = require("fs");
    var httpGet_lib = require("../../lib/spec_lib").httpGet;
    var httpPost_lib = require("../../lib/spec_lib").httpPost;

    describe("server", function(){
        beforeEach(function(){
            server = require("../server").init({
                port: PORT,
                mainFile: TEST_FILE,
                notFoundFile: TEST_FILE_404});
        });
        afterEach(function(done){
            tearDownFiles([TEST_FILE, TEST_FILE_404]);

            if(server){
                try{
                    server.stop(function(){
                        done();
                    });
                }catch(ex){
                    done();
                }
            }
        });
        
        it("has a version property", function () {
            expect(server.version).toBeDefined();
        });
        it("has a port property", function(){
            expect(server.port).toMatch(/\d+/);
        });
        it("has a mainFile property", function(){
            expect(server.mainFile).toMatch(/\w\.html/);
        });
        it("has a notFoundFile property", function(){
            expect(server.notFoundFile).toMatch(/\w\.html/);
        });
        it("listen to given port", function(){
            spyOn(server.app, "listen");
            server.start(function(){
                expect(server.app.listen.mostRecentCall.args[0]).toBe(PORT);
            });
            expect(server.port).toBe(PORT);
        });
        it("throws an exception when stop is called before start", function(){
            expect(server.stop).toThrow();
        });
        it("listens to a simple request", function(done){
            var expectedData = "Hello world";

            writeTestFileWith(expectedData);

            httpGet(SERVER_URI, function(response, responseData){
                expect(response.statusCode).toBe(200);
                expect(responseData).toBe(expectedData);
                done();
            });
        });
        it("serves a file", function(done){
            var url = SERVER_URI + TEST_FILE;
            var expectedData = "Hello world";
            
            writeTestFileWith(expectedData);

            httpGet(url, function(response, responseData){
                expect(response.statusCode).toBe(200);
                expect(responseData).toBe(expectedData);
                done();
            });
        });
        it("serves homepage", function(done){
            var url = SERVER_URI + "index.html";
            var expectedData = "Hello world";
            
            writeTestFileWith(expectedData);

            httpGet(url, function(response, responseData){
                expect(response.statusCode).toBe(200);
                expect(responseData).toBe(expectedData);
                done();
            });
        });
        it("returns 404 page for every page but homepage", function(done){
            var url = SERVER_URI + "marglar";
            var expectedData = "404 FILE";
            
            writeTestFile404With(expectedData);

            httpGet(url, function(response, responseData){
                expect(response.statusCode).toBe(404);
                expect(responseData).toBe(expectedData);
                done();
            });
        });

        describe("login", function(){
            it("response a json with user information", function(done){
                var url = SERVER_URI + "login";
                var TEST_USER = 'test';
                var TEST_PASS = 'test';

                httpPost({user: TEST_USER, pass: TEST_PASS}, function(response, responseData){
                    expect(response.statusCode).toBe(200);
                    expect(JSON.parse(responseData).user).toBe(TEST_USER);
                    done();
                });
            });
        });
        function httpGet(url, callback){
            server.start(
                function(){
                    httpGet_lib(url, callback);
                }
            );
        }
        function httpPost(data, callback){
            server.start(
                function(){
                    httpPost_lib(data, callback);
                }
            );
        }
        function writeTestFileWith(expectedData){
            fs.writeFileSync(TEST_FILE, expectedData);
        }
        function writeTestFile404With(expectedData){
            fs.writeFileSync(TEST_FILE_404, expectedData);
        }
    });
    function tearDownFiles(files){
        var i;
        for(i=0;i<files.length;i++){
            var file = files[i];
            if(fs.existsSync(file)){
                fs.unlinkSync(file);
                expect(fs.existsSync(file)).toBeFalsy();
            }
        }
    }
})();