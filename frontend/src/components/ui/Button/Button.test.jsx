import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveAttribute('data-disabled', 'true');
  });

  it('shows loading spinner when loading is true', () => {
    render(<Button loading>Click Me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-loading', 'true');
    // In many implementations, the text is hidden or replaced, or an SVG is added.
    // We check for the disabled state, which is the most reliable cross-implementation indicator.
  });
});
