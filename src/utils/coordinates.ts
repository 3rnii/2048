import { Coordinate } from "../common/types";

const MIN_INDEX = 0;
const MAX_INDEX = 3;

export const getRandomCoordinate = (): Coordinate => {
    return [
        Math.floor(Math.random() * (MAX_INDEX - MIN_INDEX + 1)) + MIN_INDEX,
        Math.floor(Math.random() * (MAX_INDEX - MIN_INDEX + 1)) + MIN_INDEX,
    ];
}

export const coordinatesEqual = (a: Coordinate, b: Coordinate): boolean => {
    return a[0] === b[0] && a[1] === b[1];
}
