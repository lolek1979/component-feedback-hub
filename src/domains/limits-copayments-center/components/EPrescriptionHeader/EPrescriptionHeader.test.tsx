import { NextIntlClientProvider } from 'next-intl';
import { render, screen } from '@testing-library/react';

import messages from '@/core/messages/cs.json';

import { EPrescriptionHeader } from '.';

describe('EPrescriptionHeader', () => {
  it('should render the component with props', () => {
    const mockDate = '2024-11-07';
    const mockPrescriptionCode = 'ABC123';

    render(
      <NextIntlClientProvider locale="cs" messages={messages}>
        <EPrescriptionHeader
          date={mockDate}
          prescriptionCode={mockPrescriptionCode}
          isLimitOverPaid={false}
        />
      </NextIntlClientProvider>,
    );

    expect(screen.getByText(mockDate)).toBeInTheDocument();
    expect(screen.getByText('eRecept ' + mockPrescriptionCode)).toBeInTheDocument();
  });
});
