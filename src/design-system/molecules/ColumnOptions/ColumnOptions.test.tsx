import { NextIntlClientProvider } from 'next-intl';

import { render, screen } from '@/core/tests/test-utils';

import { ColumnType } from '../Table';
import { ColumnOptions } from '.';

const messages = {
  ColumnOptions: {
    deleteColumn: 'Delete column',
    addColumnRight: 'Add column right',
    addColumnLeft: 'Add column left',
  },
};
const renderColumnOptions = (component: React.ReactNode) => {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>,
  );
};
describe('ColumnsOptions', () => {
  const mockOnAddNew = jest.fn();
  const mockOnDelete = jest.fn();
  const index = 1;

  it('should render the add right button', () => {
    renderColumnOptions(
      <ColumnOptions
        index={index}
        onAddNew={mockOnAddNew}
        onDelete={mockOnDelete}
        onTypeChange={function (type: ColumnType): void {
          throw new Error('Function not implemented.');
        }}
      />,
    );
    expect(screen.getByText(/Add column right/i)).toBeInTheDocument();
  });

  it('should render the add left button', () => {
    renderColumnOptions(
      <ColumnOptions
        index={index}
        onAddNew={mockOnAddNew}
        onDelete={mockOnDelete}
        onTypeChange={function (type: ColumnType): void {
          throw new Error('Function not implemented.');
        }}
      />,
    );
    expect(screen.getByText(/Add column left/i)).toBeInTheDocument();
  });

  it('should render the delete button', () => {
    renderColumnOptions(
      <ColumnOptions
        index={index}
        onAddNew={mockOnAddNew}
        onDelete={mockOnDelete}
        onTypeChange={function (type: ColumnType): void {
          throw new Error('Function not implemented.');
        }}
      />,
    );
    expect(screen.getByText(/Delete column/i)).toBeInTheDocument();
  });

  //TODO: Fix these tests
  //   it('should call onAddNew with correct indices when add above button is clicked', () => {
  //     fireEvent.click(screen.getByTestId('add-right-button'));
  //     expect(mockOnAddNew).toHaveBeenCalledWith(index, index + 1);
  //   });

  //   it('should call onAddNew with correct indices when add left button is clicked', () => {
  //     fireEvent.click(screen.getByTestId('add-left-button'));
  //     expect(mockOnAddNew).toHaveBeenCalledWith(index, index);
  //   });

  //   it('should call onDelete with correct index when delete button is clicked', () => {
  //     fireEvent.click(screen.getByTestId('delete-button'));
  //     expect(mockOnDelete).toHaveBeenCalledWith(index);
  //   });
  //
});
