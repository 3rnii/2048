/**
 * @vitest-environment happy-dom
 */
/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import Tile from '../Tile';
import TEST_IDS from '../../../common/testIds';

vi.mock('../Tile.viewModel', () => ({
  default: ({ value }: { value?: number }) => ({
    tileStyle: value === 2048 ? 'bg-yellow-500 text-white' : 'bg-amber-100 text-amber-900',
  }),
}));

describe('Tile', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders with the correct test id', () => {
    render(<Tile value={2} />);
    const tile = screen.getByTestId(TEST_IDS.TILE);
    expect(tile).toBeInTheDocument();
  });

  it('applies expected base layout and typography styling', () => {
    render(<Tile value={2} />);
    const tile = screen.getByTestId(TEST_IDS.TILE);
    expect(tile).toHaveClass('w-full');
    expect(tile).toHaveClass('h-full');
    expect(tile).toHaveClass('min-w-0');
    expect(tile).toHaveClass('min-h-0');
    expect(tile).toHaveClass('flex');
    expect(tile).toHaveClass('items-center');
    expect(tile).toHaveClass('justify-center');
    expect(tile).toHaveClass('rounded');
    expect(tile).toHaveClass('font-bold');
    expect(tile).toHaveClass('text-lg');
    expect(tile).toHaveClass('sm:text-xl');
    expect(tile).toHaveClass('md:text-2xl');
    expect(tile).toHaveClass('lg:text-3xl');
    expect(tile).toHaveClass('transition-all');
    expect(tile).toHaveClass('duration-150');
    expect(tile).toHaveClass('shadow-sm');
  });

  it('renders the value in the document', () => {
    render(<Tile value={16} />);
    expect(screen.getByText('16')).toBeInTheDocument();
  });

  it('applies tileStyle from view model (mocked)', () => {
    render(<Tile value={2048} />);
    const tile = screen.getByTestId(TEST_IDS.TILE);
    expect(tile).toHaveClass('bg-yellow-500');
    expect(tile).toHaveClass('text-white');
  });
});
