import { NextIntlClientProvider } from 'next-intl';

import messages from '@/core/messages/en.json';
import { render, screen } from '@/core/tests/test-utils';

import { CSMainInfo } from './CSMainInfo';

const renderWithProvider = (ui: React.ReactElement<any>) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
};
describe('CSMainInfo', () => {
  const mockCSObject = {
    title: 'Sample Title',
    id: '12345',
    guarantors: [
      {
        fullName: 'John Doe',
        abbrev: 'JD',
        mail: 'john.doe@example.com',
        department: 'Engineering',
        businessPhones: ['123-456-7890'],
      },
    ],
    validFrom: new Date('2023-01-01'),
    validUntil: new Date('2023-12-31'),
    types: 'Type2',
  };

  it('should render the title', () => {
    renderWithProvider(<CSMainInfo CSObject={mockCSObject} />);

    screen.getByText(/Sample Title/i);
  });

  it('should render the id', () => {
    renderWithProvider(<CSMainInfo CSObject={mockCSObject} />);

    screen.getByText(/12345/i);
  });

  it('should render the guarantor', () => {
    renderWithProvider(<CSMainInfo CSObject={mockCSObject} />);

    screen.getByText(/John Doe/i);
  });

  it('should render the validity dates', () => {
    renderWithProvider(<CSMainInfo CSObject={mockCSObject} />);
    screen.getByText(/1\. 1\. 2023/i);
  });

  it('should render the types', () => {
    renderWithProvider(<CSMainInfo CSObject={mockCSObject} />);
    screen.getByText(/Typ/i);
  });
});
