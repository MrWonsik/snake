import React, { useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { pointEquals } from '../../helpers/PointHelpers';
import Field from './Field';
import { snakeDirectionChanged, Direction, foodEaten, snakeMoved, GameStatus, gameStatusChanged } from './gameSlice';

const useStyles = createUseStyles({
	gameBoard: {
		width: "40vw",
		height: "40vw",
		border: '3px solid #a67a5b',
		margin: 'auto',
		display: 'inline-grid',
		gridTemplate: ({ boardSize }: { boardSize: number }) => {
			return "repeat(" + boardSize + ", 1fr) / repeat(" + boardSize + ", 1fr)"
		},
		backgroundColor: "#e8dcb5",
		gap: 0, 
		maxWidth: "600px",
		maxHeight: "600px",
	},
	scoreContainer: {
		textAlign: "right",
		fontSize: "12px"
	},
	infoContainer: {
		position: "absolute",
		width: "-webkit-fill-available",
		height: "-webkit-fill-available",
		backgroundColor: "rgba(100, 100, 100, 0.3)",
		top: "0",
		left: "0",
		textAlign: "center",
		fontSize: "50px",
		paddingTop: "100px"
	},
});


const createInformationMessage = (gameStatus: GameStatus) => {
	switch(gameStatus) {
		case GameStatus.FREEZE: return "PAUSE"
		case GameStatus.END: return "YOU LOSE!"
		default: return ""
	}
}

const GameBoard: React.FC = () => {

	const snake = useSelector((state: RootState) => state.game.snake);
	const score = useSelector((state: RootState) => state.game.score);
	const boardSize = useSelector((state: RootState) => state.game.boardSize);
	const foodCoordinates = useSelector((state: RootState) => state.game.foodPoint);
	const gameStatus = useSelector((state: RootState) => state.game.gameStatus);

	const dispatch = useDispatch();

	const handleArrowPress = (e: KeyboardEvent): void => {
		if (e.key === "ArrowUp") {
			dispatch(snakeDirectionChanged(Direction.UP));
		}
		if (e.key === "ArrowLeft") {
			dispatch(snakeDirectionChanged(Direction.LEFT));
		}
		if (e.key === "ArrowRight") {
			dispatch(snakeDirectionChanged(Direction.RIGHT));
		}
		if (e.key === "ArrowDown") {
			dispatch(snakeDirectionChanged(Direction.DOWN));
		}
	}

	const pauseTheGame = () => {
		dispatch(gameStatusChanged(GameStatus.FREEZE));
	}

	const resumeTheGame = () => {
		dispatch(gameStatusChanged(GameStatus.STARTED));
	}

	useEffect(() => {
		document.addEventListener("keydown", handleArrowPress, false);
		window.addEventListener("blur", pauseTheGame);
		window.addEventListener("focus", resumeTheGame);
		const interval = setInterval(() => dispatch(snakeMoved()), snake.speed, gameStatus);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (pointEquals(snake.points[0], foodCoordinates)) {
			dispatch(foodEaten());
		}
	}, [snake.points[0]])

	const classes = useStyles({ boardSize });

	const fields = [];
	for (let i = 0; i < boardSize; i++) {
		for (let j = 0; j < boardSize; j++) {
			fields.push(<Field key={`${i}-${j}`} fieldCoordinates={{ x: j, y: i}} />);
		}
	}

	return (
		<div>
			{[GameStatus.FREEZE, GameStatus.END].includes(gameStatus) && <div className={classes.infoContainer}>{createInformationMessage(gameStatus)}</div>}
			<div className={classes.scoreContainer}>SCORE: {score}</div> 
			<div className={classes.gameBoard}>
				{fields}
			</div>
		</div>
	);
}

export default GameBoard;
