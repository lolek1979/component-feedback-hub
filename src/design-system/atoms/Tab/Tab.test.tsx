import { fireEvent, render, screen } from '@/core/tests/test-utils';

import { Tab } from '.';

describe('Tab', () => {
  it('should render the tab with children', () => {
    render(<Tab id="tab-content">Tab Content</Tab>);
    expect(screen.getByText('Tab Content')).toBeInTheDocument();
  });

  it('should toggle selected state on click', () => {
    render(
      <Tab id="selected-tab" selected>
        Tab Content
      </Tab>,
    );
    const tabElement = screen.getByText('Tab Content');
    fireEvent.click(tabElement);
    expect(tabElement).toHaveClass('text subtitle');
  });
});
