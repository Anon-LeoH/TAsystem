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

// 有一个问题，就是我接收数据没有写非阻塞是因为访问量小而且传输的都是文本数据
// 如果从网络安全的角度考虑应该是得写非阻塞的，如果需要写非阻塞那我就马上改
// （非阻塞要加好多缩进。。。。

function start(req,res) {
    var result = "";
    var Cookies = {};
    req.headers.cookie && req.headers.cookie.split(';').forEach(function(Cookie) {
        var parts = Cookie.split('=');
        Cookies[parts[0].trim()] = (parts[1]||'').trim();
    });
    // var IP = getClientIp(req);
	    var sid = Cookies["sid"];
        if (check[sid] == "" || check[sid] == undefined) {
            require('crypto').randomBytes(16, function(ex, buf) {  
                check[sid] = buf.toString('hex');  
                result = check[sid];
                res.writeHead(200, {"Content-Type": "text/plain"});
                res.end(result);
            });
        }
        else {
            result = "failed";
            res.writeHead(200, {"Content-Type": "text/html"});
            res.write(result);
            res.end();
        }
        //if (IP in IPlist) {
        //    console.log("result is " + result);
        //}
        //else {
        //    result = {"status" : "failed",
        //              "info"   : "invalid IP"}; 
        //}
}

function end(req,res) {
        //var IP = getClientIp(req);
        //if (IP in IPlist) {
            var Cookies = {};
            req.headers.cookie && req.headers.cookie.split(';').forEach(function(Cookie) {
            var parts = Cookie.split('=');
                Cookies[parts[0].trim()] = (parts[1]||'').trim();
            });
            query = url.parse(req.url).query;
            var info = querystring.parse(query);
			var sid = Cookies["sid"];
            if (check[sid] == info['checkCode']
                && parseInt(info['hour']) <= MAX_HOUR) {
                check[sid] = "";
                var log = {'date'    : info['date'],
                           'std'     : sid,
                           'cls'     : info['cls'],
                           'st_time' : info['st_time'],
                           'ed_time' : info['ed_time'],
                           'hour'    : info['hour'],
                           'log'     : info['log']};
                db.addLog(log, function(rlt){
                    if (rlt) {
                        result = 'succeed';
                    }
                    else {
                        result = 'failed';
                    }
                    res.writeHead(200, {"Content-Type": "text/plain"});
                    res.write(result);
                    res.end();
                });
            }
            else {
                result = "failed";
                res.writeHead(200, {"Content-Type": "text/plain"});
                res.write(result);
                res.end();
            }
        //}
        //else {
           // result = "failed";
        //}
}

function chgInfo(req,res){
        var Cookies = {};
        req.headers.cookie && req.headers.cookie.split(';').forEach(function(Cookie) {
            var parts = Cookie.split('=');
            Cookies[parts[0].trim()] = (parts[1]||'').trim();
        });
        if (Cookies == {}){
            pre.load("loginPage",{'info' : "login first"},function(err,file){
                res.writeHead(200, {"Content-Type": "text/html"});
                res.write(file, "utf-8");
                res.end();
            });
        }
        else db.login_check(Cookies['sid'],Cookies['psw'],function(rlt){
            if (rlt){
                query = url.parse(req.url).query;
                var info = querystring.parse(query);
                db.editUser(info,function(rst){
                    if (rst){
                        pre.load("Suc",{},function(err,file){
                            res.writeHead(200, {"Content-Type": "text/html"});
                            res.write(file, "utf-8");
                            res.end();
                        });
                    }
                    else {
                        pre.load("Fld",{},function(err,file){
                            res.writeHead(200, {"Content-Type": "text/html"});
                            res.write(file, "utf-8");
                            res.end();
                        });
                    }
                });
            }
        });
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

exports.start = start;
exports.end = end;
exports.chgInfo = chgInfo;

