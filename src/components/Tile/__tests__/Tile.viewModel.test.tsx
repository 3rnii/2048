import { describe, it, expect } from 'vitest';
import useTileViewModel, { valueBgClass } from '../Tile.viewModel';

describe('Tile viewModel', () => {
  describe('valueBgClass', () => {
    it('has expected keys for powers of 2 from 2 to 2048', () => {
      const expectedKeys = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];
      expectedKeys.forEach((key) => {
        expect(valueBgClass[key]).toBeDefined();
        expect(typeof valueBgClass[key]).toBe('string');
      });
    });

    it('maps 2 to amber styling', () => {
      expect(valueBgClass[2]).toContain('amber');
    });

    it('maps 4 to amber styling', () => {
      expect(valueBgClass[4]).toContain('amber');
    });

    it('maps 8 and 16 to orange styling', () => {
      expect(valueBgClass[8]).toContain('orange');
      expect(valueBgClass[16]).toContain('orange');
    });

    it('maps 64 to red styling', () => {
      expect(valueBgClass[64]).toContain('red');
    });

    it('maps 128, 256, 512, 1024 to yellow styling', () => {
      expect(valueBgClass[128]).toContain('yellow');
      expect(valueBgClass[256]).toContain('yellow');
      expect(valueBgClass[512]).toContain('yellow');
      expect(valueBgClass[1024]).toContain('yellow');
    });

    it('maps 2048 to yellow styling', () => {
      expect(valueBgClass[2048]).toContain('yellow');
    });
  });

  describe('useTileViewModel (default export)', () => {
    it('returns tileStyle for undefined value as default empty-tile styling', () => {
      const result = useTileViewModel({});
      expect(result).toEqual({ tileStyle: 'bg-gray-300 text-gray-700' });
    });

    it('returns tileStyle for value 2', () => {
      const result = useTileViewModel({ value: 2 });
      expect(result.tileStyle).toBe(valueBgClass[2]);
      expect(result.tileStyle).toBe('bg-amber-100 text-amber-900');
    });

    it('returns tileStyle for value 4', () => {
      const result = useTileViewModel({ value: 4 });
      expect(result.tileStyle).toBe(valueBgClass[4]);
    });

    it('returns tileStyle for value 2048', () => {
      const result = useTileViewModel({ value: 2048 });
      expect(result.tileStyle).toBe(valueBgClass[2048]);
      expect(result.tileStyle).toBe('bg-yellow-500 text-white');
    });

    it('returns object with tileStyle key only', () => {
      const result = useTileViewModel({ value: 8 });
      expect(Object.keys(result)).toEqual(['tileStyle']);
      expect(result.tileStyle).toBe(valueBgClass[8]);
    });
  });
});
