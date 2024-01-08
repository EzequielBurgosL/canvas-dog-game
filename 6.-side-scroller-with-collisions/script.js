document.addEventListener("DOMContentLoaded", () => {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 720;
  let enemies = [];
  let score = 0;
  let gameOver = false;

  class InputHandler {
    constructor() {
      this.keys = [];
      window.addEventListener("keydown", (event) => {
        if (
          (event.key === "ArrowDown" ||
            event.key === "ArrowUp" ||
            event.key === "ArrowLeft" ||
            event.key === "ArrowRight") &&
          !this.keys.includes(event.key)
        ) {
          this.keys.push(event.key);
        }
      });

      window.addEventListener("keyup", (event) => {
        if (
          event.key === "ArrowDown" ||
          event.key === "ArrowUp" ||
          event.key === "ArrowLeft" ||
          event.key === "ArrowRight"
        ) {
          this.keys.splice(this.keys.indexOf(event.key), 1);
        }
      });
    }
  }

  class Background {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.image = backgroundImage;
      this.x = 0;
      this.y = 0;
      this.width = 2400;
      this.height = 720;
      this.speed = 10;
    }

    draw(context) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
      context.drawImage(
        this.image,
        this.x + this.width - this.speed,
        this.y,
        this.width,
        this.height
      );
    }

    update() {
      this.x -= this.speed;
      if (this.x < 0 - this.width) this.x = 0;
    }
  }

  class Player {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      // this.spriteWidth = 200;
      // this.spriteHeight = 200;
      this.width = 200;
      this.height = 200;
      this.x = 10;
      this.y = this.gameHeight - this.height;
      this.image = playerImage;
      this.maxFrame = 8;
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
      this.frameX = 0;
      this.frameY = 0;
      this.speed = 0;
      this.vy = 0;
      this.weight = 1;
    }

    update(input, deltaTime, enemies) {
      // collision detection
      enemies.forEach((enemy) => {
        const dx = enemy.x + enemy.width / 2 - (this.x + this.width / 2);
        const dy = enemy.y + enemy.height / 2 - (this.y + this.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < enemy.width / 2 + this.width / 2) {
          gameOver = true;
        }
      });

      // sprite animation
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frameX++;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }

      // controls
      if (input.keys.includes("ArrowRight")) {
        this.speed = 5;
      } else if (input.keys.includes("ArrowLeft")) {
        this.speed = -5;
      } else if (input.keys.includes("ArrowUp") && this.onGround()) {
        this.vy -= 32;
      } else {
        this.speed = 0;
      }

      this.x += this.speed;
      // Horizontal movement
      if (this.x < 0) this.x = 0;
      else if (this.x > this.gameWidth - this.width)
        this.x = this.gameWidth - this.width;

      // Vertical movement
      this.y += this.vy;

      if (!this.onGround()) {
        this.vy += this.weight;
        this.maxFrame = 5;
        this.frameY = 1;
      } else {
        this.vy = 0;
        this.maxFrame = 8;
        this.frameY = 0;
        this.y = this.gameHeight - this.height;
      }
    }

    onGround() {
      return this.y >= this.gameHeight - this.height;
    }

    draw(context) {
      context.strokeStyle = "white";
      context.strokeRect(this.x, this.y, this.width, this.height);
      context.beginPath();
      context.arc(
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.width / 2,
        0,
        Math.PI * 2
      );
      context.stroke();

      context.drawImage(
        this.image,
        this.width * this.frameX,
        this.height * this.frameY,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }

  class Enemy {
    constructor(gameWidth, gameHeight) {
      this.image = enemyImage;
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 160;
      this.height = 119;
      this.x = this.gameWidth;
      this.y = this.gameHeight - this.height;
      this.frameX = 0;
      this.maxFrame = 5;
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
      this.speed = 8;
      this.isMarkedForDeletion = false;
    }

    update(deltaTime) {
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frameX++;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }

      this.x -= this.speed;
      if (this.x < 0 - this.width) {
        this.isMarkedForDeletion = true;
        score++;
      }
    }

    draw(context) {
      context.strokeStyle = "white";
      context.strokeRect(this.x, this.y, this.width, this.height);
      context.beginPath();
      context.arc(
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.width / 2,
        0,
        Math.PI * 2
      );
      context.stroke();

      context.drawImage(
        this.image,
        this.frameX * this.width,
        0,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }

  let enemyTimer = 0;
  let enemyInterval = 2000;
  let randomEnemyInterval = Math.random() * 1000 + 500;
  function handleEnemies(deltaTime) {
    if (enemyTimer > enemyInterval + randomEnemyInterval) {
      enemies.push(new Enemy(canvas.width, canvas.height));
      console.log("enemies: ", enemies);

      randomEnemyInterval = Math.random() * 1000 + 500;
      enemyTimer = 0;
    } else {
      enemyTimer += deltaTime;
    }

    enemies.forEach((enemy) => {
      enemy.draw(ctx);
      enemy.update(deltaTime);
    });
    enemies = enemies.filter((enemy) => !enemy.isMarkedForDeletion);
  }

  function displayStatusText(context) {
    context.fillStyle = "black";
    context.font = "40px Helvetica";
    context.fillText("Score " + score, 20, 50);
    context.fillStyle = "white";
    context.font = "40px Helvetica";
    context.fillText("Score " + score, 20, 52);
  }

  function drawGameOver() {
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText(
      "GAME OVER, your score is " + score,
      canvas.width / 2,
      canvas.height / 2
    );
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText(
      "GAME OVER, your score is " + score,
      canvas.width / 2 + 2,
      canvas.height / 2 + 2
    );
  }

  const inputHandler = new InputHandler();
  const background = new Background(canvas.width, canvas.height);
  const player = new Player(canvas.width, canvas.height);

  let lastTime = 0;
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    background.draw(ctx);
    // background.update();
    player.draw(ctx);
    player.update(inputHandler, deltaTime, enemies);
    handleEnemies(deltaTime);
    displayStatusText(ctx);
    if (!gameOver) requestAnimationFrame(animate);
    else drawGameOver();
  }

  animate(0);
});
