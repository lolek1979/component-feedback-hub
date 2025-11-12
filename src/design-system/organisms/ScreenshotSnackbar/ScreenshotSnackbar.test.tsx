import React from 'react';
import { useTranslations } from 'next-intl';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useQueryState } from 'nuqs';

import ScreenshotSnackbar from './ScreenshotSnackbar';

jest.mock('@/design-system/molecules/Toast/Toast', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    dismiss: jest.fn(),
  },
  Toast: jest.fn(() => null),
}));
jest.mock('next-intl');
jest.mock('nuqs');

jest.mock('@/assets/icons/screenshot.svg', () => () => <div data-testid="screenshot-icon" />);

describe('ScreenshotSnackbar', () => {
  const mockSetIsBugReportModalVisible = jest.fn().mockResolvedValue(undefined);
  const mockSetIsScreenshotSnackbar = jest.fn().mockResolvedValue(undefined);
  const mockTranslate = jest.fn((key) => key);

  beforeEach(() => {
    jest.clearAllMocks();

    (useTranslations as jest.Mock).mockReturnValue(mockTranslate);

    // Mock query state hooks
    (useQueryState as jest.Mock).mockImplementation((param) => {
      if (param === 'bugReport') {
        return [false, mockSetIsBugReportModalVisible];
      }
      if (param === 'captureScreenshot') {
        return [true, mockSetIsScreenshotSnackbar];
      }

      return [false, jest.fn()];
    });

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        setItem: jest.fn(),
        getItem: jest.fn(),
      },
      writable: true,
    });
  });

  it('renders nothing when isScreenshotSnackbarVisible is false', () => {
    (useQueryState as jest.Mock).mockImplementation((param) => {
      if (param === 'captureScreenshot') {
        return [false, mockSetIsScreenshotSnackbar];
      }

      return [false, jest.fn()];
    });

    const { container } = render(<ScreenshotSnackbar />);
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toBeNull();
  });

  it('renders the snackbar when isScreenshotSnackbarVisible is true', () => {
    render(<ScreenshotSnackbar />);

    expect(screen.getByText('cancelBtn')).toBeInTheDocument();
    expect(screen.getByText('makeBtn')).toBeInTheDocument();
    expect(screen.getByTestId('screenshot-icon')).toBeInTheDocument();
  });

  it('handles cancel button click correctly', async () => {
    render(<ScreenshotSnackbar />);

    fireEvent.click(screen.getByText('cancelBtn'));

    expect(mockSetIsScreenshotSnackbar).toHaveBeenCalledWith(null);
    await waitFor(() => {
      expect(mockSetIsBugReportModalVisible).toHaveBeenCalledWith(true);
    });
  });
});
