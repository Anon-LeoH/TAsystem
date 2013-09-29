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

function login_check(sid,psw,callback){
     db.collection("users",function(err,collection) {
        if (err) console.log("error when open collection" + err)
        else collection.findOne({'sid': sid, 'psw': psw, },function(err,res){
        if (err) {
            console.log("Find user error");
            callback(0);
        }
        else if (res == null) callback(0);
        else if (res['group'] == "admin") callback(2);
        else callback(1);
    });
    });
}

function addLog(log,callback){
    db.collection("logs",function(err,collection) {
        if (err) console.log("error when open collection:" + err);
    collection.insert({    "month"  : log['month'],
		                   "year"   : log['year'],
		                   "day"    : log['day'],
                           "std"    : log['std'],
                           "cls"    : log['cls'],
                           "st_time": log['st_time'],
                           "ed_time": log['ed_time'],
                           "hour"   : log['hour'],
                           "log"    : log['log'],},
                           function(err,res){
                               if (!err) callback(1);
                               else {
                                   console.log("error occur when insert:" + err);
                                   callback(0);
                               }
                           });
    });
}

function listLog(type, callback) {
	db.collection("logs",function(err,collection) {
        if (err) console.log("error when open collection:" + err);
		collection.find().toArray(function(err,res){
			for(i=0;i<res.length;i++){
		        res[i]["date"] = res[i].year + "-" + res[i].month + "-" + res[i].day;
			    res[i]["st"] = new Date(parseInt(res[i]["st_time"])).getHours() + ":" +
                               new Date(parseInt(res[i]["st_time"])).getMinutes();
			    res[i]["ed"] = new Date(parseInt(res[i]["ed_time"])).getHours() + ":" + 
                               new Date(parseInt(res[i]["ed_time"])).getMinutes();
		    }
		    if (type == "0") {
			    callback(1,res);
			}
			else if (type == "1") {
			    var tmp = [];
				var month = new Date().getMonth() + 1;
				var year = new Date().getFullYear();
				for (i = 0; i < res.length; i++) {
				    if (res[i].year == year && res[i].month == month) {
					    tmp.push(res[i]);
					}
				}
				callback(1,tmp);
			}
		    else if (type == "2") {
			    var tmp = [];
				var month = new Date().getMonth() + 1;
				var year = new Date().getFullYear();
				for (i = 0; i < res.length; i++) {
				    if (res[i].year == year && res[i].month == month) {
					    tmp.push(res[i]);
					}
				}
				month = month - 1;
				if (month == 0) {
				    year -= 1;
					month = 12;
				}
				for (i = 0; i < res.length; i++) {
				    if (res[i].year == year && res[i].month == month) {
					    tmp.push(res[i]);
					}
				}
				month = month - 1;
				if (month == 0) {
				    year -= 1;
					month = 12;
				}
				for (i = 0; i < res.length; i++) {
				    if (res[i].year == year && res[i].month == month) {
					    tmp.push(res[i]);
					}
				}
				callback(1,tmp);
			}
			else {
			    var tmp = [];
				var month = new Date().getMonth() + 1;
				var year = new Date().getFullYear();
				for (i = 0; i < 12; i++) {
				    for (j = 0; j < res.length; j++) {
				        if (res[j].year == year && res[j].month == month) {
					        tmp.push(res[j]);
					    }
				    }
					month -= 1;
					if (month == 0) {
					    month = 12;
						year -= 1;
					}
				}
				callback(1,tmp);
			}
		});
	});
}

function userLog(sid,callback) {
    db.collection("logs",function(err,collection) {
		collection.find().toArray(function(err,res){
			var tmp = [];
		    for(i=0;i<res.length;i++){
		        res[i]["date"] = res[i].year + "-" + res[i].month + "-" + res[i].day;
			    res[i]["st"] = new Date(parseInt(res[i]["st_time"])).getHours() + ":" + 
                               new Date(parseInt(res[i]["st_time"])).getMinutes();
			    res[i]["ed"] = new Date(parseInt(res[i]["ed_time"])).getHours() + ":" + 
                               new Date(parseInt(res[i]["ed_time"])).getMinutes();
				if (res[i].std == sid){
				    tmp.push(res[i]);
				}
			}
			callback(1,tmp);
		});
	});
}

function deleteLog(id,callback) {
    console.log("id: " + id);
    db.collection("logs",function(err,collection) {
        if (err) console.log("error when open collection:" + err);
        collection.remove({"_id" : new mongodb.ObjectID(id)},function(err,res){
            if(!err) callback(res);
            else callback(0);
        });
    });
}

function logInfo(id,callback) {
    db.collection("logs",function(err,collection) {
	    if (err) console.log("error when open collection:" + err);
		collection.findOne({"_id" : new mongodb.ObjectID(id)}, function(err,res) {
            if (err) callback (0,{});
		    var data = {};
			data["sid"] = res["std"];
			data["date"] = res["year"] + "-" + res["month"] + "-" + res["day"];
			data["st"] = new Date(parseInt(res["st_time"])).getHours() + ":" + 
                         new Date(parseInt(res["st_time"])).getMinutes();
			data["ed"] = new Date(parseInt(res["ed_time"])).getHours() + ":" + 
                         new Date(parseInt(res["ed_time"])).getMinutes();
			data["hour"] = res["hour"];
			data["cls"] = res["cls"];
			data["log"] = res["log"];
			callback(1,data);
		});
	});
}

function addUser(user,callback){
    db.collection("users",function(err,collection) {
        if (err) console.log("error when open collection:" + err);
    collection.insert({    "sid"  :user['sid'],
                           "name" :user['name'],
                           "psw"  :user['psw'],
                           "group":user['group'],
                           "major":user['major'],
                           "phone":user['phone'],
                           "email":user['email'],},
                           function(err,res){
                               if (!err) callback(1);
                               else {
                                   console.log("error occur when insert:" + err);
                                   callback(0);
                               }
                           });
    });
}

function deleteUser(sid,callback){
    db.collection("users",function(err,collection) {
        if (err) console.log("error when open collection:" + err);
        collection.remove({"sid":sid, },function(err,res){
            if(!err) callback(1);
            else callback(0);
        });
    });
}

function editUser(info,callback){
    db.collection("users",function(err,collection) {
        if (err) {
            console.log("error when open collection:" + err);
            callback(0);
        }
        collection.update({'sid' : info['sid']},
                          {
						      $set : { "name" : info["name"],
									   "psw"  : info['psw'],
                                       "major": info['major'],
                                       "phone": info['phone'],
                                       "email": info['email'],},
                                     },
						  function(err,rlt){}
        );
        callback(1);
    });
}

function getUserInfo(sid,callback){
    db.collection("users",function(err,collection) {
        if (err) console.log("error when open collection" + err);
        collection.findOne({'sid':sid},function(err,res){
            if (err) {
                console.log("Find user error");
                callback(0,{});
            }
            else if (res == null) callback(0,{});
            else {
                callback(1,res);
            }
        });
    });
}

function getAllInfo(callback){
    db.collection("users",function(err,collection) {
        if (err) console.log("error when open collection" + err);
    collection.find().toArray(function(err,res){
            callback(1,res)
    });
    });
}

exports.startdb=startdb;
exports.login_check = login_check;
exports.addUser = addUser;
exports.addLog = addLog;
exports.deleteUser = deleteUser;
exports.editUser = editUser;
exports.getUserInfo = getUserInfo;
exports.getAllInfo = getAllInfo;
exports.listLog = listLog;
exports.userLog = userLog;
exports.logInfo = logInfo;
exports.deleteLog = deleteLog;

