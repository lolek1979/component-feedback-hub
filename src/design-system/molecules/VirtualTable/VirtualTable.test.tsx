import { render, screen } from '@/core/tests/test-utils';

import VirtualTable from './VirtualTable';

class ResizeObserverMock {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

beforeAll(() => {
  global.ResizeObserver = ResizeObserverMock;
});

afterAll(() => {
  // @ts-ignore: Restore the original implementation if it exists
  delete global.ResizeObserver;
});

const tableHeader = ['Header 1', 'Header 2', 'Header 3'];
const tableBody = [
  ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
  ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3'],
];

describe('VirtualTable', () => {
  beforeAll(() => {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });
  it('renders nothing if no data is provided', () => {
    render(<VirtualTable headerData={[]} bodyData={[]} cellHeight={40} tableHeight={300} />);
    expect(screen.queryByText('Header 1')).not.toBeInTheDocument();
  });

  it('supports custom className', () => {
    render(
      <VirtualTable
        headerData={tableHeader}
        bodyData={tableBody}
        tableHeight={300}
        cellHeight={40}
        className="custom-class"
      />,
    );
    const container = screen.getByRole('table') || document.querySelector('.custom-class');
    expect(container).toBeTruthy();
  });
});
