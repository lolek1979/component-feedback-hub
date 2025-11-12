import { NextIntlClientProvider } from 'next-intl';

import { fireEvent, render, screen } from '@/core/tests/test-utils';

import { RowOptions } from '.';

const messages = {
  RowOptions: {
    deleteRow: 'Delete row',
    addRowBelow: 'Add row below',
    addRowAbove: 'Add row above',
  },
};
const renderRowOptions = (component: React.ReactNode) => {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>,
  );
};
describe('RowOptions', () => {
  const onRowAction = jest.fn();
  const index = 1;

  it('should render the add above button', () => {
    renderRowOptions(<RowOptions index={index} onRowAction={onRowAction} />);
    expect(screen.getByText(/Add row above/i)).toBeInTheDocument();
  });

  it('should render the add below button', () => {
    renderRowOptions(<RowOptions index={index} onRowAction={onRowAction} />);
    expect(screen.getByText(/Add row below/i)).toBeInTheDocument();
  });

  it('should render the delete button', () => {
    renderRowOptions(<RowOptions index={index} onRowAction={onRowAction} />);
    expect(screen.getByText(/Delete row/i)).toBeInTheDocument();
  });

  it('should call onAddNew with correct indices when add above button is clicked', () => {
    renderRowOptions(<RowOptions index={index} onRowAction={onRowAction} />);
    fireEvent.click(screen.getByTestId('add-above-button'));
    expect(onRowAction).toHaveBeenCalledWith('above', index);
  });

  it('should call onAddNew with correct indices when add below button is clicked', () => {
    renderRowOptions(<RowOptions index={index} onRowAction={onRowAction} />);
    fireEvent.click(screen.getByTestId('add-below-button'));
    expect(onRowAction).toHaveBeenCalledWith('below', index);
  });

  it('should call onDelete with correct index when delete button is clicked', () => {
    renderRowOptions(<RowOptions index={index} onRowAction={onRowAction} />);
    fireEvent.click(screen.getByTestId('delete-button'));
    expect(onRowAction).toHaveBeenCalledWith('delete', index);
  });
});
