var mongodb = require("mongodb");
var fs = require("fs")
var path = require("path");
var url = require("url");
var querystring = require("querystring");
var db = require("./dbopt");
var pre = require("./preload");
var check = {};

function start(req,res) {
    query = url.parse(request.url).query;
    var que = querystring.parse(query);
    var stDate = new Date();
    check[que['sid']] = stDate;
}

function end(req,res) {
    
}
