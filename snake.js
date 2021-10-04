let canvas = document.getElementById('game');
let context = canvas.getContext('2d');
var score = document.getElementById('score');
let grid = 16, pause=false, flag1=true, flag2=true;
let time=200; 
var dx = 0, dy = 0, count=0, highscore=0, interval, paused=false, pastX=0, pastY=0;

    try {
        highscore = JSON.parse(localStorage.highscore);
    }
    catch(e) {
        localStorage.highscore = 0;
    }
    try {
       var snake = JSON.parse(localStorage.snake);
       var apple = JSON.parse(localStorage.apple);
    }
    catch(e) {
        var snake = {
            x:160,
            y:160,
            cells: [{x: 160, y: 160}, {x: 160, y: 160+grid}]
        }
        var apple = {
            x: 320,
            y: 320
        }
    }
    console.log(snake);    
    score.innerHTML='Score: '+(snake.cells.length>2?snake.cells.length-2:0)+', '+' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; HighScore: '+highscore;


cls = ()=>{
    context.clearRect(0, 0, canvas.height, canvas.width);
}

drawApple = ()=> {
    context.fillStyle = 'red';
    context.beginPath();
    context.arc(apple.x+8, apple.y+8, grid/2, 0, 2 * Math.PI);
    context.fill();
}

drawSnake = ()=> {
    context.fillStyle = 'lightgreen';
    snake.cells.map( (cell)=>{
        context.beginPath();
        context.arc(cell.x+grid/2, cell.y+grid/2, grid/2, 0, 2 * Math.PI);
        context.fill();
    });
    context.beginPath();
    context.arc(snake.x+8, snake.y+8, grid/2+1, 0, 2 * Math.PI);
    context.fillStyle = 'darkgreen';
    context.fill();
}

drawApple();
drawSnake();

moveSnake = (dx,dy)=> {
    if(dx==0&&dy==0) return;
    snake.x+= dx; snake.y+= dy;
    if(checkCollision()) {
        clearTimeout(interval);
        return;
    }
    snake.cells.unshift({x: snake.x, y: snake.y});
    if(!ingestion()) snake.cells.pop();
    cls();
    drawSnake();
    saveState();
}

document.addEventListener('keydown', (e)=>{

    if (e.keyCode == 37 ) {
        if(snake.x-grid!=snake.cells[1].x) {
        dx = -grid;
        dy = 0;
        }
    }
    // up arrow key
    else if (e.keyCode == 38 ) {
        if(snake.y-grid!=snake.cells[1].y){
        dy = -grid;
        dx = 0;
        }
    }
    // right arrow key
    else if (e.keyCode == 39 ) {
        if(snake.x+grid!=snake.cells[1].x) {
        dx = grid;
        dy = 0;
        }
    }
    // down arrow key
    else if (e.keyCode == 40 ) {
        if(snake.y+grid!=snake.cells[1].y) {
        dy = grid;
        dx = 0;
        }
    }

})

checkCollision = ()=>{
    if(snake.x<0) {
       snake.x = canvas.width-grid; 
    }
    if(snake.y<0) {
       snake.y = canvas.height-grid;
    }
    if(snake.x>canvas.width-grid) {
        snake.x = 0;
    }
    if(snake.y>canvas.width-grid) {
        snake.y = 0;
    }
    for(i=1; i<snake.cells.length; i++) {
        if(snake.cells[i].x==snake.x&&snake.cells[i].y==snake.y&&snake.cells.length>=4) {
            context.fillStyle = 'red';
            context.font = '20px Arial';
            context.textAlign = 'center'; 
            context.fillText('GAME OVER!', canvas.height/2, canvas.height/2);
            dx=0;dy=0;
            localStorage.clear();
            localStorage.highscore = snake.cells.length-2;
            return true;
        }
    }
}

randomApple = ()=> {
    apple.x = 32*Math.floor((Math.random()*10));
    apple.y = 32*Math.floor((Math.random()*10));

    snake.cells.map((cell)=>{
        if(cell.x==apple.x&&cell.y==apple.y) randomApple();
    })
}

ingestion = ()=> {
    if(snake.x==apple.x&&snake.y==apple.y) {
        randomApple();
        score.innerHTML='Score: '+(snake.cells.length>2?snake.cells.length-2:0)+', '+' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; HighScore: '+highscore;
        return true;
    }
}

iterate = ()=> {
    moveSnake( dx, dy);
    drawApple();
    
    if(snake.cells.length==12&&flag1) {
        clearInterval(interval);
        time=100;
        flag1 = false;
        interval=setInterval(func,time);
        context.fillStyle = 'green';
        context.font = '20px Arial';
        context.textAlign = 'center'; 
        context.fillText('Level Up!', canvas.height/2, canvas.height/2); 
        setTimeout(1000);
    }
    if(snake.cells.length==17&&flag2){
        clearInterval(interval);
        time=50;flag2=false;
        interval = setInterval(func,time);
        context.fillStyle = 'green';
        context.font = '20px Arial';
        context.textAlign = 'center'; 
        context.fillText('Level Up!', canvas.height/2, canvas.height/2); 
        setTimeout(1000);
    }
}

func = ()=>{
    if(paused) {
        context.fillStyle = 'yellow';
        context.font = '20px Arial';
        context.textAlign = 'center'; 
        context.fillText('Paused, press enter to continue!', canvas.height/2, canvas.height/2); 
    }
    else
    iterate();
}

interval = setInterval(func, time);


document.addEventListener("keydown",(e)=> {
    console.log('keydown');
    if(e.keyCode==13) {
        if(!paused)
        pause();
        else {
            paused=false;
            dx = pastX; dy = pastY;
        }
    }
    
});

pause = ()=> {
 pastX = dx; pastY = dy;
 dx=0;dy=0;
 paused=true;
}

saveState = ()=> {
    localStorage.apple = JSON.stringify(apple);
    localStorage.snake = JSON.stringify(snake);
}
