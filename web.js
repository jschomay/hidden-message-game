var express = require('express');
var app = express();

// facebook makes a post request to get the files
app.post('/', function (req, res, next) {
    req.method = 'GET';
    next();
});

app.use(express.static('./'));

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
