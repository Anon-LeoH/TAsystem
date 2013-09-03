var mongodb = require("mongodb");
var fs = require("fs")
var path = require("path");
var url = require("url");
var querystring = require("querystring");
var db = require("./dbopt");
var pre = require("./preload");



function index(req, res) {
    var Cookies = {};
    req.headers.cookie && req.headers.cookie.split(';').forEach(function(Cookie) {
        var parts = Cookie.split('=');
        Cookies[parts[0].trim()] = (parts[1]||'').trim();
    });
    if (Cookies == {}) {
        pre.load("loginPage",{},function(err,file){
            res.writeHead(200, {"Content-Type": "text/html"});
            res.write(file, "utf-8");
            res.end();
        });
    } else {
          db.login_check(Cookies['sid'],Cookies['psw'],function(rlt) {
              if (rlt) {
                  pre.load("workPage",{Cookies['sid']},function(err,file){
                      res.writeHead(200, {"Content-Type": "text/html"});
                      res.write(file, "utf-8");
                      res.end();
                  });
              } else {
                    pre.load("loginPage",{},function(err,file) {
                        res.writeHead(200, {"Content-Type": "text/html"});
                        res.write(file, "utf-8");
                        res.end();
                    });
              }
          });
      }
}

function info(req,res) {
    var Cookies = {};
    req.headers.cookie && req.headers.cookie.split(';').forEach(function(Cookie) {
        var parts = Cookie.split('=');
        Cookies[parts[0].trim()] = (parts[1]||'').trim();
    });
    if (Cookies == {}) {
        pre.load("loginPage",{},function(err,file){
            res.writeHead(200, {"Content-Type": "text/html"});
            res.write(file, "utf-8");
            res.end();
        });
    } else {
          db.login_check(Cookies['sid'],Cookies['psw'],function(rlt) {
              if (rlt) {
                  pre.load("infoPage",{Cookies['sid']},function(err,file){
                      res.writeHead(200, {"Content-Type": "text/html"});
                      res.write(file, "utf-8");
                      res.end();
                  });
              } else {
                    pre.load("loginPage",{},function(err,file){
                        res.writeHead(200, {"Content-Type": "text/html"});
                        res.write(file, "utf-8");
                        res.end();
                    });
                }
          });
      }
}  

exports.index=index;
exports.info=info;
