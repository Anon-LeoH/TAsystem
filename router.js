var path = require("path");
var fs = require("fs");
var page = require("./page");
var preload = require("./preload");
var url = require("url");
var admin = require("./admin");
var sign = require("./sign_in");
var fileserver = require("./fileserver");
var handle = {};
var count = 0;

function init() {
    handle["/"] = page.index;
    handle["/home"] = page.index;
    handle["/infoPage"] = page.info;
    handle["/chginfo"] = work.chginfo;
    handle["/workstart"] = work.start;
    handle["/workend"] = work.end;
    handle["/login"] = sign.login;
	handle["/quit"] = sign.quit;
    handle["/admin"] = admin.index;
    handle["/addTA"] = admin.addTA;
    handle["/deleteTA"] = admin.deleteTA;
    handle["/refreshTA"]= admin.refreshTA;
    handle["/log_que"] = admin.log;
    handle["/TAinfo"] = admin.TAinfo;        
    console.log("Router inited.");
}

function route(request,response) {
    pathname = url.parse(request.url).pathname;
    if (typeof handle[pathname] === 'function') {
            handle[pathname](request,response);
    }
    else{
        fileserver.handle(pathname,response);
    }
}

exports.route = route;
exports.init = init;
