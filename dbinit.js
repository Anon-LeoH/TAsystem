var DB_HOST = "localhost";
var DB_PORT = 27017;
var DB_NAME = "TAsys";

var mongodb = require('mongodb');
var server = new mongodb.Server(DB_HOST,DB_PORT,{auto_reconnect:true});
var db = new mongodb.Db(DB_NAME,server,{safe:true});

db.open(function(err,db){
    if (!err){  
        console.log('Connecting DataBase succeed'); //db链接成功
    db.createCollection("users",function(err,collection){  //建立用户信息的collection
            if (err)
        console.log("error:" + err);  //报错
            else {
        console.log("collection DB.TAsys.users created.");
	            collection.remove(function(){});	
                collection.insert({"sid":"10000001",
                                   "name":"管理员",
                                   "psw":"root123456",
                                   "group":"admin",
                                   "major":"软件学院",
                                   "phone":"10086",
                                   "email":"aaa@bbb.com"}, //初始化test信息
                                   {safe:true},
                                   function(err,rec){
                                       if (err) console.log(err);
                                   }
                );
                collection.insert({"sid":"10000002",
                                   "name":"普通用户",
                                   "psw":"user123456",
                                   "group":"user",
                                   "major":"软件学院",
                                   "phone":"10000",
                                   "email":"ccc@ddd.com"}, //初始化test信息
                                   {safe:true},
                                   function(err,rec){
                                       if (err) console.log(err);
                                   }
                );
                collection.find().toArray(function(err,res){
                    console.log(err||res);
                });  //打印collection内的信息以验证；
            }
        });
        db.createCollection("logs",function(err,collection){  //建立值班日志的collection
            if (err)
        console.log("error:" + err);  //报错
            else {
        console.log("collection DB.TAsys.logs created.");
		        collection.remove(function(){});
                collection.insert({"year":"2013",
                                   "month":"09",
                                   "day":"16",
                                   "std":"10000001",
                                   "cls":"B401",
                                   "st_time":new Date().getTime(),
                                   "ed_time":new Date().getTime(),
                                   "hour":"0.0",
                                   "log":"今天很不高兴",}, //初始化test信息
                                   {safe:true},
                                   function(err,rec){
                                       if (err) console.log(err);
                                   }
                );
                collection.find().toArray(function(err,res){  
                    console.log(err||res);
                });  //打印collection内信息以验证；
            }
        });
    }
    else console.log(err); //无法打开database
});


