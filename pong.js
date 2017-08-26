var board;
var playerScore = 0;
var aiScore = 0;

//starts the game and generates all pieces
function start() { 
    board.start();
    playerPaddle = new paddle (15, 100, 'white', 25, (board.canvas.height/2), 'player');
    aiPaddle = new paddle(15, 100, 'white', (board.canvas.width - 50), (board.canvas.height/2), 'ai');
    ball = new ball(15, 15, "white", (board.canvas.width/2), (board.canvas.height/2));
}

//create are game board
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
    //clears the board when updating so we don't leave any trails
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //draw dashed line
        this.context.beginPath();
        this.context.setLineDash([5, 5]);
        this.context.moveTo(400, 0);
        this.context.lineTo(400, 625);
        this.context.strokeStyle = 'white';
        this.context.stroke();
        //draw score
        this.context.font = "30px Arial";
        this.context.fillText(playerScore, 325, 30);
        this.context.font = "30px Arial";
        this.context.fillText(aiScore, 450, 30);
    }
}

//controls for player paddle
function move(key, paddle){
    if(key && key === 87){
        paddle.speedY -= 5;
    }else if(key && key === 83){
        paddle.speedY += 5;
    }
}

//controls for ai paddle
function ai(paddle, ball){
    if(paddle.y < ball.y){
        paddle.y += 2;
    }else if(paddle.y > ball.y){
        paddle.y -= 2
    }
}

//paddle constructor
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
    //allows paddles to pass through the canvas appearing at the opposite end
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

//ball constructor function
function ball(width, height, color, x, y){
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 2;
    this.speedY = 2;
    this.update = function(){
        ctx = board.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    //resets the ball when somebody scores also responsible for moving the ball
    this.newPos = function() {
        if(this.y < 0){
            this.speedY = 2;
            this.y += this.speedY;
        }else if(this.y > board.canvas.height - this.height){
            this.speedY = -2;
            this.y += this.speedY            
        }else if(this.x > board.canvas.width){
            this.x = board.canvas.width/2;
            this.y = board.canvas.height/2;
            this.speedY = randomSpeed();
            this.speedX = randomSpeed();
            playerScore++;
        }else if(this.x < 0 - this.width){
            this.x = board.canvas.width/2;
            this.y = board.canvas.height/2;
            this.speedY = randomSpeed();
            this.speedX = randomSpeed();
            aiScore++;
        }else{
            this.x += this.speedX;
            this.y += this.speedY;
        }        
    }

    //deflects the ball off of a paddle
    this.deflect = function(paddle) {
        if((this.x >= paddle.x && this.x <= paddle.x + paddle.width) || (this.x + this.width >= paddle.x && this.x <= paddle.x + paddle.width)){
            if((this.y >= paddle.y && this.y <= paddle.y + paddle.height) || (this.y + this.height >= paddle.y && this.y + this.height <= paddle.y + paddle.height)){
                this.speedX = this.speedX * -1;
                this.x += this.speedX;
            }            
        }
    }    
}

//generates a random number for ball speed (-2 or 2) when resetting the ball
function randomSpeed(){
    var number = Math.random() < 0.5 ? -2 : 2;
    return number;
}
//updates all pieces of the game
function updateBoard(){
    board.clear();
    playerPaddle.speedY = 0;
    aiPaddle.speedY = 0;
    move(board.key, playerPaddle);
    ai(aiPaddle, ball)
    playerPaddle.newPos();
    playerPaddle.update();
    aiPaddle.newPos();
    aiPaddle.update();
    ball.newPos();
    ball.update();
    ball.deflect(aiPaddle);
    ball.deflect(playerPaddle);
}

//start the game when fully loaded
window.onload = start();