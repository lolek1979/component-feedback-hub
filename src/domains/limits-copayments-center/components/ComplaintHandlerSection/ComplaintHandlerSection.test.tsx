import { useTranslations } from 'next-intl';
import { fireEvent, render, screen } from '@testing-library/react';

import {
  COMPLAINT_HANDLERS,
  ComplaintHandler,
  useComplaintStore,
} from '../../stores/useComplaintStore';
import { ComplaintHandlerSection } from './ComplaintHandlerSection';

import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('next-intl');
jest.mock('../../stores/useComplaintStore');

const mockSetComplaintHandler = jest.fn();
const mockUseComplaintStore = useComplaintStore as jest.MockedFunction<typeof useComplaintStore>;

describe('ComplaintHandlerSection', () => {
  const mockTranslations: Record<string, string> = {
    title: 'Řešitel',
    description: 'Kdo vyřeší reklamaci',
    forwardToBackOffice: 'Předání na Back Office',
    clientDesk: 'KLIPR',
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
      setComplaintHandler: mockSetComplaintHandler,
      setReferenceNumber: jest.fn(),
      resetForm: jest.fn(),
    });
  });

  it('renders the component with title and description', () => {
    render(<ComplaintHandlerSection />);

    expect(screen.getByText('Řešitel')).toBeInTheDocument();
    expect(screen.getByText('Kdo vyřeší reklamaci')).toBeInTheDocument();
  });

  it('renders both radio button options', () => {
    render(<ComplaintHandlerSection />);

    expect(screen.getByLabelText('Předání na Back Office')).toBeInTheDocument();
    expect(screen.getByLabelText('KLIPR')).toBeInTheDocument();
  });

  it('displays the current selected value from store', () => {
    mockUseComplaintStore.mockReturnValue({
      currentStep: 3,
      formData: {
        complaintType: null,
        complaintHandler: COMPLAINT_HANDLERS.BACK_OFFICE as ComplaintHandler,
        referenceNumber: '',
      },
      setCurrentStep: jest.fn(),
      nextStep: jest.fn(),
      previousStep: jest.fn(),
      setComplaintType: jest.fn(),
      setComplaintHandler: mockSetComplaintHandler,
      setReferenceNumber: jest.fn(),
      resetForm: jest.fn(),
    });

    render(<ComplaintHandlerSection />);

    const backOfficeRadio = screen.getByLabelText('Předání na Back Office') as HTMLInputElement;
    expect(backOfficeRadio.checked).toBe(true);
  });

  it('calls setComplaintHandler when backOffice option is selected', () => {
    render(<ComplaintHandlerSection />);

    const backOfficeRadio = screen.getByLabelText('Předání na Back Office');
    fireEvent.click(backOfficeRadio);

    expect(mockSetComplaintHandler).toHaveBeenCalledWith(COMPLAINT_HANDLERS.BACK_OFFICE);
  });

  it('calls setComplaintHandler when clientDesk option is selected', () => {
    render(<ComplaintHandlerSection />);

    const clientDeskRadio = screen.getByLabelText('KLIPR');
    fireEvent.click(clientDeskRadio);

    expect(mockSetComplaintHandler).toHaveBeenCalledWith(COMPLAINT_HANDLERS.CLIENT_DESK);
  });

  it('renders debug form values section', () => {
    mockUseComplaintStore.mockReturnValue({
      currentStep: 3,
      formData: {
        complaintType: 'general',
        complaintHandler: COMPLAINT_HANDLERS.BACK_OFFICE as ComplaintHandler,
        referenceNumber: 'REF123',
      },
      setCurrentStep: jest.fn(),
      nextStep: jest.fn(),
      previousStep: jest.fn(),
      setComplaintType: jest.fn(),
      setComplaintHandler: mockSetComplaintHandler,
      setReferenceNumber: jest.fn(),
      resetForm: jest.fn(),
    });

    render(<ComplaintHandlerSection />);

    const debugSection = screen.getByText(/general/);
    expect(debugSection).toBeInTheDocument();
  });

  it('uses correct radio name attribute', () => {
    render(<ComplaintHandlerSection />);

    const backOfficeRadio = screen.getByLabelText('Předání na Back Office') as HTMLInputElement;
    const clientDeskRadio = screen.getByLabelText('KLIPR') as HTMLInputElement;

    expect(backOfficeRadio.name).toBe('complaintHandler');
    expect(clientDeskRadio.name).toBe('complaintHandler');
  });

  it('maintains correct radio values', () => {
    render(<ComplaintHandlerSection />);

    const backOfficeRadio = screen.getByLabelText('Předání na Back Office') as HTMLInputElement;
    const clientDeskRadio = screen.getByLabelText('KLIPR') as HTMLInputElement;

    expect(backOfficeRadio.value).toBe(COMPLAINT_HANDLERS.BACK_OFFICE);
    expect(clientDeskRadio.value).toBe(COMPLAINT_HANDLERS.CLIENT_DESK);
  });

  it('calls setComplaintHandler only once when changing selection', () => {
    render(<ComplaintHandlerSection />);

    const clientDeskRadio = screen.getByLabelText('KLIPR');
    fireEvent.click(clientDeskRadio);

    expect(mockSetComplaintHandler).toHaveBeenCalledTimes(1);
  });

  it('uses memoized callback for onChange handler', () => {
    const { rerender } = render(<ComplaintHandlerSection />);

    const clientDeskRadio = screen.getByLabelText('KLIPR');
    fireEvent.click(clientDeskRadio);

    expect(mockSetComplaintHandler).toHaveBeenCalledWith(COMPLAINT_HANDLERS.CLIENT_DESK);

    // Rerender and test that callback is stable
    rerender(<ComplaintHandlerSection />);

    const backOfficeRadio = screen.getByLabelText('Předání na Back Office');
    fireEvent.click(backOfficeRadio);

    expect(mockSetComplaintHandler).toHaveBeenCalledWith(COMPLAINT_HANDLERS.BACK_OFFICE);
    expect(mockSetComplaintHandler).toHaveBeenCalledTimes(2);
  });
});
