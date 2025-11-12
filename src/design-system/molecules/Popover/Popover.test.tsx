import { NextIntlClientProvider } from 'next-intl';
import { render, screen } from '@testing-library/react';

import messages from '@/core/messages/cs.json';
import { FeedBackHubProvider } from '@/core/providers/FeedBackHubProvider';

import { Popover } from '.';

const renderPopover = (component: React.ReactNode) => {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <FeedBackHubProvider>{component}</FeedBackHubProvider>
    </NextIntlClientProvider>,
  );
};
const content = () => <div>Content</div>;
const trigger = <button>Trigger</button>;
describe('Popover', () => {
  it('should render the heading', () => {
    renderPopover(<Popover content={content} trigger={trigger} title="PopoverTitle" />);

    // Assert
    screen.queryByTestId('title-id');
  });
});
