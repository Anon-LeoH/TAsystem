var http = require("http");
var qstring = require("querystring");
var pre = require("./preload");
var db = require("./dbopt");

function login(req,res)
{
    var postData = "";
    req.setEncoding("utf8");
    req.addListener("data",function(postDataChunk){
        postData += postDataChunk;
    });
    req.addListener("end",function(postDataCHunk){
        var sid = qstring.parse(postData).sid;
        var psw = qstring.parse(postData).psw;
        db.login_check(sid,psw,function(rlt){
            var file;
            if(rlt) {
                if (rlt == 2){
                    pre.load("adminPage",{'sid' : sid},function(err,file){
                        res.writeHead(200,{"Set-Cookie"   : ["sid="+sid,"psw="+psw,"Max-Age=-1"],
                                           "Content-Type" : "text/html"});
                        res.write(file, "utf-8");
                        res.end();
                    });
                }
                else {
                    pre.load("workPage",{'sid' : sid},function(err,file){
                        res.writeHead(200,{"Set-Cookie"   : ["sid="+sid,"psw="+psw,"Max-Age=-1"],
                                           "Content-Type" : "text/html"});
                        res.write(file, "utf-8");
                        res.end();
                    });
                }
            }
            else {
				console.log("loginFailed");
                pre.load("loginPage",{'info' : "login failed"},function(err,file){
                    res.writeHead(200, {"Content-Type": "text/html"});
                    res.write(file, "utf-8");
                    res.end();
                });
            }
        });
    });
}

function quit(req,res){
    pre.load("loginPage",{"info" : "log out"},function(err,file){
        res.writeHead(200,{"Set-Cookie"   : ["sid= psw= "],
                           "Content-Type" : "text/html"});
        res.write(file, "utf-8");
        res.end();
    });
}

exports.login = login;
exports.quit = quit;
