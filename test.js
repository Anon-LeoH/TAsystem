var async = require("async");
var t = require("./t");
var log = t.log;

async.waterfall([
    function(cb) { log('1.1.1: ', 'start'); cb(null, 3); },
    function(n, cb) { log('1.1.2: ',n); t.inc(n, cb); },
    function(n, cb) { log('1.1.3: ',n); t.fire(n*n, cb); }
], function (err, result) {
    log('1.1 err: ', err); // -> null
    log('1.1 result: ', result); // -> 16
});
