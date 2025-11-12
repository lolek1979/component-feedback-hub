import { fireEvent, render, screen } from '@/core/tests/test-utils';

import { TabGroup } from '.';

describe('TabGroup', () => {
  it('should render the correct number of tabs', () => {
    const tabs = [
      { value: 'Tab 1', id: 'tab1' },
      { value: 'Tab 2', id: 'tab2' },
      { value: 'Tab 3', id: 'tab3' },
    ];

    render(
      <TabGroup tabs={tabs}>
        <div>Content for Tab 1</div>
        <div>Content for Tab 2</div>
        <div>Content for Tab 3</div>
      </TabGroup>,
    );

    // Assert
    const renderedTabs = screen.getAllByRole('tab');
    expect(renderedTabs).toHaveLength(tabs.length);
  });

  it('should switch tabs correctly', () => {
    const tabs = [
      { value: 'Tab 1', id: 'tab1' },
      { value: 'Tab 2', id: 'tab2' },
      { value: 'Tab 3', id: 'tab3' },
    ];

    const setSelectedTabMock = jest.fn();
    const selectedTabMock = 'tab1';

    render(
      <TabGroup selectedTab={selectedTabMock} setSelectedTab={setSelectedTabMock} tabs={tabs}>
        <div>Content for Tab 1</div>
        <div>Content for Tab 2</div>
        <div>Content for Tab 3</div>
      </TabGroup>,
    );

    // Act
    const tab2 = screen.getByRole('tab', { name: /Tab 2/i });
    fireEvent.click(tab2);

    // Assert
    expect(setSelectedTabMock).toHaveBeenCalledWith('tab2');
  });

  it('should handle the disabled prop correctly', () => {
    const tabs = [
      { value: 'Tab 1', id: 'tab1' },
      { value: 'Tab 2', id: 'tab2', disabled: true },
      { value: 'Tab 3', id: 'tab3' },
    ];

    render(
      <TabGroup tabs={tabs}>
        <div>Content for Tab 1</div>
        <div>Content for Tab 2</div>
        <div>Content for Tab 3</div>
      </TabGroup>,
    );

    // Assert
    const disabledTab = screen.getByRole('tab', { name: /Tab 2/i });
    expect(disabledTab).toBeDisabled();
  });
});
