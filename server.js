// static file server using ecstatic
var http = require('http')
var ecstatic = require('ecstatic')
var st = ecstatic(__dirname + '/public')

// API calls to pick words and get definitions:
var pick = require('./server-side/pick-word.js');
var p = new pick('wow!');
// p.printDemo();

var server = http.createServer(function (req, res) {
	st(req, res)
})
server.listen(5000);