var express = require('express');
var app = express();

// facebook makes a post request to get the files
app.post('/', function (req, res, next) {
    req.method = 'GET';
    next();
});

app.get('/privacy', function (req, res, next) {
    res.send("This game is for the purpose of fun, and my privacy policy is simple.  I use your Facebook login to store your progress in the game.  Other than that, I use some forms of analytics to see where my marketing efforts are working or not, and I may show 3rd party adds and use a 3rd party payment processor for in app purchases.  I never sell any of your information to 3rd parties.");
});
app.post('/privacy', function (req, res, next) {
    res.send("This game is for the purpose of fun, and my privacy policy is simple.  I use your Facebook login to store your progress in the game.  Other than that, I use some forms of analytics to see where my marketing efforts are working or not, and I may show 3rd party adds and use a 3rd party payment processor for in app purchases.  I never sell any of your information to 3rd parties.");
});

app.use(express.static('./'));

var port = process.env.PORT || 3000;

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
