const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");

// define game variables
let gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = spawnFood();
let highScore = 0;
let direction = "right";
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

// draw game map , snake , food
function draw() {
  board.innerHTML = "";
  drawSnake();
  drawFood();
  updateScore();
}

function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

// creating a snake cube or food a food cube on the board

function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// setting the position of the snake and food

function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement("div", "food");
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}

function spawnFood() {
  let randomX = Math.floor(Math.random() * gridSize) + 1;
  let randomY = Math.floor(Math.random() * gridSize) + 1;
  return {
    x: randomX,
    y: randomY,
  };
}

// moving the snake

function moveTheSnake() {
  const head = { ...snake[0] };
  switch (direction) {
    case "right":
      head.x++;
      break;
    case "left":
      head.x--;
      break;
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
  }
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = spawnFood();
    increaseSpeed();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      moveTheSnake();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

function startGame() {
  gameStarted = true;
  instructionText.style.display = "none";
  logo.style.display = "none";
  gameInterval = setInterval(() => {
    moveTheSnake();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

//keep-press event listener

function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === "Space") ||
    (!gameStarted && event.key === " ")
  ) {
    startGame();
  } else {
    switch (event.key) {
      case "ArrowUp":
        direction = "up";
        break;
      case "ArrowDown":
        direction = "down";
        break;
      case "ArrowLeft":
        direction = "left";
        break;
      case "ArrowRight":
        direction = "right";
        break;
    }
  }
}

document.addEventListener("keydown", handleKeyPress);

function increaseSpeed() {
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

function checkCollision() {
  const head = snake[0];

  // collision check with walls
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  // collision check with itself
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [
    {
      x: 10,
      y: 10,
    },
  ];
  food = spawnFood();
  direction = "right";
  gameSpeedDelay = 200;
  updateScore();
}

function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, "0");
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = "block";
  logo.style.display = "block";
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, "0");
  }
  highScoreText.style.display = "block";
}
