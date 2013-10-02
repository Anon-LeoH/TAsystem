function jumpOut() {
    var url = $("a").attr("href");
    window.location.href=url;
}

$(document).ready(function(){
    var se=setInterval("jumpOut()",3000);
});

