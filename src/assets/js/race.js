/* get game wrap */
var getReaceWrap = document.getElementById('raceWrap');

/* get canvas */
var getRace = document.getElementById('race');
var rCtx = getRace.getContext('2d');

/* canvas size */
var canvasWidth = getRace.width;
var canvasHeight = getRace.height;

/* size for one block. 
through this block we draw car and bot car, move the car, draw borders and indent*/
var block = 10;

/* set cols and rows */
var getColumns = canvasWidth / block;

/* get body for car movement */
var getBody = document.body;

/* game score */
var score = 0;

/* get game score and reset it */
var getScore = 0;

/* game speed */
var speed = 20;

/* game lvl */
var lvl = 1;

/* in this var we set game speed, score and  lvl (function startGame) */
var setRaceInterval;

/* mobile controls */
var moveLeft = document.getElementById('leftMove');
var moveRight = document.getElementById('rightMove');

/* direction for movements */
var directions = {
    68: 'right',
    65: 'left',
}

/* restart / play  button */
var getRestartBtn = document.getElementById('restartRace');
var getPlayBtn = document.getElementById('startGame');


/*  
** GAME BORDERS
*/
function addBorders() {
    rCtx.fillStyle = '#0770BB';

    // borders by clockwise
    rCtx.fillRect(0, 0, canvasWidth, block);
    rCtx.fillRect(canvasWidth - block, 0, block, canvasHeight);
    rCtx.fillRect(0, canvasHeight - block, canvasWidth, block);
    rCtx.fillRect(0, 0, block, canvasHeight);
}
addBorders();


/*  
** END GAME
*/
function endGame() {
    clearTimeout(setRaceInterval);
    rCtx.font = '30px Montserrat';
    rCtx.fillStyle = '#eee';
    rCtx.textAlign = 'center';
    rCtx.fillText('End Game', canvasWidth / 2, block * 10);
    initCar.isCollision = true;
    getRestartBtn.classList.add('show');
}


/*  
**  SCORE
*/
function outputScore() {
    rCtx.clearRect(block, block, canvasWidth - block * 2, block * 2);
    rCtx.font = '15px Montserrat';
    rCtx.fillStyle = '#EF9B0F';
    rCtx.textAlign = 'left';
    rCtx.fillText('score: ' + score, block + 5, block * 2.5);
}


/* 
** LVL
*/
function outputLvl() {
    rCtx.clearRect(canvasWidth - block * 7, block, block * 5, block * 2.);
    rCtx.font = '15px Montserrat';
    rCtx.fillStyle = '#EF9B0F';
    rCtx.textAlign = 'left';
    rCtx.fillText('level: ' + lvl, canvasWidth - block * 7, block * 2.5)
}


/* 
** INCREASE SCORE AND CHANGE GAME SPEED
speed and lvl changes every 20 seconds
*/
function setScoreAndSpeed() {
    var scoreInterval = setInterval(function () {
        score += 5;
        getScore += 5;
        if (getScore >= 100) {
            getScore = 0;
            lvl++;
            speed -= 2;
            speed <= 2 ? speed = 2 : speed;
            return speed;
        }
    }, 1000);
}


/* 
** CONSTRUCTOR CarParts (via this one we draw car)
*/
function CarParts(col, row) {
    this.col = col;
    this.row = row;

    /* draw car */
    this.draw = function () {
        var x = this.col;
        var y = this.row;
        rCtx.fillRect(x, y, block * 3, block * 5);
    }
}


/* 
** CONSTRUCTOR Car
*/
function Car() {

    // set start position for car
    this.x = canvasWidth / 2 - block;
    this.y = canvasHeight - block * 8;

    /* if collision happens (check function checkCollisions ) we change value to true 
    and ending game (check function endGame )
    */
    this.isCollision = false;

    /* CREATE CAR VIA CONSTRUCTOR CarParts */
    this.car = new CarParts(this.x, this.y, block * 3, block * 5);

    /* GET CAR POSITION. chnage it when pressing controll buttons, coliision check. */
    this.carPosition = function () {

        // for setting new car position
        var moveCar;

        /* draw car when it change position */
        rCtx.fillStyle = '#023560';
        moveCar = new CarParts(this.x, this.y, block * 3, block * 5);
        rCtx.fillRect(this.x, this.y, block * 3, block * 5);

        // prototype for adding borders (just visual effect)
        this.carDecoration();

        // if car collided with a border
        if (this.x > canvasWidth - block * 4 || this.x < block) {
            this.isCollision = true;
            endGame();
        }
    }
}


/* 
** RETURN COORDS FOR CHECKING COLIISION (check function checkCollisions) 
*/
Car.prototype.carCoords = function () {
    var carCoords = {
        x: this.x,
        y: this.y
    };
    return carCoords;
}


/*
** CAR DECORATION 
*/
Car.prototype.carDecoration = function () {
    // car decoration white block
    rCtx.fillStyle = '#eee';
    rCtx.fillRect(this.x + block, this.y + block * 2, block, block * 2);

    // car decoration white borders by clockwise
    rCtx.fillRect(this.x, this.y, block * 3, 1);
    rCtx.fillRect(this.x + block * 3 - 1, this.y, 1, block * 5);
    rCtx.fillRect(this.x, this.y + block * 5 - 1, block * 3, 1);
    rCtx.fillRect(this.x, this.y, 1, block * 5);
}


/*
** DRAW CAR 
*/
Car.prototype.drawCar = function () {
    rCtx.fillStyle = '#023560';
    this.car.draw();
    this.carDecoration();
}


/* 
** CAR CONTROLLERS (PC)
*/
Car.prototype.pcControllers = function (key) {

    // movement left / right
    if (key == 'left') {
        this.x -= block;
        rCtx.clearRect(this.x + block, this.y, block * 3, block * 5);
    } else { }

    if (key == 'right') {
        this.x += block;
        rCtx.clearRect(this.x - block, this.y, block * 3, block * 5);
    } else { }

    // check car position 
    this.carPosition();
}


/* 
** CAR CONTROLLERS (MOBILE)
*/
Car.prototype.mobileControllers = function (target) {
    if (target.classList.contains('move-left')) {
        this.x -= block;
        rCtx.clearRect(this.x + block, this.y, block * 3, block * 5);
    } else { }

    if (target.classList.contains('move-right')) {
        this.x += block;
        rCtx.clearRect(this.x - block, this.y, block * 3, block * 5);
    } else { }

    // check car position
    this.carPosition();
}


/* 
** INIT CONSTRUCTOR Car 
*/
var initCar = new Car();
initCar.drawCar();


/* 
** CONSTRUCTOR Bots 
*/
function Bots(x, y) {

    // x and y coords
    this.x = x;
    this.y = y;

    // speed for y
    this.speed = 1;

    /* DRAW BOT */
    this.drawBots = function () {

        // bot car body
        rCtx.fillStyle = '#333';
        rCtx.fillRect(this.x, this.y, block * 3, block * 5);

        // bot decoration (orange block)
        rCtx.fillStyle = '#EF9B0F';
        rCtx.fillRect(this.x + block, this.y + block * 2, block, block * 2);

        // bot decoration (white borders)
        rCtx.fillRect(this.x, this.y, block * 3, 1);
        rCtx.fillRect(this.x + block * 3 - 1, this.y, 1, block * 5);
        rCtx.fillRect(this.x, this.y + block * 5 - 1, block * 3, 1);
        rCtx.fillRect(this.x, this.y, 1, block * 5);
    }


    /* RETURN BOT STEP FOR CHECKING COLLISIONS (check function checkCollisions)*/
    this.botStep = function () {
        var coords = {
            x: this.x,
            y: this.y
        }
        return coords;
    }


    /* BOT MOVEMENT */
    this.moveBots = function () {

        rCtx.clearRect(this.x, this.y, block * 3, block * 5);
        this.y += this.speed;

        // repeat animation when bot goes outside game border
        if (this.y > canvasHeight) {

            // setting y coords
            this.y = block * 2;

            /* setting x coords. Generating random number between 1 and 16 and multiply it  on 10. because canvas width is 200 - 20 (borders from each side) available canvas width is 180. So 160(max random number) + 20(bot width) = 180. So now we sure that bot position will be correct  (from 10 to 160)  */
            var setCoordX = Math.floor(Math.random() * (getColumns - 4)) + 1;
            this.x = setCoordX * block;
        }
        this.drawBots();
    }
}


/* 
** GENERATED NUMBERS BETWEEN MIN AND MAX
*/
function setMinAndMax(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// array for creating bots
var botsCreator = [];

// array with coords for each bot
var setBotCoords = [
    setMinAndMax(-10, -10),
    setMinAndMax(2, 3),
    setMinAndMax(14, 15)
];

// push bot to botsCreator array
function outputBots() {
    for (var i = 0; i < setBotCoords.length; i++) {
        var x = Math.floor(Math.random() * (getColumns - 4)) + 1;
        botsCreator.push(new Bots(x * block, setBotCoords[i] * 10, block * 3, block * 5));
    }
}


/* 
** BOT MOVEMENT 
    (we can use methods from bot constructor because we 
    push new Bot Object for creating new bots )
*/
function moveBots() {
    for (var i = 0; i < botsCreator.length; i++) {
        botsCreator[i].moveBots();
    }
    // prevent destroy border by bot when they rich bottom
    addBorders();
}


/* 
** CHEK FOR COLLISIONS
*/
function checkCollisions() {
    /* car coords from CONSTRUCTOR Car.
    type car.x for getting car X coords  */

    var car = initCar.carCoords();
    // array fro bot coords
    var getBotCoords = [];

    /* get bot coords (dynamic) */
    for (var i = 0; i < setBotCoords.length; i++) {
        getBotCoords.push(botsCreator[i].botStep());
    }

    /* get bot coords */
    for (var key in getBotCoords) {
        // coord X
        var botX = getBotCoords[key].x;
        // coord Y
        var botY = getBotCoords[key].y;

        /* if boot in diapasone check coord botX and car.x
            Why 27 and 37
                canvas height = 400;
                car position = 320 from top
                bot length = 50;

            So: 270 + 50 = 320
            So: 320 + 50 = 370

            Checking will be strictly in needed coords    
        */
        if (botY >= block * 27 && botY <= block * 37) {

            // if direct collision
            if (botX == car.x) {
                endGame();

                // cheking left part of the car 
            } else if (botX + block * 2 == car.x) {
                endGame();
            } else if (botX + block == car.x) {
                endGame();

                // cheking right part of the car 
            } else if (botX - block * 2 == car.x) {
                endGame();
            } else if (botX - block == car.x) {
                endGame();
            } else { }
        }
        else { }
    }
}


/* 
** CAR DRIVING BUTTONS (PC)
*/
getBody.addEventListener('keydown', function (e) {
    var direction = directions[e.keyCode];
    if (initCar.isCollision == false && !getReaceWrap.classList.contains('not-active')) {
        initCar.pcControllers(direction);
    } else {
        return false;
    }
});


/* 
** CAR DRIVING BUTTONS (MOBILE)
*/
function mobileControllers(target) {
    if (initCar.isCollision == false && !getReaceWrap.classList.contains('not-active')) {
        initCar.mobileControllers(target);
    } else {
        return;
    }
}

moveLeft.addEventListener('click', function (e) {
    mobileControllers(e.target);
});

moveRight.addEventListener('click', function (e) {
    mobileControllers(e.target);
});


/* 
** INIT GAME via nested setTimeout;
*/
function startGame() {
    setRaceInterval = setTimeout(function movement() {
        setRaceInterval = setTimeout(movement, speed);
        moveBots();
        checkCollisions();
        outputScore();
        outputLvl();
    }, speed);
}


/* 
** PLAY GAME BUTTON
*/
getPlayBtn.addEventListener('click', function () {
    outputBots();
    outputScore();
    outputLvl();
    setScoreAndSpeed()
    startGame()
    this.style.display = 'none';
    getReaceWrap.classList.remove('not-active');
});


/* 
** RESTART GAME BUTTON
*/
getRestartBtn.addEventListener('click', function () {
    rCtx.clearRect(0, 0, canvasWidth, canvasHeight);

    initCar = new Car();
    initCar.drawCar();

    botsCreator = [];
    setBotCoords = [];
    setBotCoords = [setMinAndMax(-10, -10), setMinAndMax(2, 3), setMinAndMax(14, 15)];
    outputBots();

    score = 0;
    speed = 20;
    getScore = 0;
    lvl = 1;

    clearInterval(setRaceInterval);
    startGame();

    this.classList.remove('show');
});