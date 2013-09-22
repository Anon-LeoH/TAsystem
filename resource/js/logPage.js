
function _init_() {
    var height = $("#mainContent").height();
    var width = $(window).width();
    $("#info").css("height",height+"px");
    $(".well").css("height",height+"px");
    $(".header").css("width",width+"px");
}

$(document).ready(function(){
    _init_();
    $('a.info-btn').on('click', function(e, data) {
        var target = $(e.target).parent();
		var lid = target.attr("id");
		$.ajax({
            type     : "get",
            url      : "/logInfo",
            data     : { "lid" : lid,},
            success  : function(data) {
                           if (data.info == "success"){
                               $("#sid").replaceWith("<p id='sid'>" + data.sid + "</p>");
							   $("#date").replaceWith("<p id='date'>" + data.date + "</p>");
							   $("#st").replaceWith("<p id='st'>" + data.st + "</p>");
							   $("#ed").replaceWith("<p id='ed'>" + data.ed + "</p>");
							   $("#hour").replaceWith("<p id='hour'>" + data.hour + "</p>");
							   $("#cls").replaceWith("<p id='cls'>" + data.cls + "</p>");
							   $("#log").replaceWith("<p id='log'>" + data.log + "</p>");
							   $('#myModal').modal('show');
                           }
                           else {
                               alert("服务器出错，请稍后再次尝试！");
                           }
                      },
            error    : function() {
                           alert("无法链接服务器！");
            },
            dataType : 'json',
            async    : false,
        });
    });
});

