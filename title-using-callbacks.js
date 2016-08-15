var http = require('http');
var express = require('express');
var app = express();
app.set('view engine', 'pug');
var _url = require('url');

app.get('/I/want/title/', iWantTitle);

app.all('*', function(req, res) {
    res.sendStatus(404);
});

app.listen(3000, function() {
    console.log('Server listening on port 3000!');
});



// function to handle the request
function iWantTitle(req, res) {
    if (!req.query.address) res.send('No address passed.');



    // counts the number of requests done
    var done = 0;
    // stores the requests result
    var result = [];

    var re = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/gi;

    var arrAddress = [];

    // get addresses
    _address = req.query.address;

    console.log(Array.isArray(_address));
    console.log('_address', _address);

    Array.isArray(_address) ? arrAddress = _address : arrAddress.push(_address)
    console.log('arrAddress', arrAddress);
    arrAddress.forEach(processUrl);


    // process url
    function processUrl(url, index, array) {
        console.log('processUrl', _url.parse(url, true));

        var finalData = '';
        http.get(_url.format(url, true), function(response) {
            response.setEncoding('utf8');
            response.on('data', function(data) {
                var match = re.exec(data.toString());
                if (match && match[2]) {
                    console.log(match[2]);
                    callback(index, match[2], array, url);
                } else {
                    finalData += data;
                }
            });

            response.on('end', function() {
                var match = re.exec(finalData);
                if (match && match[2]) {
                    console.log(match[2]);
                    callback(index, match[2], array);
                }
            })
        }).on('error', function() {
            console.error('errrrrr');
            callback(index, 'NO RESPONSE', array, url);
        });
    }


    // this will be called by each http.get and they will provide their index
    function callback(index, data, array, url) {
        console.log('callback', data);
        console.log('index', index);
        console.log('done', done);
        console.log('lenght', array.length);

        result[index] = {
            'url': url,
            'title': data
        };
        done++;
        // all requests are done, log everything
        if (done == array.length) {
            result.forEach(console.log);
            res.render('index', {
                title: 'Hey',
                titles: result
            });
        }
    }


};
