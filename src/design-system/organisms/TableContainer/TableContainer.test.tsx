import { fireEvent, render, screen } from '@/core/tests/test-utils';
import { Button } from '@/design-system/atoms';

import { TableContainer } from './TableContainer';

const mockTabs = [
  { value: 'Tab 1', id: 'tab1' },
  { value: 'Tab 2', id: 'tab2' },
  { value: 'Tab 3', id: 'tab3' },
];

const mockSelectItems = [
  { label: '10', value: '10' },
  { label: '20', value: '20' },
  { label: '50', value: '50' },
];

const mockButtons = [
  <Button id="button-mock-1" key="1">
    Button 1
  </Button>,
  <Button id="button-mock-1" key="2">
    Button 2
  </Button>,
];
const mockSelectChange = jest.fn();
describe('TableContainer', () => {
  it('should render the title and description in the toolbar', () => {
    const setSelectedTabMock = jest.fn();
    const selectedTabMock = 'tab1';
    render(
      <TableContainer
        title="Test Table Title"
        description="Test Table Description"
        buttons={mockButtons}
        tabs={mockTabs}
        selectItems={mockSelectItems}
        onSelectChange={mockSelectChange}
        setSelectedTab={setSelectedTabMock}
        selectedTab={selectedTabMock}
      >
        <div>Tab Content 1</div>
        <div>Tab Content 2</div>
        <div>Tab Content 3</div>
      </TableContainer>,
    );

    expect(screen.getByText('Test Table Title')).toBeInTheDocument();
    expect(screen.getByText('Test Table Description')).toBeInTheDocument();
    // Ensures both buttons are rendered
    expect(screen.getAllByTestId('button-testId').length).toBe(mockButtons.length);
  });

  it('should render the correct number of tabs and switch between them', () => {
    const setSelectedTabMock = jest.fn();
    const selectedTabMock = 'tab1';
    render(
      <TableContainer
        tabs={mockTabs}
        selectItems={mockSelectItems}
        onSelectChange={mockSelectChange}
        setSelectedTab={setSelectedTabMock}
        selectedTab={selectedTabMock}
      >
        <div>Tab Content 1</div>
        <div>Tab Content 2</div>
        <div>Tab Content 3</div>
      </TableContainer>,
    );

    const tab1 = screen.getByText('Tab 1');
    const tab2 = screen.getByRole('tab', { name: /Tab 2/i });
    const tab3 = screen.getByRole('tab', { name: /Tab 3/i });

    expect(tab1).toBeInTheDocument();
    expect(tab2).toBeInTheDocument();
    expect(tab3).toBeInTheDocument();

    // Simulate tab clicks and verify displayed content
    fireEvent.click(tab2);
    expect(setSelectedTabMock).toHaveBeenCalledWith('tab2');
    fireEvent.click(tab3);
    expect(setSelectedTabMock).toHaveBeenCalledWith('tab3');
  });
});
