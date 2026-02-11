import { useReducer } from "react";
import { nanoid } from "nanoid";
import { keys as gameKeys, actions as gameActions, type Action } from './actions';
import { Coordinate, GameState, Tile } from "../../common/types";
import { intializeBoard, processTileAndBoardOnUpMovement, processTilesAndBoardOnDownMovement, processTilesAndBoardOnLeftMovement, processTilesAndBoardOnRightMovement } from './helper';

type State = {
    board: string[][];
    tiles: {
        [id: string]: Tile
    },
    tilesByIds: string[];
    gameStatus: GameState;
    hasMoved?: boolean;
    previousBoard?: string[][];
}

export const initialState: State = {
    board: intializeBoard(),
    tiles: {},
    tilesByIds: [],
    gameStatus: 'new',
    previousBoard: undefined,
}

export const gameReducer = (state: State = initialState, action: Action) => {
    switch (action.type) {
        case gameKeys.createTile: {
            const id = nanoid(8);
            const [xPosition, yPosition] = action.payload.position;
            const copiedBoard = state.board.map(row => row.slice());
            copiedBoard[yPosition][xPosition] = id;

            return {
                ...state,
                board: copiedBoard,
                tiles: {
                    ...state.tiles,
                    [id]: {
                        id,
                        position: action.payload.position,
                        value: action.payload.value
                    }
                },
                tilesByIds: [...state.tilesByIds, id]
            };
        }
        case gameKeys.moveUp:
            return {
                ...state,
                previousBoard: state.board,
                ...processTileAndBoardOnUpMovement(state.board, state.tiles),
                hasMoved: true
            }
        case gameKeys.moveDown:
            return {
                ...state,
                previousBoard: state.board,
                ...processTilesAndBoardOnDownMovement(state.board, state.tiles),
                hasMoved: true
            }
        case gameKeys.moveLeft:
            return {
                ...state,
                previousBoard: state.board,
                ...processTilesAndBoardOnLeftMovement(state.board, state.tiles),
                hasMoved: true
            }
        case gameKeys.moveRight:
            return {
                ...state,
                previousBoard: state.board,
                ...processTilesAndBoardOnRightMovement(state.board, state.tiles),
                hasMoved: true
            }
        case gameKeys.updateStatus:
            return {
                ...state,
                gameStatus: action.payload.status
            }
        case gameKeys.updateHasMoved:
            return {
                ...state,
                hasMoved: false
            }
        case gameKeys.reset:
            return initialState;
        default:
            return state;
    }
}

export default function useGameReducer() {
    const [state, dispatch] = useReducer(gameReducer, initialState);

    const getTiles = () => {
        return state.tilesByIds.filter(id => !!id).map(id => state.tiles[id]);
    }

    const getEmptyTiles = () => {
        const emptyTiles: Coordinate[] = [];

        state.board.forEach((row, y) => {
            row.forEach((tileId, x) => {
                if (!tileId) {
                    emptyTiles.push([x, y]);
                }
            })
        });
        return emptyTiles;
    }

    const getBoardAndTiles = () => {
        return {
            board: state.board,
            tiles: state.tiles
        };
    }

    return {
        actions: {
            reset: () => dispatch(gameActions.reset),
            createTile: (position: Coordinate, value: number) => dispatch(gameActions.createTile(position, value)),
            moveUp: () => dispatch(gameActions.moveUp),
            moveDown: () => dispatch(gameActions.moveDown),
            moveLeft: () => dispatch(gameActions.moveLeft),
            moveRight: () => dispatch(gameActions.moveRight),
            updateStatus: (status: GameState) => dispatch(gameActions.updateStatus(status)),
            updateHasMoved: () => dispatch(gameActions.hasMoved),
            updateLock: (isLocked: boolean) => dispatch(gameActions.updateLock(isLocked))
        },
        getTiles,
        getEmptyTiles,
        getBoardAndTiles,
        status: state.gameStatus,
        hasMoved: state.hasMoved,
        previousBoard: state.previousBoard
    };
}