#!/usr/bin/env nodejs

const http = require('http');
const fs = require ('fs');
const urlmodule = require('url');


const quips = require('./lib/quips');
quips.loadQuips();

const renderer = require('./lib/render');

const flickrr = require('./lib/flickrr');
const sc = require('./lib/safecast/api');

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
      response.writeHead(302, {
        'Location': '/index.html'
      });
      response.end();
    } else if (path == "/qotd") {
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
    } else if (path == "/flickr/locate") {
      var photoId = parsedUrl.query.id;
      console.log("locating "+photoId);
      flickrr.geoLocatePhoto(photoId, function(result) {
        response.setHeader('Content-Type', 'application/json');
        response.write(JSON.stringify(result));
        response.end();
      });
    } else if (path == "/flickr/setuser") {
	    var username = parsedUrl.query.username;
	    console.log("Changing username to " + username);
      flickrr.getIdByUsername(username, function(result) {
        response.setHeader('Content-Type', 'application/json');
        response.write(JSON.stringify(result));
        response.end();        
      });
    } else if (path == "/sc/measurement") {
      var latitude = parsedUrl.query.lat;
      var longitude = parsedUrl.query.lon;
      sc.getNearestMeasurement(latitude, longitude, 1000, function(result) {
        console.log("lat="+latitude+", lon="+longitude+"; measurement: "+JSON.stringify(result));
        console.log(result);
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
}).listen(8090, function () { console.log("Server started")});
