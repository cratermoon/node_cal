const http = require('http');
const fs = require ('fs');
const urlmodule = require('url');


const quips = require('./lib/quips');
quips.loadQuips();


const renderer = require('./lib/render');

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
    var lowerpath = parsedUrl.pathname.toLowerCase ();
    console.log("path is "+lowerpath);
    if (lowerpath == "/") {
      var  clientIp = request.connection.remoteAddress;
      response.setHeader('Content-Type', 'text/plain');
      response.write(quips.randomQuip());
      response.write("\n");
      response.end();
    } else {
      renderer.render(response, lowerpath);
    }
  } else {
    response.statusCode = 404;
    response.end();
  }
}).listen(8090);
