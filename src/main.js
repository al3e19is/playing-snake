import { createInitialState, setDirection, step } from "./snakeLogic.mjs";

const TICK_MS = 140;
const boardEl = document.getElementById("board");
const scoreEl = document.getElementById("score");
const statusEl = document.getElementById("status");
const restartEl = document.getElementById("restart");
const pauseEl = document.getElementById("pause");

let state = createInitialState();
let timer = null;
let paused = false;

function render() {
  const size = state.size;
  boardEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  boardEl.innerHTML = "";

  const occupied = new Set(state.snake.map((part) => `${part.x},${part.y}`));
  const foodKey = `${state.food.x},${state.food.y}`;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const key = `${x},${y}`;
      const cell = document.createElement("div");
      cell.className = "cell";

      if (key === foodKey) {
        cell.classList.add("food");
      }

      if (occupied.has(key)) {
        cell.classList.add("snake");
      }

      boardEl.appendChild(cell);
    }
  }

  scoreEl.textContent = String(state.score);
  pauseEl.textContent = paused ? "Resume" : "Pause";
  statusEl.textContent = state.gameOver
    ? "Game over. Press Restart to play again."
    : paused
      ? "Paused. Press Space or Resume to continue."
      : "Use arrow keys or WASD.";
}

function tick() {
  state = step(state);
  render();
  if (state.gameOver) {
    stop();
  }
}

function start() {
  if (timer !== null || state.gameOver || paused) {
    return;
  }
  timer = window.setInterval(tick, TICK_MS);
}

function stop() {
  if (timer !== null) {
    window.clearInterval(timer);
    timer = null;
  }
}

function restart() {
  stop();
  state = createInitialState();
  paused = false;
  render();
}

function queueDirection(direction) {
  state = setDirection(state, direction);
  if (paused) {
    paused = false;
  }
  start();
  render();
}

function togglePause() {
  if (state.gameOver) {
    return;
  }

  paused = !paused;
  if (paused) {
    stop();
  } else {
    start();
  }
  render();
}

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  if (key === " ") {
    event.preventDefault();
    togglePause();
    return;
  }

  if (key === "arrowup" || key === "w") {
    queueDirection("up");
  } else if (key === "arrowdown" || key === "s") {
    queueDirection("down");
  } else if (key === "arrowleft" || key === "a") {
    queueDirection("left");
  } else if (key === "arrowright" || key === "d") {
    queueDirection("right");
  }
});

document.querySelectorAll("[data-dir]").forEach((button) => {
  button.addEventListener("click", () => {
    queueDirection(button.dataset.dir);
  });
});

pauseEl.addEventListener("click", togglePause);
restartEl.addEventListener("click", restart);

render();
