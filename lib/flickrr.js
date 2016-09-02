// curl 'https://api.flickr.com/services/rest/?method=flickr.people.getPhotos&user_id=24823165@N00&api_key=30e4f47bbe985f4426d2ed23824c7e97&format=json&nojsoncallback=1' | json_pp

exports.flickrl = flickrl;

var Flickr = require("flickrapi"),
    flickrOptions = {
      api_key: "30e4f47bbe985f4426d2ed23824c7e97",
      secret: "87001f6fb2f9e5d8",
      requestOptions: {
        timeout: 20000,
      }
    };

var photos = {};

function initFlickr() {
  Flickr.tokenOnly(flickrOptions, function(error, flickr) {
    // we can now use "flickr" as our API object,
    // but we can only call public methods and access public data
    flickr.people.getPhotos({ user_id: "24823165@N00", format: "json", "nojsoncallback" : 1, "per_page": 25 },
      function(err, result) {
        photos = result.photos.photo;
      });
  });
} 

initFlickr();

function flickrl(callback) {
  var photoIdx = Math.floor(Math.random() * photos.length);
  var photo = photos[photoIdx];
  callback(photo);
}
