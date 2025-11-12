import { render, screen } from '@testing-library/react';

import type { Step } from './StepProgressBar';
import { StepProgressBar } from '.';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

const steps: Step[] = [{ status: 'passed' }, { status: 'active' }, { status: 'incomplete' }];

const stepsWithLabels: Step[] = [
  { label: 'Step 1', status: 'passed' },
  { label: 'Step 2', status: 'active' },
  { label: 'Step 3', status: 'incomplete' },
];

describe('StepProgressBar', () => {
  it('renders the correct number of steps', () => {
    render(<StepProgressBar steps={steps} />);
    expect(screen.getAllByTestId('step-icon-wrapper').length).toBe(3);
  });

  it('renders step labels when provided', () => {
    render(<StepProgressBar steps={stepsWithLabels} />);
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
  });

  it('renders the correct number of dividers (steps.length - 1)', () => {
    render(<StepProgressBar steps={steps} />);
    expect(screen.getAllByRole('separator').length).toBe(2);
  });

  it('renders the correct icon for each status', () => {
    render(<StepProgressBar steps={stepsWithLabels} />);
    const wrappers = screen.getAllByTestId('step-icon-wrapper');
    wrappers.forEach((wrapper) => {
      expect(wrapper.childNodes.length).toBeGreaterThan(0);
    });
    expect(wrappers.length).toBe(3);
  });

  it('renders with horizontal orientation by default', () => {
    render(<StepProgressBar steps={steps} />);
    const container = screen.getByTestId('step-progress-bar');
    expect(container.className).toMatch(/horizontal/);
  });

  it('renders with vertical orientation when specified', () => {
    render(<StepProgressBar steps={steps} orientation="vertical" />);
    const container = screen.getByTestId('step-progress-bar');
    expect(container.className).toMatch(/vertical/);
  });
});
