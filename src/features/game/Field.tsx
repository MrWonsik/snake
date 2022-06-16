import React from 'react'
import { createUseStyles } from 'react-jss';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { pointEquals, pointsIncludes } from '../../helpers/PointHelpers';
import { Point } from './gameSlice';

type Props = {
    fieldCoordinates: Point
}

const useStyles = createUseStyles({
    field: {
        width: '90%',
        height: '90%',
        margin: '1px'
    },
    fieldWithFood: {
        backgroundColor: "red",
        borderRadius: "20px"
    },
    fieldWithSnake: {
        backgroundColor: "green",
    },
    fieldWithSnakeHead: {
        backgroundColor: "yellow",
    }
});

const Field: React.FC<Props> = (props: Props) => {
    const foodCoordinates = useSelector((state: RootState) => state.game.foodPoint);
    const snake = useSelector((state: RootState) => state.game.snake);

    const classes = useStyles();

    const generateFieldClass = (fieldPoint: Point): string => {
        if (pointEquals(foodCoordinates, fieldPoint)) {
            return `${classes.field} ${classes.fieldWithFood}`;
        }
        if (pointEquals(snake.points[0], fieldPoint)) {
            return `${classes.field} ${classes.fieldWithSnakeHead}`;
        }
        if (pointsIncludes(snake.points, fieldPoint)) {
            return `${classes.field} ${classes.fieldWithSnake}`;
        }
        return classes.field;
    }

    return (
        <div className={generateFieldClass(props.fieldCoordinates)} />
    )
}

export default Field;