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
	var result = {};
	var IP = getClientIp(req);
    if (req.method.toLowerCase() == 'post') {
		var info = getInfo(req);
	    if (check[info['sid']] || check[info['sid']] == "") {
            require('crypto').randomBytes(16, function(ex, buf) {  
                check[info['sid']] = buf.toString('hex');  
            });
	    }
	    else {
	    	result = {"status" : "failed",
		              "info"   : "already start"};
	    }
	    if (IP in IPlist) {
		    result = {"status"    : "succeed",
		              "checkCode" : check[info['sid']]};
	    }
	    else {
	        result = {"status" : "failed",
		              "info"   : "invalid IP"}; 
	    }
	}
	else {
	    result = {"status" : "failed",
	              "info"   : "unknown error,\n"
		                    +"please contact the admin"}; 
	}
    res.writeHead(200, {"Content-Type": "json"});
	res.write(result);
	res.end();
}

function end(req,res) {
    if (req.method.toLowerCase() == 'post') {
	    var IP = getClientIp(req);
	    if (IP in IPlist) {
			var info = getInfo(req);
	        if (check[info['sid']] == info['checkCode']
		        && parseInt(info['hour']) <= MAX_HOUR) {
		        check[info['sid']] = "";
		        var log = {'date'    : info['date'],
			               'std'     : info['std'],
			               'cls'     : info['cls'],
			               'st_time' : info['st_time'],
			               'ed_time' : info['ed_time'],
			               'hour'    : info['hour'],
			               'log'     : info['log']};
		        db.addLog(log, function(rlt){
			        if (rlt) {
				        result = {'status' : 'succeed'};
				    }
				    else {
				        result = {'status' : 'failed',
					              'info'   : 'failed when insert log to db'
				                             +', please contact the admin!'};
				    }
			    });
		    }
		    else {
		        result = {"status" : "failed",
			              "info"   : "secret code check failed! "
			                        +"please contact the admin!"};
		    }
	    }
	    else {
	        result = {"status" : "failed",
	                  "info"   : "invalid IP"}; 
	    }
    }
	else {
	    result = {"status" : "failed",
	              "info"   : "unknown error,\n"
		                    +"please contact the admin"}; 
	}
    res.writeHead(200, {"Content-Type": "json"});
 	res.write(result);
    res.end();
}

function chgInfo(rep,res){
    if (req.method.toLowerCase() == 'post') {
        var Cookies = {};
        req.headers.cookie && req.headers.cookie.split(';').forEach(function(Cookie) {
		    var parts = Cookie.split('=');
			Cookies[parts[0].trim()] = (parts[1]||'').trim();
		});
		if (Cookies == {}){
		    pre.load("loginPage",{},function(err,file){
		        res.writeHead(200, {"Content-Type": "text/html"});
		        res.write(file, "utf-8");
			    res.end();
			});
		}
		else db.login_check(Cookies['sid'],Cookies['psw'],function(rlt){
		    if (rlt){
	            var info = getInfo(req);
				db.editUser(info,function(rst){
				    if (rst){
		                pre.load("eUserSuc",{},function(err,file){
		                    res.writeHead(200, {"Content-Type": "text/html"});
		                    res.write(file, "utf-8");
			                res.end();
			            });
					}
					else {
		                pre.load("eUserFld",{},function(err,file){
		                    res.writeHead(200, {"Content-Type": "text/html"});
		                    res.write(file, "utf-8");
			                res.end();
			            });
					}
				});
			}
			else {
		        pre.load("loginPage",{},function(err,file){
		            res.writeHead(200, {"Content-Type": "text/html"});
		            res.write(file, "utf-8");
			        res.end();
			    });
			}
        });
    }
	else {
	    pre.load("404",{},function(err,file){
		    res.writeHead(404, {"Content-Type": "text/html"});
		    res.write(file, "utf-8");
		    res.end();
		});
	}
}

function getInfo(req){
    var info ='';  
    req.addListener('data', function(chunk){  
        info += chunk;  
    }).addListener('end', function(){  
        info = querystring.parse(info);  
    }); 
	return info;
} // wait for change GET to POST

getClientIP = function(req){
	var ipAddress;
	var headers = req.headers;
	var forwardedIpsStr = headers['x-real-ip'] || headers['x-forwarded-for'];
	forwardedIpsStr ? ipAddress = forwardedIpsStr : ipAddress = null;
	if (!ipAddress) {
		ipAddress = req.connection.remoteAddress;
	}
	return ipAddress;

exports.start = start;
exports.end = end;
exports.chgInfo = chgInfo;
}
