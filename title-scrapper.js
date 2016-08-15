var http = require('http');

var re = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/gi;

module.exports = {

  // function to get title
  getTitle: function(url, cb){

    console.log('get title for', url);

    http.get(url, function (response) {
        response.on('data', function (chunk) {
            var str=chunk.toString();
            var match = re.exec(str);
            if (match && match[2]) {
              console.log(match[2]);
              return match[2];
            }
        });
    });
  },

};

//reference @ http://stackoverflow.com/questions/13087888/getting-the-page-title-from-a-scraped-webpage
