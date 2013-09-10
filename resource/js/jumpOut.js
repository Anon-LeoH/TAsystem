function jumpOut() {
    window.location.href="/home";
}

$(document).ready(function(){
    var se=setInterval("jumpOut()",3000);
});

