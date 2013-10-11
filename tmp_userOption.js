var path = require("path");
var url = require("url");
var querystring = require("querystring");
var cls_page = require("./Page");
var cls_user = require("./User");
var db = require("./dbopt");

var pages = {};
var tmpPage = cls_page.tmpPage();

function signIn(req, res, cookies) {
  tool.fetchPostData(req, function(data) {
    var sid = data.sid;
    var psw = data.psw;
    db.check(sid, psw, function(rlt, grp) {
      if (!rlt) {
        tool.htmlRespond([],tmpPage.loginPage());
        return;
      }
      var tmp = cls_user.newUser(sid, grp);
      pages[sid] = cls_page.newPage(tmp);
      tool.htmlRespond(["sid=" + sid, "Max-Age=-1",], pages[sid].index());
      return;
    });
  });
}

function index(req, res, cookies) {
  var sid = cookies.sid;
  i f(sid == undefined || pages[sid] == undefined || pages[sid] == "") {
    tool.htmlRespond([],tmpPage.loginPage());
    return;
  }
  tool.htmlRespond([],page[sid].index());
}

function infoPage(req, res, cookies) {
  var sid = cookies.sid;
  if (sid == undefined || pages[sid] == undefined || pages[sid] == "") {
    tool.htmlRespond([],tmpPage.loginPage());
    return;
  }
  var query = url.parse(req.url).query;
  var sid = query.sid;
  tool.htmlRespond([],page[cookies.sid].infoPage(sid));
}

function 

function workStart(req, res, cookies) {
  var sid = cookies.sid;
  if (sid == undefined || pages[sid] == undefined || pages[sid] == "") {
    tool.stringRespond("illegal");
    return;
  }
  tool.fetchPostData(req, function(data) {
    var st_time = data.st_time;
    var checkCode = data.checkCode;
    tool.stringRespond(pages[sid].user.workStart(st_time, checkCode));
    return;
  });
}

function workEnd(req, res, cookies) {
  var sid = cookies.sid;
  if (sid == undefined || pages[sid] == undefined || pages[sid] == "") {
    tool.stringRespond("illegal");
    return;
  }
  tool.fetchPostData(req, function(data) {
    var ed_time = data.ed_time;
    var checkCode = data.checkCode;
    var log = data.log;
    tool.stringRespond(pages[sid].user.workEnd(ed_time, log, checkCode));
    return;
  });
}

function userLog(req, res, cookies) {
  var sid = cookies.sid;
  if (sid == undefined || pages[sid] == undefined || pages[sid] == "") {
    tool.htmlRespond([],tmpPage.loginPage());
    return;
  }
  var query = url.parse(req.url).query;
  var sid = query.sid;
  tool.htmlRespond([],page[cookies.sid].userLog(sid));
}

function 
