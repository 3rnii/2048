/**
 * @vitest-environment happy-dom
 */
/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import Suggestion from '../Suggestion';
import TEST_IDS from '../../../common/testIds';

const mockViewModelReturn = vi.hoisted(() => ({
  onClick: vi.fn(),
  loading: false,
  hasResponse: false,
  text: { recommended: '', reasoning: '' },
}));

vi.mock('../Suggestion.viewModel', () => ({
  default: () => mockViewModelReturn,
}));

describe('Suggestion', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    mockViewModelReturn.onClick = vi.fn();
    mockViewModelReturn.loading = false;
    mockViewModelReturn.hasResponse = false;
    mockViewModelReturn.text = { recommended: '', reasoning: '' };
  });

  it('renders button with correct test id', () => {
    render(<Suggestion />);
    expect(screen.getByTestId(TEST_IDS.SUGGEST_BUTTON)).toBeInTheDocument();
  });

  it('renders suggestion response container with correct test id', () => {
    render(<Suggestion />);
    expect(screen.getByTestId(TEST_IDS.SUGGESTION_RESPONSE)).toBeInTheDocument();
  });

  it('renders "Suggest a Move" button text', () => {
    render(<Suggestion />);
    expect(screen.getByRole('button', { name: /Suggest a Move/i })).toBeInTheDocument();
  });

  it('applies expected button styling', () => {
    render(<Suggestion />);
    const button = screen.getByTestId(TEST_IDS.SUGGEST_BUTTON);
    expect(button).toHaveClass('px-8');
    expect(button).toHaveClass('py-4');
    expect(button).toHaveClass('bg-purple-600');
    expect(button).toHaveClass('hover:bg-purple-700');
    expect(button).toHaveClass('font-semibold');
    expect(button).toHaveClass('rounded-lg');
    expect(button).toHaveClass('flex');
    expect(button).toHaveClass('items-center');
    expect(button).toHaveClass('gap-2');
    expect(button).toHaveClass('text-lg');
  });

  it('applies expected response container styling', () => {
    render(<Suggestion />);
    const response = screen.getByTestId(TEST_IDS.SUGGESTION_RESPONSE);
    expect(response).toHaveClass('mt-4');
    expect(response).toHaveClass('text-center');
  });

  it('does not show response content when hasResponse is false', () => {
    mockViewModelReturn.hasResponse = false;
    mockViewModelReturn.text = { recommended: '', reasoning: '' };
    render(<Suggestion />);
    const responseEl = screen.getByTestId(TEST_IDS.SUGGESTION_RESPONSE);
    expect(responseEl).toBeInTheDocument();
    expect(responseEl).toHaveTextContent('');
  });

  it('shows recommended and reasoning when hasResponse is true', () => {
    mockViewModelReturn.hasResponse = true;
    mockViewModelReturn.text = {
      recommended: '⬆️ Move Up!',
      reasoning: 'Moving up will merge tiles.',
    };
    render(<Suggestion />);
    expect(screen.getByText('⬆️ Move Up!')).toBeInTheDocument();
    expect(screen.getByText('Moving up will merge tiles.')).toBeInTheDocument();
  });

  it('button is not disabled when loading is false', () => {
    mockViewModelReturn.loading = false;
    render(<Suggestion />);
    expect(screen.getByTestId(TEST_IDS.SUGGEST_BUTTON)).not.toBeDisabled();
  });

  it('disables button when loading is true', () => {
    mockViewModelReturn.loading = true;
    render(<Suggestion />);
    expect(screen.getByTestId(TEST_IDS.SUGGEST_BUTTON)).toBeDisabled();
  });
});
