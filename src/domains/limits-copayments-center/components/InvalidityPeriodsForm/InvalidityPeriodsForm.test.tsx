import { NextIntlClientProvider } from 'next-intl';
import { fireEvent, render, screen } from '@testing-library/react';

import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';

import { InvalidityPeriodsForm } from './InvalidityPeriodsForm';

const messages = {
  InvalidityPeriodsForm: {
    invaliditySectionTitle: 'Invalidity',
    invaliditySectionDescription:
      'Select the period of 2024 for which the insured person is requesting a limit adjustment.',
    recognizedFromLabel: 'Recognized from',
    validUntilLabel: 'Valid until',
    ongoingCheckboxLabel: 'currently valid',
    requiredLimitLabel: 'Required limit',
    requiredLimitPlaceholder: 'Select limit',
    limitOption3rdDegree: '3rd degree invalidity with invalidity pension',
    limitOption2ndDegree: '2nd degree invalidity',
    limitOption1stDegree: '1st degree invalidity',
    removeButtonAriaLabel: 'Remove period',
    addPeriodButton: 'Add period',
    termsSectionTitle: 'Terms',
    submissionDateLabel: 'Submission date',
    settlementDeadlineLabel: 'Settlement deadline',
  },
};

const renderWithIntl = (component: React.ReactElement) => {
  return render(
    <FeedBackHubProvider>
      <NextIntlClientProvider locale="en" messages={messages}>
        {component}
      </NextIntlClientProvider>
    </FeedBackHubProvider>,
  );
};

describe('InvalidityPeriodsForm', () => {
  it('renders the form with initial period', () => {
    renderWithIntl(<InvalidityPeriodsForm />);

    expect(screen.getByText('Invalidity')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Select the period of 2024 for which the insured person is requesting a limit adjustment.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Recognized from')).toBeInTheDocument();
    expect(screen.getByText('Valid until')).toBeInTheDocument();
    expect(screen.getByText('Required limit')).toBeInTheDocument();
  });

  it('renders terms section', () => {
    renderWithIntl(<InvalidityPeriodsForm />);

    expect(screen.getByText('Terms')).toBeInTheDocument();
    expect(screen.getByText('Submission date')).toBeInTheDocument();
    expect(screen.getByText('Settlement deadline')).toBeInTheDocument();
  });

  it('adds a new period when "Add period" button is clicked', () => {
    renderWithIntl(<InvalidityPeriodsForm />);

    const addButton = screen.getByRole('button', { name: 'Add period' });
    fireEvent.click(addButton);

    const removeButtons = screen.getAllByLabelText('Remove period');
    expect(removeButtons).toHaveLength(1);
  });

  it('removes a period when remove button is clicked', () => {
    renderWithIntl(<InvalidityPeriodsForm />);

    const addButton = screen.getByRole('button', { name: 'Add period' });
    fireEvent.click(addButton);

    let removeButtons = screen.getAllByLabelText('Remove period');
    expect(removeButtons).toHaveLength(1);

    fireEvent.click(removeButtons[0]);

    removeButtons = screen.queryAllByLabelText('Remove period');
    expect(removeButtons).toHaveLength(0);
  });

  it('does not show remove button for the first period', () => {
    renderWithIntl(<InvalidityPeriodsForm />);

    const removeButtons = screen.queryAllByLabelText('Remove period');
    expect(removeButtons).toHaveLength(0);
  });

  it('disables "Valid until" date picker when "ongoing" checkbox is checked', () => {
    renderWithIntl(<InvalidityPeriodsForm />);

    const ongoingCheckbox = screen.getByRole('checkbox');
    fireEvent.click(ongoingCheckbox);

    expect(ongoingCheckbox).toBeChecked();
  });

  it('calls onPeriodsChange callback when periods are modified', () => {
    const onPeriodsChange = jest.fn();
    renderWithIntl(<InvalidityPeriodsForm onPeriodsChange={onPeriodsChange} />);

    const addButton = screen.getByRole('button', { name: 'Add period' });
    fireEvent.click(addButton);

    expect(onPeriodsChange).toHaveBeenCalled();
  });

  it('calls onSubmissionDateChange callback when submission date changes', () => {
    const onSubmissionDateChange = jest.fn();
    renderWithIntl(<InvalidityPeriodsForm onSubmissionDateChange={onSubmissionDateChange} />);
  });

  it('calculates settlement deadline as 1 month after submission date', () => {
    const submissionDate = new Date('2024-01-15');
    renderWithIntl(<InvalidityPeriodsForm submissionDate={submissionDate} />);

    expect(screen.getByText('14. 02. 2024')).toBeInTheDocument();
  });

  it('renders with initial periods provided', () => {
    const initialPeriods = [
      {
        id: 'period-1',
        recognizedFrom: new Date('2024-01-01'),
        validUntil: new Date('2024-12-31'),
        isOngoing: false,
        requiredLimit: '3-degree-invalid-reason',
      },
      {
        id: 'period-2',
        recognizedFrom: new Date('2024-06-01'),
        validUntil: null,
        isOngoing: true,
        requiredLimit: '2-degree-invalid',
      },
    ];

    renderWithIntl(<InvalidityPeriodsForm initialPeriods={initialPeriods} />);

    const removeButtons = screen.getAllByLabelText('Remove period');
    expect(removeButtons).toHaveLength(1);
  });
});
