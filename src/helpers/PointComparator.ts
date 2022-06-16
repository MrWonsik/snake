import { Point } from "../features/game/gameSlice";

export const pointEquals = (a: Point, b: Point): boolean => {
    return a.x === b.x && a.y === b.y;
}