import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { useQueryState } from 'nuqs';

import { BugReportModal } from './BugReportModal';

import '@testing-library/jest-dom';

const queryClient = new QueryClient();

const mockMessages = {
  bugReport: {
    modalTitle: 'Report a Bug',
    titleLabel: 'Title',
    descriptionLabel:
      'Something is not working or you have an idea for improvement? Let us know, your feedback is important!',
    descriptionPlaceholder: 'Your message',
    captureScreenshot: 'Capture screenshot',
    screenshotAlt: 'Screenshot',
    submit: 'Submit',
    cancel: 'Cancel',
  },
  common: {
    close: 'Cancel',
  },
};

jest.mock('nuqs');
jest.mock('@azure/msal-react', () => ({
  useMsal: jest.fn(() => ({
    accounts: [{}],
  })),
  useAccount: jest.fn(() => ({})),
}));
const setupPortalRoot = () => {
  const portalRoot = document.createElement('div');
  portalRoot.setAttribute('id', 'modal-root');
  document.body.appendChild(portalRoot);

  return portalRoot;
};

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: { [key: string]: string }) => <img alt="screenshot" {...props} />,
}));

const renderWithIntl = (component: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider locale="en" messages={mockMessages}>
        {component}
      </NextIntlClientProvider>
    </QueryClientProvider>,
  );
};

describe('BugReportModal component', () => {
  let portalRoot: HTMLElement;
  const mockSetBugReportVisible = jest.fn().mockResolvedValue(undefined);
  const mockSetCaptureScreenshot = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
    portalRoot = setupPortalRoot();

    (useQueryState as jest.Mock).mockImplementation((param: string) => {
      if (param === 'bugReport') {
        return [true, mockSetBugReportVisible];
      }
      if (param === 'captureScreenshot') {
        return [false, mockSetCaptureScreenshot];
      }

      return [false, jest.fn()];
    });
  });

  afterEach(() => {
    if (portalRoot) {
      document.body.removeChild(portalRoot);
    }
  });

  it('renders modal with correct title', () => {
    renderWithIntl(<BugReportModal />);
    expect(screen.getByText('Report a Bug')).toBeInTheDocument();
  });

  it('shows textarea for problem description', () => {
    renderWithIntl(<BugReportModal />);
    expect(screen.getByPlaceholderText('Your message')).toBeInTheDocument();
  });

  it('shows screenshot button when no screenshot is available', () => {
    renderWithIntl(<BugReportModal />);
    expect(screen.getByText('Capture screenshot')).toBeInTheDocument();
  });

  it('allows typing in the description field', () => {
    renderWithIntl(<BugReportModal />);
    const textarea = screen.getByPlaceholderText('Your message');

    fireEvent.change(textarea, {
      target: {
        id: 'description',
        value: 'Test problem description',
      },
    });

    expect(textarea).toHaveValue('Test problem description');
  });

  it('disables submit button when description is empty', () => {
    renderWithIntl(<BugReportModal />);
    // eslint-disable-next-line testing-library/no-node-access
    const submitButton = screen.getByText('Submit').closest('button');
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when description is filled', () => {
    renderWithIntl(<BugReportModal />);
    const textarea = screen.getByPlaceholderText('Your message');

    fireEvent.change(textarea, {
      target: {
        id: 'description',
        value: 'Test problem description',
      },
    });

    const submitButton = screen.getByText('Submit');
    expect(submitButton).not.toBeDisabled();
  });

  it('closes modal when cancel button is clicked', () => {
    renderWithIntl(<BugReportModal />);
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(mockSetBugReportVisible).toHaveBeenCalledWith(false);
  });
});
