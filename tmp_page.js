var path = require('path');
var fs = require('fs');
var tool = require('./tool');
var db = require('./dbopt');

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
    var page.user = user;
    var page.basicInfo = tool.formBasicInfo(user);

    page.loginPage = function() {
      fs.readFile('./static/loginPage.html', 'utf-8', function(err, file) {
        if (err) return '404 not found';
        return file;
      });
    };

    page.index = function() {
      if (page.user.group == 1) {
        fs.readFile('./static/workPage.html', 'utf-8', function(err, file) {
          if (err) return '404 not found';
          file = tool.replaceInfo(file, page.user);
          file = file.replace(BASIC_INFO, page.basicInfo);
          return file;
        });
      } else {
        fs.readFile('./static/adminPage.html', 'utf-8', function(err, file) {
          if (err) return '404 not found';
          if (page.user.group != '2') return 'not admin';
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
            return file;
          });
        });
      }
    };

    page.infoPage = function(sid) {
      fs.readFile('./static/infoPage.html', 'utf-8', function(err, file) {
        if (err) return '404 not found';
        if (page.user.group != '2') {
          if (sid != page.user.sid) return 'not admin';
        }
        file = tool.replaceInfo(file, page.user);
        file = tool.replaceExample(file, sid);
        return file;
      });
    };

    page.logPage = function() {
      fs.readFile('./static/logPage.html', 'utf-8', function(err, file) {
        if (err) return '404 not found';
        if (page.user.group != '2') return 'not admin';
        var logTable = tool.formLogTable(page.user.handle);
        file = tool.replaceInfo(file, page.user);
        file = file.replace(BASIC_INFO, page.basicInfo);
        file = file.replace(LOG_TABLE, logTable);
        return file;
      });
    };

    page.userLog = function(sid) {
      fs.readFile('./static/userLog.html', 'utf-8', function(err, file) {
        if (err) return '404 not found';
        if (page.user.group != '2') {
          if (sid != page.user.sid) return 'not admin';
        }
        file = tool.replaceInfo(file, page.user);
        var logTable = tool.listUserLog(sid);
        file = tool.replaceInfo(file, page.user);
        file = file.replace(BASIC_INFO, page.basicInfo);
        file = file.replace(LOG_TABLE, logTable);
      });
    };

    page.sucPage = function(url) {
      fs.readFile('./static/jumpOut.html', 'utf-8', function(err, file) {
        if (err) return '404 not found';
        file = file.replace('WAIT_FOR_REPLACE', '操作成功！');
        file = file.replace('url_example', url);
        return file;
      });
    };

    page.fldPage = function(url) {
      fs.readFile('./static/jumpOut.html', 'utf-8', function(err, file) {
        if (err) return '404 not found';
        file = file.replace('WAIT_FOR_REPLACE', '操作成功！');
        file = file.replace('url_example', url);
        return file;
      });
    };

    return page;
  }
};

function newPage(user) {
    return Page.createNew(user);
}

exports.newPage = newPage;

