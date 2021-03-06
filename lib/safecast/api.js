const https = require('https');
const http = require('http');

exports.getMeasurements = getMeasurements;
exports.getNearestMeasurement = getNearestMeasurement;

var options = {
hostname: 'api.safecast.org'
    ,
headers:
    { 'Accept': 'application/json'
        ,
'User-Agent': 'node.js'
    },
};

function getMeasurements(latitude, longitude, distance, callback) {
    var str = '';
    options.path = '/measurements.json?'
                   + 'latitude=' + latitude
                   + '&longitude=' + longitude
                   + '&distance=100' ;
    var req = https.get(options, (res) => {
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

function getNearestMeasurement(latitude, longitude, distance, callback) {
    getMeasurements(latitude, longitude, distance, function(response) {
        if (response.length === undefined || response.length < 1) {
            callback({});
        } else {
            value = response[0].value;
            unit = response[0].unit;
            lat = response[0].latitude;
            lon = response[0].longitude;
            ts = response[0].captured_at;
            callback({ value, unit, lat, lon, ts});
        }
    });
}
