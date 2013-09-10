var mongodb = require("mongodb");
var fs = require("fs")
var path = require("path");
var url = require("url");
var querystring = require("querystring");
var db = require("./dbopt");
var pre = require("./preload");



function index(req,res){
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
            if (rlt == 2){
            pre.load("adminPage",{"sid" : Cookies['sid']},function(err,file){
                res.writeHead(200, {"Content-Type": "text/html"});
                res.write(file, "utf-8");
                res.end();
            });
        }
            else if (rlt == 1){
                pre.load("workPage",{"sid" : Cookies['sid']},function(err,file){
                    res.writeHead(200, {"Content-Type": "text/html"});
                    res.write(file, "utf-8");
                    res.end();
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

function log(req,res){
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
        if (rlt == 2){
            query = url.parse(req.url).query;
            var que = querystring.parse(query);
            if (que['sid']){
                pre.load("logPage",{"sid" : que['sid']},function(err,file){
                    res.writeHead(200, {"Content-Type": "text/html"});
                    res.write(file, "utf-8");
                    res.end();
                });
            }
            else {
                pre.load("logPage",{},function(err,file){
                    res.writeHead(200, {"Content-Type": "text/html"});
                    res.write(file, "utf-8");
                    res.end();
                });
            }
        }
        else {
            pre.load("loginPage",{'info' : "login first"},function(err,file){
                res.writeHead(200, {"Content-Type": "text/html"});
                res.write(file, "utf-8");
                res.end();
            });
        }
    });
}

function TAinfo(req,res){
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
            if (rlt == 2){
			    query = url.parse(req.url).query;
                var que = querystring.parse(query);
                pre.load("infoPage",{"sid" : que["sid"]},function(err,file){
                    res.writeHead(200, {"Content-Type": "text/html"});
                    res.write(file, "utf-8");
                    res.end();
                });
        }
            else if (rlt == 1){
                pre.load("workPage",{"sid" : Cookies['sid']},function(err,file){
                    res.writeHead(200, {"Content-Type": "text/html"});
                    res.write(file, "utf-8");
                    res.end();
                });
            }
        else {
            pre.load("loginPage",{'info' : "login first"},function(err,file){
                res.writeHead(200, {"Content-Type": "text/html"});
                res.write(file, "utf-8");
                res.end();
            });
        }
    });
}

function addTA(req,res){
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
            if (rlt == 2){
                query = url.parse(req.url).query;
                var que = querystring.parse(query);
                db.addUser(que, function(rst){
                    if (rst) {
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
            else if (rlt == 1){
                pre.load("workPage",{"sid" : Cookies['sid']},function(err,file){
                    res.writeHead(200, {"Content-Type": "text/html"});
                    res.write(file, "utf-8");
                    res.end();
                });
            }
        else {
            pre.load("loginPage",{'info' : "login first"},function(err,file){
                res.writeHead(200, {"Content-Type": "text/html"});
                res.write(file, "utf-8");
                res.end();
            });
        }
    });
}

function deleteTA(req,res){
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
            if (rlt == 2){
                query = url.parse(req.url).query;
                var que = querystring.parse(query);
                db.deleteUser(que["sid"], function(rst){
                    if (rst) {
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
            else if (rlt == 1){
                pre.load("workPage",{"sid" : Cookies['sid']},function(err,file){
                    res.writeHead(200, {"Content-Type": "text/html"});
                    res.write(file, "utf-8");
                    res.end();
                });
            }
        else {
            pre.load("loginPage",{'info' : "login first"},function(err,file){
                res.writeHead(200, {"Content-Type": "text/html"});
                res.write(file, "utf-8");
                res.end();
            });
        }
    });
}

function refreshTA(req,res){
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
            if (rlt == 2){
                query = url.parse(req.url).query;
                var que = querystring.parse(query);
                db.editUser(que, function(rst){
                    if (rst) {
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
            else if (rlt == 1){
                pre.load("workPage",{"sid" : Cookies['sid']},function(err,file){
                    res.writeHead(200, {"Content-Type": "text/html"});
                    res.write(file, "utf-8");
                    res.end();
                });
            }
        else {
            pre.load("loginPage",{'info' : "login first"},function(err,file){
                res.writeHead(200, {"Content-Type": "text/html"});
                res.write(file, "utf-8");
                res.end();
            });
        }
    });
}


exports.index=index;
exports.log=log;
exports.TAinfo = TAinfo;
exports.addTA = addTA;
exports.deleteTA = deleteTA;
exports.refreshTA = refreshTA;
