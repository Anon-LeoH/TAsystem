var mime = require("./mime").types;
var path = require("path");
var fs = require("fs");

function handle(pathname,response) {
    var realPath = "resourse" + pathname;
    readPath = realPath.replace("../","");
    fs.exists(realPath, function (exists) {
    if (!exists) {
        response.writeHead(404, {'Content-Type':'text/plain'});
            response.write("404 not found!");
        response.end();
        return;
    } else {
        fs.readFile(realPath,"binary",function(err,file) {
                if (err) {
            response.writeHead(500, {'Content-Type': 'text/plain'});
                    response.write("404 not found!");
            response.end(err);
                } else {
            var ext = path.extname(realPath);
            ext = ext ? ext.slice(1) : 'unknown';
            var cty = mime[ext]||'text/plain';
            response.writeHead(200, {'Content-Type':cty});
            response.write(file, "binary");
            response.end();
                }
        });
    }
    });
}

exports.handle = handle;
