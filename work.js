var mongodb = require("mongodb");
var fs = require("fs")
var path = require("path");
var url = require("url");
var querystring = require("querystring");
var db = require("./dbopt");
var pre = require("./preload");
var check = {};
var IPlist = [];
var MAX_HOUR = 99;

function start(req,res) {
    query = url.parse(req.url).query;
    var que = querystring.parse(query);
	var IP = getClientIp(req);
	var result = {};
	if (check[que['sid']] || check[que['id']] == "") {
        require('crypto').randomBytes(16, function(ex, buf) {  
            check[que['sid']] = buf.toString('hex');  
        });
	}
	else {
		result = {"status" : "failed",
		          "info"   : "already start"};
        res.writeHead(200, {"Content-Type": "json"});
	    res.write(result);
	    res.end();
	}
	if (IP in IPlist) {
		result = {"status"    : "succeed",
		          "checkCode" : check[que['sid']]};
	}
	else {
	    result = {"status" : "failed",
		          "info"   : "invalid IP"}; 
	}
    res.writeHead(200, {"Content-Type": "json"});
	res.write(result);
	res.end();
}

function end(req,res) {
    query = url.parse(req.url).query;
	var que = querystring.parse(query);
	var IP = getClientIp(req);
	var result = {};
	if (IP in IPlist) {
	    if (check[que['sid']] == que['checkCode']
		    && parseInt(que['hour']) <= MAX_HOUR) {
		    check[que['sid']] = "";
		    var log = {'date'    : que['date'],
			           'std'     : que['std'],
			           'cls'     : que['cls'],
			           'st_time' : que['st_time'],
			           'ed_time' : que['ed_time'],
			           'hour'    : que['hour'],
			           'log'     : que['log']};
		    db.addLog(log, function(rlt){
			    if (rlt) {
				    result = {'status' : 'succeed'};
				}
				else {
				    result = {'status' : 'failed',
					          'info'   : 'failed when insert log to db'
				                         +', please contact the admin!'};
				}
                res.writeHead(200, {"Content-Type": "json"});
	            res.write(result);
	            res.end();
			})
		}
		
	}
}

getClientIP = function(req){
	var ipAddress;
	var headers = req.headers;
	var forwardedIpsStr = headers['x-real-ip'] || headers['x-forwarded-for'];
	forwardedIpsStr ? ipAddress = forwardedIpsStr : ipAddress = null;
	if (!ipAddress) {
		ipAddress = req.connection.remoteAddress;
	}
	return ipAddress;
}
