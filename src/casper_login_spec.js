(function(){
    "use strict";

    var port = "8080";
    var serverUri = "http://localhost:" + port + "/";
    var TEST_USER = 'test';
    var TEST_PASS = 'test';

    casper.test.begin('user test can do log in', 1, function(test) {
        casper.start(serverUri, function() {
            this.fill('form[action="/login"]', { user: TEST_USER, pass:TEST_PASS }, true);
        }).then(function(){
            console.log(this.getPageContent());
            var response = JSON.parse(this.getPageContent());
            test.assertEquals(response.user, TEST_USER, "User value must be correct");
        }).run(function() {
            test.done();
        });
    });
}());