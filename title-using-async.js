var http = require('http');
var express = require('express');
var async = require('async');

var app = express();
app.set('view engine', 'pug');

app.get('/I/want/title/', iWantTitle);

app.all('*', function(req, res) {
    res.sendStatus(404);
});

app.listen(3000, function() {
    console.log('Server listening on port 3000!');
});


var re = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/gi;

// function to handle the request
function iWantTitle(req, res) {
    if (!req.query.address) res.send('No address passed.');

    // counts the number of requests done
    var done = 0;
    // stores the requests result
    var result = [];
    var arrAddress = [];
    var promises = [];
    var arrResults = [];

    // get addresses
    _address = req.query.address;

    console.log(Array.isArray(_address));
    console.log('_address', _address);

    Array.isArray(_address) ? arrAddress = _address : arrAddress.push(_address)
    console.log('arrAddress', arrAddress);


    // arrAddress.forEach(function(url){
    //   promises.push({url : processUrl(url, _callback)})
    // });

    // async.parallel(promises, function(err, results) {
    //     // results is now equals to: {one: 1, two: 2}
    //     console.log(err);
    // });

    console.log('promises', promises);

    // function _callback(err, result) {
    //   console.log('result >> ', result);

    //     arrResults.push(
    //         {
    //             'url': result.url,
    //             'title': result.title
    //         });

    //         // return console.log('arrResults', arrResults);
    //         //return;
    // };

    // process url
    // function processUrl(url, callback) {
    //   if(!url) return;
    //     console.log('processUrl', url);

    //     http.get(url, function(response) {
    //         response.setEncoding('utf8');
    //         response.on('data', function(data) {
    //             var match = re.exec(data.toString());
    //             if (match && match[2]) {
    //                 console.log('match[2] match[2]', match[2]);
    //                 var data = {
    //                   title: match[2],
    //                   url: url
    //                 };
    //                 // return data;
    //                 return callback(null, data);
    //             }
    //         });
    //     }).on('error', function(err) {
    //         console.error('errrrrr', err);
    //         var data = {
    //           title: 'NO RESPONSE',
    //           url: url
    //         };
    //         // return data;
    //         return callback(null, data);
    //       });
    // }


// async.parallel({
//     google: function(callback){
//       http.get("http://www.google.com", function(res){
//         console.log("google done");
//         callback(null, res.statusCode);
//       })
//     },
//     yahoo: function(callback){
//       http.get("http://www.yahoo.com", function(res){
//         console.log("yahoo done");
//         callback(null, res.statusCode);
//       })    
//     }
//   },
//   function(err, results) {
//     if(!err){
//       console.log("all done");
//       console.log(results.google);
//       console.log(results.yahoo);
//     }else{
//       console.log(err);
//     }
//   }
// );


var obj = {};




arrAddress.forEach(function(url){
    obj[url] = function(callback){
        http.get(url, function(res){
            //console.log(res);
            
            
            var data = {};
            
            
            res.on('data', function(data) {
                var match = re.exec(data.toString());
                if (match && match[2]) {
                    console.log('match[2] match[2]', match[2]);
                    data = {
                      title: match[2],
                      url: url
                    };
                    // return data;
                    callback(null, data);
                }
            });
            
            
            
            
            
            
            
            console.log(data);
            // callback(null, data);
        });
    }
});
    
    

async.parallel(obj,
  function(err, results) {
    if(!err){
      console.log(results);
      
      
      
      
      
    arrAddress.forEach(function(url){
        console.log("----------------------------------------");
        console.log("----------------------------------------");
        console.log("----------------------------------------");
        console.log("----------------------------------------");
        console.log("----------------------------------------");
        
        console.log(results[url]);
        
        console.log("----------------------------------------");
        console.log("----------------------------------------");
        console.log("----------------------------------------");
        console.log("----------------------------------------");
        arrResults.push(results[url]);
    });
      
      
      
      console.log('arrResults >>>>>>>>>', arrResults);
      
            res.render('index', {
                title: 'Hey',
                titles: arrResults
            });
      
      
    }else{
      console.log(err);
    }
  }
);



}
