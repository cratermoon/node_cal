var fs = require ("fs");

exports.loadQuips = loadQuips;
exports.randomQuip = randomQuip;

var  gQuips = [ "hi. if you are seeing this, the quips file failed to load properly." ];

function loadQuips() {
  fs.readFile ("./lib/quips.json", function (err, data) {
    if (!err) {
      gQuips = JSON.parse (data.toString()).quips;
      console.log ("\nloadquips: " + gQuips.length + " quips loaded\n");
    } else {
      console.error ("\n\nloadquips: *** ERROR *** loading " + err);
    }
  });
}

function randomQuip() {
    var quipNum = Math.floor(Math.random() * gQuips.length);
    return gQuips[quipNum];
}
