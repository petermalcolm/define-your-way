//// INCLUDES ////
// static file server using ecstatic
const http = require('http');
const ecstatic = require('ecstatic');
const st = ecstatic({ root: __dirname + '/public', handleError: false })

// and a db for users, games and cached API responses
const levelup = require('level');
const dbNoPromise = levelup('./define-db');

// and some node magic for making Promises:
const {promisify} = require('util');
const db = { get : promisify(dbNoPromise.get.bind(dbNoPromise)),
			 put : promisify(dbNoPromise.put.bind(dbNoPromise)),
			 del : promisify(dbNoPromise.del.bind(dbNoPromise)) };

// and simple little endpoints using routes
const Router = require('routes');
const staticRouter = Router();
const apiRouter = Router();
const qs = require('querystring');
// and websockets for realtime communication between players
const websocket = require('nodejs-websocket');
// local includes
const pick = require('./server-side/pick-word.js');
const definition = require('./server-side/define-word.js');
const userlib = require('./server-side/users.js');
const users = new userlib(db);
const gamelib = require('./server-side/games.js');
const games = new gamelib(db);

//// STATIC FILES on 5000 ////
// define endpoint: /game/:name
staticRouter.addRoute('/game/:name/*', function(req, res, m) {
	if( !m.splats.length || JSON.stringify(m.splats) === JSON.stringify(['']) ) {
		joinGame( m.params.name, readReqCookie(req,'define-jwt') )
		.then( function youreIn( result ) {
			if( !(result instanceof Error) ) {
				console.log( 'User made it into the game with token',result );
				req.url = "/game.html";
				st(req,res);
			} else {
				console.log( 'User entered non-existent game:',result );
				res.end('Sorry. That game does not exist');
			}
		})
		.catch(function(err){
			console.log( 'User is not signed in.',err );
			redirect(res,'/',{});
		});
	} else {
		req.url = "/assets/" + m.splats[0];
		st(req,res);
	}
});
// endpoint: /create/game/:name
staticRouter.addRoute('/create/game/:name', function(req, res, m) {
	createGame( m.params.name, readReqCookie(req,'define-jwt') )
	.then( (result) => {
		if( !(result instanceof Error) ) {
			console.log( 'User created game',m.params.name,'with userToken',result );
			redirect(res,'/game/'+m.params.name+'/',{});
		} else {
			console.log( 'Something went wrong creating game',m.params.name );
			res.end('Sorry. Something went wrong creating game',m.params.name );
		}
	});
});
// endpoint: /login for POST submissions
staticRouter.addRoute('/login', function logIn(req, res, m) {
	if('POST'!==req.method) {
		redirect(res,'/',{});
		return;
	}
	parsePost(req)
	.then( function findThem(body) {
		var post = qs.parse(body);
		return users.authenticate(post['email'],post['password']);
	})
	.then( function redirectThemAfterLogIn(userToken){
		console.log('Here is the user\'s token:',userToken); // debugging
		redirect(res,'/',{'Set-Cookie':'define-jwt='+userToken});
	})
	.catch( function logInFailed(err) {
		console.log('Log-In Failed:',err);
		var result;
		if(err && 'NotFoundError' === err.type ) {
			result = '' + post['email'] + ' not found';
		} else if (err && 'BadPasswordError' === err.type) {
			result = 'sorry, wrong password for ' + post['email'];
		} else if (err && 'BadDataError' === err.type) {
			result = 'sorry, there is a problem with the user account for ' + post['email'];
		} else {
			result = '' + post['email'] + ' found! \n ' + userToken;
		}
		res.end(result); // debugging
	});
});
// endpoint: /signup for POST submissions
staticRouter.addRoute('/signup', function signUp(req, res, m) {
	if('POST'!==req.method) {
		redirect(res,'/',{});
		return;
	}
	parsePost(req)
	.then( function createThem(body) {
		var post = qs.parse(body);
        return users.create({	name : post['name'],
								email : post['email'],
								password : post['password'],
								avatar : post['avatar']});
    })
	.catch(function signUpFailed(err) {
		if(err) {
			result = 'An account already exists for that email.';
		}
		console.log(err);
		res.end(result); // debugging
    })
    .then( function redirectThemAfterSignIn(userToken){
		console.log('Here is the user\'s token:',userToken); // debugging
		redirect(res,'/',{'Set-Cookie':'define-jwt='+userToken});
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
	headers.Location = to;
	res.writeHead(302, headers);
	res.end();
}

// parse a post request
// Thanks: https://stackoverflow.com/questions/4295782/how-do-you-extract-post-data-in-node-js
// return a Promise
const parsePost = function(req) {
	return new Promise(function(resolve, reject) {
		var body = '';
		req.on('data', function (data) {
		    body += data;
		    // Too much POST data, kill the connection!
		    // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
		    if (body.length > 1e6) {
		        req.connection.destroy();
		        reject(Error('Too much data'));
		    }
		});
		req.on('end', function() { 
			resolve(body) 
		});
	});
}

const readReqCookie = function(req, name) {
	const nameEQ = name + "=";
	const ca = req.headers.cookie && req.headers.cookie.split(';');
	for(var i=0;ca && i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

// join a game
// return a Promise
const joinGame = function( gameName, userToken ) {
	if( null === userToken ) { return Promise.reject( userToken ); }
	return games.joinIn( gameName, userToken );
}

// create a game
// return a Promise
const createGame = function( gameName, userToken ) {
	if( null === userToken ) { return Promise.reject( userToken ); }
	return games.create( gameName, users.extractEmailFromToken(userToken) );
}

//// WebSockets on 5123 for multiplayer ////

const wsockserv = websocket.createServer( function (conn) {
	console.log('New Connection');
	conn.nickname = null
	conn.on("text", function (str) {
		if (conn.nickname === null) {
			conn.nickname = str
			broadcast(str+" entered")
		} else
			broadcast("["+conn.nickname+"] "+str)
	})
	conn.on("close", function () {
		broadcast(conn.nickname+" left")
	})
}).listen(5123);

function broadcast(str) {
	wsockserv.connections.forEach(function (connection) {
		connection.sendText(str)
	})
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