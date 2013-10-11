var path = require("path");
var fs = require("fs");
var page = require("./page");
var preload = require("./preload");
var url = require("url");
var admin = require("./admin");
var work = require("./work")
var sign = require("./sign");
var fileserver = require("./fileserver");
var handle = {};
var count = 0;

function init() {
    handle["/"] = userOption.index;
    handle["/home"] = userOption.index;
    handle["/infoPage"] = userOption.infoPage;
    handle["/chgInfo"] = userOption.chgInfo;
    handle["/workStart"] = userOption.workStart;
    handle["/workEnd"] = userOption.workEnd;
    handle["/login"] = userOption.signIn;
    handle["/quit"] = userOption.signOut;
    handle["/addTA"] = userOption.addTA;
    handle["/deleteTA"] = userOption.deleteTA;
    handle["/logPage"] = userOption.logPage;
    handle["/userLog"] = userOption.userLog;
    handle["/handleLog"] = userOption.handleLog;
    console.log("Router inited.");
}

function route(request,response) {
    // needs cookies parse
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
