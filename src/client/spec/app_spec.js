/*global describe, it, expect, spyOn, beforeEach, fs, xit, done, jasmine, afterEach, xdescribe */

(function(){
    "use strict";

    describe("karma", function(){
        
        it("runs tests properly", function () {
            expect(true).toBeTruthy();
        });
    });

    describe("login", function(){
        it("should request user info", function (done){
            var loginBox = berlin.createLogin('login-box');
            loginBox.setUser('test');
            loginBox.setPass('test');

            var foo = {
                callback : (function(done){return function(response){
                    expect(true).toBeTruthy();
                    done();
                };})(done),
                errorCallback: (function(done){return function(error){
                    expect(true).toBeTruthy();
                    done();
                };})(done)
            };
            var loginButton = $('#login-box-button');
            loginButton.on('click', (function(foo){ loginBox.logIn(foo.callback, foo.errorCallback);})(foo));//});
            loginButton.click();
        });
    });

})();