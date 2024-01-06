/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const collisionCanvas = document.getElementById("collisionCanvas");
const collisionCtx = collisionCanvas.getContext("2d");
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;
let score = 0;
ctx.font = "50px Impact";
let gameOver = false;

let ravens = [];
class Raven {
  constructor() {
    this.image = new Image();
    this.image.src = "assets/raven.png";
    this.spriteWidth = 271;
    this.spriteHeight = 194;
    this.sizeModifier = Math.random() * 0.6 + 0.4;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);
    this.directionX = Math.random() * 5 + 3;
    this.directionY = Math.random() * 5 - 2.5;
    this.isMarkedForDeletion = false;
    this.frame = 0;
    this.maxFrame = 4;
    this.timeSinceFlap = 0;
    this.flapInterval = Math.random() * 50 + 50;
    this.randomColors = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ];
    this.color = `rgb(${this.randomColors[0]},${this.randomColors[1]},${this.randomColors[2]})`;
  }

  update(deltaTime) {
    this.x -= this.directionX;
    this.y += this.directionY;

    if (this.y < 0 || this.y > canvas.height - this.height) {
      this.directionY = this.directionY * -1;
    }

    if (this.x < 0 - this.width) this.isMarkedForDeletion = true;
    this.timeSinceFlap += deltaTime;

    if (this.timeSinceFlap > this.flapInterval) {
      if (this.frame > this.maxFrame) this.frame = 0;
      else this.frame++;

      this.timeSinceFlap = 0;
    }

    if (this.x < 0 - this.width) gameOver = true;
  }

  draw() {
    collisionCtx.fillStyle = this.color;
    collisionCtx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

let explosions = [];
class Explosion {
  constructor(x, y, size) {
    this.image = new Image();
    this.image.src = "assets/boom.png";
    this.sound = new Audio();
    this.sound.src = "assets/fire-impact.wav";
    this.spriteWidth = 1000 / 5;
    this.spriteHeight = 179;
    this.size = size;
    this.x = x;
    this.y = y;
    this.frame = 0;
    this.timeSinceLastFrame = 0;
    this.frameInterval = 100;
  }

  update(deltaTime) {
    if (this.frame === 0) this.sound.play();

    this.timeSinceLastFrame += deltaTime;

    if (this.timeSinceLastFrame > this.frameInterval) {
      this.frame++;
      this.timeSinceLastFrame = 0;
      if (this.frame > 5) this.isMarkedForDeletion = true;
    }
  }

  draw() {
    ctx.drawImage(
      this.image,
      this.spriteWidth * this.frame,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.size,
      this.size
    );
  }
}

function drawScore() {
  ctx.fillStyle = "gray";
  ctx.fillText("Score " + score, 50, 75);
}

function drawGameOver() {
  ctx.textAlign = "center";
  ctx.fillStyle = "gray";
  ctx.fillText(
    "GAME OVER, your score is " + score,
    canvas.width / 2,
    canvas.height / 2
  );
}

window.addEventListener("click", (event) => {
  const detectPixelColor = collisionCtx.getImageData(event.x, event.y, 1, 1);
  const pc = detectPixelColor.data;
  ravens.forEach((raven) => {
    if (
      raven.randomColors[0] === pc[0] &&
      raven.randomColors[1] === pc[1] &&
      raven.randomColors[2] === pc[2]
    ) {
      raven.isMarkedForDeletion = true;
      score++;
      explosions.push(new Explosion(raven.x, raven.y, raven.width));
    }
  });
});

function animate(timestamp = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextRaven += deltaTime;
  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Raven());
    timeToNextRaven = 0;
    ravens.sort((a, b) => a.width - b.width);
  }

  drawScore();

  [...ravens, ...explosions].forEach((raven) => raven.update(deltaTime));
  [...ravens, ...explosions].forEach((raven) => raven.draw());
  ravens = ravens.filter((raven) => !raven.isMarkedForDeletion);
  explosions = explosions.filter((raven) => !raven.isMarkedForDeletion);

  if (!gameOver) requestAnimationFrame(animate);
  else drawGameOver();
}

animate();
