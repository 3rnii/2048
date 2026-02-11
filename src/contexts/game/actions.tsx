import { GameState } from "../../common/types";

export const keys = {
    reset: 'RESET',
    createTile: 'CREATE_TILE',
    moveUp: 'MOVE_UP',
    moveDown: 'MOVE_DOWN',
    moveLeft: 'MOVE_LEFT',
    moveRight: 'MOVE_RIGHT',
    updateStatus: 'UPDATE_STATUS',
    updateHasMoved: 'UPDATE_HAS_MOVED',
    updateLock: 'UPDATE_LOCK'
} as const;

export type Action =
    | { type: typeof keys.reset }
    | { type: typeof keys.createTile; payload: { position: [number, number], value: number } }
    | { type: typeof keys.moveUp }
    | { type: typeof keys.moveDown }
    | { type: typeof keys.moveLeft }
    | { type: typeof keys.moveRight }
    | { type: typeof keys.updateStatus; payload: { status: GameState } }
    | { type: typeof keys.updateHasMoved }
    | { type: typeof keys.updateLock; payload: { isLocked: boolean } };

export const actions = {
    reset: { type: keys.reset },
    createTile: (position: [number, number], value: number): Action => ({
        type: keys.createTile,
        payload: { position, value },
    }),
    moveUp: { type: keys.moveUp },
    moveDown: { type: keys.moveDown },
    moveLeft: { type: keys.moveLeft },
    moveRight: { type: keys.moveRight },
    updateStatus: (status: GameState): Action => ({
        type: keys.updateStatus,
        payload: { status }
    }),
    hasMoved: { type: keys.updateHasMoved },
    updateLock: (isLocked: boolean): Action => ({
        type: keys.updateLock,
        payload: { isLocked }
    })

};
