const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const tileSize = 16;
const rows = 31;
const cols = 28;

// Map legend:
// 0 = empty path
// 1 = wall
// 2 = pellet
// 3 = power pellet
// 4 = ghost house door (treated as path)

const map = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,3,2,2,2,2,2,2,2,2,2,2,1,1,1,2,2,2,2,2,2,2,2,2,2,2,3,1],
  [1,2,1,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,1,2,2,1],
  [1,2,1,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,1,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,2,1],
  [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,1,1,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1,1,1,1,1,1,1],
  [0,0,0,0,0,1,2,1,1,0,0,0,2,1,1,2,0,0,0,1,2,1,0,0,0,0,0,0],
  [1,1,1,1,1,1,2,1,1,0,1,1,2,1,1,2,1,1,0,1,2,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,2,0,0,0,1,1,2,0,0,2,1,1,0,0,2,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,1,1,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,2,1],
  [1,3,2,2,2,2,2,2,2,2,1,1,1,0,0,1,1,2,2,2,2,2,2,2,2,2,3,1],
  [1,1,1,1,1,1,1,1,1,2,1,1,0,0,0,0,1,1,2,1,1,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,1,2,1,1,0,0,0,0,1,1,2,1,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,1,2,2,1],
  [1,3,2,2,1,1,2,2,2,2,2,2,1,1,1,2,2,2,2,2,2,1,1,2,2,2,3,1],
  [1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1],
  [0,0,1,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,1,0,0,0],
  [1,1,1,1,1,1,2,1,0,1,1,1,1,0,0,1,1,1,0,1,2,1,1,1,1,1,1,1],
  [0,0,0,0,0,1,2,0,0,1,0,0,0,0,0,0,0,1,0,0,2,1,0,0,0,0,0,0],
  [1,1,1,1,1,1,2,1,1,1,0,1,1,1,1,1,0,1,1,1,2,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,1,1,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
  [1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Directions
const directions = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
};

// Game state
let score = 0;

// Pac-Man
const pacman = {
  x: 13,
  y: 23,
  dir: { x: 0, y: 0 },
  nextDir: { x: 0, y: 0 },
  mouthOpen: true,
  mouthTimer: 0
};

// Ghosts
const ghostColors = ['#FF0000', '#FFB8FF', '#00FFFF', '#FFB852'];

class Ghost {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.dir = { x: 0, y: 0 };
    this.scatterTarget = { x: 0, y: 0 };
    this.mode = 'scatter'; // scatter or chase
    this.modeTimer = 0;
  }

  move() {
    // Simple random movement for demo
    const possibleDirs = [];
    for (const d of Object.values(directions)) {
      const nx = this.x + d.x;
      const ny = this.y + d.y;
      if (isWalkable(nx, ny) && !(nx === pacman.x && ny === pacman.y)) {
        possibleDirs.push(d);
      }
    }
    if (possibleDirs.length > 0) {
      // Avoid reversing direction
      let filtered = possibleDirs.filter(d => !(d.x === -this.dir.x && d.y === -this.dir.y));
      if (filtered.length === 0) filtered = possibleDirs;
      this.dir = filtered[Math.floor(Math.random() * filtered.length)];
      this.x += this.dir.x;
      this.y += this.dir.y;
    }
  }
}

const ghosts = [
  new Ghost(13, 11, ghostColors[0]),
  new Ghost(14, 11, ghostColors[1]),
  new Ghost(12, 11, ghostColors[2]),
  new Ghost(15, 11, ghostColors[3])
];

function isWalkable(x, y) {
  if (x < 0) x = cols - 1;
  else if (x >= cols) x = 0;
  if (y < 0) y = rows - 1;
  else if (y >= rows) y = 0;
  const tile = map[y][x];
  return tile !== 1;
}

function wrapPosition(pos) {
  let x = pos.x;
  let y = pos.y;
  if (x < 0) x = cols - 1;
  else if (x >= cols) x = 0;
  if (y < 0) y = rows - 1;
  else if (y >= rows) y = 0;
  return { x, y };
}

function updatePacman() {
  // Try to change direction if possible
  const nextPos = { x: pacman.x + pacman.nextDir.x, y: pacman.y + pacman.nextDir.y };
  const wrappedNext = wrapPosition(nextPos);
  if (isWalkable(wrappedNext.x, wrappedNext.y)) {
    pacman.dir = pacman.nextDir;
  }

  // Move pacman
  const newPos = { x: pacman.x + pacman.dir.x, y: pacman.y + pacman.dir.y };
  const wrappedNew = wrapPosition(newPos);
  if (isWalkable(wrappedNew.x, wrappedNew.y)) {
    pacman.x = wrappedNew.x;
    pacman.y = wrappedNew.y;
  }

  // Eat pellets
  if (map[pacman.y][pacman.x] === 2) {
    map[pacman.y][pacman.x] = 0;
    score += 10;
  } else if (map[pacman.y][pacman.x] === 3) {
    map[pacman.y][pacman.x] = 0;
    score += 50;
  }

  // Mouth animation
  pacman.mouthTimer++;
  if (pacman.mouthTimer > 10) {
    pacman.mouthOpen = !pacman.mouthOpen;
    pacman.mouthTimer = 0;
  }
}

function updateGhosts() {
  ghosts.forEach(g => g.move());
}

function checkCollisions() {
  for (const g of ghosts) {
    if (g.x === pacman.x && g.y === pacman.y) {
      // Game over
      alert('Game Over! Your score: ' + score);
      resetGame();
      break;
    }
  }
}

function resetGame() {
  // Reset map pellets
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (map[y][x] === 0) {
        // Refill pellets except walls
        if ((y === 1 || y === 26) && (x === 1 || x === 26)) {
          map[y][x] = 3; // power pellets
        } else if (map[y][x] !== 1) {
          map[y][x] = 2;
        }
      }
    }
  }
  score = 0;
  pacman.x = 13;
  pacman.y = 23;
  pacman.dir = { x: 0, y: 0 };
  pacman.nextDir = { x: 0, y: 0 };
  ghosts[0].x = 13; ghosts[0].y = 11;
  ghosts[1].x = 14; ghosts[1].y = 11;
  ghosts[2].x = 12; ghosts[2].y = 11;
  ghosts[3].x = 15; ghosts[3].y = 11;
}

function drawMap() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const tile = map[y][x];
      const px = x * tileSize;
      const py = y * tileSize;

      if (tile === 1) {
        // Wall
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(px, py, tileSize, tileSize);
        ctx.strokeStyle = '#0000AA';
        ctx.lineWidth = 2;
        ctx.strokeRect(px + 1, py + 1, tileSize - 2, tileSize - 2);
      } else {
        // Path
        ctx.fillStyle = '#000';
        ctx.fillRect(px, py, tileSize, tileSize);

        if (tile === 2) {
          // Pellet
          ctx.fillStyle = '#FFF';
          ctx.beginPath();
          ctx.arc(px + tileSize / 2, py + tileSize / 2, 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (tile === 3) {
          // Power pellet
          ctx.fillStyle = '#FFF';
          ctx.beginPath();
          ctx.arc(px + tileSize / 2, py + tileSize / 2, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }
}

function drawPacman() {
  const px = pacman.x * tileSize + tileSize / 2;
  const py = pacman.y * tileSize + tileSize / 2;
  const radius = tileSize / 2 - 2;

  ctx.fillStyle = '#FFFF00';
  ctx.beginPath();

  let startAngle = 0.25 * Math.PI;
  let endAngle = 1.75 * Math.PI;
  if (!pacman.mouthOpen) {
    startAngle = 0;
    endAngle = 2 * Math.PI;
  }

  // Rotate mouth direction
  let angleOffset = 0;
  if (pacman.dir.x === 1) angleOffset = 0;
  else if (pacman.dir.x === -1) angleOffset = Math.PI;
  else if (pacman.dir.y === 1) angleOffset = 0.5 * Math.PI;
  else if (pacman.dir.y === -1) angleOffset = 1.5 * Math.PI;
  else angleOffset = 0;

  ctx.moveTo(px, py);
  ctx.arc(px, py, radius, startAngle + angleOffset, endAngle + angleOffset, false);
  ctx.closePath();
  ctx.fill();
}

function drawGhosts() {
  ghosts.forEach(g => {
    const px = g.x * tileSize + tileSize / 2;
    const py = g.y * tileSize + tileSize / 2;
    const radius = tileSize / 2 - 2;

    // Body
    ctx.fillStyle = g.color;
    ctx.beginPath();
    ctx.arc(px, py - 2, radius, Math.PI, 0, false);
    ctx.lineTo(px + radius, py + radius);
    ctx.lineTo(px - radius, py + radius);
    ctx.closePath();
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.ellipse(px - 5, py - 3, 4, 6, 0, 0, 2 * Math.PI);
    ctx.ellipse(px + 5, py - 3, 4, 6, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Pupils
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(px - 5 + g.dir.x * 2, py - 3 + g.dir.y * 2, 2, 3, 0, 0, 2 * Math.PI);
    ctx.ellipse(px + 5 + g.dir.x * 2, py - 3 + g.dir.y * 2, 2, 3, 0, 0, 2 * Math.PI);
    ctx.fill();
  });
}

function gameLoop() {
  updatePacman();
  updateGhosts();
  checkCollisions();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  drawPacman();
  drawGhosts();

  document.getElementById('score').textContent = score;

  requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', e => {
  if (directions[e.key]) {
    pacman.nextDir = directions[e.key];
    e.preventDefault();
  }
});

resetGame();
requestAnimationFrame(gameLoop);
