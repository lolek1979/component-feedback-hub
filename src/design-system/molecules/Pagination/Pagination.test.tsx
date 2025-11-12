import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { fireEvent, render, screen } from '@testing-library/react';

import messages from '@/core/messages/en.json';

import { Pagination } from './Pagination';

const renderWithProviders = (component: ReactNode) =>
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>,
  );

describe('Pagination Component', () => {
  it('renders without crashing', () => {
    renderWithProviders(<Pagination pageCount={5} />);
    expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Next page')).toBeInTheDocument();
  });

  it('displays the correct number of pages for small pageCount', () => {
    renderWithProviders(<Pagination pageCount={5} />);
    expect(screen.getAllByRole('button').filter((btn) => btn.textContent)).toHaveLength(5);
  });

  it('calls onChange when a page is clicked', () => {
    const handleChange = jest.fn();
    renderWithProviders(<Pagination pageCount={5} onChange={handleChange} />);
    fireEvent.click(screen.getByText('3'));
    expect(handleChange).toHaveBeenCalledWith(3);
  });

  it('disables the previous button on the first page', () => {
    renderWithProviders(<Pagination pageCount={5} currPage={1} />);
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('disables the next button on the last page', () => {
    renderWithProviders(<Pagination pageCount={5} currPage={5} />);
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('updates the current page when currPage prop changes', () => {
    const { rerender } = renderWithProviders(<Pagination pageCount={5} currPage={1} />);
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveClass('primary');
    rerender(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Pagination pageCount={5} currPage={3} />
      </NextIntlClientProvider>,
    );
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveClass('primary');
  });

  it('does not allow navigating beyond page limits', () => {
    const handleChange = jest.fn();
    renderWithProviders(<Pagination pageCount={5} currPage={5} onChange={handleChange} />);
    fireEvent.click(screen.getByLabelText('Next page'));
    expect(handleChange).not.toHaveBeenCalled();
  });
});
