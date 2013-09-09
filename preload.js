var http = require("http");
var path = require("path");
var fs = require("fs");
var querystring = require("querystring");
var dbopt = require("./dbopt");
var SID = "WAIT_FOR_SID_REPLACE";
var BASIC_INFO = "WAIT_FOR_BASIC_INFO_REPLACE";
var TA_INFO = "WAIT_FOR_TA_INFO_REPLACE";

function load(type,options,callback){

    if(type == "loginPage"){ // load loginPage
        fs.readFile("./static/loginPage.html","utf-8",function(err,file){
            if(!err) callback(0,file);
            else callback(1,"");  
        });
    }// end loginPage loading;

    else if(type == "workPage"){  // load workPage 
        fs.readFile("./static/workPage.html","utf-8",function(err,file){
            var userInfo = getTAInfo(options.sid);
            var basicInfo = formBasicInfo(userInfo);
            file = file.replace(SID, options.sid);
            file = file.replace(BASIC_INFO, basicInfo);
            callback(0,file);
        });
    }// end workPage loading;  

    else if(type == "adminPage"){  // load adminPage 
        fs.readFile("./static/workPage.html","utf-8",function(err,file){
            var userInfo = getTAInfo(options.sid);
            var basicInfo = formBasicInfo(userInfo);
            var allInfo = getAllTAInfo();
            var item = "<tr>";
            for (i=0; i<allInfo.length; i++) {
                if (i%2 == 0 && i != 0) {
                    item += "</tr><tr>";
                }
                item += formTAInfo(allInfo[i]);
            }
            item += "</tr>";
            file = file.replace(SID, options.sid);
            file = file.replace(BASIC_INFO, basicInfo);
            file = file.replace(TA_INFO, item);
            callback(0,file);
        });
    }// end adminPage loading;

    else if(type == "Suc"){
        fs.readFile("./static/jumpOut.html","utf-8",function(err,file){
            file = file.repace("WAIT_FOR_REPLACE", "操作成功！");
            callback(0,file);
        });
    }

    else if(type == "Fld"){
        fs.readFile("./static/jumpOut.html","utf-8",function(err,file){
            file = file.repace("WAIT_FOR_REPLACE", "操作失败！");
            callback(0,file);
        });
    }

    else {
        callBack(0, "404 ERROR OCCUR!");
    }
}

function getTAInfo(sid) {
    db.getUserInfo(sid, function(err,rlt){
        if (!err) return rlt;
        else return {};
    });
}

function getAllTAInfo() {
    db.getAllInfo(function(err,rlt){
        return rlt;
    });
}

function formTAInfo(info) {
    fs.readFile("./static/TAinfo.html","utf-8",function(err,file){
        file = file.replace("sid_example", info.sid);
        file = file.replace("name_example", info.name);
        file = file.replace("major_example", info.major);
        file = file.replace("phone_example", info.phone);
        file = file.replace("email_example", info.email);
        return file;
    });
}

function formBasicInfo(info) {
    var item = ""; 
    item += "<tr>";
    item +=   "<td style='width:30%;'>姓名</td>";
    item +=   "<td style='width:70%;'>" + info.name + "</td>";
    item += "</tr>";
    item += "<tr>";
    item +=   "<td style='width:30%;'>专业</td>";
    item +=   "<td style='width:70%;'>" + info.major + "</td>";
    item += "</tr>";
    item += "<tr>";
    item +=   "<td style='width:30%;'>电话</td>";
    item +=   "<td style='width:70%;'>" + info.phone + "</td>";
    item += "</tr>";
    item += "<tr>";
    item +=   "<td style='width:30%;'>Email</td>";
    item +=   "<td style='width:70%;'>" + info.email + "</td>";
    item += "</tr>";
    return item;
}

exports.load = load;

