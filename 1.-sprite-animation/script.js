let playerState = "run";

const selector = document.getElementById("state-selector");
selector.addEventListener("change", (event) => {
  playerState = event.target.value;
});

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  let position =
    Math.floor(gameFrame / frameRate) %
    spriteAnimations[playerState].loc.length;
  let frameX = position * spriteWidth;
  let frameY = spriteAnimations[playerState].loc[position].y;

  ctx.drawImage(
    playerImage,
    frameX,
    frameY,
    spriteWidth,
    spriteHeight,
    0,
    0,
    spriteWidth,
    spriteHeight
  );

  requestAnimationFrame(animate);
  gameFrame++;
}

animate();
