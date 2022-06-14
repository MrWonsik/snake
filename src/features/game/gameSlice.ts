import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const BOARD_SIZE = 20;

const randomPointWithoutSnake = (pointsToMiss: Point[]): Point => {
  const randomCoordinate = (): number => {
	return Math.floor(Math.random() * BOARD_SIZE);
  }
  let coordinateX: number;
  let coordinateY: number;
  do { 
	coordinateX = randomCoordinate();
	coordinateY = randomCoordinate();
  } while (pointsToMiss.some(point => point.x === coordinateX && point.y === coordinateY))
  return { x: coordinateX, y: coordinateY };
}

type Point = {
  x: number;
  y: number;
};

enum Speed {
  slow = 200,
  normal = 100,
  fast = 50
}

export enum Direction { LEFT, RIGHT, UP, DOWN }

type Snake = {
  points: Point[];
  length: number;
  isAlive: boolean;
  speed: Speed;
  direction: Direction;
};

export interface GameState {
  score: number;
  snake: Snake;
  boardSize: number;
  foodPoint: Point;
}

const initialState: GameState = {
  score: 0,
  snake: {
	points: [{x: 0, y: 0}],
	length: 0,
	isAlive: true,
	speed: Speed.slow,
	direction: Direction.RIGHT
  },
  boardSize: BOARD_SIZE,
  foodPoint: randomPointWithoutSnake([{x: 0, y: 0}])
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
	foodEaten: (state) => {
		state.score += 1;
		state.foodPoint = randomPointWithoutSnake(state.snake.points);
		state.snake.length += 1;
	},
	speedChanged: (state, action: PayloadAction<Speed>) => {
		state.snake.speed = action.payload;
	},
	changeDirection: (state, action: PayloadAction<Direction>) => {
		state.snake.direction = action.payload;
	},
	moveSnake: (state) => {
		const head = state.snake.points[0];
		if(state.snake.length !== state.snake.points.length) {
			state.snake.points.pop(); //delete last element
		}
		switch(state.snake.direction) {
			case Direction.UP: {
				state.snake.points.unshift({ x: head.x, y: head.y - 1 })
				break;
			}
			case Direction.DOWN: {
				state.snake.points.unshift({x: head.x, y: head.y + 1 })
				break;
			}
			case Direction.LEFT: {
				state.snake.points.unshift({ x: head.x - 1, y: head.y })
				break;
			}
			case Direction.RIGHT: {
				state.snake.points.unshift({ x: head.x + 1, y: head.y })
				break;
			}
		}
	}
  },
});

// Action creators are generated for each case reducer function
export const { foodEaten, speedChanged, changeDirection, moveSnake } = gameSlice.actions;

export default gameSlice.reducer;
