import { Point } from "../features/game/gameSlice";

export const pointEquals = (a: Point, b: Point): boolean => {
    return a.x === b.x && a.y === b.y;
}

export const pointsIncludes = (points: Point[], searchingPoint: Point): boolean => {
    return points.some(point => pointEquals(point, searchingPoint));
}

export const generateAvailableRandomPoint = (pointsToAvoid: Point[], maxNumber: number): Point => {
	
	const generateRandomPoint = (): Point => {
		const randomCoordinate = (): number => Math.floor(Math.random() * maxNumber);
		return { x: randomCoordinate(), y: randomCoordinate() };
	}
	let randomPoint: Point;
	do {
		randomPoint = generateRandomPoint();
	} while (pointsIncludes(pointsToAvoid, randomPoint)); 
	return randomPoint;
};
