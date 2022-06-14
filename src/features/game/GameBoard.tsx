import React, { ReactElement, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import Field from './Field';
import { changeDirection, Direction, foodEaten, moveSnake } from './gameSlice';

const useStyles = createUseStyles({
	gameBoard: {
		border: '1px solid black',
		margin: 'auto',
		display: 'inline-grid',
		gridTemplate: ({ boardSize } : { boardSize: number }) => {
			return "repeat(" + boardSize + ", 1fr) / repeat(" + boardSize +", 1fr)"
		},
		columnGap: 0,
		rowGap: 0,
	}
});

const GameBoard = (): ReactElement => {

	const snake = useSelector((state: RootState) => state.game.snake);
	const boardSize = useSelector((state: RootState) => state.game.boardSize);
	const foodCoordinates = useSelector((state: RootState) => state.game.foodPoint);

	const dispatch = useDispatch();

	useEffect(() => {
		document.addEventListener("keydown", handleKeyPress, false);
		const interval = setInterval(() => dispatch(moveSnake()), snake.speed);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if(snake.points[0].x === foodCoordinates.x && snake.points[0].y === foodCoordinates.y) {
			dispatch(foodEaten());
		}
	}, [snake.points[0]])

	const classes = useStyles({ boardSize });

	const handleKeyPress = (e: KeyboardEvent): void => {
		if(e.key === "ArrowUp") {
			dispatch(changeDirection(Direction.UP));
		}
		if(e.key === "ArrowLeft") {
			dispatch(changeDirection(Direction.LEFT));
		}
		if(e.key === "ArrowRight") {
			dispatch(changeDirection(Direction.RIGHT));
		}
		if(e.key === "ArrowDown") {
			dispatch(changeDirection(Direction.DOWN));
		}
	}

	const fields = [];
	for (let i = 0; i < boardSize; i++) {
		for (let j = 0; j < boardSize; j++) {
			fields.push(<Field key={`${i}-${j}`} coordinateX={j} coordinateY={i} />);
		}
	}

	return (
		<div className={classes.gameBoard}>
			{ fields }
		</div>
	);
}

export default GameBoard;
