import type { Meta, StoryObj } from '@storybook/react';

import { JsonDetailViewer } from './JsonDetailViewer';

const meta: Meta<typeof JsonDetailViewer> = {
  title: 'Molecules/JsonDetailViewer',
  component: JsonDetailViewer,
};

export default meta;

type Story = StoryObj<typeof JsonDetailViewer>;

export const Default: Story = {
  args: {
    data: { id: 'John Doe', timestamp: '2025-07-07T09:41:50.729Z', domain: 'example.com' },
    translation: 'AuditPage.headers',
  },
};
