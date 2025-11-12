import { NextIntlClientProvider } from 'next-intl';
import { fireEvent, render, screen } from '@testing-library/react';

import messages from '@/core/messages/en.json';

import { DarkmodeToggle } from './DarkmodeToggle';

// Mock the icons to avoid rendering issues during tests
jest.mock('@/core/assets/icons/icon-dark-mode.svg', () => 'mock-dark-icon');
jest.mock('@/core/assets/icons/icon-light-mode.svg', () => 'mock-light-icon');

describe('DarkmodeToggle', () => {
  it('should toggle to Light Mode when Light button is clicked', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <DarkmodeToggle />
      </NextIntlClientProvider>,
    );

    const lightButton = screen.getByLabelText('Light mode');
    const darkButton = screen.getByLabelText('Dark mode');

    // Clicking the Dark Mode button should change the state
    fireEvent.click(darkButton);

    expect(lightButton).not.toHaveClass('active');
    expect(darkButton).toHaveClass('active');
  });

  it('should toggle to Dark Mode when Dark button is clicked', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <DarkmodeToggle />
      </NextIntlClientProvider>,
    );

    const lightButton = screen.getByLabelText('Light mode');
    const darkButton = screen.getByLabelText('Dark mode');

    // Clicking the Light Mode button should change the state
    fireEvent.click(lightButton);

    expect(darkButton).not.toHaveClass('active');
    expect(lightButton).toHaveClass('active');
  });
});
