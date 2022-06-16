import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { pointEquals } from "../../helpers/PointComparator";

const BOARD_SIZE = 20;

const generateAvailableRandomPoint = (pointsToAvoid: Point[]): Point => {
	
	const generateRandomPoint = (): Point => {
		const randomCoordinate = (): number => Math.floor(Math.random() * BOARD_SIZE);
		return { x: randomCoordinate(), y: randomCoordinate() };
	}
	let randomPoint: Point;
	do {
		randomPoint = generateRandomPoint();
	} while (pointsToAvoid.some(pointToAvoid => pointEquals(pointToAvoid, randomPoint))); 
	return randomPoint;
};

export type Point = {
	x: number;
	y: number;
};

export enum Speed {
	slow = 200,
	normal = 100,
	fast = 50,
}

export enum Direction {
	LEFT,
	RIGHT,
	UP,
	DOWN,
}

type Snake = {
	points: Point[];
	length: number;
	speed: Speed;
	direction: Direction;
};

export enum GameStatus {
	OPEN,
	STARTED,
	FREEZE,
	END
}

export interface GameState {
	score: number;
	snake: Snake;
	boardSize: number;
	foodPoint: Point;
	gameStatus: GameStatus;
}

const snakeStartPoint: Point = {x:0, y:0}

const initialState: GameState = {
	score: 0,
	snake: {
		points: [snakeStartPoint],
		length: 0,
		speed: Speed.slow,
		direction: Direction.RIGHT,
	},
	boardSize: BOARD_SIZE,
	foodPoint: generateAvailableRandomPoint([snakeStartPoint]),
	gameStatus: GameStatus.OPEN
};

const availableHorizontalDirections = [Direction.LEFT, Direction.RIGHT];
const availableVerticalDirections = [Direction.UP, Direction.DOWN];

const isNewDirectionValid = (currentDirection: Direction, newDirection: Direction): boolean => {
	switch(currentDirection) {
		case Direction.UP: 
		case Direction.DOWN: return availableHorizontalDirections.includes(newDirection);
		case Direction.LEFT: 
		case Direction.RIGHT: return availableVerticalDirections.includes(newDirection);
		default: return false;
	}
}

const checkIsSnakeContactItselfOrWall = (snakePoints: Point[], nextMove: Point, boardSize: number) => {
	return snakePoints.some((point: Point) => pointEquals(point, nextMove)) || nextMove.y < 0 || nextMove.y > boardSize-1 || nextMove.x < 0 || nextMove.x > boardSize-1;
}

const countNextMove = (direction: Direction, head: Point): Point => {
	switch (direction) {
		case Direction.UP: return { x: head.x, y: head.y - 1 };
		case Direction.DOWN: return { x: head.x, y: head.y + 1 };
		case Direction.LEFT: return { x: head.x - 1, y: head.y };
		case Direction.RIGHT: return { x: head.x + 1, y: head.y };
	}
} 

export const gameSlice = createSlice({
	name: "game",
	initialState,
	reducers: {
		foodEaten: (state) => {
			state.score += 1;
			state.foodPoint = generateAvailableRandomPoint(state.snake.points);
			state.snake.length += 1;
		},
		snakeSpeedChanged: (state, action: PayloadAction<Speed>) => {
			state.snake.speed = action.payload;
		},
		snakeDirectionChanged: (state, action: PayloadAction<Direction>) => {
			if(isNewDirectionValid(state.snake.direction, action.payload)) {
				state.snake.direction = action.payload;
			}
		},
		snakeMoved: (state) => {
			const head = state.snake.points[0];
			const nextMove = countNextMove(state.snake.direction, head);
			if (checkIsSnakeContactItselfOrWall(state.snake.points, nextMove, state.boardSize)) {
				state.gameStatus = GameStatus.END;
				return;
			}
			if(document.hasFocus()) { // TODO: this should be moved somewhere else
				state.gameStatus = GameStatus.STARTED;
			} else {
				state.gameStatus = GameStatus.FREEZE;
				return;
			}
			if (state.snake.length !== state.snake.points.length) {
				state.snake.points.pop(); //delete last element
			}
			state.snake.points.unshift(nextMove); // append nextMove point at start
		},
		gameStatusChanged: (state, action: PayloadAction<GameStatus>) => {
			state.gameStatus = action.payload;
		}
	},
});

// Action creators are generated for each case reducer function
export const { foodEaten, snakeSpeedChanged, snakeDirectionChanged, snakeMoved, gameStatusChanged } = gameSlice.actions;

export default gameSlice.reducer;
