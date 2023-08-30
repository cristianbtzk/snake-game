const canvas = document.querySelector('canvas')
const ctx = canvas.getContext("2d")

const score = document.querySelector(".score-value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");

const audio = new Audio("../assets/audio.mp3")

const size = 30

const snakeInitialPosition = {
  x: 300,
  y: 300,
}

let snake = [snakeInitialPosition]

const randomCoordinate = () => {
  return Math.round(Math.round(Math.random() * (600 - size)) / 30) * 30;
}

const incrementScore = () => {
  score.innerText = +score.innerText + 10;
}

let loop;
let direction = "up";

const generateFood = () => {
  let x = randomCoordinate();
  let y = randomCoordinate();

  while (snake.some(({ x: snakeX, y: snakeY }) => x === snakeX && y === snakeY)) {
    x = randomCoordinate();
    y = randomCoordinate();
  }

  return {
    x,
    y,
    color: "yellow",
  }
}

let food = generateFood();

const drawSnake = () => {
  ctx.fillStyle = "#ddd"

  snake.forEach((coordinate, index) => {
    if (index === snake.length - 1) {
      ctx.fillStyle = "white"
    }
    ctx.fillRect(coordinate.x, coordinate.y, size, size)
  })
}

const moveSnake = () => {
  if (!direction) return
  // TODO validate next square
  const head = snake[snake.length - 1];


  switch (direction) {
    case "right":
      snake.push({ x: head.x + size, y: head.y })
      break;
    case "left":
      snake.push({ x: head.x - size, y: head.y })
      break;
    case "up":
      snake.push({ x: head.x, y: head.y - size })
      break;
    case "down":
      snake.push({ x: head.x, y: head.y + size })
      break;

    default:
      break;
  }

  snake.shift()

}

const drawGrid = () => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#191919";

  for (let i = 0; i <= canvas.width; i += size) {
    ctx.beginPath();
    ctx.lineTo(i, 0);
    ctx.lineTo(i, canvas.width);
    ctx.stroke();
  }

  for (let i = 0; i <= canvas.height; i += size) {
    ctx.beginPath();
    ctx.lineTo(0, i);
    ctx.lineTo(600, i);
    ctx.stroke();
  }
}

const checkFoodTile = () => {
  const snakeHead = snake[snake.length - 1];

  if (snakeHead.x === food.x && snakeHead.y === food.y) {
    audio.play();
    incrementScore();
    snake.push(snakeHead);
    food = generateFood();
  }
}

const drawFood = () => {
  const { x, y, color } = food;

  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
  ctx.shadowBlur = 0;
}

const checkCollision = () => {
  const { x, y } = snake[snake.length - 1];

  const canvasCollision = x < 0 || x >= canvas.width || y < 0 || y >= canvas.height;

  const selfCollision = snake.some(({ x: snakeX, y: snakeY }, index) => x === snakeX && y === snakeY && index < snake.length - 2);
  
  if (canvasCollision || selfCollision) {
    gameOver();
  }
}

const gameOver = () => {
  direction = undefined;
  console.log(menu);
  menu.style.display = "flex";
  finalScore.innerText = score.innerText;
  canvas.style.filter = "blur(2px)";
}

const game = () => {
  clearInterval(loop)
  ctx.clearRect(0, 0, 600, 600)
  drawGrid();
  drawFood();
  moveSnake();
  drawSnake();
  checkFoodTile();
  checkCollision();

  loop = setTimeout(() => {
    game()
  }, 200)


}

game()

const keyDirections = {
  w: "up",
  a: "left",
  s: "down",
  d: "right",
}

document.addEventListener("keydown", ({ key }) => {
  direction = keyDirections[key];
})

buttonPlay.addEventListener("click", () => {
  score.innerText = "00";
  menu.style.display = "none";
  canvas.style.filter = "none";
  snake = [snakeInitialPosition];
})