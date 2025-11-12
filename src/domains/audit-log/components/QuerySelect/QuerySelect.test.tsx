import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { equal } from 'assert';

import { QuerySelect } from './QuerySelect';

//mock Translation service
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

//mock data definition:
interface Item {
  code: string;
  description: string;
}

const items: Item[] = [
  { code: '001', description: 'Apple' },
  { code: '002', description: 'Banana' },
  { code: '003', description: 'Orange' },
  { code: '004', description: 'Grape' },
];

//mock function to fetch items for dropdown box
const mockFetchItems = jest.fn(
  async (query: string, page: number, pageSize = 10): Promise<Item[]> => {
    const filtered = items.filter(
      (item) =>
        item.description.toLowerCase().includes(query.toLowerCase()) || item.code.includes(query),
    );

    return filtered.slice(page * pageSize, (page + 1) * pageSize);
  },
);

const getOptionLabel = (item: Item | null) => (item ? `${item.description} (${item.code})` : '');

describe('QuerySelect', () => {
  test('renders input and fetches results on input dropdown-Items box', async () => {
    const handleChange = jest.fn();

    render(
      <QuerySelect<Item>
        fetchItems={mockFetchItems}
        getOptionLabel={getOptionLabel}
        onChange={handleChange}
        placeholder="Search..."
      />,
    );

    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '00' } });

    await waitFor(() => {
      expect(screen.getByText('Apple (001)')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Banana (002)')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Orange (003)')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Grape (004)')).toBeInTheDocument();
    });
  });

  test('renders input and fetch data and select item #1', async () => {
    const handleChange = jest.fn();

    render(
      <QuerySelect<Item>
        fetchItems={mockFetchItems}
        getOptionLabel={getOptionLabel}
        onChange={handleChange}
        placeholder="Search..."
      />,
    );

    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '00' } });

    await waitFor(() => {
      expect(screen.getByText('Orange (003)')).toBeInTheDocument();
    });

    //test item selection
    const div = screen.getByText('Orange (003)') as HTMLDivElement;
    fireEvent.mouseDown(div);
    await waitFor(() => {
      expect(equal(input.value, getOptionLabel({ code: '003', description: 'Orange' })));
    });
  });

  test('renders input and fetch data and select item #2', async () => {
    const handleChange = jest.fn();

    render(
      <QuerySelect<Item>
        fetchItems={mockFetchItems}
        getOptionLabel={getOptionLabel}
        onChange={handleChange}
        placeholder="Search..."
      />,
    );

    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '00' } });

    await waitFor(() => {
      expect(screen.getByText('Orange (003)')).toBeInTheDocument();
    });

    //test item selection
    const div = screen.getByText('Orange (003)') as HTMLDivElement;
    fireEvent.mouseDown(div);
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith({ code: '003', description: 'Orange' });
    });
  });
});
