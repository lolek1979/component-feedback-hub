import { fireEvent, render, screen } from '@/core/tests/test-utils';

import { SegmentedControl } from '.';

const options = [
  [
    { value: 'one', label: 'One' },
    { value: 'two', label: 'Two' },
    { value: 'three', label: 'Three' },
  ],
  [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
    { value: 'c', label: 'C' },
  ],
];

describe('SegmentedControl', () => {
  it('renders all rows and buttons', () => {
    render(<SegmentedControl options={options} />);
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
    expect(screen.getByText('Three')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('calls setSelectedValue when a button is clicked', () => {
    const setSelectedValue = jest.fn();
    render(<SegmentedControl options={options} setSelectedValue={setSelectedValue} />);
    fireEvent.click(screen.getByText('Two'));
    expect(setSelectedValue).toHaveBeenCalledWith('two');
  });
});
