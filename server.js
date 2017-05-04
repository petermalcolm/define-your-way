//// INCLUDES ////
// static file server using ecstatic
var http = require('http');
var ecstatic = require('ecstatic');
var st = ecstatic(__dirname + '/public');
// and simple little endpoint using routes
var Router = require('routes');
var router = Router();
// my includes
var pick = require('./server-side/pick-word.js');

//// STATIC FILES on 5000 ////
var server = http.createServer(function (req, res) {
	st(req, res); // static files
});
server.listen(5000);

//// API on 5411 ////
// define endpoints 
router.addRoute('/word', function (req, res, m) {
	this.res = res;
	var that = this;
	var p = new pick();
	p.getWord(function(err,word){
		if(null===err){
			console.log('callback, successfully gotWord()');
			that.res.setHeader("Access-Control-Allow-Origin", "http://localhost:5000");
		    that.res.setHeader("Access-Control-Allow-Credentials", "true");
		    that.res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
		    that.res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    		that.res.end(word+'\n');
		} else {
			console.log('callback, failed at gotWord()', err);
			that.res.end('... error\n');
		}
	});
});


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