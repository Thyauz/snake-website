const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#score");
const resetButton = document.querySelector("#resetButton");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "#90EE90";
const snakeColor = "white";
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 25;
const difficulty1 = document.querySelector("#speed1");
const difficulty2 = document.querySelector("#speed2");
const difficulty3 = document.querySelector("#speed3");
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
    {x:unitSize * 4, y:0},
    {x:unitSize * 3, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize * 1, y:0},
    {x:0, y:0},
];
let tickSpeed = 150;
let obstacle = [];
const obstacleColor = "blue";

window.addEventListener("keydown", changeDirection);
resetButton.addEventListener("click", resetGame);
difficulty1.addEventListener("click", () => {setSpeed(150);});
difficulty2.addEventListener("click", () => {setSpeed(75);});
difficulty3.addEventListener("click", () => {
    setSpeed(50);
    if(tickSpeed === 50){
        createObstacle();
    }
});

gamestart();
createFood();
drawFood();     

function setSpeed(speed){
    tickSpeed = speed;
}
function gamestart(){
    running = true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    nextTick();
};
function clearBoard(){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};
function nextTick(){
    if(running){
        setTimeout(()=>{
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
            
            if(tickSpeed == 50){
                drawObstacle();
                createObstacle();
            }
        }, tickSpeed);
    }
    else {
        displayGameOver();
    }
};
function createFood(){
    function randomFood(min, max){
        const randNum= Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameHeight - unitSize);
};
function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
};
function moveSnake(){
    const head = {  x: snake[0].x + xVelocity,
                    y: snake[0].y + yVelocity};
    snake.unshift(head);
    
    if(snake[0].x == foodX && snake[0].y == foodY){
        score += 1;
        scoreText.textContent = score;
        createFood();
    }
    else{
        if(isCollisionWithObstacle(snake[0].x, snake[0].y)){
            running = false;
            return;
        }

        snake.pop();
    }
};
function drawSnake(){
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    })
};
function changeDirection(event){
    const keypressed = event.keyCode;
    const up = 38;
    const left = 37;
    const down = 40;
    const right = 39;

    const movingUp = (yVelocity == -unitSize);
    const movingDown = (yVelocity == unitSize);
    const movingRight = (xVelocity == unitSize);
    const movingLeft = (xVelocity == -unitSize);

    switch(true){
        case(keypressed == left && !movingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        
        case(keypressed == up && !movingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
            
        case(keypressed == down && !movingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;

        case(keypressed == right && !movingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;

    }
};
function checkGameOver(){
    switch(true){
        case(snake[0].x < 0):
            running = false;
            break;
        case(snake[0].x >= gameWidth):
            running = false;
            break;
        case(snake[0].y < 0):
            running = false;
            break;
        case(snake[0].y >= gameHeight):
            running = false;
            break;
    }
    for(let i = 1; i < snake.length; i++){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y)
            running = false;
    }
};
function displayGameOver(){
    ctx.font = "50px MV Boli";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", gameWidth/2, gameHeight/2);
    running = false;
};
function resetGame(){
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        {x:unitSize * 4, y:0},
        {x:unitSize * 3, y:0},
        {x:unitSize * 2, y:0},
        {x:unitSize * 1, y:0},
        {x:0, y:0},
    ];
    clearBoard();
    gamestart();
};
function drawObstacle(){
    ctx.fillStyle = obstacleColor;
    obstacle.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, unitSize, unitSize);
    });
}
function createObstacle(){
    obstacle = [];
    for(let i = 0; i < 5; i++){
        const obstacleX = Math.floor(Math.random() * (gameWidth / unitSize)) * unitSize;
        const obstacleY = Math.floor(Math.random() * (gameHeight / unitSize)) * unitSize;
        obstacle.push({x:obstacleX, y:obstacleY});
    }
}
function isCollisionWithObstacle(x, y){
    for (let i = 0; i < obstacle.length; i++){
        if (x === obstacle[i].x && y === obstacle[i].y) {
            return true; 
        }
    }
    return false;
}
