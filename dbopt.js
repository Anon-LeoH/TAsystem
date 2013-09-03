var DB_HOST = "localhost";
var DB_PORT = 27017;
var DB_NAME = "Tasystem";

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
        else if (res['group'] == admin)callback(2);
        else callback(1);
    });
    });
}

function addLog(log,callback){
    db.collection("logs",function(err,collection) {
        if (err) console.log("error when open collection:" + err);
    collection.insert({"id"     :log['id']
                           "date"   :log['date'],
                           "std"    :log['std'],
                           "cls"    :log['cls'],
                           "st_time":log['st_time'],
                           "ed_time":log['ed_time'],
                           "hour"   :log['hour'],
                           "log"    :log['log'],},
                           function(err,res){
                               if (!err) callback(1);
                               else {
                                   console.log("error occur when insert:" + err);
                                   callback(0);
                               }
                           }
    });
    });
}

function addUser(user,callback){
    db.collection("users",function(err,collection) {
        if (err) console.log("error when open collection:" + err);
    collection.insert({"name" :user['name'],
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

exports.startdb=startdb;
exports.login_check = login_check;
exports.addUser = addUser;
exports.addLog = addLog;
exports.deleteUser = deleteUser;
