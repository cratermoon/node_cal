const http = require('http');
const fs = require ('fs');
const urlmodule = require('url');


const quips = require('./lib/quips');
quips.loadQuips();

const renderer = require('./lib/render');

const flickrr = require('./lib/flickrr');

http.createServer(function(request, response) {
  request.on('error', function(err) {
    console.error(err);
    response.statusCode = 400;
    response.end();
  });
  response.on('error', function(err) {
    console.error(err);
  });
  if (request.method === 'GET') {
    var parsedUrl = urlmodule.parse (request.url, true);
    var path = parsedUrl.pathname.toLowerCase();
    console.log("path is "+path);
    if (path == "/") {
      var  clientIp = request.connection.remoteAddress;
      response.setHeader('Content-Type', 'text/plain');
      response.write(quips.randomQuip());
      response.write("\n");
      response.end();
    } else if (path == "/flickr") {
      flickrr.flickrl(function(result) {
        response.setHeader('Content-Type', 'application/json');
        response.write(JSON.stringify(result));
        response.end();
      });
    } else {
      renderer.render(response, path);
    }
  } else {
    response.statusCode = 404;
    response.end();
  }
}).listen(8090);
