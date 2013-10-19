var path = require('path');
var url = require('url');
var querystring = require('querystring');
var cls_page = require('./Page');
var cls_user = require('./User');
var db = require('./dbopt');

var pages = {};
var tmpPage = cls_page.tmpPage();
var wtf = require('async').waterfall;
var resPage = {
  login: function() {
    wtf([
      function(cb) {tmpPage.loginPage(cb);},
      function(file, cb) {tool.htmlRespond([], file); cb('','');}
    ], function(err, rlt) {});
  },
  
  index: function(sid) {
    wtf([
      function(cb) {pages[sid].index(cb);},
      function(file, cb) {tool.htmlRespond(['sid=' + sid, 'Max-Age=-1'], file); cb('','');}
    ], function(err, rlt) {});
  },
  
  info: function(sid, vid) {
    wtf([
      function(cb) {pages[sid].infoPage(vid, cb);},
      function(file, cb) {tool.htmlRespond([], file); cb('','');}
    ], function(err, rlt) {});
  },

  suc: function(sid, url) {
    wtf([
      function(cb) {pages[sid].sucPage(url, cb);},
      function(file, cb) {tool.htmlRespond([], file); cb('','');}
    ], function(err, rlt) {});
  },

  fld: function(sid, url) {
    wtf([
      function(cb) {pages[sid].fldPage(url, cb);},
      function(file, cb) {tool.htmlRespond([], file); cb('','');}
    ], function(err, rlt) {});
  },

  log: function(sid) {
    wtf([
      function(cb) {pages[sid].logPage(cb);},
      function(file, cb) {tool.htmlRespond([], file); cb('','');}
    ], function(err, rlt) {});
  },

  ulog: function(sid, vid) {
    wtf([
      function(cb) {pages[sid].userLog(vid, cb);},
      function(file, cb) {tool.htmlRespond([], file); cb('','');}
    ], function(err, rlt) {});
  },
};

var resStr = {
  str: function(str) {
    tool.stringRespond(str);
  },
  
  start: function(sid, st_time, checkCode) {
    wtf([
      function(cb) {pages[sid].user.workStart(st_time, checkCode, cb);},
      function(rlt, cb) {tool.stringRespond(rlt);}
    ], function(err, rlt) {});
  },

  end: function(sid, ed_time, log, checkCode) {
    wtf([
      function(cb) {pages[sid].user.workEnd(ed_time, log, checkCode, cb);},
      function(rlt, cb) {tool.stringRespond(rlt);}
    ], function(err, rlt) {});
  },
};

function signIn(req, res, cookies) {
  tool.fetchPostData(req, function(data) {
    var sid = data.sid;
    var psw = data.psw;
    db.check(sid, psw, function(rlt, grp) {
      if (!rlt) {
        resPage.login();
        return;
      }
      var tmp = cls_user.newUser(sid, grp);
      tmp.getCode();
      pages[sid] = cls_page.newPage(tmp);
      resPage.index(sid);
      return;
    });
  });
}

function index(req, res, cookies) {
  var sid = cookies.sid;
  if (sid == undefined || pages[sid] == undefined || pages[sid] == '') {
    resPage.login();
    return;
  }
  resPage.index(sid);
}

function infoPage(req, res, cookies) {
  var sid = cookies.sid;
  if (sid == undefined || pages[sid] == undefined || pages[sid] == '') {
    resPage.login();
    return;
  }
  var query = url.parse(req.url).query;
  var sid = query.sid;
  resPage.info(cookies.sid, sid);
}

function chgInfo(req, res, cookies) {
  var sid = cookies.sid;
  if (sid == undefined || pages[sid] == undefined || pages[sid] == '') {
    resPage.login();
    return;
  }
  var tmpUser = tool.fetchPostData(req);
  if (page[sid].user.changeInfo(tmpUser)) {
    resPage.suc('/home');
  } else {
    resPage.fld('/home');
  }
}

function signOut(req, res, cookies) {
  var sid = cookies.sid;
  if (sid == undefined || pages[sid] == undefined || pages[sid] == '') {
    resPage.login();
    return;
  }
  pages[sid] = '';
  resPage.login();
}

function addTA(req, res, cookies) {
  var sid = cookies.sid;
  if (sid == undefined || pages[sid] == undefined || pages[sid] == '') {
    resPage.login();
    return;
  }
  if (pages[sid].user.group == '1') {
    resPage.index(sid);
    return;
  }
  var tmpUser = tool.fetchPostData(req);
  if (tool.addTA(tmpUser)) {
    resPage.suc('/home');
  } else {
    resPage.fld('/home');
  }
}

function deleteTA(req, res, cookies) {
  var sid = cookies.sid;
  if (sid == undefined || pages[sid] == undefined || pages[sid] == '') {
    resPage.login();
    return;
  }
  if (pages[sid].user.group == '1') {
    resPage.index(sid);
    return;
  }
  var info = tool.fetchPostData(req);
  if (tool.deleteTA(info.sid)) {
    pages[info.sid] = '';
    resPage.suc('/home');
  } else {
    resPage.fld('/home');
  }
}

function workStart(req, res, cookies) {
  var sid = cookies.sid;
  if (sid == undefined || pages[sid] == undefined || pages[sid] == '') {
    resStr.str('illegal');
    return;
  }
  tool.fetchPostData(req, function(data) {
    var st_time = data.st_time;
    var checkCode = data.checkCode;
    resStr.start(sid, st_time, checkCode);
    return;
  });
}

function workEnd(req, res, cookies) {
  var sid = cookies.sid;
  if (sid == undefined || pages[sid] == undefined || pages[sid] == '') {
    resStr.str('illegal');
    return;
  }
  tool.fetchPostData(req, function(data) {
    var ed_time = data.ed_time;
    var checkCode = data.checkCode;
    var log = data.log;
    resStr.end(sid, ed_time, log, checkCode);
    return;
  });
}

function logPage(req, res, cookies) {
  var sid = cookies.sid;
  if (sid == undefined || pages[sid] == undefined || pages[sid] == '') {
    resPage.login();
    return;
  }
  if (pages[sid].user.group == '1') {
    resPage.index(sid);
    return;
  }
  var query = url.parse(req.url).query;
  var ed_time = new Date(query.ed_time);
  pages[sid].user.refreshUndoList();
  pages[sid].user.handleLog(ed_time);
  resPage.log(sid);
  return;
}

function handleLog(req, res, cookies) {
  var sid = cookies.sid;
  if (sid == undefined || pages[sid] == undefined || pages[sid] == '') {
    resPage.login();
    return;
  }
  if (pages[sid].user.group == '1') {
    resPage.index(sid);
    return;
  }
  pages[sid].user.markAllDone();
  resPage.suc('/home');
}

function userLog(req, res, cookies) {
  var sid = cookies.sid;
  if (sid == undefined || pages[sid] == undefined || pages[sid] == '') {
    resPage.login();
    return;
  }
  var query = url.parse(req.url).query;
  var sid = query.sid;
  resPage.ulog(cookies.sid, sid);
}

exports.index = index();
exports.signIn = signIn;
exports.signOut = signOut;
exports.infoPage = infoPage;
exports.logPage = logPage;
exports.userLog = userLog;
exports.handleLog = handleLog;
exports.workStart = workStart;
exports.workEnd = workEnd;
exports.chgInfo = chgInfo;
exports.addTA = addTA;
exports.deleteTA = deleteTA;

