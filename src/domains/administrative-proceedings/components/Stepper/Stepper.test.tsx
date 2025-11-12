/* eslint-disable testing-library/no-node-access */
import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import userEvent from '@testing-library/user-event';

import messages from '@/core/messages/cs.json';
import { render, screen } from '@/core/tests/test-utils';

import { Stepper } from './Stepper';

const renderWithProviders = (component: ReactNode) =>
  render(
    <NextIntlClientProvider locale="cs" messages={messages}>
      {component}
    </NextIntlClientProvider>,
  );

describe('Stepper', () => {
  const mockSteps = [
    { id: 'step1', label: 'Step 1', completed: true },
    { id: 'step2', label: 'Step 2' },
    { id: 'step3', label: 'Step 3' },
    { id: 'step4', label: 'Step 4' },
  ];

  const mockGroupSteps = {
    1: [
      { id: 'substep1', label: 'Sub-step 1', completed: true },
      { id: 'substep2', label: 'Sub-step 2' },
      { id: 'substep3', label: 'Sub-step 3' },
    ],
  };

  it('renders all steps correctly', () => {
    renderWithProviders(<Stepper steps={mockSteps} />);

    expect(screen.getByText('1. Step 1')).toBeInTheDocument();
    expect(screen.getByText('2. Step 2')).toBeInTheDocument();
    expect(screen.getByText('3. Step 3')).toBeInTheDocument();
    expect(screen.getByText('4. Step 4')).toBeInTheDocument();
  });

  it('applies the correct styling based on step status', () => {
    renderWithProviders(<Stepper steps={mockSteps} activeStep={1} />);

    const step1Container = screen.getByText('1. Step 1').closest('div')?.parentElement;
    expect(step1Container).toHaveClass('completed');

    const step2Container = screen.getByText('2. Step 2').closest('div')?.parentElement;
    expect(step2Container).toHaveClass('active');

    const step4Container = screen.getByText('4. Step 4').closest('div')?.parentElement;
    expect(step4Container).toHaveClass('disabled');
  });

  it('expands/collapses steps with group steps', async () => {
    const user = userEvent.setup();
    const onStepChangeMock = jest.fn();

    renderWithProviders(
      <Stepper
        steps={mockSteps}
        groupSteps={mockGroupSteps}
        activeStep={1}
        onStepChange={onStepChangeMock}
      />,
    );

    expect(screen.getByText('Sub-step 1')).toBeInTheDocument();

    await user.click(screen.getByText('2. Step 2'));

    await user.click(screen.getByText('2. Step 2'));

    expect(screen.getByText('Sub-step 1')).toBeInTheDocument();
    expect(screen.getByText('Sub-step 2')).toBeInTheDocument();
    expect(screen.getByText('Sub-step 3')).toBeInTheDocument();
  });

  it('does not allow interaction with disabled steps', async () => {
    const user = userEvent.setup();
    const onStepChangeMock = jest.fn();

    const disabledSteps = [
      { id: 'step1', label: 'Step 1', completed: false },
      { id: 'step2', label: 'Step 2', disabled: true },
    ];

    renderWithProviders(
      <Stepper steps={disabledSteps} activeStep={0} onStepChange={onStepChangeMock} />,
    );

    await user.click(screen.getByText('2. Step 2'));

    expect(onStepChangeMock).not.toHaveBeenCalled();
  });
});
