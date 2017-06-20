//// INCLUDES ////
// static file server using ecstatic
var http = require('http');
var ecstatic = require('ecstatic');
// var st = ecstatic(__dirname + '/public');
var st = ecstatic({ root: __dirname + '/public', handleError: false })

// and a db to cache some API responses
var levelup = require('level');
var db = levelup('./define-db')
// and simple little endpoint using routes
var Router = require('routes');
var staticRouter = Router();
var apiRouter = Router();
// my includes
var pick = require('./server-side/pick-word.js');
var definition = require('./server-side/define-word.js');

//// STATIC FILES on 5000 ////
// define endpoint: /game/:id
staticRouter.addRoute('/game/:id/*', function(req, res, m) {
	if( !m.splats.length || JSON.stringify(m.splats) === JSON.stringify(['']) ) {
		req.url = "/index.html";		
	} else {
		req.url = "/assets/" + m.splats[0];
	}
	st(req,res);
});
// root level:
var server = http.createServer(function (req, res) {
//	st(req, res); // static files
	var m = staticRouter.match(req.url)
		if (m) m.fn(req, res, m)
		else {
			res.statusCode = 404
			res.end('not found\n')
		}
});
server.listen(5000);

//// API on 5411 ////
// define endpoint: /word
apiRouter.addRoute('/word', function (req, res, m) {
	this.res = res;
	var that = this;
	var p = new pick();
	p.getWord(function(err,word){
		if(null===err){
			console.log('callback, successfully gotWord()');
			that.res = corsHeaders( that.res );
    		that.res.end(word+'\n');
		} else {
			console.log('callback, failed at gotWord()', err);
			that.res.end('... error\n');
		}
	});
});

// define endpoint: /definition
apiRouter.addRoute('/define/:word?', function (req, res, m) {
	this.res = res;
	var that = this;
	console.log('inside definition, m.word is: '+JSON.stringify(m.params));
	this.word = m.params.word ? m.params.word : '';
	var d = new definition( db, this.word );
	d.getDefinition( function(err,defined){
		if(null===err){
			console.log('callback, success at getDefinition()');
			that.res = corsHeaders( that.res );
			that.res.end(defined+'\n');
		} else {
			console.log('callback, failed at getDefinition()', err)
		}
	});
});

// helper: CORS-friendly headers
var corsHeaders = function(res) {
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:5000");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
	res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
	return res;
};

var apiserv = http.createServer(function (req, res) {
	// endpoints
	var m = apiRouter.match(req.url)
		if (m) m.fn(req, res, m)
		else {
			res.statusCode = 404
			res.end('not found\n')
		}	
});
apiserv.listen(5411);