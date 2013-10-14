var path = require('path');
var fs = require('fs');
var tool = require('./tool');
var db = require('./dbopt');

var User = {
  createNew: function(sid) {
    var user = db.getUserInfo(sid);

    user.changeInfo = function(newUser) {
      if (user.group == '1' && newUser.sid != user.sid) return 'denied';
      var tmp = tool.insertInfo(newUser);
	  user = db.getUserInfo(user.sid);
	  return tmp;
    };

    return user;
  }
};

var Ta = {
  createNew: function(sid) {
    var ta = User.createNew(sid);
    ta.checkCode = tool.getCheckCode();
    ta.st_time = '';
    ta.lastLog = '';
    ta.handle = [];

    ta.workStart = function(st_time, checkCode) {
      if (checkCode == ta.checkCode) {
        if (ta.st_time != '') console.log(ta.sid +
                                          ': last time not finish -- ' +
                                          ta.st_time);
        ta.st_time = st_time;
        return 'started';
      } else {
        return 'wrong code';
      }
    };

    ta.workEnd = function(ed_time, log, checkCode) {
      if (checkCode == ta.checkCode) {
        log.hour = tool.transToHour(ed_time - ta.st_time);
        ta.st_time = '';
        ta.lastLog = log;
        db.insertLog(log);
        return 'ended';
      } else {
        return 'wrong code';
      }
    };

    ta.refreshLogs = function() {
      ta.logs = db.listUserLogs();
      return;
    };

    return ta;
  }
};

var Admin = {
  createNew: function(sid) {
    var admin = User.createNew(sid);
    admin.undoList = [];
    admin.handle = [];

    admin.refreshUndoList = function() {
      admin.undoList = db.listAllUndoLog();
      return;
    };

    admin.handleLog = function(ed_time) {
      for (i = 0; i < admin.undoList.length; i++) {
        if (parseInt(admin.undoList[i].st_time) <= ed_time) {
          admin.handle.push(admin.undoList[i]);
        }
      }
      return;
    };

    admin.markAllDone = function() {
      for (i = 0; i < admin.handle.length; i++) {
        admin.handle[i].done = '1';
      }
      admin.refreshUndoList();
      admin.handle = [];
      return;
    };

    return admin;
  }
};

function newUser(sid, grp) {
  if (grp == 1) return Ta.createNew(sid);
  return Admin.createNew(sid);
}

exports.newUser = newUser;

