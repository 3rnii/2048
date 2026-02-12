import { isNil } from "lodash";
import { Tile } from "../../common/types";
import { flattenDeep } from "lodash";

type ProcessedMovementPayload = {
    board: string[][],
    tiles: Record<string, Tile>,
    tilesByIds: string[]
};

export const intializeBoard = () => {
    const board: string[][] = [];

    for (let i  = 0; i < 4; i++) {
        board[i] = new Array(4).fill(null)
    }

    return board;
}

export const sanitizeTiles = (board: string[][], tiles: Record<string, Tile>): Record<string, Tile> => {
    const flattenBoard = flattenDeep(board);
    const validTileIds = flattenBoard.filter((tileId: string) => !isNil(tileId)) as string[];

    return Object.keys(tiles).reduce((acc, tileId) => {
        if (validTileIds.includes(tileId)) {
            acc[tileId] = tiles[tileId];
        }

        return acc;
    }, {} as Record<string, Tile>);
}

export const mergeYTiles = (tile1: Tile, tile2: Tile, columnPosition: number): [Tile, Tile] => {
    return [
        {
            ...tile1,
            value: tile1.value! * 2
        },
        {
            ...tile2,
            position: [tile1.position[0], columnPosition - 1]
        }
    ];
};

export const mergeXTiles = (tile1: Tile, tile2: Tile, rowPosition: number): [Tile, Tile] => {
    return [
        {
            ...tile1,
            value: tile1.value! * 2
        },
        {
            ...tile2,
            position: [rowPosition - 1, tile1.position[1]]
        }
    ];
};

export const processTileAndBoardOnUpMovement = (currentBoard: string[][], currentTiles: Record<string, Tile>): ProcessedMovementPayload => {
    const newBoard = intializeBoard();
    let newTiles: Record<string, Tile> = {};

    for (let x = 0; x < 4; x++) {
        let newY = 0;
        let previousTile: Tile | null = null;
        let previousTileId: string | null = null;

        for (let y = 0; y < 4; y++) {
            const tileId = currentBoard[y][x];
            if (isNil(tileId)) continue;

            const currentTile = currentTiles[tileId];

            if (previousTile && previousTile.value === currentTile.value) {
                const [processedPreviousTile, processedCurrentTile] = mergeYTiles(previousTile, currentTile, newY);
                newTiles[previousTileId!] = processedPreviousTile;
                newTiles[tileId] = processedCurrentTile;
                previousTile = null;
                previousTileId = null;
                continue;
            }

            newBoard[newY][x] = tileId;
            newTiles[tileId] = { ...currentTile, position: [x, newY] };
            previousTile = newTiles[tileId];
            previousTileId = tileId;
            newY++;
        }
    }

    const sanitizedTiles = sanitizeTiles(newBoard, newTiles);

    return {
        board: newBoard,
        tiles: sanitizedTiles,
        tilesByIds: Object.keys(sanitizedTiles)
    };
};

export const processTilesAndBoardOnDownMovement = (currentBoard: string[][], currentTiles: Record<string, Tile>): ProcessedMovementPayload => {
    const newBoard = intializeBoard();
    let newTiles: Record<string, Tile> = {};

        for (let x = 0; x < 4; x++) {
            let newY = 3;
            let previousTile: Tile | null = null;
            let previousTileId: string | null = null;

            for (let y = 3; y >= 0; y--) {
                const tileId = currentBoard[y][x];
                if (isNil(tileId)) continue;

                const currentTile = currentTiles[tileId];

                if (previousTile && previousTile.value === currentTile.value) {
                    const [processedPreviousTile, processedCurrentTile] = mergeYTiles(previousTile, currentTile, newY);
                    newTiles[previousTileId!] = processedPreviousTile;
                    newTiles[tileId] = processedCurrentTile;
                    previousTile = null;
                    previousTileId = null;
                    continue;
                }

                newBoard[newY][x] = tileId;
                newTiles[tileId] = { ...currentTile, position: [x, newY] };
                previousTile = newTiles[tileId];
                previousTileId = tileId;
                newY--;
            }
        }

    const sanitizedTiles = sanitizeTiles(newBoard, newTiles);

    return {
        board: newBoard,
        tiles: sanitizedTiles,
        tilesByIds: Object.keys(sanitizedTiles)
    }
}

export const processTilesAndBoardOnLeftMovement = (currentBoard: string[][], currentTiles: Record<string, Tile>): ProcessedMovementPayload => {
    const newBoard = intializeBoard();
    let newTiles: Record<string, Tile> = {};

    for (let y = 0; y < 4; y++) {
        let newX = 0;
        let previousTile: Tile | null = null;
        let previousTileId: string | null = null;

        for (let x = 0; x < 4; x++) {
            const tileId = currentBoard[y][x];
            if (isNil(tileId)) continue;

            const currentTile = currentTiles[tileId];

            if (previousTile && previousTile.value === currentTile.value) {
                const [processedPreviousTile, processedCurrentTile] = mergeXTiles(previousTile, currentTile, newX);
                newTiles[previousTileId!] = processedPreviousTile;
                newTiles[tileId] = processedCurrentTile;
                previousTile = null;
                previousTileId = null;
                continue;
            }

            newBoard[y][newX] = tileId;
            newTiles[tileId] = { ...currentTile, position: [newX, y] };
            previousTile = newTiles[tileId];
            previousTileId = tileId;
            newX++;
        }
    }

    const sanitizedTiles = sanitizeTiles(newBoard, newTiles);

    return {
        board: newBoard,
        tiles: sanitizedTiles,
        tilesByIds: Object.keys(sanitizedTiles)
    }
}

export const processTilesAndBoardOnRightMovement = (currentBoard: string[][], currentTiles: Record<string, Tile>): ProcessedMovementPayload => {
    const newBoard = intializeBoard();
    let newTiles: Record<string, Tile> = {};

    for (let y = 0; y < 4; y++) {
        let newX = 3;
        let previousTile: Tile | null = null;
        let previousTileId: string | null = null;

        for (let x = 3; x >= 0; x--) {
            const tileId = currentBoard[y][x];
            if (isNil(tileId)) continue;

            const currentTile = currentTiles[tileId];

            if (previousTile && previousTile.value === currentTile.value) {
                const [processedPreviousTile, processedCurrentTile] = mergeXTiles(previousTile, currentTile, newX);
                newTiles[previousTileId!] = processedPreviousTile;
                newTiles[tileId] = processedCurrentTile;
                previousTile = null;
                previousTileId = null;
                continue;
            }

            newBoard[y][newX] = tileId;
            newTiles[tileId] = { ...currentTile, position: [newX, y] };
            previousTile = newTiles[tileId];
            previousTileId = tileId;
            newX--;
        }
    }

    const sanitizedTiles = sanitizeTiles(newBoard, newTiles);

    return {
        board: newBoard,
        tiles: sanitizedTiles,
        tilesByIds: Object.keys(sanitizedTiles)
    }
}

export const doesBoardContainViableMove = (board: string[][], tiles: Record<string, Tile>) => {
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