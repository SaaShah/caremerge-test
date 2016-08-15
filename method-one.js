var express = require('express');
var app = express();

app.get('/I/want/title/', function (req, res) {

  // get addresses
  arrAddress = req.query.address;

  // has address ?
  if(arrAddress != undefined && arrAddress.length > 0){
    arrAddress.forEach(function(url){
      console.log(url);
    });
  }
  else {
    res.send('No address passed.');
  }

});

app.all('*', function (req, res) {
  res.sendStatus(404);
});

app.listen(3000, function () {
  console.log('Server listening on port 3000!');
});
