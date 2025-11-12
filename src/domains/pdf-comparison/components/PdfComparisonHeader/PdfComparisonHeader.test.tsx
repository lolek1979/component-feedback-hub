import React from 'react';
import { render, screen } from '@testing-library/react';

import { PdfComparisonHeader } from './PdfComparisonHeader';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string, options?: Record<string, any>) => {
    if (key === 'results.differences.matchPercentage' && options?.percentage !== undefined) {
      return `Match rate: ${options.percentage}%`;
    }

    return key;
  },
}));

describe('PdfComparisonHeader', () => {
  it('renders match percentage correctly', () => {
    render(<PdfComparisonHeader matchPercentage={85.5} />);

    expect(screen.getByText('Match rate: 85.5%')).toBeInTheDocument();
  });

  it('applies custom className and id', () => {
    render(<PdfComparisonHeader matchPercentage={95} className="custom-class" id="custom-id" />);

    const headerElement = screen.getByTestId('pdf-comparison-header');
    expect(headerElement).toHaveClass('custom-class');
    expect(headerElement).toHaveAttribute('id', 'custom-id');
  });

  it('handles zero percentage', () => {
    render(<PdfComparisonHeader matchPercentage={0} />);

    expect(screen.getByText('Match rate: 0%')).toBeInTheDocument();
  });

  it('handles 100% match', () => {
    render(<PdfComparisonHeader matchPercentage={100} />);

    expect(screen.getByText('Match rate: 100%')).toBeInTheDocument();
  });
});
