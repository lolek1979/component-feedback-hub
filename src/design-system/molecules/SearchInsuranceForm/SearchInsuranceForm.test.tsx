import { NextIntlClientProvider } from 'next-intl';
import { render, screen } from '@testing-library/react';

import messages from '@/core/messages/cs.json';
import { fireEvent, waitFor } from '@/core/tests/test-utils';

import { SearchInsuranceForm } from '.';

const renderWithIntl = (component: React.ReactNode) =>
  render(
    <NextIntlClientProvider locale="cs" messages={messages}>
      {component}
    </NextIntlClientProvider>,
  );
describe('SearchInsuranceForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders input field with placeholder', () => {
    renderWithIntl(<SearchInsuranceForm onSubmit={mockOnSubmit} isSubmitting={false} />);
    const input = screen.getByPlaceholderText(/Číslo pojištěnce/i);
    expect(input).toBeInTheDocument();
  });

  test('renders disabled input when isSubmiting is true', () => {
    renderWithIntl(<SearchInsuranceForm onSubmit={mockOnSubmit} isSubmitting={true} />);
    const input = screen.getByPlaceholderText(/Číslo pojištěnce/i);
    expect(input).toBeDisabled();
  });

  test('displays success message for valid input', () => {
    renderWithIntl(<SearchInsuranceForm onSubmit={mockOnSubmit} isSubmitting={false} />);
    const input = screen.getByPlaceholderText(/Číslo pojištěnce/i);

    fireEvent.change(input, { target: { value: '9001010123' } });
    const successMessage = screen.getByText(/Platné číslo pojištěnce/i);
    expect(successMessage).toBeInTheDocument();
  });

  test('displays error message for invalid input', () => {
    renderWithIntl(<SearchInsuranceForm onSubmit={mockOnSubmit} isSubmitting={false} />);
    const input = screen.getByPlaceholderText(/Číslo pojištěnce/i);

    fireEvent.change(input, { target: { value: '123' } });
    const errorMessage = screen.getByText(/Zadejte platné číslo pojištěnce/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test('calls onSubmit with trimmed insurance number on form submit', async () => {
    renderWithIntl(<SearchInsuranceForm onSubmit={mockOnSubmit} isSubmitting={false} />);
    const input = screen.getByPlaceholderText(/Číslo pojištěnce/i);
    const form = screen.getByTestId('form');

    fireEvent.change(input, { target: { value: '9001010123' } });

    await waitFor(() => {
      expect(screen.getByText(/Platné číslo pojištěnce/i)).toBeInTheDocument();
    });

    fireEvent.submit(form);
    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalledWith('9001010123');
    });
  });

  test('does not call onSubmit for invalid input', () => {
    renderWithIntl(<SearchInsuranceForm onSubmit={mockOnSubmit} isSubmitting={false} />);
    const input = screen.getByPlaceholderText(/Číslo pojištěnce/i);
    const form = screen.getByTestId('form');

    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.submit(form);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('hides validation messages after form submission', async () => {
    renderWithIntl(<SearchInsuranceForm onSubmit={mockOnSubmit} isSubmitting={false} />);
    const input = screen.getByPlaceholderText(/Číslo pojištěnce/i);
    const form = screen.getByTestId('form');

    fireEvent.change(input, { target: { value: '9001010123' } });

    await waitFor(() => {
      expect(screen.getByText(/Platné číslo pojištěnce/i)).toBeInTheDocument();
    });

    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/Platné číslo pojištěnce/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/Zadejte platné číslo pojištěnce/i)).toBeInTheDocument();
    });
  });

  test('displays spinner when isSubmiting is true', () => {
    renderWithIntl(<SearchInsuranceForm onSubmit={mockOnSubmit} isSubmitting={true} />);
    const spinner = screen.getByTestId('spinner-container');
    expect(spinner).toBeInTheDocument();
  });
});
