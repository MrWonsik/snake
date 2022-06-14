
import React from 'react'
import { createUseStyles } from 'react-jss'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../app/store'
import { scoreUpdated } from './gameSlice'

type Props = {}

 const useStyles = createUseStyles({
        gameBoard: {
            backgroundColor: "gray",
            border: "1px solid black",
            margin: "auto",
            display: "inline-grid",
            gridTemplate: `repeat(20, 1fr) / repeat(20, 1fr)`,
            columnGap: 0,
            rowGap: 0
        },
        field: {
            width: "20px",
            height: "20px",
            backgroundColor: "yellow",
            "&:hover": {
                backgroundColor: "red"
            }
        }
      })

const GameBoard = (props: Props) => {
    const score = useSelector((state: RootState) => state.game.score);
    const snakeSpeed = useSelector((state: RootState) => state.game.snake.speed);
    const gameSize = useSelector((state: RootState) => state.game.boardSize);

    const classes = useStyles();

    const dispatch = useDispatch()
    
    let fields = [];
    for (let i = 0; i < gameSize.horizontal; i++) {
        for (let j = 0; j < gameSize.vertical; j++) {
            fields.push(<div className={classes.field} key={`${i}-${j}`}></div>)
        }
    }

    
    return (<div>
        <p>Snake speed: {snakeSpeed}</p>
        <p>Score: {score}</p>
        <div className={classes.gameBoard}>
            { fields }
        </div>
    </div>)
}

export default GameBoard;