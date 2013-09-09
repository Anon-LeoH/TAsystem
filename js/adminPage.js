
function _init_() {
    var height = $("#mainContent").height();
    var width = $(window).width();
    $("#info").css("height",height+"px");
    $("#info>div.well").css("height",height+"px");
    $(".header").css("width",width+"px");
}

$(document).ready(function(){
    _init_();
    $('#add-btn').on('click', function(e, data) {
        $('#myModal').modal('toggle');
    });
});
