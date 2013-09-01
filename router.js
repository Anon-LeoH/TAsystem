var path = require("path");
var fs = require("fs");
var userpage = require("./userpage");
var preload = require("./preload");
var url = require("url");
var admin = require("./admin");
var sign = require("./sign");
var fileserver = require("./fileserver");
var handle = {};
var count = 0;

function init() {
    handle["/"] = userpage.index;
    handle["/home"] = userpage.index;
    handle["/mgzlist"] = userpage.mgzlist;
    handle["/flashprv"] = preload.flash;
    handle["/comingsoon"] = userpage.comingsoon;
    handle["/aboutus"] = userpage.aboutus;
    handle["/admin"] = admin.index;
    handle["/login"] = sign.login;
    handle["/addmgz"] = admin.addmgz;
    handle["/deletemgz"] = admin.deletemgz;    
    console.log("Router inited.");
}

function route(request,response) {
    pathname = url.parse(request.url).pathname;
    query = url.parse(request.url).query;
    var Cookies = {};
	request.headers.cookie && request.headers.cookie.split(';').forEach(function(Cookie) {
	    var parts = Cookie.split('=');
	    Cookies[parts[0].trim()] = (parts[1]||'').trim();
	});
    if (typeof handle[pathname] === 'function') {
        if(pathname == "/login" || pathname == "/addmgz")
            handle[pathname](request,response,Cookies);
        else
	    handle[pathname](response,query,Cookies);
    }
    else{
        fileserver.handle(pathname,response);
    }
}

exports.route = route;
exports.init = init;
