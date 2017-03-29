var canvas = document.getElementById('myCanvas');
var context = canvas.getContext("2d");
var gainNum = 1;
var yPos = 380;

$(document).ready(function () {
    drawStickman(yPos);

    $("#myCanvas").mousedown(function(){
        yPos = 300;
        drawStickman(yPos);
    })
    $("#myCanvas").mouseup(function(){
        yPos = 380;
        drawStickman(yPos);    
        updateGains();
    })

});

function drawStickman(yPos){
    //Clear canvas for next frame
    context.clearRect(0, 0, canvas.width, canvas.height);

    //HEAD
    context.beginPath();
    context.fillStyle = "black"; // #ffe4c4
    context.arc(300, 350, 20, 0, Math.PI * 2, true); 
    context.fill();

    //BODY
    context.beginPath();
    context.moveTo(300,330);
    context.lineTo(280,430);
    context.lineTo(320,430);

    context.lineWidth = 1;
    context.fillStyle = "black";
    context.fill();
    context.strokeStyle = "black";
    context.stroke();

    //BAR
    context.beginPath();
    context.moveTo(200,yPos);
    context.lineTo(400,yPos);
    context.lineWidth = 7;
    context.strokeStyle = "gray";
    context.stroke();

}

function updateGains(){
    $('#gainCount').val(gainNum++); 
}
