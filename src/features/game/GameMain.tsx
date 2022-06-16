import React from 'react';
import { createUseStyles } from 'react-jss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { GameStatus, gameStatusChanged, snakeSpeedChanged, Speed } from './gameSlice';

const useStyles = createUseStyles({
    mainContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "40vw",
        height: "40vw",
        textShadow: "1px 1px darkgreen"
    },
    startButtonContainer: {
        marginTop: "50px",
    },
    speedButtonsContainer: {
        display: "flex",
        justifyContent: "space-around",
        width: "100%",
        marginTop: "50px",
    },
    startButton: {
        width: "200px",
        height: "40px",
        textTransform: "uppercase",
        background: "transparent",
        border: "none",
        fontFamily: "inherit",
        color: "inherit",
        "&:hover": {
            cursor: "pointer",
            color: "red"
        }
    },
    button: {
        width: "100px",
        height: "40px",
        textTransform: "uppercase",
        background: "transparent",
        border: "none",
        fontFamily: "inherit",
        color: "inherit",
        "&:hover": {
            cursor: "pointer",
            color: "red"
        }
    },
    buttonToggled: {
        color: "green"
    }
});

const GameMain: React.FC = () => {

    const snakeSpeed = useSelector((state: RootState) => state.game.snake.speed);

	const dispatch = useDispatch();

    const classes = useStyles();

    const getClasses = (speed: Speed) => (snakeSpeed === speed ? `${classes.button} ${classes.buttonToggled}` : `${classes.button}`)

	return (<div className={classes.mainContainer}>
        <p>~ SNAKE ~</p>
        <div className={classes.startButtonContainer}>
            <button className={classes.startButton} onClick={() => dispatch(gameStatusChanged(GameStatus.STARTED))}>start the game</button>
        </div>
        <div className={classes.speedButtonsContainer}>
            <button className={getClasses(Speed.slow)} onClick={() => dispatch(snakeSpeedChanged(Speed.slow))}>slow</button>
            <button className={getClasses(Speed.normal)} onClick={() => dispatch(snakeSpeedChanged(Speed.normal))}>normal</button>
            <button className={getClasses(Speed.fast)} onClick={() => dispatch(snakeSpeedChanged(Speed.fast))}>fast</button>
        </div>
    </div>);
}

export default GameMain;
