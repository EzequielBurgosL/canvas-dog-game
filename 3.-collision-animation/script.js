/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 700;
const explosions = [];
let canvasPosition = canvas.getBoundingClientRect();

class Explosion {
  constructor(x, y) {
    this.spriteWidth = 1000 / 5;
    this.spriteHeight = 179;
    this.width = this.spriteWidth * 0.8;
    this.height = this.spriteHeight * 0.8;
    this.x = x - this.width / 2;
    this.y = y - this.height / 2;
    this.image = new Image();
    this.image.src = "assets/boom.png";
    this.frame = 0;
    this.timer = 0;
    this.sound = new Audio();
    this.sound.src = "assets/fire-impact.wav";
  }

  update() {
    if (this.frame === 0) this.sound.play();

    this.timer++;

    if (this.timer % 5 === 0) {
      this.frame++;
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
      this.width,
      this.height
    );
  }
}

window.addEventListener("click", (event) => {
  createAnimation(event);
});

function createAnimation(event) {
  const x = event.x - canvasPosition.left;
  const y = event.y - canvasPosition.top;

  explosions.push(new Explosion(x, y));
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < explosions.length; i++) {
    explosions[i].update();
    explosions[i].draw();

    if (explosions[i].frame > 5) {
      explosions.splice(i, 1);
      i--;
    }
  }

  requestAnimationFrame(animate);
}
animate();

// window.addEventListener("click", function (event) {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   const rectLength = 50;
//   const x = event.x - canvasPosition.left - rectLength / 2;
//   const y = event.y - canvasPosition.top - rectLength / 2;

//   ctx.fillStyle = "white";
//   ctx.fillRect(x, y, rectLength, rectLength);
// });
