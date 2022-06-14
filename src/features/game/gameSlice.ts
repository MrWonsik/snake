import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Point = {
	x: number;
	y: number;
};

enum Speed { slow = 1000, normal = 500, fast = 200 }

type Snake = {
	points: Point[];
	isAlive: boolean;
    speed: Speed
};

type BoardSize = {
    vertical: number;
    horizontal: number;
}


export interface GameState {
	score: number;
	snake: Snake;
    boardSize: BoardSize;
};

const initialState: GameState = {
    score: 0,
    snake: {
      points: [],
      isAlive: true,
      speed: Speed.slow,
    },
    boardSize: {
        vertical: 20,
        horizontal: 20
    },
}

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
      scoreUpdated: (state, action: PayloadAction<number>) => {
        state.score += action.payload
      },
      speedChanged: (state, action: PayloadAction<Speed>) => {
        state.snake.speed = action.payload;
      }
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { scoreUpdated, speedChanged } = gameSlice.actions
  
  export default gameSlice.reducer