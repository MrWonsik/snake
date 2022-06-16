import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { generateAvailableRandomPoint, pointsIncludes } from "../../helpers/PointHelpers";

const BOARD_SIZE = 20;

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

export enum GameStatus {
	OPEN,
	STARTED,
	FREEZE,
	END
}

type Snake = {
	points: Point[];
	length: number;
	speed: Speed;
	direction: Direction;
	moves: Direction[];
};
export interface GameState {
	score: number;
	snake: Snake;
	boardSize: number;
	foodPoint: Point;
	gameStatus: GameStatus;
	godMode: boolean;
	mirrorMode: boolean;
}

const SNAKE_START_POINT: Point = {x:0, y:0}

const initialState: GameState = {
	score: 0,
	snake: {
		points: [SNAKE_START_POINT],
		length: 0,
		speed: Speed.slow,
		direction: Direction.RIGHT,
		moves: [],
	},
	boardSize: BOARD_SIZE,
	foodPoint: generateAvailableRandomPoint([SNAKE_START_POINT], BOARD_SIZE),
	gameStatus: GameStatus.OPEN,
	godMode: false,
	mirrorMode: false
};

const AVAILABLE_HORIZONTAL_DIRECTIONS = [Direction.LEFT, Direction.RIGHT];
const AVAILABLE_VERTICAL_DIRECTIONS = [Direction.UP, Direction.DOWN];

const isNewDirectionValid = (currentDirection: Direction, newDirection: Direction): boolean => {
	switch(currentDirection) {
		case Direction.UP: 
		case Direction.DOWN: return AVAILABLE_HORIZONTAL_DIRECTIONS.includes(newDirection);
		case Direction.LEFT: 
		case Direction.RIGHT: return AVAILABLE_VERTICAL_DIRECTIONS.includes(newDirection);
		default: return false;
	}
}

const checkIsSnakeContactItself = (snakePoints: Point[], nextMove: Point): boolean => {
	return pointsIncludes(snakePoints, nextMove);
}

const checkIsSnakeContactWall = (nextMove: Point, boardSize: number): boolean => {
	return (nextMove.y < 0 || nextMove.y > boardSize-1 || nextMove.x < 0 || nextMove.x > boardSize-1);
}

const countNextMove = (direction: Direction, head: Point, mirrorMode: boolean, boardSize: number): Point => {
	const countCoordinate = (coordinate: number): number => {
		if(mirrorMode && coordinate > boardSize - 1) {
			return coordinate - boardSize;
		}
		if( mirrorMode && coordinate < 0) {
			return coordinate + boardSize;
		}
		return coordinate;
	}

	switch (direction) {
		case Direction.UP: return { x: head.x, y: countCoordinate(head.y - 1) };
		case Direction.DOWN: return { x: head.x, y: countCoordinate(head.y + 1) };
		case Direction.LEFT: return { x: countCoordinate(head.x - 1), y: head.y };
		case Direction.RIGHT: return { x: countCoordinate(head.x + 1), y: head.y };
	}
} 

const isGameOver = (points: Point[], nextMove: Point, boardSize: number, mirrorMode: boolean, godMode: boolean) => {
	if(godMode) {
		return false;
	}
	const isSnakeContactItself: boolean = checkIsSnakeContactItself(points, nextMove);
	const isSnakeContactWall: boolean = !mirrorMode && checkIsSnakeContactWall(nextMove, boardSize);
	return isSnakeContactItself || isSnakeContactWall;
}

export const gameSlice = createSlice({
	name: "game",
	initialState,
	reducers: {
		foodEaten: (state) => {
			state.score += 1;
			state.foodPoint = generateAvailableRandomPoint(state.snake.points, state.boardSize);
			state.snake.length += 1;
		},
		snakeSpeedChanged: (state, action: PayloadAction<Speed>) => {
			state.snake.speed = action.payload;
		},
		snakeDirectionChanged: (state, action: PayloadAction<Direction>) => {
			if(isNewDirectionValid(state.snake.direction, action.payload)) {
				state.snake.moves.unshift(action.payload);
			}
		},
		snakeMoved: (state) => {
			if(state.gameStatus === GameStatus.FREEZE || state.gameStatus === GameStatus.END) {
				return;
			}
			const head = state.snake.points[0];
			if(state.snake.moves.length > 0) {
				state.snake.direction = state.snake.moves.pop() as Direction
			}
			const nextMove = countNextMove(state.snake.direction, head, state.mirrorMode, state.boardSize);
			if (isGameOver(state.snake.points, nextMove, state.boardSize, state.mirrorMode, state.godMode)) {
				state.gameStatus = GameStatus.END;
				return;
			}
			if (state.snake.length !== state.snake.points.length) {
				state.snake.points.pop(); //delete last element
			}
			state.snake.points.unshift(nextMove); // append nextMove point at start
		},
		gameStatusChanged: (state, action: PayloadAction<GameStatus>) => {
			if(state.gameStatus === GameStatus.END && [GameStatus.FREEZE, GameStatus.STARTED].includes(action.payload)) {
				return;
			}
			state.gameStatus = action.payload;
		},
		godModeToggled: (state) => {
			state.godMode = !state.godMode;
		},
		mirrorModeToggled: (state) => {
			state.mirrorMode = !state.mirrorMode;
		}
	},
});

// Action creators are generated for each case reducer function
export const { foodEaten, snakeSpeedChanged, snakeDirectionChanged, snakeMoved, gameStatusChanged, godModeToggled, mirrorModeToggled } = gameSlice.actions;

export default gameSlice.reducer;
