import { NextIntlClientProvider } from 'next-intl';

import { fireEvent, render, screen } from '@/core/tests/test-utils';

import { TableSettings } from '.';

const messages = {
  TableSettings: {
    TableSettingsButton: 'Nastavení tabulky',
    ResetFiltersButton: 'Zrušit filtr',
    SelectAllButton: 'Vybrat vše',
  },
};

const renderWithProvider = (ui: React.ReactElement<any>) => {
  return render(
    <NextIntlClientProvider locale="cs" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
};

describe('TableSettings', () => {
  const items = [
    { label: 'Column1', value: 'column1' },
    { label: 'Column2', value: 'column2' },
    { label: 'Column3', value: 'column3' },
  ];
  const onOptionsChange = jest.fn();

  it('should render checkboxes for each item', () => {
    renderWithProvider(<TableSettings items={items} onOptionsChange={onOptionsChange} />);
    items.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
      expect(screen.getByTestId(`checkbox-${item.label}`)).toBeInTheDocument();
    });
  });

  it('should call onOptionsChange with correct values when checkboxes are clicked', () => {
    renderWithProvider(<TableSettings items={items} onOptionsChange={onOptionsChange} />);
    items.forEach((item) => {
      const checkbox = screen.getByTestId(`checkbox-${item.label}`);
      fireEvent.click(checkbox);
      expect(onOptionsChange).toHaveBeenCalledWith(expect.arrayContaining([item.value]));
    });
  });

  it('should select all checkboxes when select all button is clicked', () => {
    renderWithProvider(<TableSettings items={items} onOptionsChange={onOptionsChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Vybrat vše/i }));
    items.forEach((item) => {
      expect(screen.getByTestId(`checkbox-${item.label}`)).not.toBeChecked();
    });
    expect(onOptionsChange).toHaveBeenCalledWith(items.map((item) => item.value));
  });
});
