var SERVER_PORT = 8080;

var http = require("http");
var url = require("url");
var router = require("./router");
var dbopt = require("./dbopt");

dbopt.startdb();
router.init();
http.createServer(function onRequest(request, response) {
    router.route(request,response);
}
).listen(SERVER_PORT);
console.log("Server started.");
