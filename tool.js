var path = require('path');
var url = require('url');
var querystring = require('querystring');
var cls_page = require('./Page');
var cls_user = require('./User');
var db = require('./dbopt');

var replace = {
  name: 'WAIT_FOR_NAME_REPLACE',
  sid: 'WAIT_FOR_SID_REPLACE',
  psw: 'WAIT_FOR_PSW_REPLACE',
  major: 'WAIT_FOR_MAJOR_REPLACE',
  phone: 'WAIT_FOR_PHONE_REPLACE',
  email: 'WAIT_FOR_EMAIL_REPLACE',
  group: 'WAIT_FOR_GROUP_REPLACE' 
};

var eg = {
  name: 'name_example',
  sid: 'sid_example',
  psw: 'psw_example',
  major: 'major_example',
  phone: 'phone_example',
  email: 'email_example',
  group: 'group_example', 
};

function replaceInfo(file, user) {
  file = replaceAll(file, user.sid, replace.sid);
  file = replaceAll(file, user.name, replace.name);
  file = replaceAll(file, user.psw, replace.psw);
  file = replaceAll(file, user.major, replace.major);
  file = replaceAll(file, user.phone, replace.phone);
  file = replaceAll(file, user.email, replace.email);
  file = replaceAll(file, user.group, replace.group);
  return file;
}

function replaceExample(file, user) {
  file = replaceAll(file, user.sid, eg.sid);
  file = replaceAll(file, user.name, eg.name);
  file = replaceAll(file, user.psw, eg.psw);
  file = replaceAll(file, user.major, eg.major);
  file = replaceAll(file, user.phone, eg.phone);
  file = replaceAll(file, user.email, eg.email);
  file = replaceAll(file, user.group, eg.group);
  return file;
}

function htmlRespond(cookie, file) {
  res.writeHead(200, {"Set-Cookie": cookie,
			          "Content-Type": "text/html"});
  res.write(file, "utf-8");
  res.end();
}

function stringRespond(buffer) {
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end(buffer);
}

function replaceAll(file, info, place) {
  return file.replace(new RegExp(place, 'gm'), info);
}

function formBasicInfo(user) {
  var item = ""; 
  item += "<tr>";
  item +=   "<td style='width:30%;'>姓名</td>";
  item +=   "<td style='width:70%;'>" + user["name"] + "</td>";
  item += "</tr>";
  item += "<tr>";
  item +=   "<td style='width:30%;'>专业</td>";
  item +=   "<td style='width:70%;'>" + user["major"] + "</td>";
  item += "</tr>";
  item += "<tr>";
  item +=   "<td style='width:30%;'>电话</td>";
  item +=   "<td style='width:70%;'>" + user["phone"] + "</td>";
  item += "</tr>";
  item += "<tr>";
  item +=   "<td style='width:30%;'>Email</td>";
  item +=   "<td style='width:70%;'>" + user["email"] + "</td>";
  item += "</tr>";
  return item;
}

function transToHour(ms) {
  return (ms / 1000) / 3600;
}

function getCheckCode(callback) {
  require('crypto').randomBytes(16, function(ex, buf) {  
    callback(1, buf.toString('hex'));  
  });
}

function fetchPostData(req, callback) {
  var postData = "";
  req.setEncoding("utf8");
  req.addListener("data",function(postDataChunk){
    postData += postDataChunk;
  });
  req.addListener("end",function(postDataCHunk){
    var data = queryString.parse(postData);
    callback(data);
  });
}
