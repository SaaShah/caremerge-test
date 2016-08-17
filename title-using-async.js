var http = require('http');
var express = require('express');
var async = require('async');

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
    var arrAddress = [];
    var arrResults = [];
    var arrFunctionCalls = {};

    var _address = req.query.address;

    // has single or multiple address ?
    Array.isArray(_address) ? arrAddress = _address : arrAddress.push(_address)

    // for each url passed, make functions objects
    arrAddress.forEach(function(url) {
        arrFunctionCalls[url] = function(callback) {
            // request and extract the titles
            http.get(url, processGetResponse).on('error', processGetError);

            // function to process the response
            function processGetResponse(response) {
                // process chunks
                response.on('data', function(chunk) {
                    var match = re.exec(chunk.toString());
                    if (match && match[2]) 
                        callback(null, { title: match[2], url: url }); // return callback                       
                });
            };
            
            // function to process the error
            function processGetError(err) {
                // return callback                
                callback(null, { title: 'NO RESPONSE', url: url });
            };    
        }
    });



    // async parallel on arrFunctionCalls
    async.parallel(arrFunctionCalls, allCallsProcessed);

    // all calls processed
    function allCallsProcessed(err, allResponses) {
        if (err) return;
        
        // prepare array of results
        arrAddress.forEach(function(url) {
            arrResults.push(allResponses[url]);
        });

        // render the template
        res.render('index', { arrResults: arrResults });
    };


}