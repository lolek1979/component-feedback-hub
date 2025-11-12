import { render, screen } from '@testing-library/react';
import * as sonner from 'sonner';

import { Toast, toast } from './Toast';

// Mock the sonner library
jest.mock('sonner', () => {
  return {
    __esModule: true,
    Toaster: jest.fn(
      ({ children, position, duration, offset, gap, icons, toastOptions, expand, ...domProps }) => (
        <div
          data-testid="sonner-toaster"
          position={position}
          duration={duration}
          icons={icons ? 'true' : undefined}
          {...domProps}
        >
          {children}
        </div>
      ),
    ),
    toast: {
      success: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warning: jest.fn(),
    },
    useSonner: jest.fn(() => ({
      toasts: [],
    })),
  };
});

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('Toast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the toast component', () => {
    render(<Toast />);

    // Assert the Toaster component is rendered
    const toaster = screen.getByTestId('sonner-toaster');
    expect(toaster).toBeInTheDocument();
  });

  it('should have correct position and duration props', () => {
    render(<Toast />);

    const toaster = screen.getByTestId('sonner-toaster');
    expect(toaster).toHaveAttribute('position', 'top-right');
    expect(toaster).toHaveAttribute('duration', '4000');
  });

  it('should have custom icons configured', () => {
    render(<Toast />);

    const toaster = screen.getByTestId('sonner-toaster');

    // Check that the icon property exists
    expect(toaster).toHaveAttribute('icons');
  });

  it('toast function should be exported and callable', () => {
    // Test that toast functions can be called
    toast.success('Success message');
    toast.error('Error message');
    toast.info('Info message');
    toast.warning('Warning message');

    expect(sonner.toast.success).toHaveBeenCalledWith('Success message');
    expect(sonner.toast.error).toHaveBeenCalledWith('Error message');
    expect(sonner.toast.info).toHaveBeenCalledWith('Info message');
    expect(sonner.toast.warning).toHaveBeenCalledWith('Warning message');
  });

  it('should render without errors when useSonner returns null', () => {
    // Mock useSonner to return null/undefined
    const mockUseSonner = sonner.useSonner as jest.Mock;
    mockUseSonner.mockReturnValueOnce(null);

    // Should not throw error
    render(<Toast />);

    const toaster = screen.getByTestId('sonner-toaster');
    expect(toaster).toBeInTheDocument();
  });

  it('should handle toast with custom ID', () => {
    // Test that toasts can be called with custom ID options
    toast.success('Success with ID', { id: 'custom-success-id' });
    toast.error('Error with ID', { id: 'custom-error-id' });

    expect(sonner.toast.success).toHaveBeenCalledWith('Success with ID', {
      id: 'custom-success-id',
    });
    expect(sonner.toast.error).toHaveBeenCalledWith('Error with ID', { id: 'custom-error-id' });
  });
});
