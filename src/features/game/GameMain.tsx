import React from 'react';
import { createUseStyles } from 'react-jss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { GameStatus, gameStatusChanged, godModeToggled, mirrorModeToggled, snakeSpeedChanged, Speed } from './gameSlice';

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
    buttonContainer: {
        marginTop: "50px",
    },
    buttonsContainer: {
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
        width: "160px",
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
    },
    godModeButton: {
        width: "120px",
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
    gotModeButtonToggled: {
        color: "gold"
    }
});

const GameMain: React.FC = () => {

    const snakeSpeed = useSelector((state: RootState) => state.game.snake.speed);
    const godMode = useSelector((state: RootState) => state.game.godMode);
    const mirrorMode = useSelector((state: RootState) => state.game.mirrorMode);

	const dispatch = useDispatch();

    const classes = useStyles();

    const getSpeedClasses = (speed: Speed) => (snakeSpeed === speed ? `${classes.button} ${classes.buttonToggled}` : `${classes.button}`)

	return (<div className={classes.mainContainer}>
        <p>~ SNAKE ~</p>
        <div className={classes.buttonContainer}>
            <button className={classes.startButton} onClick={() => dispatch(gameStatusChanged(GameStatus.STARTED))}>start the game</button>
        </div>
        <div className={classes.buttonsContainer}>
            <button className={getSpeedClasses(Speed.slow)} onClick={() => dispatch(snakeSpeedChanged(Speed.slow))}>slow</button>
            <button className={getSpeedClasses(Speed.normal)} onClick={() => dispatch(snakeSpeedChanged(Speed.normal))}>normal</button>
            <button className={getSpeedClasses(Speed.fast)} onClick={() => dispatch(snakeSpeedChanged(Speed.fast))}>fast</button>
        </div>
        <div className={classes.buttonsContainer}>
            <button className={mirrorMode ? `${classes.button} ${classes.buttonToggled}` : `${classes.button}`} onClick={() => dispatch(mirrorModeToggled())}>mirror mode</button>
            <button className={godMode ? `${classes.godModeButton} ${classes.gotModeButtonToggled}` : `${classes.godModeButton}`} onClick={() => dispatch(godModeToggled())}>GOD MODE</button>
        </div>
    </div>);
}

export default GameMain;
