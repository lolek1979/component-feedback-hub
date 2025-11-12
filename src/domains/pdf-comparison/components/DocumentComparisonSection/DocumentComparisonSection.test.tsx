import { render, screen } from '@testing-library/react';

import { DocumentComparisonSection } from './DocumentComparisonSection';

describe('DocumentComparisonSection', () => {
  const defaultProps = {
    leftTitle: 'Odeslaná',
    rightTitle: 'Podepsaná',
    leftContent: 'Left content text',
    rightContent: 'Right content text',
    id: 'test-comparison-section',
  };

  it('renders the component with required props', () => {
    render(<DocumentComparisonSection {...defaultProps} />);

    expect(screen.getByTestId('document-comparison-section')).toBeInTheDocument();
    expect(screen.getAllByText('Odeslaná')).toHaveLength(2);
    expect(screen.getAllByText('Podepsaná')).toHaveLength(2);
    expect(screen.getByText('Left content text')).toBeInTheDocument();
    expect(screen.getByText('Right content text')).toBeInTheDocument();
  });

  it('renders all content correctly when all optional props are provided', () => {
    const fullProps = {
      ...defaultProps,
      pageInfo: 'Stránka 8 / Článek III.',
      className: 'full-content',
    };

    render(<DocumentComparisonSection {...fullProps} />);

    expect(screen.getAllByText('Odeslaná')).toHaveLength(2);
    expect(screen.getAllByText('Podepsaná')).toHaveLength(2);
    expect(screen.getByText('Left content text')).toBeInTheDocument();
    expect(screen.getByText('Right content text')).toBeInTheDocument();
    expect(screen.getByText('Stránka 8 / Článek III.')).toBeInTheDocument();
  });
});
