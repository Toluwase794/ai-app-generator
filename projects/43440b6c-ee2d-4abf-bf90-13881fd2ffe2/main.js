const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const messageEl = document.getElementById('message');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Game constants
const GRAVITY = 0.5;
const FLAP_STRENGTH = -8;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const PIPE_SPEED = 2;
const BIRD_SIZE = 34;

// Bird sprite colors
const BIRD_COLOR = '#FFD700';
const BIRD_BORDER = '#DAA520';

// Pipe colors
const PIPE_COLOR = '#228B22';
const PIPE_BORDER = '#006400';

// Ground height
const GROUND_HEIGHT = 80;

// Game state
let bird = {
  x: 80,
  y: HEIGHT / 2,
  velocity: 0
};

let pipes = [];
let frameCount = 0;
let score = 0;
let gameRunning = false;
let gameOver = false;

function resetGame() {
  bird = { x: 80, y: HEIGHT / 2, velocity: 0 };
  pipes = [];
  frameCount = 0;
  score = 0;
  gameRunning = true;
  gameOver = false;
  messageEl.style.display = 'none';
  scoreEl.textContent = 'Score: 0';
}

function drawBird() {
  ctx.save();
  ctx.translate(bird.x, bird.y);
  // rotate bird slightly based on velocity
  const angle = Math.min(Math.max(bird.velocity / 10, -0.5), 0.5);
  ctx.rotate(angle);
  // draw bird as a circle with a beak
  ctx.fillStyle = BIRD_COLOR;
  ctx.strokeStyle = BIRD_BORDER;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, BIRD_SIZE/2, BIRD_SIZE/2 * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // beak
  ctx.beginPath();
  ctx.moveTo(BIRD_SIZE/2, 0);
  ctx.lineTo(BIRD_SIZE/2 + 10, -5);
  ctx.lineTo(BIRD_SIZE/2 + 10, 5);
  ctx.closePath();
  ctx.fillStyle = '#FF8C00';
  ctx.fill();
  ctx.stroke();

  // eye
  ctx.beginPath();
  ctx.fillStyle = '#000';
  ctx.arc(5, -5, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawPipe(pipe) {
  ctx.fillStyle = PIPE_COLOR;
  ctx.strokeStyle = PIPE_BORDER;
  ctx.lineWidth = 3;

  // top pipe
  ctx.beginPath();
  ctx.rect(pipe.x, 0, PIPE_WIDTH, pipe.top);
  ctx.fill();
  ctx.stroke();

  // bottom pipe
  ctx.beginPath();
  ctx.rect(pipe.x, pipe.bottom, PIPE_WIDTH, HEIGHT - pipe.bottom - GROUND_HEIGHT);
  ctx.fill();
  ctx.stroke();
}

function drawGround() {
  ctx.fillStyle = '#DEB887';
  ctx.fillRect(0, HEIGHT - GROUND_HEIGHT, WIDTH, GROUND_HEIGHT);
  ctx.strokeStyle = '#A0522D';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, HEIGHT - GROUND_HEIGHT);
  ctx.lineTo(WIDTH, HEIGHT - GROUND_HEIGHT);
  ctx.stroke();
}

function update() {
  if (!gameRunning) return;

  bird.velocity += GRAVITY;
  bird.y += bird.velocity;

  // Add pipes every 90 frames
  if (frameCount % 90 === 0) {
    const topHeight = Math.random() * (HEIGHT - PIPE_GAP - GROUND_HEIGHT - 100) + 50;
    pipes.push({
      x: WIDTH,
      top: topHeight,
      bottom: topHeight + PIPE_GAP
    });
  }

  // Move pipes
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= PIPE_SPEED;
  }

  // Remove offscreen pipes
  if (pipes.length && pipes[0].x + PIPE_WIDTH < 0) {
    pipes.shift();
    score++;
    scoreEl.textContent = `Score: ${score}`;
  }

  // Collision detection
  if (bird.y + BIRD_SIZE/2 > HEIGHT - GROUND_HEIGHT) {
    // hit ground
    endGame();
  }

  if (bird.y - BIRD_SIZE/2 < 0) {
    // hit top
    bird.y = BIRD_SIZE/2;
    bird.velocity = 0;
  }

  // Check pipes collision
  for (let pipe of pipes) {
    if (
      bird.x + BIRD_SIZE/2 > pipe.x &&
      bird.x - BIRD_SIZE/2 < pipe.x + PIPE_WIDTH
    ) {
      if (bird.y - BIRD_SIZE/2 < pipe.top || bird.y + BIRD_SIZE/2 > pipe.bottom) {
        endGame();
      }
    }
  }

  frameCount++;
}

function endGame() {
  gameRunning = false;
  gameOver = true;
  messageEl.textContent = 'Game Over! Click or press Space to restart';
  messageEl.style.display = 'block';
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Draw pipes
  for (let pipe of pipes) {
    drawPipe(pipe);
  }

  drawGround();
  drawBird();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function flap() {
  if (!gameRunning) {
    resetGame();
  }
  bird.velocity = FLAP_STRENGTH;
}

canvas.addEventListener('click', () => {
  flap();
});

window.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    e.preventDefault();
    flap();
  }
});

messageEl.style.display = 'block';
gameLoop();
