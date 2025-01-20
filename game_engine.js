const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d"); //to store the 2D rendering context — the actual tool we can use to paint on the Canvas
/*
ctx.beginPath();
ctx.rect(30, 40, 100, 40);
ctx.strokeStyle = "rgb(0 0 255 / 100%)";
ctx.stroke();
ctx.closePath();

ctx.beginPath();
ctx.arc(240, 160, 30, 0, Math.PI * 2, false);
ctx.fillStyle = "green";
ctx.fill();
ctx.closePath();
*/

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
const ballRadius = 10;

function checkBorderCollision() {
    if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
        dy = -dy;
    }

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
}

//separate functions
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2, false);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    checkBorderCollision();
    x += dx;
    y += dy;
}

function startGame() {
    setInterval(draw, 10); //The draw() function will be executed within setInterval every 10 milliseconds
}
//add start game button logic
document.getElementById("runButton").addEventListener("click", function () {
    startGame();
    this.disabled = true;
});