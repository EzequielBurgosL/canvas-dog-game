/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 800;
const numberOfEnemies = 2;
const enemiesArray = [];

let gameFrame = 0;

class Enemy {
  constructor(spriteWidth, spriteHeight) {
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.width = this.spriteWidth / 2;
    this.height = this.spriteHeight / 2;
    this.x = Math.random() * (canvas.width - this.width);
    this.y = Math.random() * (canvas.height - this.height);
  }

  draw() {
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

class Enemy1 extends Enemy {
  constructor(spriteWidth, spriteHeight) {
    super(spriteWidth, spriteHeight);
    this.image = new Image();
    this.image.src = "assets/enemy1.png";
    this.frame = 0;
    this.flapSpeed = Math.floor(Math.random() * 2 + 1);
  }

  update() {
    if (gameFrame % this.flapSpeed === 0) {
      this.x += Math.random() * 5 - 2.5;
      this.y += Math.random() * 5 - 2.5;
      this.frame > 4 ? (this.frame = 0) : this.frame++;
    }
  }
}

class Enemy2 extends Enemy {
  constructor(spriteWidth, spriteHeight) {
    super(spriteWidth, spriteHeight);
    this.image = new Image();
    this.image.src = "assets/enemy2.png";
    this.frame = 0;
    this.speed = Math.random() * 4 + 1;
    this.flapSpeed = Math.floor(Math.random() * 2 + 1);
    this.angle = 0;
    this.angleSpeed = Math.random() * 0.2;
    this.verticalMovementRange = Math.random() * 5;
  }

  update() {
    this.x -= this.speed;
    this.y += this.verticalMovementRange * Math.sin(this.angle);
    this.angle += this.angleSpeed;

    const isOutOfCanvas = this.x + this.width < 0;

    if (isOutOfCanvas) {
      this.x = canvas.width;
      this.y = Math.random() * (canvas.height - this.height);
      this.speed = Math.random() * 4 + 1;
    }

    if (gameFrame % this.flapSpeed === 0) {
      this.frame > 4 ? (this.frame = 0) : this.frame++;
    }
  }
}

for (let i = 0; i < numberOfEnemies; i++) {
  enemiesArray.push(new Enemy1(293, 219));
  enemiesArray.push(new Enemy2(266, 188));
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  enemiesArray.forEach((enemy) => {
    enemy.draw();
    enemy.update();
  });
  requestAnimationFrame(animate);
  gameFrame++;
}

animate();
