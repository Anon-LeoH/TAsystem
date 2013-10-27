var DB_HOST = "localhost";
var DB_PORT = 27017;
var DB_NAME = "TAsys";

var mongodb = require('mongodb');
var server = new mongodb.Server(DB_HOST,DB_PORT,{auto_reconnect:true});
var db = new mongodb.Db(DB_NAME,server,{safe:true});

function startdb() {
    db.open(function(err,db){
    if(!err)
            console.log("DB Connected.");
    else
        console.log(err);
    });
};

function check(sid,psw,callback){
  db.collection("users",function(err,collection) {
    if (err) console.log("error when open collection" + err)
    else collection.findOne({'sid': sid, 'psw': psw, },function(err,res){
      if (err) {
        console.log("Find user error");
        callback(0, 0);
      }
      else if (res == null) callback(0, 0);
      else callback(1, res.group)
    });
  });
}

function insertLog(log,callback){
  db.collection("logs",function(err,collection) {
    if (err) console.log("error when open collection:" + err);
	db.getUserInfo(log.sid, function(res) {
      collection.insert({ "date": log['date'],
		                  "name": res.name,
                          "sid": log['sid'],
                          "cls": log['cls'],
                          "st_time": log['st_time'],
                          "ed_time": log['ed_time'],
                          "hour": log['hour'],
                          "log": log['log'],
                          "handled": 0},
                          function(err,res){
                            if (!err) callback(1);
                            else {
                              console.log("error occur when insert:" + err);
                              callback(0);
                            }
	                      
      });
	});
  });
}

function addTA(user,callback){
  db.collection("users",function(err,collection) {
    if (err) console.log("error when open collection:" + err);
    collection.insert({  "name": user['name'],
                         "psw": user['psw'],
                         "group": user['group'],
                         "major": user['major'],
                         "phone": user['phone'],
                         "email": user['email'],},
                         function(err,res){
                           if (!err) callback(1);
                           else {
                             console.log("error occur when insert:" + err);
                             callback(0);
                           }
    });
  });
}

function deleteTA(sid,callback){
  db.collection("users",function(err,collection) {
    if (err) console.log("error when open collection:" + err);
    collection.remove({"sid":sid, },function(err,res){
      if(!err) callback(1);
      else callback(0);
    });
  });
}

function getAllInfo(callback) {
  db.collection("users", function(err, collection) {
    if (err) console.log("error when open collection:" + err);
	collection.find().toArray(function(err, res) {
	    callback(err, res);
	});
  });
}

function insertInfo(user) {
  console.log("chgInfo: ");
  console.log(user);
  db.collection("users", function(err, collection) {
    if (err) console.log("error when open collection:" + err);
	collection.update({sid: user.sid}, {$set: {
	  name: user.name,
      psw: user.psw,
	  major: user.major,
	  phone: user.phone,
	  email: user.email
	}}, function(err){});
  });
  return 1;
}

function listUserLogs(sid, callback) {
  db.collection("logs", function(err, collection) {
    if (err) console.log("error when open collection:" + err);
	collection.find({'sid': sid}).toArray(function(err, res) {
	  callback(res);
	});
  });
}

function listAllUndoLog(sid, callback) {
  db.collection("logs", function(err, collection) {
    if (err) console.log("error when open collection:" + err);
	collection.find({'handled': 0}).toArray(function(err, res) {
	  callback(res);
	});
  });
}

function handle(id) {
  db.collection("logs", function(err, collection) {
    if (err) console.log("error when open collection:" + err);
	collection.update({'_id': id}, {$set: {handled: 1}});
  });
}

exports.startdb = startdb;
exports.check = check;
exports.insertLog = insertLog;
exports.addTA = addTA;
exports.deleteTA = deleteTA;
exports.getAllInfo = getAllInfo;
exports.insertInfo = insertInfo;
exports.listUserLogs = listUserLogs;
exports.listAllUndoLog = listAllUndoLog;
exports.handle = handle;

