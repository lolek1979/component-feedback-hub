import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Stepper } from './Stepper';

const meta: Meta<typeof Stepper> = {
  title: 'Organisms/Stepper',
  component: Stepper,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    onStepChange: { action: 'step changed' },
    backButtonLabel: {
      description:
        'Label for the back button. Set to empty string to hide the back button completely.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Stepper>;

export const Default: Story = {
  args: {
    steps: [
      { id: 'step1', label: 'Zahájení řízení' },
      { id: 'step2', label: 'Shromažďování podkladů' },
      { id: 'step3', label: 'Posouzení žádosti' },
      { id: 'step4', label: 'Rozhodnutí' },
    ],
    activeStep: 0,
  },
};

export const WithBadges: Story = {
  args: {
    steps: [
      {
        id: 'step1',
        label: 'Registrace',
        completed: true,
        badgeContent: 'Dokončeno',
      },
      {
        id: 'step2',
        label: 'Ověření údajů',
        active: true,
        badgeContent: 'Probíhá',
      },
      { id: 'step3', label: 'Schválení', badgeContent: 'Čeká' },
      {
        id: 'step4',
        label: 'Aktivace',
        disabled: true,
        badgeContent: 'Nedostupné',
      },
    ],
    activeStep: 1,
  },
};

export const WithSubSteps: Story = {
  args: {
    steps: [
      { id: 'step1', label: 'Přípravná fáze' },
      { id: 'step2', label: 'Dokumentace' },
      { id: 'step3', label: 'Kontrola' },
      { id: 'step4', label: 'Dokončení' },
    ],
    activeStep: 1,
    groupSteps: {
      1: [
        { label: 'Sběr dokumentů' },
        { label: 'Kontrola úplnosti' },
        { label: 'Nahrání souborů' },
      ],
    },
  },
};

export const WithMultipleSubSteps: Story = {
  render: () => {
    function WithMultipleSubStepsComponent() {
      const [activeStep, setActiveStep] = useState(2);

      return (
        <Stepper
          steps={[
            { id: 'step1', label: 'Zahájení' },
            { id: 'step2', label: 'Příprava podkladů' },
            { id: 'step3', label: 'Ověření' },
            { id: 'step4', label: 'Uzavření' },
          ]}
          activeStep={activeStep}
          onStepChange={setActiveStep}
          groupSteps={{
            0: [{ label: 'Podání žádosti' }, { label: 'Ověření e-mailu' }],
            1: [
              { label: 'Sběr dokumentů' },
              { label: 'Kontrola úplnosti', badgeContent: 'No response from the participant' },
            ],
            2: [
              { label: 'Kontrola dokumentů' },
              { label: 'Ověření totožnosti', badgeContent: 'No response from the participant' },
              { label: 'Ověření adresy' },
            ],
          }}
        />
      );
    }

    return <WithMultipleSubStepsComponent />;
  },
};

export const MultipleSubStepsWithNavigation: Story = {
  render: () => {
    function MultipleSubStepsWithNavigation() {
      const [activeStep, setActiveStep] = useState(3);

      return (
        <div>
          <Stepper
            steps={[
              { id: 'step1', label: 'First Phase' },
              { id: 'step2', label: 'Second Phase' },
              { id: 'step3', label: 'Third Phase' },
              { id: 'step4', label: 'Completion' },
            ]}
            activeStep={activeStep}
            onStepChange={setActiveStep}
            showNavigation={true}
            groupSteps={{
              0: [
                { label: 'Submit application' },
                { label: 'Email verification', badgeContent: 'No response from the participant' },
              ],
              1: [
                { label: 'Document collection', badgeContent: 'Bez reakce účastníka' },
                { label: 'Completeness check' },
              ],
              2: [
                { label: 'Document review' },
                { label: 'Identity verification' },
                { label: 'Address verification' },
              ],
            }}
          />
        </div>
      );
    }

    return <MultipleSubStepsWithNavigation />;
  },
};
