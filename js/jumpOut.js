function jumpOut() {
    window.location.href="/index";
}

$(document).ready(function(){
    var se=setInterval("jumpOut()",3000);
});

