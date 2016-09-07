const https = require('https');
const http = require('http');

// https://launchlibrary.net/1.2/launch/next/10/mode/list
exports.launches = launches;

var options = {
  hostname: 'launchlibrary.net',
  //hostname: 'cookiehome.com',
  headers: { 'Accept': 'application/json',
             'User-Agent': 'node.js' }, 
  path: '/1.2/launch/next/10/mode/list'
  // path: '/cgi-bin/env.pl'
};

function launches(callback) {
  var str = '';
  var req = http.get(options, (res) => {
    res.on('data', (d) => {
      str += d;
    });
    res.on('end', function () {
      callback(JSON.parse(str));
    });

  });

  req.end();


  req.on('error', (e) => {
    console.error(e);
  });
}
