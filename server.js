var RSVP = require('rsvp');
// static file server using ecstatic
var http = require('http')
var ecstatic = require('ecstatic')
var st = ecstatic(__dirname + '/public')

var server = http.createServer(function (req, res) {
  st(req, res)
})
server.listen(5000)