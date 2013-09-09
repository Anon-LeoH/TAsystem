var check_code = "";
var startTime;
var endTime;
var sid = $("#l3>h6>a").value

function _init_() {
    var height = $("#mainContent").height();
    var width = $(window).width();
    $("#info").css("height",height+"px");
    $(".well").css("height",height+"px");
    $(".header").css("width",width+"px");
}

var se, m = 0, h = 0, s = 0, ss = 1;
  
function second(){  
    if((ss%200)==0){
        s += 1;
        ss = 1;
    }  
    if(s>0 && (s%60)==0){
        m += 1;
        s = 0;
    }  
    if(m>0 && (m%60)==0){
        h += 1;
        m = 0;
    }  
    t = h + ":" + m + ":" + s;  
    $("#time").replaceWith("<h4 id='time'>" + t + "</h4>");  
    ss+=1;  
}  
function startclock(){se=setInterval("second()",1);}  
function stopclock(){clearInterval(se);ss=1;m=h=s=0;}

var action = {
    "start" : function() {
                  var sid = "";
                  var tmp;
                  $.ajax({
                      type     : "post",
                      url      : "/workStart",
                      data     : { "sid" : sid,},
                      success  : function(data) {
                          if (data.info == "none"){
                              check_code = data.checkCode;
                              alert("工作已开始，请结束时点击按钮，否则后果自负。");
                              tmp = true;
                          }
                          else {
                              alert(data.info);
                              tmp = false;
                          }
                      },
                      error    : function() {
                          alert("无法链接服务器！");
                          tmp = false;
                      },
                      dataType : 'json',
                      async    : false,
                  });
                  return tmp;
              },
    "end"   : function(dt) {
                  var tmp;
                  dt["sid"] = sid;
                  dt["checkCode"] = check_code;
                  $.ajax({
                      type     : "post",
                      url      : "/workEnd",
                      data     : dt,
                      success  : function(data) {
                          if (data.info == "none"){
                              alert("工作已结束，辛苦了！");
                              tmp = true;
                          }
                          else {
                              alert(data.info);
                              tmp = false;
                          }
                      },
                      error    : function() {
                          alert("无法链接服务器！");
                          tmp = false;
                      },
                      dataType : 'json',
                      async    : false,
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
            startTime = new Date();
            $("#status").replaceWith("<td style='width:70%;color:green;' id='status'>已开始</td>");
        }
    });
    $('#end-btn').on('click', function(e, data) {    
        if (check_code == "") {
            alert("工作还未开始！请先点击开始工作！");
            return;
        }
        $('#myModal').modal('toggle');
        $('#myModal').on('hide.bs.modal',function(){
            var data = {};
            texts = $(":textarea",$('myModal'));
            selects = $(":select",$('myModal'));
            for(i = 0; i < texts.length; i++){
                data[texts[i].attr("name")] = texts[i].attr("value");
            }
            for(i = 0; i < selects.length; i++){
                data[selects[i].attr("name")] = selects[i].attr("value");
            }
            if (data['cls'] == ""){
                alert("结束工作失败，请填写好工作日志！");
                return;
            }
            else {
                endTime = new Date();
                data["st_time"] = startTime;
                data["ed_time"] = endTime;
                data["std"] = sid;
                data["date"] = endTime.toLocaleDateString();
                var sh = startTime.getHours();
                var sm = startTime.getMinutes();
                var eh = endTime.getHours();
                var em = endTime.getMinutes();
                var hour = eh - sh;
                if (em - sm >= 40) hour ++;
                else if (em - sm < -20) hour --;
                data["hour"] = hour;
            }
            var tmp = action["end"](data);
            if (tmp) {
                check_code = "";
                stopclock();
                $("#time").replaceWith("<h4 id='time'>0:0:0</h4>");      
                $("#status").replaceWith("<td style='width:70%;' id='status'>未开始</td>");                
            }
            else {
                alert("结束工作失败，请再次尝试！");
            }
        });
    });
});

