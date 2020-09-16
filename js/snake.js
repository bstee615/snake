// document.addEventListener('DOMContentLoaded', main);

var canvas, context;
var squareSize = 10;

var directionX = 1, directionY = 0;
var widthX = 50, widthY = 30;
var posX = widthX / 2, posY = widthY / 2;
var locations = [];

var pastLocations = [];
var length = 0;
var maxLength = 5;

var stepTimerLength = 100;
var stepTimer;

var appleTimerLength = 1000;
var appleTimer;

var score = -1;

var canPress = true;

var ITEM = {
	EMPTY: 0,
	SNAKE: 1,
	APPLE: 2
};

function gameOver()
{
	console.log('Game over!');
	context.fillStyle = "black";
	context.font = "50px Arial";
	context.fillText("Game Over!", 100, 100);

	context.strokeStyle = 'red';
	context.lineWidth = squareSize*0.75;
	context.beginPath();
	context.moveTo(posX * squareSize - squareSize*0.5, posY * squareSize - squareSize*0.5);
	context.lineTo(posX * squareSize + squareSize*1.5, posY * squareSize + squareSize*1.5);
	context.moveTo(posX * squareSize + squareSize*1.5, posY * squareSize - squareSize*0.5);
	context.lineTo(posX * squareSize - squareSize*0.5, posY * squareSize + squareSize*1.5);
	context.stroke();

	clearInterval(stepTimer);
	clearInterval(appleTimer);
}

function incrementScore()
{
	score ++;
	maxLength ++;
	// Update text label
	document.getElementById('scoreDisplay').innerText = 'Score: ' + score;
}

function setStepTimer(newInterval)
{
	if (stepTimer !== undefined) {
		clearInterval(stepTimer);
		stepTimerLength = newInterval;
		stepTimer = setInterval(step, stepTimerLength);
	}
}

function step()
{
	// Save this position
	pastLocations.push([posX, posY]);

	posX += directionX;
	posY += directionY;

	if (posX < 0 || // Out of bounds
		posY < 0 ||
		posX >= widthX ||
		posY >= widthY ||
		locations[posX][posY] == ITEM.SNAKE // Already stepped here
		) {
		gameOver();
	}
	else {
		if (locations[posX][posY] == ITEM.APPLE) {
			incrementScore();
		}

		locations[posX][posY] = ITEM.SNAKE;
		drawSquare(posX, posY);

		// Clear a square if needed.
		if (length >= maxLength) {
			var loc = pastLocations.shift();
			drawSquare(loc[0], loc[1], "white");
			locations[loc[0]][loc[1]] = ITEM.EMPTY;
		}
		else {
			length ++;
		}
	}
	
	canPress = true;
}

function drawSquare(x, y, color = "#000000")
{
	// console.log('drawing square at', x, y);
	x *= squareSize; y *= squareSize;

	context.fillStyle = color;
	context.fillRect(x, y, squareSize, squareSize);
}

function drawApple()
{
	var randX = Math.floor(Math.random() * widthX);
	var randY = Math.floor(Math.random() * widthY);
	while (locations[randX][randY] == ITEM.SNAKE) {
		randX = Math.floor(Math.random() * widthX);
		randY = Math.floor(Math.random() * widthY);
	}

	drawSquare(randX, randY, "#FF0000");
	locations[randX][randY] = ITEM.APPLE;
}

function main()
{
	// Set up canvas
	canvas = document.getElementById('snakeCanvas');
	canvas.width = widthX * squareSize;
	canvas.height = widthY * squareSize;
	context = canvas.getContext('2d');
	
	// Set up key input
	document.addEventListener('keydown', handleKeyDown);
	
	// Set up past locations
	for (var i = 0; i < widthX; i ++) {
		locations.push(new Array(canvas.height));
		for (var j = 0; j < widthY; j ++) {
			locations[i].push(ITEM.EMPTY);
		}
	}
	
	// Start the game
	drawSquare(posX, posY);
	stepTimer = setInterval(step, stepTimerLength);
	appleTimer = setInterval(drawApple, appleTimerLength);
	incrementScore();
}

function handleKeyDown(event)
{
	if (!canPress) {
		return;
	}

	switch (event.key) {
		case 'w':
		case 'ArrowUp':
		if (directionY != 1) {
			directionX = 0;
			directionY = -1;
			canPress = false;
		}
		break;
		
		case 's':
		case 'ArrowDown':
		if (directionY != -1) {
			directionX = 0;
			directionY = 1;
			canPress = false;
		}
		break;
		
		case 'a':
		case 'ArrowLeft':
		if (directionX != 1) {
			directionX = -1;
			directionY = 0;
			canPress = false;
		}
		break;
		
		case 'd':
		case 'ArrowRight':
		if (directionX != -1) {
			directionX = 1;
			directionY = 0;
			canPress = false;
		}
		break;
	}
}
