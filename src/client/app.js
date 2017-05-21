
var berlin = berlin || {};

(function(){
    "use strict";

    function createLogin(loginId){
        var self = {};
        var _user, _pass;

        self.setUser = function(userName){
            _user = userName;
        };
        self.setPass = function(password){
            _pass = password;
        };

        self.logIn = function(callback, errorCallback){
            $.post('/login',
                {
                    user: _user,
                    pass: _pass
                },
                function(data, textStatus, response){
                    console.log("LOGIN SUCCEDED!");
                    callback(response);
                }).fail(function(error){
                    console.log("LOGIN ERROR!");
                    errorCallback(error);
                });
        };

        return self;
    }


    berlin.createLogin = createLogin;
})();