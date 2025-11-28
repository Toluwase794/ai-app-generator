const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restart-btn');

const gridSize = 20; // number of cells per row and column
const cellSize = canvas.width / gridSize; // pixel size of each cell

// Directions
const directions = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
};

let snake = [];
let direction = directions.ArrowRight;
let nextDirection = direction;
let apple = null;
let gameOver = false;
let gameWin = false;
let gameLoopId = null;

function initGame() {
  snake = [
    { x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) }
  ];
  direction = directions.ArrowRight;
  nextDirection = direction;
  apple = generateApple();
  gameOver = false;
  gameWin = false;
  statusEl.textContent = 'Use arrow keys to move the snake.';
  if (gameLoopId) clearInterval(gameLoopId);
  gameLoopId = setInterval(gameLoop, 100);
  draw();
}

function generateApple() {
  let position;
  do {
    position = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };
  } while (snake.some(segment => segment.x === position.x && segment.y === position.y));
  return position;
}

function gameLoop() {
  if (gameOver || gameWin) {
    clearInterval(gameLoopId);
    return;
  }

  // Update direction
  direction = nextDirection;

  // Calculate new head position
  const head = snake[0];
  const newHead = { x: head.x + direction.x, y: head.y + direction.y };

  // Check wall collision
  if (
    newHead.x < 0 || newHead.x >= gridSize ||
    newHead.y < 0 || newHead.y >= gridSize
  ) {
    endGame(false);
    return;
  }

  // Check self collision
  if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
    endGame(false);
    return;
  }

  // Add new head
  snake.unshift(newHead);

  // Check apple collision
  if (newHead.x === apple.x && newHead.y === apple.y) {
    // Grow snake (do not remove tail)
    if (snake.length === gridSize * gridSize) {
      // Filled entire arena
      endGame(true);
      return;
    }
    apple = generateApple();
  } else {
    // Remove tail
    snake.pop();
  }

  draw();
}

function endGame(won) {
  gameOver = !won;
  gameWin = won;
  if (won) {
    statusEl.textContent = 'You won! The snake filled the entire arena!';
  } else {
    statusEl.textContent = 'Game Over! You hit the wall or your tail.';
  }
}

function draw() {
  // Clear canvas
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw apple
  ctx.fillStyle = '#e74c3c';
  ctx.beginPath();
  const appleX = apple.x * cellSize + cellSize / 2;
  const appleY = apple.y * cellSize + cellSize / 2;
  const radius = cellSize / 2.5;
  ctx.arc(appleX, appleY, radius, 0, Math.PI * 2);
  ctx.fill();

  // Draw snake
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? '#27ae60' : '#2ecc71';
    ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);

    // Draw segment border
    ctx.strokeStyle = '#145a32';
    ctx.lineWidth = 1;
    ctx.strokeRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
  });
}

window.addEventListener('keydown', e => {
  if (directions[e.key]) {
    const newDir = directions[e.key];
    // Prevent snake from reversing
    if (snake.length > 1) {
      const head = snake[0];
      const neck = snake[1];
      if (head.x + newDir.x === neck.x && head.y + newDir.y === neck.y) {
        return;
      }
    }
    nextDirection = newDir;
  }
});

restartBtn.addEventListener('click', () => {
  initGame();
});

initGame();
