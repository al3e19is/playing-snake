import assert from "node:assert/strict";
import { createInitialState, placeFood, setDirection, step } from "../src/snakeLogic.mjs";

function run() {
  const initial = createInitialState(8);

  const moved = step(initial, () => 0);
  assert.equal(moved.snake[0].x, initial.snake[0].x + 1);
  assert.equal(moved.snake[0].y, initial.snake[0].y);

  const withFoodAhead = {
    ...initial,
    food: { x: initial.snake[0].x + 1, y: initial.snake[0].y },
  };
  const grew = step(withFoodAhead, () => 0.5);
  assert.equal(grew.snake.length, initial.snake.length + 1);
  assert.equal(grew.score, 1);

  const intoWall = {
    ...initial,
    snake: [{ x: 7, y: 3 }, { x: 6, y: 3 }, { x: 5, y: 3 }],
    direction: "right",
    pendingDirection: "right",
  };
  const wallCollision = step(intoWall, () => 0);
  assert.equal(wallCollision.gameOver, true);

  const intoBody = {
    ...initial,
    snake: [{ x: 2, y: 2 }, { x: 2, y: 3 }, { x: 1, y: 3 }, { x: 1, y: 2 }],
    direction: "down",
    pendingDirection: "down",
    food: { x: 0, y: 0 },
  };
  const bodyCollision = step(intoBody, () => 0);
  assert.equal(bodyCollision.gameOver, true);

  const intoTail = {
    ...initial,
    snake: [{ x: 2, y: 2 }, { x: 2, y: 3 }, { x: 1, y: 3 }, { x: 1, y: 2 }],
    direction: "left",
    pendingDirection: "left",
    food: { x: 0, y: 0 },
  };
  const tailMove = step(intoTail, () => 0);
  assert.equal(tailMove.gameOver, false);
  assert.deepEqual(tailMove.snake[0], { x: 1, y: 2 });

  const blockedReverse = setDirection(initial, "left");
  assert.equal(blockedReverse.pendingDirection, "right");

  const freeFood = placeFood(4, [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
  ], () => 0);
  assert.notDeepEqual(freeFood, { x: 0, y: 0 });

  console.log("snakeLogic tests passed");
}

run();
