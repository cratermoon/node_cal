const assert = require('assert');

var quips = require('../lib/quips');
quips.loadQuips();

var flickrr = require('../lib/flickrr');

describe('Quips Test', function() {
  describe('#randomQuip', function() {
    it('should return a non-empty string', function() {
      quip = quips.randomQuip();
      assert.notEqual(quip, "");
    });
  });
});

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
});

