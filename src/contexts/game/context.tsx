import { createContext, FC, ReactNode, useEffect, useState } from "react";
import useGameReducer from './reducer';
import { noop } from "../../utils";
import { Coordinate, GameState, Movement, Tile } from "../../common/types";
import { coordinatesEqual, getRandomCoordinate } from "../../utils/coordinates";
import { isNil, flattenDeep } from "lodash";
import { processTileAndBoardOnUpMovement, processTilesAndBoardOnDownMovement, processTilesAndBoardOnLeftMovement, processTilesAndBoardOnRightMovement } from './helper';

export const GameContext = createContext({
    startGame: noop,
    getTiles: () => [] as Tile[],
    getTileAtPosition: (_: Coordinate) => undefined as Tile | undefined,
    getCurrentBoardValues: () => [] as (number | null)[][],
    hasMoved: false,
    move: (_: Movement) => {},
    status: 'new' as GameState,
    resetGame: noop,
    setLock: (_: boolean) => {},
    isLocked: false
});

type GameProviderProps = {
    children: ReactNode;
};

export const GameProvider: FC<GameProviderProps> = ({ children }) => {
    const { getTiles, getEmptyTiles, hasMoved, actions, status, getBoardAndTiles, previousBoard } = useGameReducer();
    const [lock, setLock] = useState(false);

    const startGame = () => {
        const MIN_INDEX = 2;
        const MAX_INDEX = 16;
        const numberOfNewTiles = Math.floor(Math.random() * (MAX_INDEX - MIN_INDEX + 1)) + MIN_INDEX;
        const newCoordinates: Coordinate[] = [];

        while (newCoordinates.length < numberOfNewTiles) {
            const current = getRandomCoordinate();
            const isDistinct = !newCoordinates.some((c) => coordinatesEqual(c, current));
            if (isDistinct) {
                newCoordinates.push(current);
            }
        }

        actions.reset();
        newCoordinates.forEach((coord: Coordinate) => {
            actions.createTile(coord, 2);
        });
    }

    const resetGame = () => {
        actions.reset();
        startGame();
    }

    const addRandomTile = () => {
        const hasEmptyTiles = getEmptyTiles().length > 0;
        if (hasEmptyTiles) {
            const randomTile = getEmptyTiles()[Math.floor(Math.random() * getEmptyTiles().length)];
            const randomValue = Math.random() < 0.5 ? 2 : 4;

            actions.createTile(randomTile, randomValue);
        }
    }

    const move = (movement: Movement) => {
        switch (movement) {
            case 'down':
                actions.moveDown();
                break;
            case 'up':
                actions.moveUp();
                break;
            case 'left':
                actions.moveLeft();
                break;
            case 'right':
                actions.moveRight();
                break;
            default:
                break;
        }
        actions.updateStatus('playing');
    }

    const getTileAtPosition = (position: Coordinate) => {
        return getTiles().find(tile => {
            if (isNil(tile)) return false;

            return coordinatesEqual(tile.position, position);
        });
    }

    const canMakeAnyMove = () => {
        const { board, tiles } = getBoardAndTiles();

        // Check if any move would result in a different board state
        const upResult = processTileAndBoardOnUpMovement(board, tiles);
        const downResult = processTilesAndBoardOnDownMovement(board, tiles);
        const leftResult = processTilesAndBoardOnLeftMovement(board, tiles);
        const rightResult = processTilesAndBoardOnRightMovement(board, tiles);

        // Compare board states - if any move changes the board, a move is possible
        const boardToString = (b: string[][]) => JSON.stringify(b);
        const currentBoardStr = boardToString(board);

        return (
            boardToString(upResult.board) !== currentBoardStr ||
            boardToString(downResult.board) !== currentBoardStr ||
            boardToString(leftResult.board) !== currentBoardStr ||
            boardToString(rightResult.board) !== currentBoardStr
        );
    }

    const checkState = () => {
        const tiles = getTiles();

        const hasWinningTile = tiles.some(tile => tile.value === 2048);
        if (hasWinningTile) {
            return actions.updateStatus('won');
        }

        // Check if board is full and no moves are possible
        const emptyTiles = getEmptyTiles();
        const isBoardFull = emptyTiles.length === 0;

        if (isBoardFull && !canMakeAnyMove()) {
            actions.updateStatus('lost');
        }
    }

    const getCurrentBoardValues = () => {
        const { board, tiles } = getBoardAndTiles();
        
        const boardWithValues = board.map(row => 
            row.map(cellId => {
                const tileValue = tiles[cellId];
                return tileValue?.value ?? null;
            })
        );
        
        return boardWithValues;
    }

    const isCurrentBoardIdenticalToPrevious = () => {
        const { board } = getBoardAndTiles();
        if (!previousBoard) return false;

        const currentBoard = flattenDeep(board);
        const previousBoardFlat = flattenDeep(previousBoard);
        
        return currentBoard.every((cell: string, index: number) => cell === previousBoardFlat[index]);
    }

    useEffect(() => {
        checkState();
        if (hasMoved && !isCurrentBoardIdenticalToPrevious()) {
            addRandomTile();
        }
        actions.updateHasMoved();

    }, [hasMoved, previousBoard]);

    return (
        <GameContext.Provider value={{
            startGame,
            getTiles,
            getTileAtPosition,
            getCurrentBoardValues,
            hasMoved: hasMoved ?? false,
            move,
            status,
            resetGame,
            setLock,
            isLocked: lock
        }}>
            { children }
        </GameContext.Provider>
    )
}