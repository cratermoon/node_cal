const assert = require('assert');

const quips = require('../lib/quips');
quips.loadQuips();

const flickrr = require('../lib/flickrr');

const rocket = require('../lib/rocket/rocket');

describe('Quips Test', function() {
  describe('#randomQuip', function() {
    it('should return a non-empty string', function() {
      quip = quips.randomQuip();
      assert.notEqual(quip, "");
    });
  });
});

setTimeout(function() {
  describe('Flickr Test', function() {
    describe('#flickrl', function() {
      it('should return a json object', function(done) {
        flickrr.flickrl(function(result) {
          assert.ok(result.farm, "no farm");
          assert.ok(result.server, "no server");
          assert.ok(result.id, "no id");
          assert.ok(result.secret, "no secret");
          done();
        });
      });
    });

    describe('#geoLocatePhoto', function() {
      this.slow(600);
      it('should return the lat/lon for a photo', function(done) {
        flickrr.geoLocatePhoto(3577208760, function(result) {
          assert.ok(result, "nothing returned");
          assert.equal(result.latitude, 35.202925, "wrong latitude");
          assert.equal(result.longitude, -111.664685, "wrong longitude");
          done();
        });
      });
    });
  });

  run() }, 500);


describe('Rocket Test', function() {
  describe('#launches', function() {
    it('should return 10 launches', function(done) {
      rocket.launches(function(result) {
        assert.equal(10, result.launches, "no launches");
      });
      done();
    });
  });
});
