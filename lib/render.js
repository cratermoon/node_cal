const fs = require ("fs");
const mime = require('mime');


exports.render = render;

function render(httpResponse, path) {
    if (path === "/") {
        path = "/index.html";
    }
    var path = "./template" + path;
    fs.readFile (path, function (err, data) {
        if (!err) {
            console.log("\n rendering path: " +path);
            httpResponse.setHeader("Content-Type", mime.getType(path));
            httpResponse.write(data,
            function(err) {
                httpResponse.end();
            }
                              );
        } else {
            console.error ("\n\n:*** ERROR *** loading template " + err);
        }
    });
}

