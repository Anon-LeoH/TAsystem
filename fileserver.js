var mime = require('./mime').types;
var path = require('path');
var fs = require('fs');

function handle(pathname, response) {
  pathname = 'resource' + pathname;
  pathname.replace('../', '');
  path.exists(pathname, function(exists) {
    if (!exists) {
      console.log('not exist: ' + pathname);
      response.writeHead(404, {'Content-Type': 'text/plain'});
      response.write('404 not found!');
      response.end();
      return;
    } else {
      fs.readFile(pathname, 'binary', function(err, file) {
        if (err) {
          response.writeHead(500, {'Content-Type': 'text/plain'});
          response.write('404 not found!');
          response.end(err);
        } else {
          var ext = path.extname(pathname);
          ext = ext ? ext.slice(1) : 'unknown';
          var cty = mime[ext] || 'text/plain';
          response.writeHead(200, {'Content-Type': cty});
          response.write(file, 'binary');
          response.end();
        }
      });
    }
  });
}

exports.handle = handle;
