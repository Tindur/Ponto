var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
//var app = require('express');

var server = http.createServer( function( req, res ) {
	var home = new RegExp('^/home');
	var rooms = new RegExp('^/rooms');
	var room = new RegExp('^/room/?$');
	var media = new RegExp('^/media/');
	var reqPath = url.parse(req.url).pathname;

	if(home.test(reqPath)) {
		fs.readFile('site.html', function (err, data) {
  			if (err) throw err;
  			res.writeHead( 200, { 'content-type': 'text/html'});
			res.end(data, 'utf-8');
        });
	}
	else if(media.test(reqPath)) {
		var filePath = '.' + req.url;
		var extname = path.extname(filePath);
	    switch (extname) {
	        case '.js':
	            contentType = 'text/javascript';
	            break;
	        case '.css':
	            contentType = 'text/css';
	            break;
	    }
	    fs.readFile(filePath, function (err, data) {
  			if (err) throw err;
  			res.writeHead( 200, { 'content-type': contentType});
			res.end(data, 'utf-8');
        });
	}
	else if(rooms.test(reqPath)) {
		var shit = {"shit1": "shit1", "shit2": "shit2"};
		res.write(str(shit));
		res.end();
	}
	else if (room.test(reqPath)) {
		res.writeHead( 200, { 'content-type': 'text/plain'});
		//var queryObject = url.parse(req.url,true).query;
		res.end('serving about ');
	}
	else {
		res.writeHead(404);
		res.end("File not found\n");
	}
});

server.listen( 8000 );

console.log('listening to penisshit');