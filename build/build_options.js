/*global  exports */

(function(){
    "use strict";

    function nodeLintOptions(){
        var options = lintOptions();
        options.node = true;
        return options;
    }
    function browserLintOptions(){
        var options = lintOptions();
        options.browser = true;
        options.undef = false;
        return options;
    }
    function lintOptions(){
        return {
            bitwise: true,
            curly: false,
            eqeqeq: true,
            forin: true,
            immed: true,
            latedef: true,
            newcap: true,
            noarg: true,
            noempty: true,
            nonew: true,
            regexp: true,
            undef: true,
            strict: true,
            trailing: true,
            node: false,
            browser: false
        };
    }
    
    function nodeJasmineOptions(){
        return jasmineOptions(["src/server/spec"]);
    }
    function smokeJasmineOptions(){
        var options = jasmineOptions(["src"]);
        options.regExpSpec = /^_.*_spec\.js$/;
        return options;
    }
    function jasmineOptions(specFolders){
        return {
            match:           ".",
            matchall:        false,
            specNameMatcher: "*_spec",
            extensions:      "js",
            specFolders:     specFolders,
            onComplete:      undefined,
            isVerbose:       true,
            showColors:      true,
            teamcity:        false,
            useRequireJs:    false,
            coffee:          false,
            regExpSpec:      /^.*_spec\.js$/,
            junitreport:     undefined,
            growl:           true
        };
    }

    exports.nodeLintOptions = nodeLintOptions;
    exports.browserLintOptions = browserLintOptions;
    exports.nodeJasmineOptions = nodeJasmineOptions;
    exports.smokeJasmineOptions = smokeJasmineOptions;
})();