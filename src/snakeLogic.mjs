export const GRID_SIZE = 16;

const DIRS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITE = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

export function createInitialState(size = GRID_SIZE) {
  const mid = Math.floor(size / 2);
  const snake = [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ];

  return {
    size,
    snake,
    direction: "right",
    pendingDirection: "right",
    food: placeFood(size, snake),
    score: 0,
    gameOver: false,
  };
}

export function setDirection(state, nextDirection) {
  if (!DIRS[nextDirection]) {
    return state;
  }

  if (state.snake.length > 1 && OPPOSITE[state.direction] === nextDirection) {
    return state;
  }

  return {
    ...state,
    pendingDirection: nextDirection,
  };
}

export function step(state, random = Math.random) {
  if (state.gameOver) {
    return state;
  }

  const direction = state.pendingDirection;
  const head = state.snake[0];
  const delta = DIRS[direction];
  const nextHead = { x: head.x + delta.x, y: head.y + delta.y };
  const ateFood = sameCell(nextHead, state.food);
  const bodyForCollision = ateFood ? state.snake : state.snake.slice(0, -1);

  if (isOutOfBounds(nextHead, state.size) || occupies(bodyForCollision, nextHead)) {
    return {
      ...state,
      direction,
      gameOver: true,
    };
  }

  const moved = [nextHead, ...state.snake];
  const snake = ateFood ? moved : moved.slice(0, -1);

  return {
    ...state,
    snake,
    direction,
    food: ateFood ? placeFood(state.size, snake, random) : state.food,
    score: ateFood ? state.score + 1 : state.score,
    gameOver: false,
  };
}

export function placeFood(size, snake, random = Math.random) {
  const freeCells = [];

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const cell = { x, y };
      if (!occupies(snake, cell)) {
        freeCells.push(cell);
      }
    }
  }

  if (freeCells.length === 0) {
    return snake[0];
  }

  const index = Math.floor(random() * freeCells.length);
  return freeCells[index];
}

function isOutOfBounds(cell, size) {
  return cell.x < 0 || cell.y < 0 || cell.x >= size || cell.y >= size;
}

function occupies(snake, cell) {
  return snake.some((part) => sameCell(part, cell));
}

function sameCell(a, b) {
  return a.x === b.x && a.y === b.y;
}
