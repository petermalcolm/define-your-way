//// INCLUDES ////
// static file server using ecstatic
const http = require('http');
const ecstatic = require('ecstatic');
const st = ecstatic({ root: __dirname + '/public', handleError: false })

// and a db to cache some API responses
const levelup = require('level');
const db = levelup('./define-db')
// and simple little endpoints using routes
const Router = require('routes');
const staticRouter = Router();
const apiRouter = Router();
const qs = require('querystring');
// local includes
const pick = require('./server-side/pick-word.js');
const definition = require('./server-side/define-word.js');
const userlib = require('./server-side/users.js');
const users = new userlib(db);

//// STATIC FILES on 5000 ////
// define endpoint: /game/:id
staticRouter.addRoute('/game/:id/*', function(req, res, m) {
	if( !m.splats.length || JSON.stringify(m.splats) === JSON.stringify(['']) ) {
		req.url = "/game.html";		
	} else {
		req.url = "/assets/" + m.splats[0];
	}
	st(req,res);
});
// endpoint: /login for POST submissions
staticRouter.addRoute('/login', function(req, res, m) {
	// Thanks: https://stackoverflow.com/questions/4295782/how-do-you-extract-post-data-in-node-js
	if('POST'!==req.method) {
		redirect(res,'/',[]);
		return;
	}
	parsePost_then( req, function(body) {
		var post = qs.parse(body);
		users.authenticate(post['email'],post['password'],function(err,userInfo){
			var result;
			if(err && 'NotFoundError' === err.type ) {
				result = '' + post['email'] + ' not found';
			} else if (err && 'BadPasswordError' === err.type) {
				result = 'sorry, wrong password for ' + post['email'];
			} else if (err && 'BadDataError' === err.type) {
				result = 'sorry, there is a problem with the user account for ' + post['email'];
			} else {
				result = '' + post['email'] + ' found!';
			}
			console.log(result,userInfo); // debugging
		    // // eventually, redirect now-logged-in user:
			// res.writeHead(302, {
			//   'Location': '/'
			//   //add other headers here...
			// });
			// res.end();
			res.end(result+'\n'); // debugging
		});
	});
});
// endpoint: /signup for POST submissions
staticRouter.addRoute('/signup', function(req, res, m) {
	if('POST'!==req.method) {
		redirect(res,'/',[]);
		return;
	}
    var body = '';

    req.on('data', function (data) {
        body += data;

        // Too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6)
            req.connection.destroy();
    });

    req.on('end', function () {
        var post = qs.parse(body);
        users.create({	name : post['name'],
        				email : post['email'],
        				password : post['password'],},function(err,id){
        	var result;
			if(err) {
				result = '' + post['email'] + ' not created';
			} else {
			    result = '' + post['email'] + ' created!';
			}
			console.log(result); // debugging
	        // // eventually, redirect now-logged-in user:
			// res.writeHead(302, {
			//   'Location': '/'
			//   //add other headers here...
			// });
			// res.end();
			res.end(result+'\n'); // debugging
        });
    });
});
// root level: /
staticRouter.addRoute('/*', function(req, res, m) {
	if( !m.splats.length || JSON.stringify(m.splats) === JSON.stringify(['']) ) {
		req.url = "/index.html";		
	} else {
		req.url = "/assets/" + m.splats[0];
	}
	st(req,res);
});

// wire it up:
const server = http.createServer(function (req, res) {
//	st(req, res); // static files
	var m = staticRouter.match(req.url)
		if (m) m.fn(req, res, m)
		else {
			res.statusCode = 404;
			res.end('not found\n');
		}
});
server.listen(5000);

/// helpers for static ///
const redirect = function(res, to, headers) {
	res.writeHead(302, {
	  'Location': to
	  //add other headers here...
	});
	res.end();
}

const parsePost_then = function( req, do_callback ) {
    var body = '';
    req.on('data', function (data) {
        body += data;

        // Too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6)
            req.connection.destroy();
    });
    // console.log(body); // debugging
    req.on('end', function() { 
    	do_callback(body) 
    });
}

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