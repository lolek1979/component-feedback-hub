import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { QuerySelect } from './QuerySelect';

interface Item {
  code: string;
  description: string;
}

const meta: Meta<typeof QuerySelect> = {
  title: 'Molecules/QuerySelect',
  component: QuerySelect,
  argTypes: {
    fetchItems: {
      description: 'Function to fetch items based on the query',
      action: 'fetchItems',
    },
    getOptionLabel: {
      action: 'getOptionLabel',
      description: 'Function to get the label for each option',
    },
    onChange: {
      action: 'onChange',
      description: 'Callback function when an item is selected',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input field',
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for styling the component',
    },
    debounceDelay: {
      control: 'number',
      description: 'Delay in milliseconds for debouncing the input query',
      defaultValue: 300,
    },
  },
};

export default meta;

type Story = StoryObj<typeof QuerySelect>;

export const Default: Story = {
  render: () => {
    const Wrapper = () => {
      const fetchItems = async (query: string, page: number, pageSize = 10): Promise<Item[]> => {
        const allItems: Item[] = [
          { code: '001', description: 'Apple' },
          { code: '002', description: 'Banana' },
          { code: '003', description: 'Orange' },
          { code: '004', description: 'Grape' },
          { code: '005', description: 'Watermelon' },
          { code: '006', description: 'Peach' },
          { code: '007', description: 'Pineapple' },
          { code: '008', description: 'Mango' },
          { code: '009', description: 'Strawberry' },
          { code: '010', description: 'Blueberry' },
          { code: '011', description: 'Kiwi' },
          { code: '012', description: 'Papaya' },
          { code: '013', description: 'Cherry' },
          { code: '014', description: 'Plum' },
          { code: '015', description: 'Coconut' },
          { code: '016', description: 'Lemon' },
          { code: '017', description: 'Lime' },
          { code: '018', description: 'Raspberry' },
          { code: '019', description: 'Blackberry' },
          { code: '020', description: 'Cantaloupe' },
          { code: '021', description: 'Honeydew' },
          { code: '022', description: 'Fig' },
          { code: '023', description: 'Date' },
          { code: '024', description: 'Pomegranate' },
          { code: '025', description: 'Tangerine' },
          { code: '026', description: 'Grapefruit' },
          { code: '027', description: 'Clementine' },
          { code: '028', description: 'Nectarine' },
          { code: '029', description: 'Lychee' },
          { code: '030', description: 'Passion Fruit' },
          { code: '031', description: 'Starfruit' },
          { code: '032', description: 'Dragon Fruit' },
          { code: '033', description: 'Guava' },
          { code: '034', description: 'Tamarind' },
          { code: '035', description: 'Jackfruit' },
          { code: '036', description: 'Durian' },
          { code: '037', description: 'Persimmon' },
          { code: '038', description: 'Quince' },
          { code: '039', description: 'Mulberry' },
          { code: '040', description: 'Cranberry' },
        ];

        return new Promise((resolve) => {
          setTimeout(() => {
            const filtered = allItems
              .sort((a, b) => a.description.localeCompare(b.description))
              .filter(
                (item) =>
                  item.description.toLowerCase().includes(query.toLowerCase()) ||
                  item.code.includes(query),
              );

            const start = page * pageSize;
            const end = start + pageSize;
            const paginated = filtered.slice(start, end);

            resolve(paginated);
          }, 400);
        });
      };

      const getOptionLabel = (item: Item | null) =>
        item ? `${item.description} (${item.code})` : '';

      const [selectedItem, setSelectedItem] = React.useState<Item | null>(null);

      return (
        <div style={{ width: 300 }}>
          <QuerySelect<Item>
            fetchItems={fetchItems}
            getOptionLabel={getOptionLabel}
            onChange={setSelectedItem}
            placeholder="Search..."
            debounceDelay={300}
          />
          <div style={{ marginTop: 20 }}>
            <strong>Selected:</strong>{' '}
            {selectedItem ? getOptionLabel(selectedItem) : 'nothing selected'}
          </div>
        </div>
      );
    };

    return <Wrapper />;
  },
};

export const EmptyResult: Story = {
  render: () => {
    const Wrapper = () => {
      const fetchItems = async (query: string, page: number, pageSize = 10): Promise<Item[]> => {
        const allItems: Item[] = [];

        return new Promise((resolve) => {
          setTimeout(() => {
            const filtered = allItems
              .sort((a, b) => a.description.localeCompare(b.description))
              .filter(
                (item) =>
                  item.description.toLowerCase().includes(query.toLowerCase()) ||
                  item.code.includes(query),
              );

            const start = page * pageSize;
            const end = start + pageSize;
            const paginated = filtered.slice(start, end);

            resolve(paginated);
          }, 400);
        });
      };

      const getOptionLabel = (item: Item | null) =>
        item ? `${item.description} (${item.code})` : '';

      const [selectedItem, setSelectedItem] = React.useState<Item | null>(null);

      return (
        <div style={{ width: 300 }}>
          <QuerySelect<Item>
            fetchItems={fetchItems}
            getOptionLabel={getOptionLabel}
            onChange={setSelectedItem}
            placeholder="Search..."
            debounceDelay={300}
          />
          <div style={{ marginTop: 20 }}>
            <strong>Selected:</strong>{' '}
            {selectedItem ? getOptionLabel(selectedItem) : 'nothing selected'}
          </div>
        </div>
      );
    };

    return <Wrapper />;
  },
};
