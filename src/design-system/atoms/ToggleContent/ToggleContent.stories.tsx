import React from 'react';
import { Meta, StoryObj } from '@storybook/nextjs';

import { ToggleContent } from './ToggleContent';

const meta: Meta<typeof ToggleContent> = {
  title: 'Atoms/ToggleContent',
  component: ToggleContent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
          The ToggleContent component provides a collapsible container that can show or hide content.
          It's commonly used in navigation menus, FAQ sections, or any place where space needs to be
          conserved by hiding content until needed.
        `,
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      defaultValue: 'Toggle Content Title',
      description: 'The header text displayed for the toggle section.',
    },
    collapsed: {
      control: 'boolean',
      defaultValue: true,
      description: 'Whether the content is initially collapsed.',
    },
    borderColor: {
      control: 'color',
      description: 'Border color of the toggle container.',
    },
    headerColor: {
      control: 'color',
      description: 'Background color of the header section.',
    },
    width: {
      control: 'text',
      description: 'Width of the toggle container (e.g., "400px", "100%").',
    },
    isActiveStep: {
      control: 'boolean',
      defaultValue: false,
      description: 'Marks the toggle as the active step (useful in stepper contexts).',
    },
    isDisabled: {
      control: 'boolean',
      defaultValue: false,
      description: 'Disables the toggle, preventing expansion/collapse.',
    },
    badgeStatus: {
      control: 'select',
      options: ['finished', 'opened', 'pending', 'error', undefined],
      description: 'Status of the badge shown in the header (e.g., step status).',
    },
    badgeLabel: {
      control: 'text',
      description: 'Custom label for the badge.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ToggleContent>;

export const Default: Story = {
  args: {
    title: 'Default Toggle Content',
    collapsed: true,
    children: <p>This is the content that can be toggled on and off.</p>,
  },
};

export const WithStyling: Story = {
  args: {
    title: 'Styled Toggle Content',
    collapsed: true,
    borderColor: '#e0e0e0',
    headerColor: '#f5f5f5',
    width: '400px',
    children: (
      <div style={{ padding: '10px' }}>
        <p>This toggle content has custom styling applied to it.</p>
        <ul>
          <li>Custom border color</li>
          <li>Custom header background</li>
          <li>Custom width</li>
        </ul>
      </div>
    ),
  },
};

export const Expanded: Story = {
  args: {
    title: 'Expanded Toggle Content',
    collapsed: false,
    children: (
      <div>
        <p>This content is visible by default because the toggle is expanded.</p>
        <p>Click the header to collapse it.</p>
      </div>
    ),
  },
};

export const Disabled: Story = {
  args: {
    title: 'Disabled Toggle Content',
    collapsed: true,
    isDisabled: true,
    children: <p>This toggle content is disabled and cannot be expanded.</p>,
  },
};

export const WithDefaultBadgeLabels: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ToggleContent title="Finished Step" badgeStatus="finished">
        Content for finished step
      </ToggleContent>

      <ToggleContent title="In Progress Step" badgeStatus="opened">
        Content for in-progress step
      </ToggleContent>

      <ToggleContent title="Pending Step" badgeStatus="pending">
        Content for pending step
      </ToggleContent>

      <ToggleContent title="Error Step" badgeStatus="error">
        Content for error step
      </ToggleContent>
    </div>
  ),
};

export const WithCustomBadgeLabels: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ToggleContent title="Finished Step" badgeStatus="finished" badgeLabel="Done ✓">
        Content for finished step
      </ToggleContent>

      <ToggleContent title="In Progress Step" badgeStatus="opened" badgeLabel="Working...">
        Content for in-progress step
      </ToggleContent>

      <ToggleContent title="Pending Step" badgeStatus="pending" badgeLabel="Waiting">
        Content for pending step
      </ToggleContent>

      <ToggleContent title="Error Step" badgeStatus="error" badgeLabel="Failed!">
        Content for error step
      </ToggleContent>
    </div>
  ),
};

export const BadgesInStepperContext: Story = {
  render: () => (
    <div style={{ width: '500px' }}>
      <ToggleContent title="1. Personal Information" badgeStatus="finished" badgeLabel="Completed">
        Form content would go here.
      </ToggleContent>

      <ToggleContent title="2. Address Information" badgeStatus="opened" badgeLabel="In progress">
        Form content would go here.
      </ToggleContent>

      <ToggleContent
        title="3. Employment Information"
        badgeStatus="pending"
        badgeLabel="Pending"
        collapsed={true}
      >
        Form content would go here.
      </ToggleContent>

      <ToggleContent
        title="4. Review & Submit"
        badgeStatus="pending"
        badgeLabel="Pending"
        collapsed={true}
        isDisabled={true}
      >
        Form content would go here.
      </ToggleContent>
    </div>
  ),
};
