/**
 * @vitest-environment happy-dom
 */
/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import GameOverModal from '../GameOverModal';

vi.mock('../GameOverModal.viewModel', () => ({
  default: () => ({
    display: true,
    handleKeyDown: vi.fn(),
    resetGame: vi.fn(),
    text: {
      title: '🎉 You Won! 🎉',
      message: 'Congratulations! You reached 2048!',
    },
    titleColor: 'text-green-600',
  }),
}));

describe('GameOverModal', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders modal content when display is true (mocked)', () => {
    render(<GameOverModal />);
    expect(screen.getByRole('heading', { name: /You Won/i })).toBeInTheDocument();
    expect(screen.getByText('Congratulations! You reached 2048!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start New Game' })).toBeInTheDocument();
  });

  it('applies expected overlay styling', () => {
    render(<GameOverModal />);
    const overlay = document.querySelector('.fixed.inset-0');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveClass('flex');
    expect(overlay).toHaveClass('items-center');
    expect(overlay).toHaveClass('justify-center');
    expect(overlay).toHaveClass('z-50');
    expect(overlay).toHaveClass('bg-black/50');
    expect(overlay).toHaveClass('backdrop-blur-sm');
  });

  it('applies expected inner card styling', () => {
    render(<GameOverModal />);
    const card = document.querySelector('.bg-white.rounded-lg.shadow-2xl');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('p-8');
    expect(card).toHaveClass('text-center');
    expect(card).toHaveClass('max-w-md');
    expect(card).toHaveClass('w-full');
    expect(card).toHaveClass('mx-4');
  });

  it('applies title and message styling', () => {
    render(<GameOverModal />);
    const heading = screen.getByRole('heading', { name: /You Won/i });
    expect(heading).toHaveClass('text-4xl');
    expect(heading).toHaveClass('font-bold');
    expect(heading).toHaveClass('mb-4');
    expect(heading).toHaveClass('text-green-600');

    const message = screen.getByText('Congratulations! You reached 2048!');
    expect(message).toHaveClass('text-gray-700');
    expect(message).toHaveClass('text-lg');
    expect(message).toHaveClass('mb-8');
  });

  it('applies button styling', () => {
    render(<GameOverModal />);
    const button = screen.getByRole('button', { name: 'Start New Game' });
    expect(button).toHaveClass('px-8');
    expect(button).toHaveClass('py-3');
    expect(button).toHaveClass('bg-purple-600');
    expect(button).toHaveClass('hover:bg-purple-700');
    expect(button).toHaveClass('font-semibold');
    expect(button).toHaveClass('rounded-lg');
    expect(button).toHaveClass('text-lg');
    expect(button).toHaveClass('w-full');
  });

});
