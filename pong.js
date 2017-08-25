var board;
function start() { 
    board.start();
    playerPaddle = new paddle(25, 100, 'white', 25, (board.canvas.height/2), 'player');
    aiPaddle = new paddle(25, 100, 'white', (board.canvas.width - 50), (board.canvas.height/2), 'ai');
    ball = new ball(15, 15, "white", (board.canvas.width/2), (board.canvas.height/2));
}

var board = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateBoard, 5);
        window.addEventListener('keydown', function(e) {
            board.key = e.keyCode;
        });
        window.addEventListener('keyup', function(e) {
            board.key = false;
        });
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function move(key, paddle){
    if(key && key === 87){
        paddle.speedY -= 5;
    }else if(key && key === 83){
        paddle.speedY += 5;
    }
}

function moveBall(ball){
    ball.speedY = 1;
    ball.speedX = 1;
}

function updateBall(ball){
    if(ball.x > board.canvas.width){
        ball.x = board.canvas.width/2;
        ball.y = board.canvas.height/2;
    }else if(ball.x < board.canvas.width){
        ball.x = board.canvas.width/2;
        ball.y = board.canvas.height/2;
    }else{
        ball.x += ball.speedX;
        ball.y += ball.speedY;
    }
}

function paddle(width, height, color, x, y, name){
    this.name = name;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.update = function(){
        ctx = board.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        if(this.y < 0 - this.height){
            this.y = board.canvas.height;
        }else if(this.y > board.canvas.height){
            this.y = 0 - this.height;
        }else{
            this.x += this.speedX;
            this.y += this.speedY;
        }        
    }
    
}

function ball(width, height, color, x, y){
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 1;
    this.speedY = 1;
    this.update = function(){
        ctx = board.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        if(this.y < 0){
            this.speedY = 1;
            this.y += this.speedY;
        }else if(this.y > board.canvas.height - this.height){
            this.speedY = -1;
            this.y += this.speedY            
        }else if(this.x > board.canvas.width){
            this.x = board.canvas.width/2;
            this.y = board.canvas.height/2;
            this.speedY = randomSpeed();
            this.speedX = randomSpeed();
        }else if(this.x < 0 - this.width){
            this.x = board.canvas.width/2;
            this.y = board.canvas.height/2;
            this.speedY = randomSpeed();
            this.speedX = randomSpeed();
        }else{
            this.x += this.speedX;
            this.y += this.speedY;
        }        
    }
    this.deflect = function(paddle) {
        if(paddle.name === "player" && this.x === paddle.x + paddle.width){
            if(this.y >= paddle.y && this.y <= paddle.y + paddle.height){
                this.speedX = this.speedX * -1;
                this.x += this.speedX;
            }            
        }else if(paddle.name === "ai" && this.x === paddle.x - 10){
            if(this.y >= paddle.y && this.y <= paddle.y + paddle.height){
                this.speedX = this.speedX * -1;
                this.x += this.speedX;
            }
        }
    }    
}

function randomSpeed(){
    var number = Math.random() < 0.5 ? -1 : 1;
    return number;
}

function updateBoard(){
    board.clear();
    playerPaddle.speedY = 0;
    aiPaddle.speedY = 0;
    move(board.key, playerPaddle);
    move(board.key, aiPaddle);
    playerPaddle.newPos();
    playerPaddle.update();
    aiPaddle.newPos();
    aiPaddle.update();
    ball.newPos();
    ball.update();
    ball.deflect(aiPaddle);
    ball.deflect(playerPaddle);
}

window.onload = start();