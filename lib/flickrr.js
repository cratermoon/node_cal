// curl 'https://api.flickr.com/services/rest/?method=flickr.people.getPhotos&user_id=24823165@N00&api_key=30e4f47bbe985f4426d2ed23824c7e97&format=json&nojsoncallback=1' | json_pp

var fs = require ("fs");

exports.flickrl = flickrl;

var photos = {};
var myApiKey = "30e4f47bbe985f4426d2ed23824c7e97";
var mySecret;
var userId;
var photosPerPage;

function loadConfig () {
  fs.readFile ("./lib/flickrr.json", function (err, data) {
    if (!err) {
      var config = JSON.parse (data.toString ());
      console.log ("\nloadConfig: config == " + JSON.stringify (config, undefined, 2) + "\n");
      if (config.api_key !== undefined) {
        myApiKey = config.api_key;
      }
      if (config.secret !== undefined) {
        mySecret = config.secret;
      }
      if (config.user_id !== undefined) {
        userId = config.user_id;
      }
      if (config.per_page !== undefined) {
        photosPerPage = config.per_page;
      }
    } else {
      console.error ("!! loadConfig error: " + err);
    }
  });
}

loadConfig();

var Flickr = require("flickrapi"),
    flickrOptions = {
      api_key: myApiKey,
      secret: mySecret,
      requestOptions: {
        timeout: 20000,
      }
    };

function initFlickr() {
  Flickr.tokenOnly(flickrOptions, function(error, flickr) {
    // we can now use "flickr" as our API object,
    // but we can only call public methods and access public data
    flickr.people.getPhotos({ user_id: "24823165@N00", format: "json", "nojsoncallback" : 1, "per_page": photosPerPage },
      function(err, result) {
        if(!err) {
          photos = result.photos.photo;
        } else {
          console.error ("!! flickr call error: " + err);
          console.error ("================================");
          console.error (myApiKey);
          console.error (userId);
          console.error (photosPerPage);
          console.error ("================================");
        }
      });
  });
} 

initFlickr();

function flickrl(callback) {
  var photoIdx = Math.floor(Math.random() * photos.length);
  var photo = photos[photoIdx];
  callback(photo);
}
