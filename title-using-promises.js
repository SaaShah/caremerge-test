var http = require('http');
var express = require('express');
var Q = require('q');
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
    var arrAddress = [];
    var arrPromises = [];
    var arrResults = [];

    var _address = req.query.address;

    // has single or multiple address ?
    if(Array.isArray(_address)){
        _address.forEach(function (_u) {
            arrAddress.push(new _URL(_u, true))
        })
    }
    else 
        arrAddress.push(new _URL(_address, true))

    // for each url passed, make functions objects
    arrAddress.forEach(function(url){
      arrPromises.push(makeAPromise(url));
    });

    // all promises processed
    Q.allSettled(arrPromises).then(processAllPromisesData).done(renderTheTemplate);
            
    // function to process the data
    function processAllPromisesData(promisesResults) {
        promisesResults.forEach(function (result) {
          arrResults.push({'url': result.value.url, 'title': result.value.title});
        });
    };
    
    // render the template
    function renderTheTemplate() {
            res.render('index', { arrResults: arrResults });
    };
    
    // function to process the response
    function makeAPromise(url) {

        return Q.Promise(function(resolve, reject, notify) {
            
            // function to process the response
            function processGetResponse(response) {
                // process chunks
                response.on('data', function(chunk) {
                    var match = re.exec(chunk.toString());
                    if (match && match[2]) 
                        resolve({title: match[2], url: url});                
                });
            };
            
            // function to process the error
            function processGetError(err) {
                // return callback                
                resolve({title: 'NO RESPONSE', url: url});
            };
            
            // request and extract the titles
            http.get(url, processGetResponse).on('error', processGetError);
        });
        
    }

};
