## SOAP LITMUS TESTS

Node server that communicates with Litmus soap api. It started as a hack to automate the way we tests HTML Email templates.

The server receives a petion with 3 body params:
    - html: HTML Email template
    - clients: list of email clients valid for litmus, e.g. `ol2002|ol2013|iphone5|ipad`
    - cc: list of emails to notify, separated by commas
 1. It will use the litmus api and will wait until every client respond with a maximun waiting time of 60 seconds. 
 2. After that, the server will respond with json, every result will contain Screenshots of each client rendering the HTML Email template who responded.
 3. The server will also send the HTML Email template to the list of emails the user has specified on the request.

### ROADMAP

- Add unit tests + refactor (remove the hack) 
- Maintain connection alive while waiting for litmus to finish
- Update technologies/dependencies

### Requisites

- Public accessible Linux box in port 8080, with node + sendmail configured

### HOW TO USE IT

First of all, change your litmus api credentials on server.js file:
```
    var litmusApiCredentials = {
        apiKey: 'mycompany-api',
        apiPass: 'apikeypassword'
    };
```

Change var MAILFROM in litmus.sh file:
`export MAILFROM="appname@servername.com"`

The server could be run like this
```
cd /var/www/soap
nohup node /var/www/soap/src/server/berlin.js 8088 &
```

### Based on Berlin project

Environment setup to do RIAs in javascript with node.js and mongodb.
With Jasmine as testing framework (client & server side).
Casperjs for e2e tests. Integrated with karma test runner. And all automated with gruntjs.

You can find the berlin [base project here](https://bitbucket.org/kabomi/berlin)

### License

This project is licensed under The MIT License. Please see the LICENSE.txt file for the full license.

