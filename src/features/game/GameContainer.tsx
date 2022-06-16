import React from 'react';
import { createUseStyles } from 'react-jss';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import GameBoard from './GameBoard';
import GameMain from './GameMain';
import {GameStatus } from './gameSlice';

const useStyles = createUseStyles({
	gameContainer: {
		marginTop: "50px",
		color: "#a67a5b",
		fontFamily: "\"Press Start 2P\", cursive",
		display: "flex",
		justifyContent: "center",
		alignItems: "center"
	}
});

const GameContainer: React.FC = () => {

	const gameStatus = useSelector((state: RootState) => state.game.gameStatus);

	const classes = useStyles();

	const obtainView = () => {
		switch(gameStatus) {
			case GameStatus.OPEN: {
				return <GameMain />
			}
			case GameStatus.END:
			case GameStatus.FREEZE:
			case GameStatus.STARTED: {
				return <GameBoard />
			}
		}
	}

	return (<div className={classes.gameContainer}>{obtainView()}</div>);
}

export default GameContainer;
