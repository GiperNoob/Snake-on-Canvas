/* eslint-disable no-plusplus */
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const blockSize = 10;
const widthInBlocks = width / blockSize;
const heightInBlocks = height / blockSize;
let score = 0;

function circle(x, y, radius, fillCircle, color) {
  if (fillCircle) {
    ctx.fillStyle = color;
  }
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  ctx.stroke();
  if (fillCircle) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
}

function drawBorder() {
  ctx.fillStyle = 'gray';
  ctx.fillRect(0, 0, width, blockSize);
  ctx.fillRect(0, height - blockSize, width, blockSize);
  ctx.fillRect(0, 0, blockSize, height);
  ctx.fillRect(width - blockSize, 0, blockSize, height);
}

function drawScore() {
  ctx.font = '20px Courier';
  ctx.fillStyle = 'yellow';
  ctx.textAlign = 'left';
  ctx.textBaseLine = 'top';
  ctx.fillText(`Счет: ${score}`, blockSize, blockSize);
}

function gameOver() {
  clearInterval(intervalId);
  ctx.font = '30px Courier';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.textBaseLine = 'middle';
  ctx.fillText(`Game over.Score:${score}`, width / 2, height / 2);
}

function Block(col, row) {
  this.col = col;
  this.row = row;
}

Block.prototype.drawSquare = function (color) {
  const x = this.col * blockSize;
  const y = this.row * blockSize;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, blockSize, blockSize);
};

Block.prototype.drawCircle = function (color) {
  const centerX = this.col * blockSize + blockSize / 2;
  const centerY = this.row * blockSize + blockSize / 2;
  ctx.fillStyle = color;
  circle(centerX, centerY, blockSize / 2, true);
};

Block.prototype.equal = function (otherBlock) {
  return this.col === otherBlock.col && this.row === otherBlock.row;
};


function Snake() {
  this.segments = [
    new Block(7, 5),
    new Block(6, 5),
    new Block(5, 5),
  ];

  this.direction = 'right';
  this.nextDirection = 'down';
}

const snake = new Snake();

Snake.prototype.draw = function () {
  for (let i = 0; i < this.segments.length; i++) {
    this.segments[i].drawSquare('blue');
  }
};

Snake.prototype.move = function () {
  const head = this.segments[0];
  let newHead;

  this.direction = this.nextDirection;

  if (this.direction === 'right') {
    newHead = new Block(head.col + 1, head.row);
  } else if (this.direction === 'down') {
    newHead = new Block(head.col, head.row + 1);
  } else if (this.direction === 'left') {
    newHead = new Block(head.col - 1, head.row);
  } else if (this.direction === 'up') {
    newHead = new Block(head.col, head.row - 1);
  }

  if (this.checkCollision(newHead)) {
    gameOver();
    return;
  }

  this.segments.unshift(newHead);

  if (newHead.equal(apple.position)) {
    score++;
    apple.move();
  } else {
    this.segments.pop();
  }
};

Snake.prototype.checkCollision = function (head) {
  const leftCollision = (head.col === 0);
  const topCollision = (head.row === 0);
  const rightCollision = (head.col === widthInBlocks - 1);
  const bottomCollision = (head.row === heightInBlocks - 1);

  const wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;


  let selfCollision = false;

  for (let i = 0; i < this.segments.length; i++) {
    if (head.equal(this.segments[i])) {
      selfCollision = true;
    }
  }
  return wallCollision || selfCollision;
};

Snake.prototype.setDirection = function (newDirection) {
  if (this.direction === 'up' && newDirection === 'down') {
    return;
  } if (this.direction === 'right' && newDirection === 'left') {
    return;
  } if (this.direction === 'down' && newDirection === 'up') {
    return;
  } if (this.direction === 'left' && newDirection === 'right') {
    return;
  }

  this.nextDirection = newDirection;
};

function Apple() {
  this.position = new Block(10, 10);
}

Apple.prototype.draw = function () {
  this.position.drawCircle('red');
};

Apple.prototype.move = function () {
  const randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
  const randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
  this.position = new Block(randomCol, randomRow);
};

const apple = new Apple();

let intervalId = setInterval(() => {
  ctx.clearRect(0, 0, width, height);
  drawScore();
  snake.move();
  snake.draw();
  apple.draw();
  drawBorder();
}, 100);


const directions = {
  KeyA: 'left',
  KeyD: 'right',
  KeyW: 'up',
  KeyS: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
};


document.body.addEventListener('keydown', (event) => {
  const newDirection = directions[event.code];
  if (newDirection !== undefined) {
    snake.setDirection(newDirection);
  }
});
