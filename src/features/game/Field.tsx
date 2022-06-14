import React from 'react'
import { createUseStyles } from 'react-jss';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

type Props = {
    coordinateX: number;
    coordinateY: number;
}

const useStyles = createUseStyles({
	field: {
		width: '20px',
		height: '20px',
        margin: '1px'
	},
	fieldWithFood: {
		backgroundColor: "red"
	},
	fieldWithSnake: {
		backgroundColor: "green",
	}
});

const Field: React.FC<Props> = (props: Props) => {
	const foodCoordinates = useSelector((state: RootState) => state.game.foodPoint);
	const snake = useSelector((state: RootState) => state.game.snake);

	const classes = useStyles();

	const generateFieldClass = (x: number, y: number): string => {
		if (foodCoordinates?.x === x && foodCoordinates?.y === y) {
			return `${classes.field} ${classes.fieldWithFood}`;
		}
		if (snake.points.some(point => point.x === x && point.y === y)) {
			return `${classes.field} ${classes.fieldWithSnake}`;
		}
		return classes.field;
	}

    return (
        <div className={generateFieldClass(props.coordinateX, props.coordinateY)} />
    )
}

export default Field;