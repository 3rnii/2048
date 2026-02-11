import { describe, it, expect } from 'vitest';
import { keys, actions } from '../actions';

describe('keys', () => {
  it('has expected action type constants', () => {
    expect(keys.reset).toBe('RESET');
    expect(keys.createTile).toBe('CREATE_TILE');
    expect(keys.moveUp).toBe('MOVE_UP');
    expect(keys.moveDown).toBe('MOVE_DOWN');
    expect(keys.moveLeft).toBe('MOVE_LEFT');
    expect(keys.moveRight).toBe('MOVE_RIGHT');
    expect(keys.updateStatus).toBe('UPDATE_STATUS');
    expect(keys.updateHasMoved).toBe('UPDATE_HAS_MOVED');
    expect(keys.updateLock).toBe('UPDATE_LOCK');
  });
});

describe('actions', () => {
  it('reset returns plain object with type RESET', () => {
    expect(actions.reset).toEqual({ type: keys.reset });
  });

  it('createTile returns action with position and value in payload', () => {
    const position: [number, number] = [1, 2];
    const value = 4;
    const action = actions.createTile(position, value);

    expect(action).toEqual({
      type: keys.createTile,
      payload: { position, value },
    });
  });

  it('moveUp returns plain object with type MOVE_UP', () => {
    expect(actions.moveUp).toEqual({ type: keys.moveUp });
  });

  it('moveDown returns plain object with type MOVE_DOWN', () => {
    expect(actions.moveDown).toEqual({ type: keys.moveDown });
  });

  it('moveLeft returns plain object with type MOVE_LEFT', () => {
    expect(actions.moveLeft).toEqual({ type: keys.moveLeft });
  });

  it('moveRight returns plain object with type MOVE_RIGHT', () => {
    expect(actions.moveRight).toEqual({ type: keys.moveRight });
  });

  it('updateStatus returns action with status in payload', () => {
    const action = actions.updateStatus('playing');
    expect(action).toEqual({
      type: keys.updateStatus,
      payload: { status: 'playing' },
    });
  });

  it('hasMoved returns plain object with type UPDATE_HAS_MOVED', () => {
    expect(actions.hasMoved).toEqual({ type: keys.updateHasMoved });
  });

  it('updateLock returns action with isLocked in payload', () => {
    expect(actions.updateLock(true)).toEqual({
      type: keys.updateLock,
      payload: { isLocked: true },
    });
    expect(actions.updateLock(false)).toEqual({
      type: keys.updateLock,
      payload: { isLocked: false },
    });
  });
});
