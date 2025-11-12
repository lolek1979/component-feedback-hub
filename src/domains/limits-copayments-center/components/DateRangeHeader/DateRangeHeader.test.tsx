import { NextIntlClientProvider } from 'next-intl';

import messages from '@/core/messages/cs.json';
import { render, screen } from '@/core/tests/test-utils';

import { DateRangeHeader } from './DateRangeHeader';

const renderWithIntl = (component: React.ReactNode) =>
  render(
    <NextIntlClientProvider locale="cs" messages={messages}>
      {component}
    </NextIntlClientProvider>,
  );

describe('DateRangeHeader', () => {
  const defaultProps = {
    dateRange: '1. 1. 2024 - 31. 12. 2024',
    dataSource: 'Data poskytuje SÚKL - Státní ústav pro kontrolu léčiv',
  };

  it('renders date range correctly', () => {
    renderWithIntl(<DateRangeHeader {...defaultProps} />);
    expect(screen.getByText('1. 1. 2024 - 31. 12. 2024')).toBeInTheDocument();
  });

  it('renders data source correctly', () => {
    renderWithIntl(<DateRangeHeader {...defaultProps} />);
    expect(
      screen.getByText('Data poskytuje SÚKL - Státní ústav pro kontrolu léčiv'),
    ).toBeInTheDocument();
  });

  it('renders with different date range format', () => {
    const props = {
      ...defaultProps,
      dateRange: '1. ledna 2024 - 31. prosince 2024',
    };
    renderWithIntl(<DateRangeHeader {...props} />);
    expect(screen.getByText('1. ledna 2024 - 31. prosince 2024')).toBeInTheDocument();
  });

  it('renders with short data source', () => {
    const props = {
      ...defaultProps,
      dataSource: 'SÚKL',
    };
    renderWithIntl(<DateRangeHeader {...props} />);
    expect(screen.getByText('SÚKL')).toBeInTheDocument();
  });

  it('applies correct text variants', () => {
    renderWithIntl(<DateRangeHeader {...defaultProps} />);

    const dateRangeElement = screen.getByText(defaultProps.dateRange);
    const dataSourceElement = screen.getByText(defaultProps.dataSource);

    expect(dateRangeElement).toHaveClass('text h4');
    expect(dataSourceElement).toHaveClass('text subtitle regular');
  });
});
