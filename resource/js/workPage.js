var check_code = "";
var startTime;
var endTime;
var log = {};

function _init_() {
  var height = $("#mainContent").height();
  var width = $(window).width();
  if (height < 400) height = 400;
  $("#info").css("height",height+"px");
  $(".well").css("height",height+"px");
  $(".header").css("width",width+"px");
}

var func, st;
  
function timer(){
  var now = new Date().getTime();
  var second = parseInt((now - st) / 1000);
  var minute = parseInt(second / 60);
  second -= minute * 60;
  var hour = parseInt(minute / 60);
  minute -= hour * 60;
  var t = '';
  if (hour < 10) t += '0';
  t += hour + ':';
  if (minute < 10) t += '0';
  t += minute + ':';
  if (second < 10) t += '0';
  t += second;	
  $("#time").replaceWith("<h4 id='time'>" + t + "</h4>");  
}  

function startclock(){st = new Date().getTime(); func=setInterval("timer()",1);}  
function stopclock(){clearInterval(func); st = 0;}

var action = {
  "start" : function() {
    var tmp;
    startTime = new Date().getTime();
    $.ajax({
      type   : "post",
      url    : "/workStart",
      data   : {st_time: startTime},
      success  : function(data) {
        if (data != "failed"){
          check_code = data;
          alert("工作已开始，请结束时点击按钮，否则后果自负。");
          tmp = true;
        }
        else {
          alert("开始失败，请重新尝试!");
          tmp = false;
        }
      },
      error  : function() {
        alert("无法链接服务器！");
        tmp = false;
      },
      dataType : 'text',
      async  : false,
    });
    return tmp;
  },
  "end"   : function(dt) {
    var tmp;
    $.ajax({
      type   : "post",
      url    : "/workEnd",
      data   : dt,
      success  : function(data) {
        if (data != "failed"){
          alert("工作已结束，辛苦了！");
          tmp = true;
        }
        else {
          alert("失败，请重新尝试！");
          tmp = false;
        }
      },
      error  : function() {
        alert("无法链接服务器！");
        tmp = false;
      },
      dataType : 'text',
      async  : false,
    });
    return tmp;
  }
}

$(document).ready(function(){
  _init_();
  var now_date = new Date();
  $("#date").replaceWith("<td style='width:70%;' id='date'>" + now_date.toLocaleDateString() + "</td>");
  $("#now-time").replaceWith("<td style='width:70%;' id='now-time'>" + now_date.toLocaleTimeString() + "</td>");
  $('#str-btn').on('click', function(e, data) {
    var tmp = action["start"]();
    if (tmp) {
      startclock();
      $("#status").replaceWith("<td style='width:70%;color:green;' id='status'>已开始</td>");
    }
  });
  $('#end-btn').on('click', function(e, data) {  
    if (check_code == "") {
      alert("工作还未开始！请先点击开始工作！");
      return;
    }
    $('#myModal').modal('show');
  });
  $('#submit').on('click',function(){
    log.cls = $("#ipt-cls").val();
    log.log = $("#ipt-log").val();
    if (log.cls == ""){
      alert("结束工作失败，请填写好工作日志！");
      return;
    }
    else {
      endTime = new Date();
      log.st_time = startTime;
      log.ed_time = endTime.getTime();
      var month = endTime.getMonth() + 1;
      var year = endTime.getFullYear();
      var day = endTime.getDate();
	  log.date = '';
	  log.date += year + '-';
	  if (month < 10) log.date += '0';
	  log.date += month + '-';
	  if (day < 10) log.date+= '0';
	  log.date += day;
	  log.checkCode = check_code;
    }
    var tmp = action["end"](log);
    if (tmp) {
      check_code = "";
      stopclock();
      $("#time").replaceWith("<h4 id='time'>00:00:00</h4>");    
      $("#status").replaceWith("<td style='width:70%;' id='status'>未开始</td>");        
    }
    else {
      alert("结束工作失败，请再次尝试！");
    }
  });
  window.onbeforeunload = function(){
	if (check_code != '') return "如果于工作状态离开，将产生不可预计的后果！";
  };
});

