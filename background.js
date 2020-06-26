var scrollSpeed = 70;

var current = 0;

var direction = 'h';

var body = document.getElementById("body")

function bgscroll() {

    current -= 1;

    body('body').css("backgroundPosition", (direction == 'h') ? current + "px 0" : "0 " + current + "px");

}

setInterval("bgscroll()", scrollSpeed);