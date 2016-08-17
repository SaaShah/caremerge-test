var http = require('http');
var express = require('express');
var _URL = require('url-parse');

var app = express();
app.set('view engine', 'pug');

// required url
app.get('/I/want/title/', iWantTitle);

// throw 404 on others
app.all('*', function(req, res) {
    res.sendStatus(404);
});

app.listen(3000, function() {
    console.log('Server listening on port 3000!');
});

// regex
var re = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/gi;

// function to handle the request
function iWantTitle(req, res) {
    if (!req.query.address) res.send('No address passed.');

    // variables initialization
    var done = 0;
    var arrResults = [];
    var arrAddress = [];

    var _address = req.query.address;

    // has single or multiple address ?
    if(Array.isArray(_address)){
        _address.forEach(function (_u) {
            arrAddress.push(new _URL(_u, true))
        })
    }
    else 
        arrAddress.push(new _URL(_address, true))

    // for each url passed, make get calls
    arrAddress.forEach(makeGetCall);

    // make get call for the url
    function makeGetCall(url, index, array) {

        // function to process the response
        function processGetResponse(response) {
            
            // process the response
            response.on('data', function(chunk) {
                // process chunks
                var match = re.exec(chunk.toString());
                if (match && match[2]) 
                    processResponseData(index, match[2], array, url);               
            });
            
        };
        
        // function to process the error
        function processGetError(err) {
            // return callback                
            processResponseData(index, 'NO RESPONSE', array, url);
        };

        // make the request
        http.get(url, processGetResponse).on('error', processGetError);
                
    };

    // function to process the response
    function processResponseData(index, title, array, url) {

        arrResults[index] = { 'url': url, 'title': title };
        done++;
        
        // all requests are done, render the template
        if (done == array.length) 
            res.render('index', { arrResults: arrResults });

    };


};
