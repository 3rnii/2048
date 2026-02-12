import { describe, it, expect } from 'vitest';
import {
  intializeBoard,
  sanitizeTiles,
  mergeYTiles,
  mergeXTiles,
  processTileAndBoardOnUpMovement,
  processTilesAndBoardOnDownMovement,
  processTilesAndBoardOnLeftMovement,
  processTilesAndBoardOnRightMovement,
  doesBoardContainViableMove,
} from '../helper';
import type { Tile } from '../../../common/types';

describe('intializeBoard', () => {
  it('returns a 4x4 array', () => {
    const board = intializeBoard();
    expect(board).toHaveLength(4);
    expect(board.every((row) => row.length === 4)).toBe(true);
  });

  it('fills every cell with null', () => {
    const board = intializeBoard();
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        expect(board[y][x]).toBeNull();
      }
    }
  });
});

describe('sanitizeTiles', () => {
  it('keeps only tiles whose id appears on the board', () => {
    const board = [
      ['a', null, null, null],
      [null, 'b', null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const tiles: Record<string, Tile> = {
      a: { id: 'a', position: [0, 0], value: 2 },
      b: { id: 'b', position: [1, 1], value: 4 },
      c: { id: 'c', position: [2, 2], value: 8 },
    };
    const result = sanitizeTiles(board, tiles);
    expect(Object.keys(result)).toEqual(['a', 'b']);
    expect(result.a).toEqual(tiles.a);
    expect(result.b).toEqual(tiles.b);
    expect(result.c).toBeUndefined();
  });

  it('returns empty object when board has no tile ids', () => {
    const board = intializeBoard();
    const tiles: Record<string, Tile> = {
      x: { id: 'x', position: [0, 0], value: 2 },
    };
    const result = sanitizeTiles(board, tiles);
    expect(result).toEqual({});
  });
});

describe('mergeYTiles', () => {
  it('doubles first tile value and moves second to columnPosition - 1', () => {
    const tile1: Tile = { id: '1', position: [0, 0], value: 4 };
    const tile2: Tile = { id: '2', position: [0, 1], value: 4 };
    const [merged1, merged2] = mergeYTiles(tile1, tile2, 2);

    expect(merged1.value).toBe(8);
    expect(merged2.position).toEqual([0, 1]); // tile1.position[0], columnPosition - 1
  });
});

describe('mergeXTiles', () => {
  it('doubles first tile value and moves second to rowPosition - 1', () => {
    const tile1: Tile = { id: '1', position: [0, 0], value: 2 };
    const tile2: Tile = { id: '2', position: [1, 0], value: 2 };
    const [merged1, merged2] = mergeXTiles(tile1, tile2, 2);

    expect(merged1.value).toBe(4);
    expect(merged2.position).toEqual([1, 0]); // rowPosition - 1, tile1.position[1]
  });
});

describe('processTileAndBoardOnUpMovement', () => {
  it('returns board, tiles, and tilesByIds', () => {
    const board = intializeBoard();
    const tiles: Record<string, Tile> = {};
    const result = processTileAndBoardOnUpMovement(board, tiles);

    expect(result).toHaveProperty('board');
    expect(result).toHaveProperty('tiles');
    expect(result).toHaveProperty('tilesByIds');
    expect(Array.isArray(result.tilesByIds)).toBe(true);
  });

  it('moves a single tile to the top of its column', () => {
    const board = [
      [null, null, null, null],
      [null, null, null, null],
      [null, 't1', null, null],
      [null, null, null, null],
    ];
    const tiles: Record<string, Tile> = {
      t1: { id: 't1', position: [1, 2], value: 2 },
    };
    const result = processTileAndBoardOnUpMovement(board, tiles);

    expect(result.board[0][1]).toBe('t1');
    expect(result.tiles['t1'].position).toEqual([1, 0]);
    expect(result.tilesByIds).toContain('t1');
  });

  it('merges two adjacent same-value tiles in the same column', () => {
    const board = [
      [null, null, null, null],
      ['a', null, null, null],
      ['b', null, null, null],
      [null, null, null, null],
    ];
    const tiles: Record<string, Tile> = {
      a: { id: 'a', position: [0, 1], value: 2 },
      b: { id: 'b', position: [0, 2], value: 2 },
    };
    const result = processTileAndBoardOnUpMovement(board, tiles);

    expect(result.board[0][0]).toBe('a');
    expect(result.tiles['a'].value).toBe(4);
    expect(result.tilesByIds).toContain('a');
  });

    it('does not merge the two adjacent same-value tiles in the same column and shifts it to the correct position', () => {
    const board = [
      [null, null, null, null],
      ['a', null, null, null],
      ['b', null, null, null],
      [null, null, null, null],
    ];
    const tiles: Record<string, Tile> = {
      a: { id: 'a', position: [0, 1], value: 2 },
      b: { id: 'b', position: [0, 2], value: 4 },
    };
    const result = processTileAndBoardOnUpMovement(board, tiles);

    expect(result.board[0][0]).toBe('a');
    expect(result.board[1][0]).toBe('b');
    expect(result.tiles['a'].value).toBe(2);
    expect(result.tilesByIds).toContain('a');
  });
});

describe('processTilesAndBoardOnDownMovement', () => {
  it('moves a single tile to the bottom of its column', () => {
    const board = [
      ['t1', null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const tiles: Record<string, Tile> = {
      t1: { id: 't1', position: [0, 0], value: 2 },
    };
    const result = processTilesAndBoardOnDownMovement(board, tiles);

    expect(result.board[3][0]).toBe('t1');
    expect(result.tiles['t1'].position).toEqual([0, 3]);
  });

    it('merges two adjacent same-value tiles in the same column', () => {
    const board = [
      [null, null, null, null],
      ['a', null, null, null],
      ['b', null, null, null],
      [null, null, null, null],
    ];
    const tiles: Record<string, Tile> = {
      a: { id: 'a', position: [0, 1], value: 2 },
      b: { id: 'b', position: [0, 2], value: 2 },
    };
    const result = processTilesAndBoardOnDownMovement(board, tiles);

    expect(result.board[3][0]).toBe('b');
    expect(result.tiles['b'].value).toBe(4);
  });

  it('does not merge the two adjacent same-value tiles in the same column and shifts it to the correct position', () => {
    const board = [
      [null, null, null, null],
      ['a', null, null, null],
      ['b', null, null, null],
      [null, null, null, null],
    ];
    const tiles: Record<string, Tile> = {
      a: { id: 'a', position: [0, 1], value: 2 },
      b: { id: 'b', position: [0, 2], value: 4 },
    };
    const result = processTilesAndBoardOnDownMovement(board, tiles);

    expect(result.board[3][0]).toBe('b');
    expect(result.board[2][0]).toBe('a');
    expect(result.tiles['b'].value).toBe(4);
  });
});

describe('processTilesAndBoardOnLeftMovement', () => {
  it('moves a single tile to the left of its row', () => {
    const board = [
      [null, null, 't1', null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const tiles: Record<string, Tile> = {
      t1: { id: 't1', position: [2, 0], value: 2 },
    };
    const result = processTilesAndBoardOnLeftMovement(board, tiles);

    expect(result.board[0][0]).toBe('t1');
    expect(result.tiles['t1'].position).toEqual([0, 0]);
  });

  it('merges two adjacent same-value tiles in the same row', () => {
    const board = [
      [null, null, null, null],
      ['a', 'b', null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const tiles: Record<string, Tile> = {
      a: { id: 'a', position: [1, 1], value: 2 },
      b: { id: 'b', position: [1, 2], value: 2 },
    };
    const result = processTilesAndBoardOnLeftMovement(board, tiles);

    expect(result.board[1][0]).toBe('a');
    expect(result.tiles['a'].value).toBe(4);
  });

    it('does not merge the two adjacent same-value tiles in the same row and shifts it to the correct position', () => {
    const board = [
      [null, null, null, null],
      ['a', 'b', null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const tiles: Record<string, Tile> = {
      a: { id: 'a', position: [1, 1], value: 2 },
      b: { id: 'b', position: [1, 2], value: 4 },
    };
    const result = processTilesAndBoardOnLeftMovement(board, tiles);

    expect(result.board[1][0]).toBe('a');
    expect(result.board[1][1]).toBe('b');
    expect(result.tiles['b'].value).toBe(4);
  });
});

describe('processTilesAndBoardOnRightMovement', () => {
  it('moves a single tile to the right of its row', () => {
    const board = [
      ['t1', null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const tiles: Record<string, Tile> = {
      t1: { id: 't1', position: [0, 0], value: 2 },
    };
    const result = processTilesAndBoardOnRightMovement(board, tiles);

    expect(result.board[0][3]).toBe('t1');
    expect(result.tiles['t1'].position).toEqual([3, 0]);
  });

   it('merges two adjacent same-value tiles in the same row', () => {
    const board = [
      [null, null, null, null],
      ['a', 'b', null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const tiles: Record<string, Tile> = {
      a: { id: 'a', position: [0, 1], value: 2 },
      b: { id: 'b', position: [0, 2], value: 2 },
    };
    const result = processTilesAndBoardOnRightMovement(board, tiles);

    expect(result.board[1][3]).toBe('b');
    expect(result.tiles['b'].value).toBe(4);
  });

    it('does not merge the two adjacent same-value tiles in the same row and shifts it to the correct position', () => {
    const board = [
      [null, null, null, null],
      ['a', 'b', null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const tiles: Record<string, Tile> = {
      a: { id: 'a', position: [0, 1], value: 2 },
      b: { id: 'b', position: [0, 2], value: 4 },
    };
    const result = processTilesAndBoardOnRightMovement(board, tiles);

    expect(result.board[1][2]).toBe('a');
    expect(result.board[1][3]).toBe('b');
    expect(result.tiles['b'].value).toBe(4);
  });
});

describe('doesBoardContainViableMove', () => {
  it('returns false for empty board (no tiles to move)', () => {
    const board = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ] as unknown as string[][];
    const tiles: Record<string, Tile> = {};
    expect(doesBoardContainViableMove(board, tiles)).toBe(false);
  });

  it('returns true when a single tile can be moved in at least one direction', () => {
    const board = [
      [null, null, null, null],
      [null, null, null, null],
      [null, 't1', null, null],
      [null, null, null, null],
    ] as unknown as string[][];
    const tiles: Record<string, Tile> = {
      t1: { id: 't1', position: [1, 2], value: 2 },
    };
    expect(doesBoardContainViableMove(board, tiles)).toBe(true);
  });

  it('returns true when board has one empty cell (tiles can shift)', () => {
    const board = [
      ['a', 'b', 'c', null],
      ['d', 'e', 'f', 'g'],
      ['h', 'i', 'j', 'k'],
      ['l', 'm', 'n', 'o'],
    ] as unknown as string[][];
    const tiles: Record<string, Tile> = {
      a: { id: 'a', position: [0, 0], value: 2 },
      b: { id: 'b', position: [1, 0], value: 4 },
      c: { id: 'c', position: [2, 0], value: 8 },
      d: { id: 'd', position: [0, 1], value: 16 },
      e: { id: 'e', position: [1, 1], value: 32 },
      f: { id: 'f', position: [2, 1], value: 64 },
      g: { id: 'g', position: [3, 1], value: 128 },
      h: { id: 'h', position: [0, 2], value: 256 },
      i: { id: 'i', position: [1, 2], value: 512 },
      j: { id: 'j', position: [2, 2], value: 1024 },
      k: { id: 'k', position: [3, 2], value: 2 },
      l: { id: 'l', position: [0, 3], value: 4 },
      m: { id: 'm', position: [1, 3], value: 8 },
      n: { id: 'n', position: [2, 3], value: 16 },
      o: { id: 'o', position: [3, 3], value: 2048 },
    };
    expect(doesBoardContainViableMove(board, tiles)).toBe(true);
  });

  it('returns true when full board has two adjacent same values in a row (merge possible)', () => {
    const board = [
      ['a', 'b', 'c', 'd'],
      ['e', 'f', 'f2', 'g'],
      ['h', 'i', 'j', 'k'],
      ['l', 'm', 'n', 'o'],
    ] as string[][];
    const tiles: Record<string, Tile> = {
      a: { id: 'a', position: [0, 0], value: 2 },
      b: { id: 'b', position: [1, 0], value: 4 },
      c: { id: 'c', position: [2, 0], value: 8 },
      d: { id: 'd', position: [3, 0], value: 16 },
      e: { id: 'e', position: [0, 1], value: 32 },
      f: { id: 'f', position: [1, 1], value: 64 },
      f2: { id: 'f2', position: [2, 1], value: 64 },
      g: { id: 'g', position: [3, 1], value: 128 },
      h: { id: 'h', position: [0, 2], value: 256 },
      i: { id: 'i', position: [1, 2], value: 512 },
      j: { id: 'j', position: [2, 2], value: 1024 },
      k: { id: 'k', position: [3, 2], value: 2 },
      l: { id: 'l', position: [0, 3], value: 4 },
      m: { id: 'm', position: [1, 3], value: 8 },
      n: { id: 'n', position: [2, 3], value: 16 },
      o: { id: 'o', position: [3, 3], value: 2048 },
    };
    expect(doesBoardContainViableMove(board, tiles)).toBe(true);
  });

  it('returns true when full board has two adjacent same values in a column (merge possible)', () => {
    const board = [
      ['a', 'b', 'c', 'd'],
      ['e', 'f', 'g', 'h'],
      ['i', 'j', 'k', 'l'],
      ['m', 'n', 'n2', 'o'],
    ] as string[][];
    const tiles: Record<string, Tile> = {
      a: { id: 'a', position: [0, 0], value: 2 },
      b: { id: 'b', position: [1, 0], value: 4 },
      c: { id: 'c', position: [2, 0], value: 8 },
      d: { id: 'd', position: [3, 0], value: 16 },
      e: { id: 'e', position: [0, 1], value: 32 },
      f: { id: 'f', position: [1, 1], value: 64 },
      g: { id: 'g', position: [2, 1], value: 128 },
      h: { id: 'h', position: [3, 1], value: 256 },
      i: { id: 'i', position: [0, 2], value: 512 },
      j: { id: 'j', position: [1, 2], value: 1024 },
      k: { id: 'k', position: [2, 2], value: 2 },
      l: { id: 'l', position: [3, 2], value: 4 },
      m: { id: 'm', position: [0, 3], value: 8 },
      n: { id: 'n', position: [1, 3], value: 16 },
      n2: { id: 'n2', position: [2, 3], value: 16 },
      o: { id: 'o', position: [3, 3], value: 2048 },
    };
    expect(doesBoardContainViableMove(board, tiles)).toBe(true);
  });

  it('returns false when board is full and no adjacent same values (no merge, no empty)', () => {
    const board = [
      ['a', 'b', 'c', 'd'],
      ['e', 'f', 'g', 'h'],
      ['i', 'j', 'k', 'l'],
      ['m', 'n', 'o', 'p'],
    ] as string[][];
    const tiles: Record<string, Tile> = {
      a: { id: 'a', position: [0, 0], value: 2 },
      b: { id: 'b', position: [1, 0], value: 4 },
      c: { id: 'c', position: [2, 0], value: 8 },
      d: { id: 'd', position: [3, 0], value: 16 },
      e: { id: 'e', position: [0, 1], value: 32 },
      f: { id: 'f', position: [1, 1], value: 64 },
      g: { id: 'g', position: [2, 1], value: 128 },
      h: { id: 'h', position: [3, 1], value: 256 },
      i: { id: 'i', position: [0, 2], value: 512 },
      j: { id: 'j', position: [1, 2], value: 1024 },
      k: { id: 'k', position: [2, 2], value: 2 },
      l: { id: 'l', position: [3, 2], value: 4 },
      m: { id: 'm', position: [0, 3], value: 8 },
      n: { id: 'n', position: [1, 3], value: 16 },
      o: { id: 'o', position: [2, 3], value: 2048 },
      p: { id: 'p', position: [3, 3], value: 4096 },
    };
    expect(doesBoardContainViableMove(board, tiles)).toBe(false);
  });

  it('returns true when only one direction changes the board (e.g. tile at top can move down)', () => {
    const board = [
      ['t1', null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ] as unknown as string[][];
    const tiles: Record<string, Tile> = {
      t1: { id: 't1', position: [0, 0], value: 2 },
    };
    expect(doesBoardContainViableMove(board, tiles)).toBe(true);
  });
});
