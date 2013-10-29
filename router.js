var path = require('path');
var fs = require('fs');
var url = require('url');
var fileserver = require('./fileserver');
var userOption = require('./userOption');
var handle = {};
var count = 0;

function init() {
    handle['/'] = userOption.index;
    handle['/home'] = userOption.index;
    handle['/infoPage'] = userOption.infoPage;
    handle['/chgInfo'] = userOption.chgInfo;
    handle['/workStart'] = userOption.workStart;
    handle['/workEnd'] = userOption.workEnd;
    handle['/login'] = userOption.signIn;
    handle['/quit'] = userOption.signOut;
    handle['/addTA'] = userOption.addTA;
    handle['/deleteTA'] = userOption.deleteTA;
    handle['/logPage'] = userOption.logPage;
    handle['/userLog'] = userOption.userLog;
    handle['/handleLog'] = userOption.handleLog;
    console.log('Router inited.');
}

function route(request, response) {
  pathname = url.parse(request.url).pathname;
  query = url.parse(request.url).query;
  var Cookies = {};
  request.headers.cookie &&
  request.headers.cookie.split(';').forEach(function(Cookie) {
    var parts = Cookie.split('=');
    Cookies[parts[0].trim()] = (parts[1] || '').trim();
  });
  if (typeof handle[pathname] === 'function') {
    handle[pathname](request, response, Cookies);
  }
  else {
    fileserver.handle(pathname, response);
  }
}

exports.route = route;
exports.init = init;
