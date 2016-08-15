var express = require('express');
var scrapper = require('./title-scrapper');
var app = express();
var Q = require('q');

console.log(scrapper);

app.get('/I/want/title/', iWantTitle);

app.all('*', function (req, res) {
  res.sendStatus(404);
});

app.listen(3000, function () {
  console.log('Server listening on port 3000!');
});




function iWantTitle(req, res) {

  // get addresses
  arrAddress = req.query.address;

  // has address ?
  if(arrAddress != undefined && arrAddress.length > 0){

    allPromises = [];

    arrAddress.forEach(function(url){
      console.log(url);
      arrNfcCalls.push(scrapper.getTitle(url));
    });

    // using q
    Q.all(allPromises).then(
        function (results) {
          console.log('results:', results);
        },
        function (err) {
          console.error('ERR', err);
        }
    );


  }
  else {
    res.send('No address passed.');
  }

};
