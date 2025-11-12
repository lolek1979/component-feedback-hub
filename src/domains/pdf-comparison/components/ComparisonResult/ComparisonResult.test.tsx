import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { ComparisonResult } from './ComparisonResult';

describe('ComparisonResult', () => {
  const defaultProps = {
    id: 'test-comparison-result',
  };

  describe('Success variant', () => {
    it('renders success variant correctly', () => {
      render(
        <ComparisonResult
          {...defaultProps}
          variant="success"
          title="Míra shody 100 %"
          description="Oba dokumenty jsou identické, žádné rozdíly nebyly nalezeny."
        />,
      );

      expect(screen.getByText('Míra shody 100 %')).toBeInTheDocument();
      expect(
        screen.getByText('Oba dokumenty jsou identické, žádné rozdíly nebyly nalezeny.'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('comparison-result-success')).toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('Error variant', () => {
    it('renders error variant correctly', () => {
      render(
        <ComparisonResult
          {...defaultProps}
          variant="error"
          title="Dokumenty se nepodařilo nahrát"
          description="Zkuste prosím soubory nahrát znovu"
        />,
      );

      expect(screen.getByText('Dokumenty se nepodařilo nahrát')).toBeInTheDocument();
      expect(screen.getByText('Zkuste prosím soubory nahrát znovu')).toBeInTheDocument();
      expect(screen.getByTestId('comparison-result-error')).toBeInTheDocument();
    });

    it('renders retry button when onRetry is provided', () => {
      const handleRetry = jest.fn();

      render(
        <ComparisonResult
          {...defaultProps}
          variant="error"
          title="Error Title"
          description="Error Description"
          onRetry={handleRetry}
          retryLabel="Zkusit znovu"
        />,
      );

      const retryButton = screen.getByRole('button', { name: /zkusit znovu/i });
      expect(retryButton).toBeInTheDocument();
    });

    it('calls onRetry when retry button is clicked', () => {
      const handleRetry = jest.fn();

      render(
        <ComparisonResult
          {...defaultProps}
          variant="error"
          title="Error Title"
          description="Error Description"
          onRetry={handleRetry}
        />,
      );

      const retryButton = screen.getByRole('button');
      fireEvent.click(retryButton);

      expect(handleRetry).toHaveBeenCalledTimes(1);
    });

    it('does not render retry button when onRetry is not provided', () => {
      render(
        <ComparisonResult
          {...defaultProps}
          variant="error"
          title="Error Title"
          description="Error Description"
        />,
      );

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('Common props', () => {
    it('applies custom className', () => {
      render(
        <ComparisonResult
          {...defaultProps}
          variant="success"
          title="Title"
          description="Description"
          className="custom-class"
        />,
      );

      expect(screen.getByTestId('comparison-result-success')).toHaveClass('custom-class');
    });

    it('renders with correct id', () => {
      render(
        <ComparisonResult
          {...defaultProps}
          variant="success"
          title="Title"
          description="Description"
          id="custom-id"
        />,
      );

      const element = screen.getByTestId('comparison-result-success');
      expect(element).toHaveAttribute('id', 'custom-id');
    });
  });
});
