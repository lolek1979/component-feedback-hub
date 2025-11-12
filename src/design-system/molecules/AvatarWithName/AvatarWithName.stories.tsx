import type { Meta, StoryObj } from '@storybook/nextjs';

import { AvatarWithName } from './AvatarWithName';

const meta: Meta<typeof AvatarWithName> = {
  title: 'Molecules/UserAvatarWithName',
  component: AvatarWithName,
  argTypes: {
    name: {
      description:
        'The name, organization and email of the user to be displayed in the avatar. Expected format "First name Surname (Organization), email"',
      control: 'text',
    },
    displayNameOnly: {
      description: 'Display only the name without the email',
      control: 'boolean',
    },
    phone: {
      description: 'Phone number to display after name and organization',
      control: 'text',
    },
    size: {
      description: 'Size variant of the component',
      control: 'select',
      options: ['S', 'M', 'L'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof AvatarWithName>;

export const Default: Story = {
  args: {
    name: 'Pepa Zdepa (VZP ČR Ústředí), pepa.zdepa@vzp.cz',
  },
};

export const DisplayNameOnly: Story = {
  args: {
    name: 'Pepa Zdepa (VZP ČR Ústředí), pepa.zdepa@vzp.cz',
    displayNameOnly: true,
  },
};

export const WithPhone: Story = {
  args: {
    name: 'Milan Fousek (Regionální pobočka Ostrava), milanfousek@vzp.cz',
    phone: '+420 123 456 789',
  },
};

export const SizeS: Story = {
  args: {
    name: 'Milan Fousek (Regionální pobočka Ostrava), milanfousek@vzp.cz',
    phone: '+420 123 456 789',
    size: 'S',
  },
};

export const SizeM: Story = {
  args: {
    name: 'Milan Fousek (Regionální pobočka Ostrava), milanfousek@vzp.cz',
    phone: '+420 123 456 789',
    size: 'M',
  },
};

export const SizeL: Story = {
  args: {
    name: 'Milan Fousek (Regionální pobočka Ostrava), milanfousek@vzp.cz',
    phone: '+420 123 456 789',
    size: 'L',
  },
};

export const Invalid: Story = {
  args: {
    name: 'Authentication failed',
  },
};
