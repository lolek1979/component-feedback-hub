import { useTranslations } from 'next-intl';
import { fireEvent, render, screen } from '@testing-library/react';

import { useComplaintStore } from '../../stores/useComplaintStore';
import { ReferenceNumberSection } from './ReferenceNumberSection';

import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('next-intl');
jest.mock('../../stores/useComplaintStore');

const mockSetReferenceNumber = jest.fn();
const mockUseComplaintStore = useComplaintStore as jest.MockedFunction<typeof useComplaintStore>;

describe('ReferenceNumberSection', () => {
  const mockTranslations: Record<string, string> = {
    title: 'Číslo jednací',
    description: 'Po vložení dokumentu do E-Spisu zkopírujte do níže uvedeného pole číslo jednací.',
    inputLabel: 'Číslo jednací',
  };

  const mockTranslate = jest.fn((key: string) => mockTranslations[key] || key);

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useTranslations
    (useTranslations as jest.Mock).mockReturnValue(mockTranslate);

    // Mock useComplaintStore with default state
    mockUseComplaintStore.mockReturnValue({
      currentStep: 3,
      formData: {
        complaintType: null,
        complaintHandler: '',
        referenceNumber: '',
      },
      setCurrentStep: jest.fn(),
      nextStep: jest.fn(),
      previousStep: jest.fn(),
      setComplaintType: jest.fn(),
      setComplaintHandler: jest.fn(),
      setReferenceNumber: mockSetReferenceNumber,
      resetForm: jest.fn(),
    });
  });

  it('renders the component with title and description', () => {
    render(<ReferenceNumberSection />);

    const heading = screen.getByRole('heading', { level: 3, name: 'Číslo jednací' });
    expect(heading).toBeInTheDocument();

    expect(
      screen.getByText(
        'Po vložení dokumentu do E-Spisu zkopírujte do níže uvedeného pole číslo jednací.',
      ),
    ).toBeInTheDocument();
  });

  it('renders the input field with label', () => {
    render(<ReferenceNumberSection />);

    // Check label text exists
    expect(screen.getAllByText('Číslo jednací')[1]).toBeInTheDocument(); // Second occurrence is in label
    expect(screen.getByText('*')).toBeInTheDocument(); // Required indicator

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'input-reference-number-consent-step');
  });

  it('renders label as required', () => {
    render(<ReferenceNumberSection />);

    expect(screen.getByText('*')).toBeInTheDocument();

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'input-reference-number-consent-step');
  });

  it('displays the current reference number value from store', () => {
    mockUseComplaintStore.mockReturnValue({
      currentStep: 3,
      formData: {
        complaintType: null,
        complaintHandler: '',
        referenceNumber: 'REF-2024-12345',
      },
      setCurrentStep: jest.fn(),
      nextStep: jest.fn(),
      previousStep: jest.fn(),
      setComplaintType: jest.fn(),
      setComplaintHandler: jest.fn(),
      setReferenceNumber: mockSetReferenceNumber,
      resetForm: jest.fn(),
    });

    render(<ReferenceNumberSection />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('REF-2024-12345');
  });

  it('calls setReferenceNumber when input value changes', () => {
    render(<ReferenceNumberSection />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'NEW-REF-123' } });

    expect(mockSetReferenceNumber).toHaveBeenCalledWith('NEW-REF-123');
    expect(mockSetReferenceNumber).toHaveBeenCalledTimes(1);
  });

  it('calls setReferenceNumber with empty string when input is cleared', () => {
    mockUseComplaintStore.mockReturnValue({
      currentStep: 3,
      formData: {
        complaintType: null,
        complaintHandler: '',
        referenceNumber: 'REF-2024-12345',
      },
      setCurrentStep: jest.fn(),
      nextStep: jest.fn(),
      previousStep: jest.fn(),
      setComplaintType: jest.fn(),
      setComplaintHandler: jest.fn(),
      setReferenceNumber: mockSetReferenceNumber,
      resetForm: jest.fn(),
    });

    render(<ReferenceNumberSection />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '' } });

    expect(mockSetReferenceNumber).toHaveBeenCalledWith('');
  });

  it('handles multiple input changes correctly', () => {
    render(<ReferenceNumberSection />);

    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'R' } });
    expect(mockSetReferenceNumber).toHaveBeenCalledWith('R');

    fireEvent.change(input, { target: { value: 'RE' } });
    expect(mockSetReferenceNumber).toHaveBeenCalledWith('RE');

    fireEvent.change(input, { target: { value: 'REF' } });
    expect(mockSetReferenceNumber).toHaveBeenCalledWith('REF');

    expect(mockSetReferenceNumber).toHaveBeenCalledTimes(3);
  });

  it('renders typography components with correct variants', () => {
    render(<ReferenceNumberSection />);

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Číslo jednací');

    const description = screen.getByText(
      'Po vložení dokumentu do E-Spisu zkopírujte do níže uvedeného pole číslo jednací.',
    );
    expect(description.tagName).toBe('P');
  });

  it('associates label with input via htmlFor', () => {
    render(<ReferenceNumberSection />);

    const input = screen.getByRole('textbox');

    // Verify input has correct id which should be linked to label
    expect(input).toHaveAttribute('id', 'input-reference-number-consent-step');
  });

  it('updates input value when store value changes', () => {
    const { rerender } = render(<ReferenceNumberSection />);

    let input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('');

    // Update store mock to return new value
    mockUseComplaintStore.mockReturnValue({
      currentStep: 3,
      formData: {
        complaintType: null,
        complaintHandler: '',
        referenceNumber: 'UPDATED-REF',
      },
      setCurrentStep: jest.fn(),
      nextStep: jest.fn(),
      previousStep: jest.fn(),
      setComplaintType: jest.fn(),
      setComplaintHandler: jest.fn(),
      setReferenceNumber: mockSetReferenceNumber,
      resetForm: jest.fn(),
    });

    rerender(<ReferenceNumberSection />);

    input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('UPDATED-REF');
  });

  it('handles special characters in reference number', () => {
    render(<ReferenceNumberSection />);

    const input = screen.getByRole('textbox');
    const specialValue = 'REF-2024/123-ABC_XYZ';

    fireEvent.change(input, { target: { value: specialValue } });

    expect(mockSetReferenceNumber).toHaveBeenCalledWith(specialValue);
  });

  it('handles whitespace in reference number', () => {
    render(<ReferenceNumberSection />);

    const input = screen.getByRole('textbox');
    const valueWithSpaces = '  REF 123  ';

    fireEvent.change(input, { target: { value: valueWithSpaces } });

    expect(mockSetReferenceNumber).toHaveBeenCalledWith(valueWithSpaces);
  });

  it('calls setReferenceNumber with empty string when value is undefined', () => {
    render(<ReferenceNumberSection />);

    const input = screen.getByRole('textbox');

    // Simulate event with undefined value
    Object.defineProperty(input, 'value', {
      writable: true,
      value: undefined,
    });

    fireEvent.change(input, { target: { value: undefined } });

    expect(mockSetReferenceNumber).toHaveBeenCalledWith('');
  });
});
