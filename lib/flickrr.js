// curl 'https://api.flickr.com/services/rest/?method=flickr.people.getPhotos&user_id=24823165@N00&api_key=30e4f47bbe985f4426d2ed23824c7e97&format=json&nojsoncallback=1' | json_pp

var fs = require ("fs");

exports.flickrl = flickrl;
exports.geoLocatePhoto = geoLocatePhoto;
exports.getIdByUsername = getIdByUsername;

var photos = {};
var myApiKey = "30e4f47bbe985f4426d2ed23824c7e97";
var mySecret;
var userId = "24823165@N00";
var photosPerPage;

function loadConfig () {
  fs.readFile ("./lib/flickrr.json", function (err, data) {
    if (!err) {
      var config = JSON.parse (data.toString ());
      // console.log ("\nloadConfig: config == " + JSON.stringify (config, "wat?", 2) + "\n");
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

function initFlickr(callback) {
  Flickr.tokenOnly(flickrOptions, function(error, flickr) {
    flickr.people.getPublicPhotos({ user_id: userId, format: "json", "nojsoncallback" : 1, "extras" : "date_taken", "per_page": photosPerPage },
      function(err, result) {
        if(!err) {
          console.log(result.photos.photo.length + " photos found for user "+userId);
          photos = result.photos.photo;
          flickrl(callback);
        } else {
          logFlickrError(err);
        }
      });
  });
} 

function flickrl(callback) {
  var photoIdx = Math.floor(Math.random() * photos.length);
  var photo = photos[photoIdx];
  if (photo) {
      console.log("photo: "+photo.title);
      callback(photo);
   }
}

function geoLocatePhoto(photoId, callback) {
  Flickr.tokenOnly(flickrOptions, function(error, flickr) {
    flickr.photos.geo.getLocation({ "photo_id": photoId, format: "json", "nojsoncallback": 1 }, 
      function(err, result) {
        if(!err) {
          callback(result.photo.location);
        } else {
        }
      });
  });
}

function getIdByUsername(username, callback) {
  Flickr.tokenOnly(flickrOptions, function(error, flickr) {
	  flickr.urls.lookupUser({ url: "http://www.flickr.com/people/"+username},
		  function(err, result) {
			  if (!err) {
  				console.log(result);
  				userId = result.user.id;
          initFlickr(callback);
			  } else {
				  logFlickrErr(err);
			  }
		  } 
	  );
  });
}
function logFlickrErr(error) {
  console.error ("!! flickr call error: " + error);
  console.error ("================================");
  console.error (flickrOptions.api_key);
  console.error (flickrOptions.user_id);
  console.error ("================================");
}
