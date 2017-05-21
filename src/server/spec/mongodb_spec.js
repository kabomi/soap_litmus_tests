/*global describe, it, expect, spyOn, beforeEach, fs, xit, done, jasmine, afterEach, xdescribe */

"use strict";

(function(){

    var MongoClient = require('mongodb').MongoClient;
    var format = require('util').format;
    var HOST = process.env.MONGODB_HOST ? process.env.MONGODB_HOST : 'localhost';
    var PORT = process.env.MONGODB_PORT ? process.env.MONGODB_PORT : 27017;
    var URI = format("mongodb://%s:%s/berlin-test?w=1", HOST, PORT);

    describe("mongodb", function(){
        it("listens to a simple request", function(done){
            console.log("mongodb uri:" + URI);
            MongoClient.connect(URI, function(err, db) {
                expect(err).toBeNull();
                db.close();
                done();
            });
        });
        it("creates a collection and inserts data", function(done){
            MongoClient.connect(URI, function(err, db){
                var collection = db.collection('test');
                collection.remove({}, function(err, result) {
                    collection.count(function(err, count) {
                        expect(count).toBe(0);
                        collection.insert([{'test': 'test'}], function(err, docs){
                            collection.count(function(err, count) {
                                expect(count).toBeGreaterThan(0);
                                collection.drop(function(err, collection) {
                                  db.close();
                                  done();
                                });
                            });
                        });
                    });
                });
            });
        });
        it("retrieves data from a collection", function(done){
            MongoClient.connect(URI, function(err, db){
                var collection = db.collection('test');
                collection.insert([{'test': 'test'}], function(err, docs){
                    collection.count(function(err, count) {
                        collection.find({}).each(function(err, item){
                            console.log('error:' + err);
                            if(item !== null){
                                expect(item.test).toBe('test');
                            }else{
                                collection.drop(function(err, collection) {
                                  db.close();
                                  done();
                                });
                            }
                        });
                        
                    });
                });
            });
        });
    });
})();