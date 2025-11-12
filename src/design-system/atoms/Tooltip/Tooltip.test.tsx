import { fireEvent, render, screen } from '@testing-library/react';

import { Tooltip } from './Tooltip';
import styles from './Tooltip.module.css';

describe('Tooltip component', () => {
  test('displays the tooltip on mouse over', () => {
    render(
      <Tooltip content="Tooltip text" id={'tooltip-text'}>
        <button>Hover over me</button>
      </Tooltip>,
    );

    const button = screen.getByText('Hover over me');
    fireEvent.mouseOver(button);

    const tooltip = screen.getByText('Tooltip text');
    expect(tooltip).toBeInTheDocument();
  });

  test('hides the tooltip on mouse out', () => {
    render(
      <Tooltip id={'tooltip-mouse'} content="Tooltip text">
        <button>Hover over me</button>
      </Tooltip>,
    );

    const button = screen.getByText('Hover over me');
    fireEvent.mouseOver(button);

    const tooltip = screen.getByText('Tooltip text');
    expect(tooltip).toBeInTheDocument();

    fireEvent.mouseOut(button);
    expect(tooltip).not.toBeInTheDocument();
  });

  test('shows tooltip on focus', () => {
    render(
      <Tooltip id={'tooltip-focus'} content="Tooltip text">
        <button>Focus on me</button>
      </Tooltip>,
    );

    const button = screen.getByText('Focus on me');
    fireEvent.focus(button);

    const tooltip = screen.getByText('Tooltip text');
    expect(tooltip).toBeInTheDocument();
  });

  test('tooltip is positioned correctly based on placement prop', () => {
    render(
      <Tooltip id={'tooltip-placement'} content="Tooltip text" placement="tooltipTop">
        <button>Hover over me</button>
      </Tooltip>,
    );

    const button = screen.getByText('Hover over me');
    fireEvent.mouseOver(button);

    const tooltipContainer = screen.getByRole('tooltip');
    expect(tooltipContainer).toBeInTheDocument();

    expect(tooltipContainer).toHaveClass(styles.tooltipTop);
  });
});
