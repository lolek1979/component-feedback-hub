import { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import IApprove from '@/core/assets/icons/icon-order-approve.svg';
import IPlaceholder from '@/core/assets/icons/icon-placeholder.svg';
import ISettings from '@/core/assets/icons/icon-settings.svg';

import { NavLink } from './NavLink';

const meta: Meta<typeof NavLink> = {
  title: 'Atoms/NavLink',
  component: NavLink,
  argTypes: {
    href: { description: 'The URL the link points to.' },
    className: { description: 'Additional CSS classes for the link.' },
    children: { description: 'The content inside the link.' },
    ariaLabel: { description: 'Aria label for the link.' },
  },
};

export default meta;

type Story = StoryObj<typeof NavLink>;

const linksStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

export const Default: Story = {
  render: (args) => (
    <NavLink {...args}>
      <IApprove /> {`Poplatky a doplatky`}
    </NavLink>
  ),
  args: {
    href: '#',
  },
};

export const Active: Story = {
  render: () => (
    <NavLink href="#">
      <IApprove /> {`Poplatky a doplatky`}
    </NavLink>
  ),
};

export const NavList: Story = {
  render: () => (
    <nav style={linksStyles}>
      <NavLink href="#">
        <IApprove /> {`Poplatky a doplatky`}
      </NavLink>
      <NavLink href="#">
        <IPlaceholder /> {`Lorem ipsum`}
      </NavLink>
      <NavLink href="#">
        <IPlaceholder /> {`Lorem ipsum`}
      </NavLink>
      <NavLink href="#">
        <ISettings /> {`Nastavení`}
      </NavLink>
    </nav>
  ),
};
