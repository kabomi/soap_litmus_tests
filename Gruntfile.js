"use strict";

module.exports = function(grunt) {
    var pkg = require('./package');
    var NODE_VERSION = "v" + pkg.engines.node + "\n";
    var GENERATED_DIR = pkg.tempDirs.root;
    var TEMP_TESTFILE_DIR = GENERATED_DIR + pkg.tempDirs.test;
    var SERVER_RUNNER = pkg.serverDirs.runner;
    var SERVER_RUNNER_PORT = process.env.BERLIN_PORT || "8080";
    var SERVER_SPEC_DIR = pkg.serverDirs.spec;
    var SERVER_DEPLOY_ALLOWED = process.env.BERLIN_DEPLOY || false;
    var MONGODB_PORT = process.env.MONGODB_PORT || "27017";

    var common = require('./build/build_options.js');
    var fs = require('fs');

    grunt.initConfig({

        pkg: require('./package'),

        jshint: {
            node: {
                files: {
                    src: ['src/server/**/*.js', 'build/**/*s.js', 'src/_*.js']
                },
                options: common.nodeLintOptions()
            },
            browser: {
                files: {
                    src: ['src/client/*.js', 'src/client/spec/*.js', 'src/casper*.js']
                },
                options: common.browserLintOptions()
            }
        },

        jasmine_node: {
            growl: true,
            options: common.nodeJasmineOptions()
        },

        watch: {
            src: {
                files: [ 'src/server/**/*.js'],
                tasks: [ 'testServer' ]
            }
        },

        exec: {
            node: {
                cmd: function() {
                    var command = 'node --version';
                    console.log("> " + command);
                    return command;
                },
                callback: function(error, stdout, stderr){
                    if (stdout !== NODE_VERSION){
                        grunt.fatal("Incorrect node version. Expected " + NODE_VERSION);
                    }
                }
            },
            kill_node_servers: {
                cmd: function() {
                    var command = 'killall -9 -q -e node';
                    console.log("Stopping all node servers");
                    console.log("> " + command);
                    return command;
                },
                callback: function(error, stdout, stderr){
                    if (error || stderr){
                        console.log("Something went wrong, but will try to move on.");
                        //grunt.fatal("Fix what went wrong and try again.");
                    }else{
                        console.log("[OK]Servers stopped successfully");
                        //grunt.task.run(['test', 'cmd:start_server']);
                    }
                }
            },
            git_pull_origin: {
                cmd: function() {
                    var command = 'git pull origin master';
                    console.log("Pull from origin master");
                    console.log("> " + command);
                    return command;
                },
                callback: function(error, stdout, stderr){
                    if (error){
                        grunt.fatal("Fix what went wrong and try again." + error);
                    }else{
                        console.log("[OK]Git up to date");
                    }
                }
            },
            remove_unnecessary_tests: {
                cmd: function() {
                    var command = 'rm -f ' + SERVER_SPEC_DIR +'/' + 'heroku* ' + SERVER_SPEC_DIR +'/' + 'digitalocean*';
                    console.log("Remove unnecessary tests for production");
                    console.log("> " + command);
                    return command;
                },
                callback: function(error, stdout, stderr){
                    if (error){
                        console.log("Something went wrong, but will try to move on.");
                        //grunt.fatal("Fix what went wrong and try again.");
                    }else{
                        console.log("[OK]Unnecessary tests removed");
                    }
                }
            },
            start_mongodb: {
                cmd: function() {
                    var command = 'mongod --port ' + MONGODB_PORT;
                    console.log("> " + command);
                    return command;
                },
                exitCodes: [0, 100],
                callback: function(error, stdout, stderr){
                    if (error || stderr){
                        if(stdout.indexOf('a mongod instance already running') < 0)
                            grunt.fatal("Couldn't start mongod demon.");
                        else{
                            console.log("[OK]Mongodb was already started");
                        }
                    }else{
                        console.log("[OK]Mongodb started successfully");
                    }
                }
            },
            start_server: {
                cmd: function() {
                    var command = 'node ' + SERVER_RUNNER + ' ' + SERVER_RUNNER_PORT;
                    console.log("> " + command);
                    return command;
                },
                callback: function(error, stdout, stderr){
                    if (error || stderr){
                        grunt.fatal("Couldn't start the server.");
                    }else{
                        console.log("[OK]Server started successfully");
                    }
                }
            },
            testClient_task: {
                cmd: function() {
                    var command = 'node ' + 'node_modules/.bin/karma' + ' run build/karma.conf.js' ;
                    console.log("> " + command);
                    return command;
                },
                callback: function(error, stdout, stderr){
                    if (error && stderr){
                        grunt.fatal("Test runner maybe not started jet.");
                    }else{
                        if(error){
                            grunt.fatal("Test runner dropped errors.");
                        }
                        console.log("[OK]Client tests were run successfully");
                    }
                }
            },
            testRunner_task: {
                cmd: function() {
                    var command = 'node ' + 'node_modules/.bin/karma' + ' start --single-run --no-auto-watch build/karma.conf.js';
                    console.log("> " + command);
                    return command;
                },
                callback: function(error, stdout, stderr){
                    if (error && stderr){
                        grunt.fatal("Test runner aborted.");
                    }else{
                        if(error){
                            grunt.fatal("Test runner dropped errors.");
                        }
                        console.log("[OK]Test Runner running");
                    }
                }
            }
        }
        
    });

    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('testServer_task', function(){
        testNodeJasmineWith.call(this, common.nodeJasmineOptions());
    });

    grunt.registerTask('smokeTests_task', function(){
        testNodeJasmineWith.call(this, common.smokeJasmineOptions());
    });

    function testNodeJasmineWith(options){
        var jasmine = require("jasmine-node");

        var done = this.async();
        options.onComplete = function(runner, log){
            if (runner.results().failedCount !== 0) {
                if(options.growl){
                    console.log("Jasmine node tests failed. Continue so that growl reporter works.");
                }else{
                    grunt.warn("Jasmine node tests failed.");
                }
            }else{
                grunt.task.run('clean');
            }
            done();
        };
        try {
            // since jasmine-node@1.0.28 an options object need to be passed
            jasmine.executeSpecsInFolder(options);
        } catch (e) {
            console.log('Failed to execute "jasmine.executeSpecsInFolder": ' + e.stack);
            grunt.fatal("Jasmine node tests failed.");
        }
    }
    grunt.registerTask('testClient_task', ['exec:testClient_task']);

    grunt.registerTask('testServer', 'Test only the server', [ 'exec:node', 'jshint:node', 'temp_testfile_directory', 'testServer_task']);
    grunt.registerTask('testClient', 'Test only the client', [ 'exec:node', 'jshint:browser', 'temp_testfile_directory', 'testClient_task', 'clean']);
    grunt.registerTask('smoke', 'Test only smoke tests', [ 'exec:node', 'jshint', 'temp_testfile_directory', 'smokeTests_task', 'clean']);
    grunt.registerTask('test', 'Test unit tests', [ 'testServer', 'testClient']);
    grunt.registerTask('default',   [ 'test' ]);
    grunt.registerTask('integrate', 'Instructions about how to integrate code in production when in a group', [ 'test', 'integrate_commands' ]);
    grunt.registerTask('deploy', '[BEWARE: to be run on production only] Rerun the server with the latest commit in origin:master',
            ['deployment_allowed', 'exec:start_mongodb', 'exec:kill_node_servers', 'exec:git_pull_origin',
             'exec:remove_unnecessary_tests', 'testServer', 'exec:testRunner_task', 'clean', 'exec:start_server']);

    grunt.registerTask('deployment_allowed', function(){
        if (!SERVER_DEPLOY_ALLOWED){
            grunt.fatal("Deploy command not allowed in this environment");
        }
    });
    grunt.registerTask('integrate_commands', function(){
        var commands = require('./build/integration_commands');
        commands.print();
    });

    grunt.registerTask('temp_testfile_directory', function(){
        console.log("TESTFILE_DIR: " +  TEMP_TESTFILE_DIR);
        if (!fs.existsSync(GENERATED_DIR)){
            fs.mkdirSync(GENERATED_DIR);
        }
        if (!fs.existsSync(TEMP_TESTFILE_DIR)){
            fs.mkdirSync(TEMP_TESTFILE_DIR);
        }
    });

    grunt.registerTask('clean', function(){
        console.log("REMOVE TESTFILE_DIR: " +  TEMP_TESTFILE_DIR);
        if (fs.existsSync(TEMP_TESTFILE_DIR)){
            fs.rmdirSync(TEMP_TESTFILE_DIR);
        }
        if (fs.existsSync(GENERATED_DIR)){
            fs.rmdirSync(GENERATED_DIR);
        }
    });

};
