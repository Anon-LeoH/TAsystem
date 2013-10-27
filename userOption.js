var path = require('path');
var url = require('url');
var queryString = require('querystring');
var cls_page = require('./Page');
var cls_user = require('./User');
var tool = require('./tool');
var db = require('./dbopt');

var pages = {};
var tmpPage = cls_page.tmpPage();
var wtf = require('async').waterfall;
var resPage = {
  login: function(res) {
    wtf([
      function(cb) {tmpPage.loginPage(cb);},
      function(file, cb) {tool.htmlRespond(res, [], file); cb('','');}
    ], function(err, rlt) {});
  },
  
  index: function(res, sid) {
    wtf([
      function(cb) {pages[sid].index(cb);},
      function(file, cb) {tool.htmlRespond(res, ['sid=' + sid, 'Max-Age=-1'], file); cb('','');}
    ], function(err, rlt) {});
  },
  
  info: function(res, sid, vid) {
    wtf([
      function(cb) {pages[sid].infoPage(vid, cb);},
      function(file, cb) {tool.htmlRespond(res, [], file); cb('','');}
    ], function(err, rlt) {});
  },

  suc: function(res, sid, url) {
    wtf([
      function(cb) {pages[sid].sucPage(url, cb);},
      function(file, cb) {tool.htmlRespond(res, [], file); cb('','');}
    ], function(err, rlt) {});
  },

  fld: function(res, sid, url) {
    wtf([
      function(cb) {pages[sid].fldPage(url, cb);},
      function(file, cb) {tool.htmlRespond(res, [], file); cb('','');}
    ], function(err, rlt) {});
  },

  log: function(res, sid) {
    wtf([
      function(cb) {pages[sid].logPage(cb);},
      function(file, cb) {tool.htmlRespond(res, [], file); cb('','');}
    ], function(err, rlt) {});
  },

  ulog: function(res, sid, vid) {
    wtf([
      function(cb) {pages[sid].userLog(vid, cb);},
      function(file, cb) {tool.htmlRespond(res, [], file); cb('','');}
    ], function(err, rlt) {});
  },
};

var resStr = {
  str: function(res, str) {
    tool.stringRespond(res, str);
  },
  
  start: function(res, sid, st_time) {
    wtf([
      function(cb) {pages[sid].user.workStart(st_time, cb);},
      function(rlt, cb) {tool.stringRespond(res, rlt);}
    ], function(err, rlt) {});
  },

  end: function(res, sid, ed_time, log, checkCode) {
    wtf([
      function(cb) {pages[sid].user.workEnd(ed_time, log, checkCode, cb);},
      function(rlt, cb) {tool.stringRespond(res, rlt);}
    ], function(err, rlt) {});
  },
};

function signIn(req, res, cookies) {
  tool.fetchPostData(req, function(data) {
    var sid = data.sid;
    var psw = data.psw;
    db.check(sid, psw, function(rlt, grp) {
      if (!rlt) {
        resPage.login(res);
        return;
      }
      var tmp = cls_user.newUser(sid, grp);
      pages[sid] = cls_page.newPage(tmp);
      resPage.index(res, sid);
      return;
    });
  });
}

function index(req, res, cookies) {
  var sid = cookies.sid;
  if (sid == undefined || pages[sid] == undefined || pages[sid] == '') {
    resPage.login(res);
    return;
  }
  resPage.index(res, sid);
}

function infoPage(req, res, cookies) {
  var sid = cookies.sid;
  if (sid == undefined || pages[sid] == undefined || pages[sid] == '') {
    resPage.login(res);
    return;
  }
  var query = url.parse(req.url).query;
  query = queryString.parse(query);
  var sid = query.sid;
  resPage.info(res, cookies.sid, sid);
}

function chgInfo(req, res, cookies) {
  var sid = cookies.sid;
  if (sid == undefined || pages[sid] == undefined || pages[sid] == '') {
    resPage.login(res);
    return;
  }
  tool.fetchPostData(req, function(tmpUser){
    if (pages[sid].user.changeInfo(tmpUser)) {
      resPage.suc(res, sid, '/home');
    } else {
      resPage.fld(res, sid, '/home');
    }
	cls_user.userInit();
	pages[sid].basicInfo = tool.formBasicInfo(pages[sid].user);
  });
}

function signOut(req, res, cookies) {
  var sid = cookies.sid;
  if (sid == undefined || pages[sid] == undefined || pages[sid] == '') {
    resPage.login(res);
    return;
  }
  pages[sid] = '';
  resPage.login(res);
}

function addTA(req, res, cookies) {
  var sid = cookies.sid;
  if (sid == undefined || pages[sid] == undefined || pages[sid] == '') {
    resPage.login(res);
    return;
  }
  if (pages[sid].user.group == '1') {
    resPage.index(res, sid);
    return;
  }
  tool.fetchPostData(req, function(tmpUser) {
    if (db.addTA(tmpUser)) {
      resPage.suc(res, sid, '/home');
    } else {
      resPage.fld(res, sid, '/home');
    }
  });
  cls_user.userInit();
}

function deleteTA(req, res, cookies) {
  var sid = cookies.sid;
  if (sid == undefined || pages[sid] == undefined || pages[sid] == '') {
    resPage.login(res);
    return;
  }
  if (pages[sid].user.group == '1') {
    resPage.index(res, sid);
    return;
  }
  var query = url.parse(req.url).query;
  query = queryString.parse(query);
  var dsid = query.sid;
  if (db.deleteTA(dsid)) {
    pages[dsid] = '';
    resPage.suc(res, sid, '/home');
  } else {
    resPage.fld(res, sid, '/home');
  }
  cls_user.userInit();
}

function workStart(req, res, cookies) {
  var sid = cookies.sid;
  if (sid == undefined || pages[sid] == undefined || pages[sid] == '') {
    resStr.str(res, 'illegal');
    return;
  }
  tool.fetchPostData(req, function(data) {
	if (data.st_time == undefined) {
	  tool.strRespond(res, 'failed');
	  return;
	}
    var st_time = parseInt(data.st_time);
    resStr.start(res, sid, st_time);
    return;
  });
}

function workEnd(req, res, cookies) {
  var sid = cookies.sid;
  if (sid == undefined || pages[sid] == undefined || pages[sid] == '') {
    resStr.str(res, 'illegal');
    return;
  }
  tool.fetchPostData(req, function(data) {
    var ed_time = data.ed_time;
    var checkCode = data.checkCode;
    var log = data;
    resStr.end(res, sid, ed_time, log, checkCode);
    return;
  });
}

function logPage(req, res, cookies) {
  var sid = cookies.sid;
  if (sid == undefined || pages[sid] == undefined || pages[sid] == '') {
    resPage.login(res);
    return;
  }
  if (pages[sid].user.group == '1') {
    resPage.index(res, sid);
    return;
  }
  var query = url.parse(req.url).query;
  query = queryString.parse(query);
  var ed_time = new Date();
  pages[sid].user.refreshUndoList();
  if (query.ed_time != undefined) {
	ed_time = new Date(query.ed_time);
  }
  pages[sid].user.handleLog(ed_time);
  resPage.log(res, sid);
  return;
}

function handleLog(req, res, cookies) {
  var sid = cookies.sid;
  if (sid == undefined || pages[sid] == undefined || pages[sid] == '') {
    resPage.login(res);
    return;
  }
  if (pages[sid].user.group == '1') {
    resPage.index(res, sid);
    return;
  }
  pages[sid].user.markAllDone();
  resPage.suc(res, sid, '/home');
}

function userLog(req, res, cookies) {
  var sid = cookies.sid;
  if (sid == undefined || pages[sid] == undefined || pages[sid] == '') {
    resPage.login(res);
    return;
  }
  var query = url.parse(req.url).query;
  query = queryString.parse(query);
  var sid = query.sid;
  resPage.ulog(res, cookies.sid, sid);
}

exports.index = index;
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

