var path = require('path');
var fs = require('fs');
var wtf = require('async').waterfall;
var tool = require('./tool');
var db = require('./dbopt');

var User = {
  createNew: function(sid) {
	var user = {
	  name: '',
	  psw: '',
	  'sid': sid,
	  group: 1,
	  major: '',
	  email: '',
	  phone: ''
	};
    user.changeInfo = function(newUser) {
      if (user.group == '1' && newUser.sid != user.sid) callback('error', 'denied');
      var tmp = db.insertInfo(newUser);
      return tmp;
    };
    db.getUserInfo(sid, function(rlt) {
	  user.name = rlt.name;
	  user.group = rlt.group;
	  user.psw = rlt.psw;
	  user.major = rlt.major;
	  user.email = rlt.email;
	  user.phone = rlt.phone;
	});
	return user;
  }
};

var Ta = {
  createNew: function(sid) {
    var ta = User.createNew(sid);
    ta.st_time = '';
    ta.lastLog = '';
    ta.checkCode = '';
    ta.handle = [];

    ta.workStart = function(st_time, checkCode, callback) {
      if (checkCode == ta.checkCode) {
        if (ta.st_time != '') console.log(ta.sid +
                                          ': last time not finish -- ' +
                                          ta.st_time);
        ta.st_time = st_time;
        callback('', 'started');
      } else {
        callback('error', 'wrong code');
      }
    };

    ta.workEnd = function(ed_time, log, checkCode, callback) {
      if (checkCode == ta.checkCode) {
        log.hour = tool.transToHour(ed_time - ta.st_time);
        ta.st_time = '';
        ta.lastLog = log;
        db.insertLog(log);
        callback('', 'ended');
      } else {
        callback('error', 'wrong code');
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
      for (i = 0; i < admin.undoList.length; i++) {
        if (parseInt(admin.undoList[i].st_time) <= ed_time.parse()) {
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

    return admin;
  }
};

function newUser(sid, grp) {
  if (grp == 1) return Ta.createNew(sid);
  return Admin.createNew(sid);
}

exports.newUser = newUser;

