var path = require('path');
var fs = require('fs');
var wtf = require('async').waterfall;
var tool = require('./tool');
var db = require('./dbopt');

var userInfo = {};

function userInit() {
  db.getAllInfo(function(err, res) {
    for(i = 0; i < res.length; i++) {
	  userInfo[res[i].sid] = res[i];
	}
  });
}

var User = {
  createNew: function(sid) {
	var user = userInfo[sid];

	user.changeInfo = function(newUser) {
      if (user.group == '1' && newUser.sid != user.sid) return 'denied';
      var tmp = db.insertInfo(newUser);
	  if (newUser.sid == user.sid) {
        user.psw = newUser.psw;
        user.name = newUser.name;
        user.major = newUser.major;
        user.email = newUser.email;
        user.phone = newUser.phone;
	  }
      return tmp;
    };

	return user;
  }
};

var Ta = {
  createNew: function(sid) {
    var ta = User.createNew(sid);
    ta.st_time = '';
    ta.lastLog = '';
    ta.checkCode = '';
    ta.logs = [];

    ta.workStart = function(st_time, callback) {
      if (ta.st_time != '') console.log(ta.sid +
                                        ': last time not finish -- ' +
                                        ta.st_time);
      ta.st_time = st_time;
      callback(null, ta.checkCode);
    };

    ta.workEnd = function(ed_time, log, checkCode, callback) {
	  if (ta.st_time == '') {
		callback('', 'failed');
		return;
	  }
      if (checkCode == ta.checkCode) {
        log.hour = tool.transToHour(ed_time - ta.st_time);
		log.sid = ta.sid;
		log.name = ta.name;
        ta.st_time = '';
        ta.lastLog = log;
        db.insertLog(log);
		ta.getCode();
        callback('', 'ended');
      } else {
        callback('error', 'failed');
      }
    };

    ta.refreshLogs = function() {
      db.listUserLogs(function(err, logs) {
        ta.logs = logs;
      });
    };
    
    ta.getCode = function() {
      tool.getCheckCode(function(err, checkcode) {
        ta.checkCode = checkcode;
      });
    }
    ta.getCode();
    return ta;
  }
};

var Admin = {
  createNew: function(sid) {
    var admin = User.createNew(sid);
    admin.undoList = [];
    admin.handle = [];

    admin.refreshUndoList = function() {
      db.listAllUndoLog(function(list) {
        admin.undoList = list;
      });
    };

    admin.handleLog = function(ed_time) {
	  admin.handle = [];
      for (i = 0; i < admin.undoList.length; i++) {
        if (parseInt(admin.undoList[i].st_time) <= ed_time.getTime()) {
          admin.handle.push(admin.undoList[i]);
        }
      }
      return;
    };

    admin.markAllDone = function() {
      for (i = 0; i < admin.handle.length; i++) {
        db.handle(admin.handle[i]._id);
      }
      admin.refreshUndoList();
      admin.handle = [];
      return;
    };

	admin.refreshUndoList();
    return admin;
  }
};

function newUser(sid, grp) {
  if (grp == 1) return Ta.createNew(sid);
  return Admin.createNew(sid);
}

function getUserInfo(sid) {
  return userInfo[sid];
}

exports.newUser = newUser;
exports.userInit = userInit;
exports.getUserInfo = getUserInfo;
