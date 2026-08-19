import { render, screen, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from './ToastContext';

const TestComponent = () => {
  const { showSuccess } = useToast();
  return (
    <button onClick={() => showSuccess('Test Message')}>
      Show Toast
    </button>
  );
};

describe('ToastContext', () => {
  it('adds and displays a toast message', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = screen.getByRole('button', { name: /show toast/i });
    await userEvent.click(button);

    // The toast message should appear in the document
    const toastMessage = await screen.findByText('Test Message');
    expect(toastMessage).toBeInTheDocument();
  });
});
