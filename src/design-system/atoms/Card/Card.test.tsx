import { fireEvent, render, screen } from '@testing-library/react';

import IApprove from '@/core/assets/icons/icon-order-approve.svg';

import { Card } from './Card';

describe('Card', () => {
  const defaultProps = {
    title: 'Test Card',
    icon: <IApprove width={32} height={32} />,
    onClick: jest.fn(),
  };

  it('renders correctly', () => {
    render(<Card id="test-id" {...defaultProps} />);

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(<Card id="text-id2" {...defaultProps} />);

    fireEvent.click(screen.getByRole('button'));
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });
});
