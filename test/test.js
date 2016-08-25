const assert = require('assert');

var quips = require('../lib/quips');
quips.loadQuips();

describe('Quips Test', function() {
  describe('#randomQuip', function() {
    it('should return a non-empty string', function() {
      quip = quips.randomQuip();
      assert.notEqual(quip, "");
    });
  });
});
