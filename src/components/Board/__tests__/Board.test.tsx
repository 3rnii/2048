/**
 * @vitest-environment happy-dom
 */
/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import Board from '../Board';
import TEST_IDS from '../../../common/testIds';

vi.mock('../Board.viewModel', () => ({
  default: () => ({
    renderTiles: () =>
      Array.from({ length: 16 }, (_, i) => (
        <div key={i} className="aspect-square bg-gray-200 rounded min-h-0 relative overflow-hidden" />
      )),
  }),
}));

describe('Board', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders with the correct test id', () => {
    render(<Board />);
    const board = screen.getByTestId(TEST_IDS.BOARD);
    expect(board).toBeInTheDocument();
  });

  it('applies expected outer container styling', () => {
    render(<Board />);
    const board = screen.getByTestId(TEST_IDS.BOARD);
    expect(board).toHaveClass('w-[min(90vw,70vmin)]');
    expect(board).toHaveClass('max-w-full');
    expect(board).toHaveClass('mx-auto');
    expect(board).toHaveClass('p-15');
    expect(board).toHaveClass('sm:p-5');
    expect(board).toHaveClass('flex');
    expect(board).toHaveClass('flex-col');
    expect(board).toHaveClass('items-center');
    expect(board).toHaveClass('justify-center');
    expect(board).toHaveClass('min-h-0');
  });

  it('renders inner grid with expected styling', () => {
    render(<Board />);
    const board = screen.getByTestId(TEST_IDS.BOARD);
    const grid = board.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('grid-cols-4');
    expect(grid).toHaveClass('gap-1');
    expect(grid).toHaveClass('sm:gap-2');
    expect(grid).toHaveClass('p-1');
    expect(grid).toHaveClass('sm:p-2');
    expect(grid).toHaveClass('bg-gray-300');
    expect(grid).toHaveClass('rounded-lg');
    expect(grid).toHaveClass('w-full');
    expect(grid).toHaveClass('aspect-square');
    expect(grid).toHaveClass('min-h-0');
  });
});
