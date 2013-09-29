var http = require("http");
var path = require("path");
var fs = require("fs");
var querystring = require("querystring");
var db = require("./dbopt");
var SID = "WAIT_FOR_SID_REPLACE";
var BASIC_INFO = "WAIT_FOR_BASIC_INFO_REPLACE";
var TA_INFO = "WAIT_FOR_TA_INFO_REPLACE";
var SEARCH_BAR = "WAIT_FOR_SEARCH_BAR_REPLACE";

function load(type,options,callback){
    if(type == "loginPage"){ // load loginPage
        fs.readFile("./static/loginPage.html","utf-8",function(err,file){
            if(!err) callback(0,file);
            else callback(1,"");  
        });
    }// end loginPage loading;

    else if(type == "workPage"){  // load workPage 
        fs.readFile("./static/workPage.html","utf-8",function(err,file){
            db.getUserInfo(options.sid,function(err,user){
                var basicInfo = formBasicInfo(user);
                file = file.replace(SID, options.sid);
                file = file.replace(SID, options.sid);
                file = file.replace(SID, options.sid);
                file = file.replace(BASIC_INFO, basicInfo);
                callback(0,file);
			});
        });
    }// end workPage loading;  

    else if(type == "adminPage"){  // load adminPage 
        fs.readFile("./static/adminPage.html","utf-8",function(err,file){
            db.getUserInfo(options.sid,function(err,user){
                var basicInfo = formBasicInfo(user);
				db.getAllInfo(function(err,allInfo){
					fs.readFile("./static/TAinfo.html","utf-8",function(err,tmp){
                        var item = "<tr>";
                        for (i=0; i<allInfo.length; i++) {
                            if (i%2 == 0 && i != 0) {
                                item += "</tr><tr>";
                            }
                            item += formTAInfo(allInfo[i],tmp);
                        }
                        item += "</tr>";
                        file = file.replace(SID, options.sid);
                        file = file.replace(SID, options.sid);
                        file = file.replace(SID, options.sid);
                        file = file.replace(SID, options.sid);
                        file = file.replace(BASIC_INFO, basicInfo);
                        file = file.replace(TA_INFO, item);
                        callback(0,file);
					});
				});
			});
        });
    }// end adminPage loading;

    else if(type == "Suc"){
        fs.readFile("./static/jumpOut.html","utf-8",function(err,file){
            file = file.replace("WAIT_FOR_REPLACE", "操作成功！");
            callback(0,file);
        });
    }

    else if(type == "Fld"){
        fs.readFile("./static/jumpOut.html","utf-8",function(err,file){
            file = file.replace("WAIT_FOR_REPLACE", "操作失败！");
            callback(0,file);
        });
    }

	else if(type == "infoPage"){
	    fs.readFile("./static/infoPage.html","utf-8",function(err,file){
            db.getUserInfo(options.sid,function(err,info){
		        file = file.replace("sid_example",info.sid);
		        file = file.replace(SID,info.sid);
		        file = file.replace(SID,info.sid);
		        file = file.replace("psw_example",info.psw);
                file = file.replace("name_example", info.name);
                file = file.replace("major_example", info.major);
                file = file.replace("phone_example", info.phone);
                file = file.replace("email_example", info.email);
				callback(1,file);
			});
		});
	}

	else if (type == "logPage"){
	    fs.readFile("./static/logPage.html","utf-8",function(err,file){
		    if (options.type != "-1") {
			    db.listLog(options.type,function(err,res){
					fs.readFile("./static/searchLog.html","utf-8",function(err,tmp){
					    file = file.replace(SEARCH_BAR,tmp);
						fs.readFile("./static/tableLine.html","utf-8",function(err,tmp){
							var item = "";
						    for (i = 0; i < res.length; i++) {
							    var chunk = tmp;
								chunk = chunk.replace("name_example",res[i].std);
								chunk = chunk.replace("date_example",res[i].date);
								chunk = chunk.replace("st_example",res[i].st);
								chunk = chunk.replace("ed_example",res[i].ed);
								chunk = chunk.replace("hour_example",res[i].hour);
								chunk = chunk.replace("lid_example",res[i]._id);
								chunk = chunk.replace("lid_example",res[i]._id);
								item += chunk;
							}
                            db.getUserInfo(options.sid, function(err,user){
                                var basicInfo = formBasicInfo(user);
                                file = file.replace(SID, options.sid);
                                file = file.replace(SID, options.sid);
                                file = file.replace(SID, options.sid);
                                file = file.replace(BASIC_INFO, basicInfo);
							    file = file.replace("log_example",item);
							    callback(1,file);
                            });
						});
					});
				});
			}
			else {
			    db.userLog(options.sid,function(err,res){
                    db.getUserInfo(options.sid, function(err,user){
                        file = file.replace(SEARCH_BAR,user.name);
						fs.readFile("./static/tableLine.html","utf-8",function(err,tmp){
							var item = "";
						    for (i = 0; i < res.length; i++) {
							    var chunk = tmp;
								chunk = chunk.replace("name_example",res[i].std);
								chunk = chunk.replace("date_example",res[i].date);
								chunk = chunk.replace("st_example",res[i].st);
								chunk = chunk.replace("ed_example",res[i].ed);
								chunk = chunk.replace("hour_example",res[i].hour);
								chunk = chunk.replace("lid_example",res[i]._id);
								chunk = chunk.replace("lid_example",res[i]._id);
								item += chunk;
							}
                            db.getUserInfo(options.admin, function(err,user){
                                var basicInfo = formBasicInfo(user);
                                file = file.replace(SID, options.admin);
                                file = file.replace(SID, options.admin);
                                file = file.replace(SID, options.admin);
                                file = file.replace(BASIC_INFO, basicInfo);
							    file = file.replace("log_example",item);
							    callback(1,file);
                            });
						});
					});
				});
			}
		});
	}
    else {
        callBack(0, "404 ERROR OCCUR!");
    }
}

function formTAInfo(info,tmp) {
	var file = tmp;
    file = file.replace("sid_example", info.sid);
    file = file.replace("sid_example", info.sid);
    file = file.replace("sid_example", info.sid);
    file = file.replace("sid_example", info.sid);
    file = file.replace("sid_example", info.sid);
    file = file.replace("name_example", info.name);
    file = file.replace("major_example", info.major);
    file = file.replace("phone_example", info.phone);
    file = file.replace("email_example", info.email);
	return file;
}

function formBasicInfo(info) {
    var item = ""; 
    item += "<tr>";
    item +=   "<td style='width:30%;'>姓名</td>";
    item +=   "<td style='width:70%;'>" + info["name"] + "</td>";
    item += "</tr>";
    item += "<tr>";
    item +=   "<td style='width:30%;'>专业</td>";
    item +=   "<td style='width:70%;'>" + info["major"] + "</td>";
    item += "</tr>";
    item += "<tr>";
    item +=   "<td style='width:30%;'>电话</td>";
    item +=   "<td style='width:70%;'>" + info["phone"] + "</td>";
    item += "</tr>";
    item += "<tr>";
    item +=   "<td style='width:30%;'>Email</td>";
    item +=   "<td style='width:70%;'>" + info["email"] + "</td>";
    item += "</tr>";
    return item;
}

exports.load = load;

