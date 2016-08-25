var fs = require ("fs");

exports.render = render;

function render(httpResponse, path) {
  var path = "./template" + path;
  fs.readFile (path, function (err, data) {
    if (!err) {
      console.log("\n rendering path: " +path);
      httpResponse.write(data,
        function(err) { httpResponse.end(); }
      );
    } else {
      console.error ("\n\n:*** ERROR *** loading template " + err);
    }
  });
}

