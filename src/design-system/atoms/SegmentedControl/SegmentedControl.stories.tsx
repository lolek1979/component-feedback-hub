import type { Meta, StoryObj } from '@storybook/nextjs';

import { SegmentedControl } from './SegmentedControl';

const meta: Meta<typeof SegmentedControl> = {
  title: 'Atoms/SegmentedControl',
  component: SegmentedControl,
};

export default meta;

type Story = StoryObj<typeof SegmentedControl>;

const options = [
  [
    { value: 'one', label: 'One' },
    { value: 'two', label: 'Two' },
    { value: 'three', label: 'Three' },
    { value: 'four', label: 'Four' },
  ],
  [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
    { value: 'c', label: 'C' },
    { value: 'd', label: 'D' },
  ],
];

export const Default: Story = {
  args: {
    options,
  },
};

export const SingleRow: Story = {
  args: {
    options: [
      [
        { value: 'alpha', label: 'Alpha' },
        { value: 'beta', label: 'Beta' },
        { value: 'gamma', label: 'Gamma' },
      ],
    ],
  },
};

export const ManyRows: Story = {
  args: {
    options: [
      [
        { value: 'red', label: 'Red' },
        { value: 'green', label: 'Green' },
        { value: 'blue', label: 'Blue' },
      ],
      [
        { value: 'cat', label: 'Cat' },
        { value: 'dog', label: 'Dog' },
        { value: 'bird', label: 'Bird' },
      ],
      [
        { value: 'car', label: 'Car' },
        { value: 'bus', label: 'Bus' },
        { value: 'bike', label: 'Bike' },
      ],
    ],
  },
};
