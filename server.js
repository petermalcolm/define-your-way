//// INCLUDES ////
// static file server using ecstatic
var http = require('http')
var ecstatic = require('ecstatic')
var st = ecstatic(__dirname + '/public')
// and simple little endpoint using routes
var Router = require('routes')
var router = Router()

//// STATIC FILES on 5000 ////
var server = http.createServer(function (req, res) {
	st(req, res); // static files
});
server.listen(5000);

//// API on 5411 ////
// define endpoints 
router.addRoute('/hello', function (req, res, m) {
	res.end('oh hello\n');
});

// API calls to pick words and get definitions:
var pick = require('./server-side/pick-word.js');
var p = new pick('wow!');
p.getWord();

var apiserv = http.createServer(function (req, res) {
	// endpoints
	var m = router.match(req.url)
		if (m) m.fn(req, res, m)
		else {
			res.statusCode = 404
			res.end('not found\n')
		}	
});
apiserv.listen(5411);