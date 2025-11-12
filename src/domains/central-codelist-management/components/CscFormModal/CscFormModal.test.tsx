import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import csMessages from '@/core/messages/cs.json';

jest.mock('@/design-system/molecules/Modal', () => ({
  Modal: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mocked-modal">{children}</div>
  ),
}));

jest.mock('@/design-system/molecules/DatePicker', () => ({
  DatePicker: ({ onDateChange }: { onDateChange: (date: Date) => void }) => (
    <input data-testid="mock-datepicker" onChange={() => onDateChange(new Date())} />
  ),
}));

jest.mock('@/design-system/molecules/RadioGroup', () => ({
  RadioGroup: ({
    options,
    onChange,
  }: {
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
  }) => (
    <div>
      {options.map((option: { value: string; label: string }) => (
        <label key={option.value}>
          {option.label}
          <input
            type="radio"
            name="type"
            value={option.value}
            onChange={() => onChange(option.value)}
          />
        </label>
      ))}
    </div>
  ),
}));

jest.mock('@/design-system/atoms', () => {
  const React = require('react');

  const Input = ({ id, placeholder, onChange, value: initialValue, disabled, autoFocus }: any) => {
    const [value, setValue] = React.useState(initialValue || '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      if (onChange) onChange(e);
    };

    return (
      <input
        id={id}
        placeholder={placeholder}
        onChange={handleChange}
        value={value}
        disabled={disabled}
        autoFocus={autoFocus}
        data-testid={id || 'input'}
      />
    );
  };

  const Textarea = ({ id, placeholder, onChange, value: initialValue }: any) => {
    const [value, setValue] = React.useState(initialValue || '');

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      if (onChange) onChange(e);
    };

    return (
      <textarea
        id={id}
        placeholder={placeholder}
        onChange={handleChange}
        value={value}
        data-testid={id || 'textarea'}
      />
    );
  };

  return {
    Label: ({ text, htmlFor, size }: { text: string; htmlFor?: string; size?: string }) => (
      <label htmlFor={htmlFor} data-size={size}>
        {text}
      </label>
    ),
    Input,
    Textarea,
    Button: ({ children, onClick, variant, id }: any) => (
      <button id={id} onClick={onClick} data-variant={variant}>
        {children}
      </button>
    ),
    Text: ({ children, variant }: { children: React.ReactNode; variant?: string }) => (
      <span data-variant={variant}>{children}</span>
    ),
  };
});

jest.mock('@tanstack/react-query', () => {
  const originalModule = jest.requireActual('@tanstack/react-query');

  return {
    ...originalModule,
    useQuery: jest.fn().mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    }),
    QueryClient: originalModule.QueryClient,
    QueryClientProvider: originalModule.QueryClientProvider,
  };
});

jest.mock('@/providers/EnvProvider', () => ({
  useEnv: () => ({ API_URL: 'http://localhost:3000' }),
}));

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

jest.mock('@/domains/central-codelist-management/api/services/getCodeLists', () => ({
  getCodeLists: jest.fn().mockResolvedValue([]),
}));

jest.mock('@/api/services/getUsers', () => ({
  fetchUsers: jest.fn().mockResolvedValue({ value: [] }),
}));

import { CscFormModal } from './CscFormModal';

jest.setTimeout(10000);

describe('CscFormModal', () => {
  const mockSetIsVisible = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(() => {
    mockSetIsVisible.mockClear();
    mockOnSubmit.mockClear();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
      },
    },
  });

  const renderComponent = () => {
    return render(
      <NextIntlClientProvider locale="cs" messages={csMessages}>
        <QueryClientProvider client={queryClient}>
          <CscFormModal
            creationType="new"
            isVisible={true}
            setIsVisible={mockSetIsVisible}
            onSubmit={mockOnSubmit}
          />
        </QueryClientProvider>
      </NextIntlClientProvider>,
    );
  };

  it('should render the modal with all form fields', async () => {
    renderComponent();

    await waitFor(
      () => {
        expect(screen.getByText('Název číselníku')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    expect(screen.getByText('Popis')).toBeInTheDocument();
    expect(screen.getByText('Garant')).toBeInTheDocument();
    expect(screen.getByText('Platnost od')).toBeInTheDocument();
    expect(screen.getByText('Typ')).toBeInTheDocument();
  });

  it('should handle input changes', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Vyplňte')).toBeInTheDocument();
    });

    const cscNameInput = screen.getByPlaceholderText('Vyplňte');
    fireEvent.change(cscNameInput, { target: { value: 'Test Name' } });
    expect(cscNameInput).toHaveValue('Test Name');

    const descriptionTextarea = screen.getByPlaceholderText('Popište účel a použití číselníku');
    fireEvent.change(descriptionTextarea, { target: { value: 'Test Description' } });
    expect(descriptionTextarea).toHaveValue('Test Description');
  });

  it('should handle radio button change', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByLabelText('Interní')).toBeInTheDocument();
    });

    const radioButton = screen.getByLabelText('Interní');
    fireEvent.click(radioButton);
    expect(radioButton).toBeChecked();
  });
});
