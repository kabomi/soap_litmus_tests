
(function(){
    "use strict";

    console.log('Loading a web page');
    var page = require('webpage').create();
    var url = 'http://www.phantomjs.org/';
    page.open(url, function (status) {
        //Page is loaded!
        console.log("Page loaded!");
        page.render("phantomjs.png");
        phantom.exit();
    });
}());

      