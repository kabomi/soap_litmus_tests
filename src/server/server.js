"use strict";

(function(){
    var VERSION = 0.1;
    var self = {};
    var express;
    var app;
    var _server;
    var util = require('../lib/server_lib');
    var fs = require("fs");
    var http = require("http");

    self.version = VERSION;

    // Litmus api credentials

    var litmusApiCredentials = {
        apiKey: 'mycompany-api',
        apiPass: 'apikeypassword'
    };

    function init(options){
        express = require('express');
        app = express();
        app.use(express.urlencoded());
        self.app = app;
        self.port = options.port;
        self.mainFile = options.mainFile;
        self.notFoundFile = options.notFoundFile;

        app.use(function (req, res, next) {
            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

            next();
        });

        setRoutes();

        self.start = function(callback){
            if(util.isNumber(self.port)){
                _server = app.listen(self.port, callback);
            }else{
                throw "Invalid port";
            }
        };
        self.stop = function(callback){
            if(_server){
                try{
                    _server.close(callback);
                }catch(ex){
                    throw ex;
                }
            }else{
                throw "Server must be started";
            }
        };
        self.get = function(url, callback){
            try{
                return http.get(url, callback);
            }catch(ex){
                console.log("Error:" + ex.message);
                throw ex;
            }
        };


        return self;
    }

    function EmailTest(){
        /*
        <s:element minOccurs="0" maxOccurs="1" form="unqualified" name="Results" nillable="true" type="s0:ArrayOfClient"/>
        <s:element minOccurs="0" maxOccurs="1" form="unqualified" name="State" nillable="true" type="s:string"/>
        <s:element minOccurs="0" maxOccurs="1" form="unqualified" name="InboxGUID" nillable="true" type="s:string"/>
        <s:element minOccurs="1" maxOccurs="1" form="unqualified" name="ID" nillable="true" type="s:int"/>
        <s:element minOccurs="0" maxOccurs="1" form="unqualified" name="Source" nillable="true" type="s:string"/>
        <s:element minOccurs="0" maxOccurs="1" form="unqualified" name="Subject" nillable="true" type="s:string"/>
        <s:element minOccurs="0" maxOccurs="1" form="unqualified" name="Html" nillable="true" type="s:string"/>
        <s:element minOccurs="0" maxOccurs="1" form="unqualified" name="ZipFile" nillable="true" type="s:string"/>
        <s:element minOccurs="0" maxOccurs="1" form="unqualified" name="TestType" nillable="true" type="s:string"/>
        <s:element minOccurs="1" maxOccurs="1" form="unqualified" name="Sandbox" nillable="true" type="s:boolean"/>
        <s:element minOccurs="0" maxOccurs="1" form="unqualified" name="UserGuid" nillable="true" type="s:string"/>
        */
        var self = {
            //Results: [], //important
            State: '',
            InboxGUID: '',
            ID: 0, //compulsory
            Source: '',
            Subject: '',
            Html: '',
            ZipFile: '',
            TestType: 'email',
            Sandbox: 'true', //compulsory
            UserGuid: ''
        };

        /*
        self = {
            "attributes":{"id":"id1","xsi:type":"types:EmailTest"},
            "Results":{
                "attributes":{"id":"id2","soapenc:arrayType":"types:Client[2]"},
                "Item":[{"attributes":{"id":"id3","xsi:type":"types:Client"},"State":{"attributes":{"xsi:type":"xsd:string"},"$value":"pending"},"WindowImageContentBlocking":{"attributes":{"xsi:type":"xsd:string"},"$value":"s3.amazonaws.com"},"FullpageImageThumb":{"attributes":{"xsi:type":"xsd:string"},"$value":"s3.amazonaws.com"},"BusinessOrPopular":{"attributes":{"xsi:type":"xsd:boolean"},"$value":"true"},"WindowImageThumbNoContentBlocking":{"attributes":{"xsi:type":"xsd:string"},"$value":"s3.amazonaws.com"},"Completed":{"attributes":{"xsi:type":"xsd:boolean"},"$value":"false"},"FullpageImage":{"attributes":{"xsi:type":"xsd:string"},"$value":"s3.amazonaws.com"},"FoundInSpam":{"attributes":{"xsi:type":"xsd:boolean"},"$value":"false"},"Status":{"attributes":{"xsi:type":"xsd:int"},"$value":"0"},"WindowImageNoContentBlocking":{"attributes":{"xsi:type":"xsd:string"},"$value":"s3.amazonaws.com"},"PlatformName":{"attributes":{"xsi:type":"xsd:string"},"$value":"Windows"},"AverageTimeToProcess":{"attributes":{"xsi:type":"xsd:int"},"$value":"60"},"SpamHeaders":{"attributes":{"id":"id5","soapenc:arrayType":"types:SpamHeader[0]"}},"WindowImageThumb":{"attributes":{"xsi:type":"xsd:string"},"$value":"s3.amazonaws.com"},"PlatformLongName":{"attributes":{"xsi:type":"xsd:string"},"$value":"Microsoft Windows"},"FullpageImageThumbContentBlocking":{"attributes":{"xsi:type":"xsd:string"},"$value":"s3.amazonaws.com"},"WindowImage":{"attributes":{"xsi:type":"xsd:string"},"$value":"s3.amazonaws.com"},"FullpageImageContentBlocking":{"attributes":{"xsi:type":"xsd:string"},"$value":"s3.amazonaws.com"},"SupportsContentBlocking":{"attributes":{"xsi:type":"xsd:boolean"},"$value":"false"},"ApplicationName":{"attributes":{"xsi:type":"xsd:string"},"$value":"ol2000"},"FullpageImageThumbNoContentBlocking":{"attributes":{"xsi:type":"xsd:string"},"$value":"s3.amazonaws.com"},"SpamScore":{"attributes":{"xsi:type":"xsd:double"},"$value":"0"},"DesktopClient":{"attributes":{"xsi:type":"xsd:boolean"},"$value":"true"},"WindowImageThumbContentBlocking":{"attributes":{"xsi:type":"xsd:string"},"$value":"s3.amazonaws.com"},"Id":{"attributes":{"xsi:type":"xsd:int"},"$value":""},"ResultType":{"attributes":{"xsi:type":"xsd:string"},"$value":"email"},"FullpageImageNoContentBlocking":{"attributes":{"xsi:type":"xsd:string"},"$value":"s3.amazonaws.com"},"ApplicationLongName":{"attributes":{"xsi:type":"xsd:string"},"$value":"Outlook 2000"}},
                        {"attributes":{"id":"id4","xsi:type":"types:Client"},"State":{"attributes":{"xsi:type":"xsd:string"},"$value":"pending"},"WindowImageContentBlocking":{"attributes":{"xsi:type":"xsd:string"},"$value":"s3.amazonaws.com"},"FullpageImageThumb":{"attributes":{"xsi:type":"xsd:string"},"$value":"s3.amazonaws.com"},"BusinessOrPopular":{"attributes":{"xsi:type":"xsd:boolean"},"$value":"true"},"WindowImageThumbNoContentBlocking":{"attributes":{"xsi:type":"xsd:string"},"$value":"s3.amazonaws.com"},"Completed":{"attributes":{"xsi:type":"xsd:boolean"},"$value":"false"},"FullpageImage":{"attributes":{"xsi:type":"xsd:string"},"$value":"s3.amazonaws.com"},"FoundInSpam":{"attributes":{"xsi:type":"xsd:boolean"},"$value":"false"},"Status":{"attributes":{"xsi:type":"xsd:int"},"$value":"0"},"WindowImageNoContentBlocking":{"attributes":{"xsi:type":"xsd:string"},"$value":"s3.amazonaws.com"},"PlatformName":{"attributes":{"xsi:type":"xsd:string"},"$value":"Windows"},"AverageTimeToProcess":{"attributes":{"xsi:type":"xsd:int"},"$value":"59"},"SpamHeaders":{"attributes":{"id":"id6","soapenc:arrayType":"types:SpamHeader[0]"}},"WindowImageThumb":{"attributes":{"xsi:type":"xsd:string"},"$value":"s3.amazonaws.com"},"PlatformLongName":{"attributes":{"xsi:type":"xsd:string"},"$value":"Microsoft Windows"},"FullpageImageThumbContentBlocking":{"attributes":{"xsi:type":"xsd:string"},"$value":"s3.amazonaws.com"},"WindowImage":{"attributes":{"xsi:type":"xsd:string"},"$value":"s3.amazonaws.com"},"FullpageImageContentBlocking":{"attributes":{"xsi:type":"xsd:string"},"$value":"s3.amazonaws.com"},"SupportsContentBlocking":{"attributes":{"xsi:type":"xsd:boolean"},"$value":"false"},"ApplicationName":{"attributes":{"xsi:type":"xsd:string"},"$value":"ol2002"},"FullpageImageThumbNoContentBlocking":{"attributes":{"xsi:type":"xsd:string"},"$value":"s3.amazonaws.com"},"SpamScore":{"attributes":{"xsi:type":"xsd:double"},"$value":"0"},"DesktopClient":{"attributes":{"xsi:type":"xsd:boolean"},"$value":"true"},"WindowImageThumbContentBlocking":{"attributes":{"xsi:type":"xsd:string"},"$value":"s3.amazonaws.com"},"Id":{"attributes":{"xsi:type":"xsd:int"},"$value":""},"ResultType":{"attributes":{"xsi:type":"xsd:string"},"$value":"email"},"FullpageImageNoContentBlocking":{"attributes":{"xsi:type":"xsd:string"},"$value":"s3.amazonaws.com"},"ApplicationLongName":{"attributes":{"xsi:type":"xsd:string"},"$value":"Outlook 2002"}}]
            },
            "State":{"attributes":{"xsi:type":"xsd:string"},"$value":"waiting"},
            "InboxGUID":{"attributes":{"xsi:type":"xsd:string"},"$value":""},
            "ID":{"attributes":{"xsi:type":"xsd:int"},"$value":""},
            "Source":{"attributes":{"xsi:type":"xsd:string"},"$value":""},
            "Subject":{"attributes":{"xsi:type":"xsd:string"}},
            "ZipFile":{"attributes":{"xsi:type":"xsd:string"},"$value":""},
            "TestType":{"attributes":{"xsi:type":"xsd:string"},"$value":"email"},
            "Sandbox":{"attributes":{"xsi:type":"xsd:boolean"},"$value":"true"}
        };
        */

        //self.Results.push(new Client('ol2003'));
        //self.Results.push(new Client('gmailnew'));

        return self;
    }
    function Client(soapClient){
        /*
        <s:element minOccurs="0" maxOccurs="1" form="unqualified" name="State" nillable="true" type="s:string"/>
        <s:element minOccurs="0" maxOccurs="1" form="unqualified" name="WindowImageContentBlocking" nillable="true" type="s:string"/>
        <s:element minOccurs="0" maxOccurs="1" form="unqualified" name="FullpageImageThumb" nillable="true" type="s:string"/>
        <s:element minOccurs="1" maxOccurs="1" form="unqualified" name="BusinessOrPopular" nillable="true" type="s:boolean"/>
        <s:element minOccurs="0" maxOccurs="1" form="unqualified" name="WindowImageThumbNoContentBlocking" nillable="true" type="s:string"/>
        <s:element minOccurs="1" maxOccurs="1" form="unqualified" name="Completed" nillable="true" type="s:boolean"/>
        <s:element minOccurs="0" maxOccurs="1" form="unqualified" name="FullpageImage" nillable="true" type="s:string"/>
        <s:element minOccurs="1" maxOccurs="1" form="unqualified" name="FoundInSpam" nillable="true" type="s:boolean"/>
        <s:element minOccurs="1" maxOccurs="1" form="unqualified" name="Status" nillable="true" type="s:int"/>
        <s:element minOccurs="0" maxOccurs="1" form="unqualified" name="WindowImageNoContentBlocking" nillable="true" type="s:string"/>
        <s:element minOccurs="0" maxOccurs="1" form="unqualified" name="PlatformName" nillable="true" type="s:string"/>
        <s:element minOccurs="1" maxOccurs="1" form="unqualified" name="AverageTimeToProcess" nillable="true" type="s:int"/>
        <s:element minOccurs="0" maxOccurs="1" form="unqualified" name="SpamHeaders" type="s0:ArrayOfSpamHeader"/>
        <s:element minOccurs="0" maxOccurs="1" form="unqualified" name="WindowImageThumb" nillable="true" type="s:string"/>
        <s:element minOccurs="0" maxOccurs="1" form="unqualified" name="RenderedHtmlUrl" nillable="true" type="s:string"/>
        <s:element minOccurs="0" maxOccurs="1" form="unqualified" name="PlatformLongName" nillable="true" type="s:string"/>
        <s:element minOccurs="0" maxOccurs="1" form="unqualified" name="FullpageImageThumbContentBlocking" nillable="true" type="s:string"/>
        <s:element minOccurs="0" maxOccurs="1" form="unqualified" name="WindowImage" nillable="true" type="s:string"/>
        <s:element minOccurs="0" maxOccurs="1" form="unqualified" name="FullpageImageContentBlocking" nillable="true" type="s:string"/>
        <s:element minOccurs="1" maxOccurs="1" form="unqualified" name="SupportsContentBlocking" nillable="true" type="s:boolean"/>
        <s:element minOccurs="0" maxOccurs="1" form="unqualified" name="ApplicationName" nillable="true" type="s:string"/>
        <s:element minOccurs="0" maxOccurs="1" form="unqualified" name="FullpageImageThumbNoContentBlocking" nillable="true" type="s:string"/>
        <s:element minOccurs="1" maxOccurs="1" form="unqualified" name="SpamScore" nillable="true" type="s:double"/>
        <s:element minOccurs="1" maxOccurs="1" form="unqualified" name="DesktopClient" nillable="true" type="s:boolean"/>
        <s:element minOccurs="0" maxOccurs="1" form="unqualified" name="WindowImageThumbContentBlocking" nillable="true" type="s:string"/>
        <s:element minOccurs="1" maxOccurs="1" form="unqualified" name="Id" type="s:int"/>
        <s:element minOccurs="0" maxOccurs="1" form="unqualified" name="ResultType" nillable="true" type="s:string"/>
        <s:element minOccurs="0" maxOccurs="1" form="unqualified" name="FullpageImageNoContentBlocking" nillable="true" type="s:string"/>
        <s:element minOccurs="0" maxOccurs="1" form="unqualified" name="ApplicationLongName" nillable="true" type="s:string"/>
        */

        return {
            State: soapClient.State? soapClient.State.$value : '',
            WindowImageContentBlocking: soapClient.WindowImageContentBlocking? soapClient.WindowImageContentBlocking.$value : '',
            FullpageImageThumb: soapClient.FullpageImageThumb? soapClient.FullpageImageThumb.$value : '',
            BusinessOrPopular: soapClient.BusinessOrPopular? soapClient.BusinessOrPopular.$value : '', //compulsory
            WindowImageThumbNoContentBlocking: soapClient.WindowImageThumbNoContentBlocking? soapClient.WindowImageThumbNoContentBlocking.$value : '',
            Completed: soapClient.Completed? soapClient.Completed.$value : '', //compulsory
            FullpageImage: soapClient.FullpageImage? soapClient.FullpageImage.$value : '',
            FoundInSpam: soapClient.FoundInSpam? soapClient.FoundInSpam.$value : '', //compulsory
            Status: soapClient.Status? soapClient.Status.$value : '', //compulsory
            WindowImageNoContentBlocking: soapClient.WindowImageNoContentBlocking? soapClient.WindowImageNoContentBlocking.$value : '',
            PlatformName: soapClient.PlatformName? soapClient.PlatformName.$value : '',
            AverageTimeToProcess: soapClient.AverageTimeToProcess? soapClient.AverageTimeToProcess.$value : '', //compulsory
            SpamHeaders: soapClient.SpamHeaders? soapClient.SpamHeaders.$value : '',
            WindowImageThumb: soapClient.WindowImageThumb? soapClient.WindowImageThumb.$value : '',
            RenderedHtmlUrl: soapClient.RenderedHtmlUrl? soapClient.RenderedHtmlUrl.$value : '',
            PlatformLongName: soapClient.PlatformLongName? soapClient.PlatformLongName.$value : '',
            FullpageImageThumbContentBlocking: soapClient.FullpageImageThumbContentBlocking? soapClient.FullpageImageThumbContentBlocking.$value : '',
            SupportsContentBlocking: soapClient.SupportsContentBlocking? soapClient.SupportsContentBlocking.$value : '', //compulsory
            ApplicationName: soapClient.ApplicationName? soapClient.ApplicationName.$value : '', //important
            FullpageImageThumbNoContentBlocking: soapClient.FullpageImageThumbNoContentBlocking? soapClient.FullpageImageThumbNoContentBlocking.$value : '',
            SpamScore: soapClient.SpamScore? soapClient.SpamScore.$value : '', //important
            DesktopClient: soapClient.DesktopClient? soapClient.DesktopClient.$value : '', //important
            WindowImageThumbContentBlocking: soapClient.WindowImageThumbContentBlocking? soapClient.WindowImageThumbContentBlocking.$value : '',
            Id: parseInt(soapClient.Id.$value), //important
            ResultType: soapClient.ResultType? soapClient.ResultType.$value : '',
            FullpageImageNoContentBlocking: soapClient.FullpageImageNoContentBlocking? soapClient.FullpageImageNoContentBlocking.$value : '',
            ApplicationLongName: soapClient.ApplicationLongName? soapClient.ApplicationLongName.$value : ''
        };
    }
    function setRoutes(){
        var EMAIL_TEST_MAX_WAIT_MS = 60000;
        var EMAIL_TEST_MS = 10000;
        var soap = require('soap');
        var requestNotCompleted = false;
        var emailTestInterval = null;

        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        //app.get(/.*/, function(req, res){
        app.post('/test', function(req, res){
            try{
            console.log('Query', JSON.stringify(req.query));
            console.log('Params', JSON.stringify(req.params));
            console.log('Body', JSON.stringify(req.body));
            console.log('Route', JSON.stringify(req.route));

            if (requestNotCompleted){
                console.log('There is already a request being processed. Wait till ends');
                return;
            }else{
                requestNotCompleted = true;
            }
            /*    var url = req.path;

                if(url === '/' || url === '/index.html'){
                    sendFile(self.mainFile, req, res);
                }else{
                    sendFile(url.slice(1), req, res);
                }
            */
            var url = 'https://soapapi.litmusapp.com/2010-06-21/api.asmx?wsdl';

            soap.createClient(url, function(err, client) {
                console.log(err);
                console.log(client.describe());
                console.log('+++++++++++createClient++++++++++++++++');

                console.log(JSON.stringify(client.wsdl.definitions.Client));
                var createGetEmailTestClientsArgs = {
                    apiKey: litmusApiCredentials.apiKey,
                    apiPass: litmusApiCredentials.apiPass,
                };
                client.GetEmailTestClients(createGetEmailTestClientsArgs, function(err, clients){
                    //console.log('Available Clients');
                    //console.log(clients.GetEmailTestClientsResult.Item);
                    //TODO: filter clients doesn't work
                    //var filter = 'iphone4|iphone5s|iphone6|gmailnew|ipad|ipadmini|ol2003|ol2007|ol2010|appmail6|androidgmailapp|oulookcom|yahoo';
                    //var shortFilter = '|iphone6|gmailnew|ipad|ol2010|appmail6|androidgmailapp|oulookcom|yahoo|';
                    var requestedFilter = (req.body.clients === ''? undefined : req.body.clients);
                    var shortFilter = requestedFilter || 'ol2002|ol2013|iphone5|ipad';
                    var filterResults = [];
                    var i = 0;
                    for(i=0; i< clients.GetEmailTestClientsResult.Item.length;i++){
                        var availableClient = clients.GetEmailTestClientsResult.Item[i];
                        if (shortFilter.indexOf(availableClient.ApplicationName.$value) >= 0){
                            filterResults.push(availableClient);
                        }
                    }

                    var emailTest = EmailTest();
                    emailTest.Results = {
                        Item: filterResults
                    };

                    console.log(emailTest);
                    var createEmailArgs = {
                        apiKey: litmusApiCredentials.apiKey,
                        apiPass: litmusApiCredentials.apiPass,
                        emailTest: emailTest
                    };

                    createEmailArgs.emailTest = emailTest;

                    client.CreateEmailTest(createEmailArgs, function(err, result){
                        var sendTo, zipFile;
                        console.log(err);
                        console.log('------------createEmailTest------------');

                        //console.log(JSON.stringify(result));
                        console.log('Clients to tests:', result.CreateEmailTestResult.Results.Item.length);
                        zipFile = result.CreateEmailTestResult.ZipFile.$value;
                        console.log('ZipFile', zipFile);
                        console.log('InboxGUID', result.CreateEmailTestResult.InboxGUID.$value);
                        sendTo = result.CreateEmailTestResult.InboxGUID.$value + '@emailtests.com';
                        console.log('sendTo', sendTo);
                        /* STEPS
                        * CreateEmailTest
                        - Send your email

                        * Wait for 60 seconds
                        * GetEmailTest
                        * Wait for 60 seconds
                        * GetResult for each pending result (explained below)
                        * Wait 60 seconds
                        * Repeat steps last 2 steps until all results are returned
                        */

                        //Send mail
                        var spawn = require('child_process').spawn,
                            email  = spawn('sh', ['litmus.sh', sendTo, req.body.html, req.body.cc]);

                        email.stderr.on('data', function (data) {
                            console.log('[email] ' + data);
                        });
                        email.stdout.on('data', function (data) {
                            console.log('[email] processed');
                        });
                        email.on('close', function (code, signal) {
                            if (signal === null){
                                console.log('[email] child process normally terminated');
                            }else{
                                console.log('[email] child process terminated due to receipt of signal ' + signal);
                            }
                        });

                        var getEmailArgs = {
                            apiKey: litmusApiCredentials.apiKey,
                            apiPass: litmusApiCredentials.apiPass,
                            emailTestID: parseInt(result.CreateEmailTestResult.ID.$value)
                        };
                        // console.log('getEmailArgs', getEmailArgs);

                        var startTime = new Date().getTime(); // returns ms since 1-1-1970
                        emailTestInterval = setInterval(function() {
                            client.GetEmailTest(getEmailArgs, function(err, emailTest){
                                console.log(err);
                                console.log('-----------getEmailTest-----------');
                                //console.log(emailTest);

                                var jsonResults;

                                var elapsedTime = new Date().getTime() - startTime;

                                if ( elapsedTime < EMAIL_TEST_MAX_WAIT_MS){
                                    jsonResults = returnResultsWhenEmailTestComplete(emailTest, filterResults);
                                }else{
                                    console.log('-----------MAX_WAIT_TIME_REACHED--------------');
                                    jsonResults = returnResults(emailTest, filterResults);
                                }

                                if (jsonResults){
                                    clearInterval(emailTestInterval);
                                    requestNotCompleted = false;

                                    console.log('|||||||||||||||||||||||||||||||||||||||||||||');
                                    console.log('jsonResults', jsonResults);
                                    res.json(jsonResults);
                                    res.end();
                                }
                            });
                        }, EMAIL_TEST_MS);
                        //emailTest = LitmusApi.GetEmailTest("api-key", "api-pass", emailTest.ID as integer)
                    });
                });
            });

            }catch(ex){
                console.log("Error:" + ex.message);
                //res.end();
            }
        });
        app.post('/login', function(req, res){
            console.log("app.post");
            res.json({user: 'test'});
            res.end();
        });
        function returnResultsWhenEmailTestComplete(emailTest, filterResults){
            var numFinished = 0;
            var numResults = emailTest.return.Results.Item.length;
            console.log('numResults', emailTest.return.Results.Item[0], 'like this one they are an amount of ' + numResults);
            console.log('State', emailTest.return.State);
            var jsonResults = allEmailTestResultsCompleted(emailTest.return.Results.Item, filterResults);

            if (jsonResults){
                return jsonResults;
            }else{
                var stringyNotCompleteResults = "", stringyCompleteResults = "";
                var countNotComplete = 0, countComplete = 0;
                for(var k=0; k < numResults; k++){
                    var testResult2 = emailTest.return.Results.Item[k];
                    var stringyResult = '(' + testResult2.ApplicationName.$value + ', ' + testResult2.ApplicationLongName.$value + ', ' + testResult2.Completed.$value + ')\n';
                    if (testResult2.Completed.$value === 'false'){
                        stringyNotCompleteResults += stringyResult;
                        countNotComplete += 1;
                    }else{
                        stringyCompleteResults += stringyResult;
                        countComplete += 1;
                    }
                }
                console.log('Not Complete ' + countNotComplete + '/' + numResults);
                console.log(stringyNotCompleteResults);
                console.log('Complete ' + countComplete + '/' + numResults);
                console.log(stringyCompleteResults);

                return false;
            }
        }
        function returnResults(emailTest, filterResults){
            return allEmailTestResults(emailTest.return.Results.Item, filterResults, false);
        }
        function allEmailTestResultsCompleted(emailTestResults, filterResults){
            return allEmailTestResults(emailTestResults, filterResults, true);
        }
        function allEmailTestResults(emailTestResults, filterResults, filterCompleted){
            var results = filterResults || emailTestResults;
            var numResults = results.length;
            var jsonResults = [];

            for(var j=0; j < numResults; j++){
                var testResult = getEmailTestResultFromApplicationName(emailTestResults, results[j].ApplicationName.$value);
                var jsonResult = {
                    ApplicationLongName: testResult.ApplicationLongName.$value,
                    SupportsContentBlocking: testResult.SupportsContentBlocking.$value,
                    Completed: testResult.Completed.$value,
                    AverageTimeToProcess: testResult.AverageTimeToProcess.$value
                };
                if (testResult.SupportsContentBlocking.$value === 'true'){
                    jsonResult.FullpageImage = testResult.FullpageImageNoContentBlocking.$value;
                    jsonResult.FullpageImageContentBlocking = testResult.FullpageImageContentBlocking.$value;
                }else{
                    jsonResult.FullpageImage = testResult.FullpageImage.$value;
                }
                jsonResults.push(jsonResult);

                if (filterCompleted &&
                    isEmailTestResultNotCompleted(emailTestResults, testResult.ApplicationName.$value)){
                    return false;
                }
            }

            return jsonResults;
        }
        function getEmailTestResultFromApplicationName(emailTestResults, ApplicationName){
            for (var i=0;i < emailTestResults.length; i++){
                if (emailTestResults[i].ApplicationName.$value === ApplicationName){
                    return emailTestResults[i];
                }
            }

            return null;
        }
        function isEmailTestResultNotCompleted(emailTestResults, ApplicationName){
            var testResult = getEmailTestResultFromApplicationName(emailTestResults, ApplicationName);

            return  (testResult.Completed.$value !== 'true');
        }
        function sendFile (url, req, res){
            fs.exists(url, function(exists){
                if(exists){
                    fs.readFile(url, function (err, data) {
                        if (err){
                            sendFileNotFound(req, res);
                        }else{
                            res.end(data);
                        }
                    });
                }else{
                    sendFileNotFound(req, res);
                }
            });
        }
        function sendFileNotFound(req, res){
            res.statusCode = 404;
            fs.readFile(self.notFoundFile, function (err, data) {
                if (err){
                    res.end();
                }else{
                    res.end(data);
                }
            });
        }
    }

    exports.init = init;
})();
