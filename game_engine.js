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
let dx = 0;
let dy = -2;
const ballRadius = 10;

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleAngleOffset = 10;
let isRightPressed = false;
let isLeftPressed = false;

let interval = 0;
let score = 0;
let lives = 3;

const brickRowCount = 4;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 40;
const brickOffsetLeft = 30;
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 }; //add status to indicate whether we want to paint each brick on the screen or not.
    }
}

function collisionDetectionBorder() {
    if (y + dy < brickOffsetTop) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius * 1.5) {
        //check whether the center of the ball is between the left and right edges of the paddle
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            collisionDetectionPaddleAngle();
        } else if (y + dy > canvas.height) {
            lives--;
            if (!lives) {
                alert("GAME OVER!");
                document.location.reload();
                //clearInterval(interval);
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 0;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
}

function collisionDetectionPaddleAngle() {
    if (x > paddleX && x < paddleX + paddleAngleOffset) {
        dx = (dx - Math.random() * 3) * 0.9;
    }
    if (x > paddleX && x < paddleX + paddleAngleOffset && isLeftPressed) {
        dx = dx - Math.random() * 3;
    }
    if (x > paddleX + paddleWidth - paddleAngleOffset && x < paddleX + paddleWidth) {
        dx = (dx + Math.random() * 3) * 0.9;
    }
    if (x > paddleX + paddleWidth - paddleAngleOffset && x < paddleX + paddleWidth && isRightPressed) {
        dx = dx + Math.random() * 3;
    }
}

function collisionDetectionBrick() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) { //check only on the ones on screen, otherwise you'll have invisible bricks
                if (y + dy > b.y && y + dy < b.y + brickHeight && x + dx > b.x && x + dx < b.x + brickWidth) {
                    dy = -dy;
                    b.status = 0;
                    score += 100;
                    if (score === brickColumnCount * brickRowCount * 100) {
                        alert("YOU WIN!");
                        document.location.reload();
                        //clearInterval(interval);
                    }
                }
            }
        }
    }
}

//separate functions
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2, false);
    ctx.fillStyle = "#000066";
    ctx.fill();
    ctx.strokeStyle = "#f9b3ff";
    ctx.stroke();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#538cc6";
    ctx.fill();
    ctx.strokeStyle = "#8debf2";
    ctx.stroke();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#ff8000";
                ctx.fill();
                ctx.strokeStyle = "#ffcc66";
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, brickOffsetTop - ballRadius);
    ctx.fillStyle = "#b3daff";
    ctx.fill();
    ctx.strokeStyle = "#9dbedd";
    ctx.stroke();
    ctx.closePath();
    ctx.font = "16px Impact";
    ctx.fillStyle = "#fff";
    ctx.fillText(`Score: ${score}`, 8, 20);
    ctx.strokeStyle = "#5e95ed";
    ctx.strokeText(`Score: ${score}`, 8, 20);
}

function drawLives() {
    ctx.font = "16px Impact";
    ctx.fillStyle = "#fff";
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
    ctx.strokeStyle = "#5e95ed";
    ctx.strokeText(`Lives: ${lives}`, canvas.width - 65, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle();
    drawBall();    
    drawBricks();
    drawScore();
    drawLives();
    collisionDetectionBrick();
    collisionDetectionBorder();
    x += dx;
    y += dy;
    //refactor with Math.min and Math.max
    if (isRightPressed && paddleX + paddleWidth < canvas.width) {
        paddleX += 5;
    } else if (isLeftPressed && paddleX > 0) {
        paddleX -= 5;
    }

    requestAnimationFrame(draw);
    /*
    The draw() function is now getting executed again and again within a requestAnimationFrame() loop,
    but instead of the fixed 10 milliseconds frame rate, we are giving control of the frame rate back 
    to the browser. It will sync the frame rate accordingly and render the shapes only when needed. 
    This produces a more efficient, smoother animation loop than the older setInterval() method.
    */
}

function startGame() {
    document.addEventListener("keydown", keyDownHandler, false); //When the keydown/keyup event is fired on any of the keys on your 
    document.addEventListener("keyup", keyUpHandler, false);     //keyboard the keyDownHandler() function will be executed.
    function keyDownHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            isRightPressed = true;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            isLeftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            isRightPressed = false;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            isLeftPressed = false;
        }
    }

    document.addEventListener("mousemove", mouseMoveHandler, false);
    function mouseMoveHandler(e) {
        const relativeX = e.clientX - canvas.offsetLeft; //e.clientX = horizontal mouse position in the viewport
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }

    //interval = setInterval(draw, 10); //The draw() function will be executed within setInterval every 10 milliseconds
    draw();

}
//add start game button logic
document.getElementById("runButton").addEventListener("click", function () {
    startGame();
    this.disabled = true;
});