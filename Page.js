var path = require('path');
var fs = require('fs');
var tool = require('./tool');
var db = require('./dbopt');
var cls_user = require('./User');

/* this js file declare class Page
 * the functions of Page is return
 * the right html file.
 */

var Page = {
  createNew: function(user) {

    var BASIC_INFO = 'WAIT_FOR_BASIC_INFO_REPLACE';
    var TA_INFO = 'WAIT_FOR_TA_INFO_REPLACE';
    var LOG_TABLE = 'WAIT_FOR_LOG_TABLE_REPLACE';

    var page = {};
    page.user = user;
    page.basicInfo = tool.formBasicInfo(user);

    page.loginPage = function(callback) {
      fs.readFile('./static/loginPage.html', 'utf-8', function(err, file) {
        if (err) callback('error', '404 not found!');
        callback('', file);
      });
    };

    page.index = function(callback) {
      if (page.user.group == 1) {
        fs.readFile('./static/workPage.html', 'utf-8', function(err, file) {
          if (err) callback('error', '404 not found!');
          file = tool.replaceInfo(file, page.user);
          file = file.replace(BASIC_INFO, page.basicInfo);
          callback('', file);
        });
      } else {
        fs.readFile('./static/adminPage.html', 'utf-8', function(err, file) {
          if (err) callback('error', '404 not found!');
          if (page.user.group != '2') callback('error', 'not admin');
          db.getAllInfo(function(err, allInfo) {
            var item = '';
            for (i = 0; i < allInfo.length; i++) {
              item += '<tr>';
              item += tool.formTAInfo(allInfo[i]);
              item += '</tr>';
            }
            file = tool.replaceInfo(file, page.user);
            file = file.replace(BASIC_INFO, page.basicInfo);
            file = file.replace(TA_INFO, item);
            callback('', file);
          });
        });
      }
    };

    page.infoPage = function(sid, callback) {
      fs.readFile('./static/infoPage.html', 'utf-8', function(err, file) {
        if (err) callback('error', '404 not found!');
        if (page.user.group != '2') {
          if (sid != page.user.sid) {
              callback('error', 'not admin');
              return;
          }
        }
        file = tool.replaceInfo(file, page.user);
        var tmpUser = cls_user.getUserInfo(sid);
        file = tool.replaceExample(file, tmpUser);
        callback('', file);
      });
    };

    page.logPage = function(callback) {
      fs.readFile('./static/logPage.html', 'utf-8', function(err, file) {
        if (err) callback('error', '404 not found!');
        if (page.user.group != '2') callback('error', 'not admin');
        var logTable = tool.formLogTable(page.user.handle);
        file = tool.replaceInfo(file, page.user);
        file = file.replace(BASIC_INFO, page.basicInfo);
        file = file.replace(LOG_TABLE, logTable);
        callback('', file);
      });
    };

    page.userLog = function(sid, callback) {
      fs.readFile('./static/userLog.html', 'utf-8', function(err, file) {
        if (err) callback('error', '404 not found!');
        if (page.user.group != '2') {
          if (sid != page.user.sid) callback('error', 'not admin');
        }
        page.user.refreshLogs();
        var logTable = tool.formLogTable(page.user.logs);
        file = tool.replaceInfo(file, page.user);
        file = file.replace(BASIC_INFO, page.basicInfo);
        file = file.replace(LOG_TABLE, logTable);
        callback('', file);
      });
    };

    page.sucPage = function(url, callback) {
      fs.readFile('./static/jumpOut.html', 'utf-8', function(err, file) {
        if (err) callback('error', '404 not found!');
        file = file.replace('WAIT_FOR_REPLACE', '操作成功！');
        file = file.replace('url_example', url);
        callback('', file);
      });
    };

    page.fldPage = function(url, callback) {
      fs.readFile('./static/jumpOut.html', 'utf-8', function(err, file) {
        if (err) callback('error', '404 not found!');
        file = file.replace('WAIT_FOR_REPLACE', '操作成功！');
        file = file.replace('url_example', url);
        callback('', file);
      });
    };

    return page;
  }
};

function newPage(user) {
    return Page.createNew(user);
}

function tmpPage() {
  var tmppage = {};
  tmppage.loginPage = function(callback) {
    fs.readFile('./static/loginPage.html', 'utf-8', function(err, file) {
      if (err) callback('error', '404 not found!');
      callback('', file);
    });
  };
  return tmppage;
}

exports.newPage = newPage;
exports.tmpPage = tmpPage;

