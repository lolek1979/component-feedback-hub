import { CSSProperties, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { AccountInfo, Logger, PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import enMessages from '@/core/messages/en.json';
import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';
import { Button } from '@/design-system/atoms';

import { UserBubble, UserBubbleProps } from './UserBubble';
const queryClient = new QueryClient();

const mockLogger = {
  clone: () => mockLogger,
  info: () => {},
  error: () => {},
  warning: () => {},
  verbose: () => {},
} as unknown as Logger;

const mockMsalInstance = {
  getAllAccounts: () => [
    {
      idTokenClaims: {
        given_name: 'John',
        family_name: 'Doe',
        email: 'john.doe@example.com',
      },
    } as unknown as AccountInfo,
  ],
  logoutPopup: async () => {
    return Promise.resolve();
  },
  getLogger: () => mockLogger,
  getActiveAccount: () =>
    ({
      idTokenClaims: {
        given_name: 'John',
        family_name: 'Doe',
        email: 'john.doe@example.com',
      },
    }) as unknown as AccountInfo,
  initializeWrapperLibrary: () => {},
  addEventCallback: () => {},
  initialize: () => {
    return new Promise<void>((resolve) => {
      resolve();
    });
  },
} as unknown as PublicClientApplication;

const MockMsalProvider = ({ children }: { children: React.ReactNode }) => (
  <MsalProvider instance={mockMsalInstance}>{children}</MsalProvider>
);
const RenderUserBubble = (args: UserBubbleProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const wrapperStyles: CSSProperties = {
    maxWidth: '300px',
    height: '100px',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    position: 'relative',
    padding: '20px 40px',
  };

  return (
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <FeedBackHubProvider>
        <MockMsalProvider>
          <QueryClientProvider client={queryClient}>
            <div style={wrapperStyles}>
              <Button id="button-user-bubble-open" onClick={() => setIsOpen(true)}>
                Open User Bubble Menu
              </Button>
              <UserBubble isOpen={isOpen} setIsOpen={setIsOpen} {...args} />
            </div>
          </QueryClientProvider>
        </MockMsalProvider>
      </FeedBackHubProvider>
    </NextIntlClientProvider>
  );
};

const meta: Meta<typeof UserBubble> = {
  title: 'Organisms/UserBubble',
  component: RenderUserBubble,
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional class names to style the UserBubble component.',
    },
    isOpen: {
      control: 'boolean',
      description: 'Boolean flag to control the visibility of the UserBubble.',
    },
    setIsOpen: {
      control: 'boolean',
      description: 'Function to set the visibility state of the UserBubble.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof UserBubble>;

export const Default: Story = {};
