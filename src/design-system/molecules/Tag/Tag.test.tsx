import React from 'react';
import { render, screen } from '@testing-library/react';

import { Tag } from './Tag';

import '@testing-library/jest-dom';

describe('Tag', () => {
  it('renders active variant correctly', () => {
    render(
      <Tag id="TestID" variant="active">
        Aktivní
      </Tag>,
    );
    expect(screen.getByText('Aktivní')).toBeInTheDocument();
    const icon = screen.getByTestId('tag-icon');
    expect(icon).toBeInTheDocument();
  });

  it('renders concept variant correctly', () => {
    render(
      <Tag id="TestID" variant="concept">
        Koncept
      </Tag>,
    );
    expect(screen.getByText('Koncept')).toBeInTheDocument();
    const icon = screen.getByTestId('tag-icon');
    expect(icon).toBeInTheDocument();
  });

  it('renders waiting variant correctly', () => {
    render(
      <Tag id="TestID" variant="planned">
        Čeká na schválení
      </Tag>,
    );
    expect(screen.getByText('Čeká na schválení')).toBeInTheDocument();
    const icon = screen.getByTestId('tag-icon');
    expect(icon).toBeInTheDocument();
  });

  it('renders inactive variant correctly', () => {
    render(
      <Tag id="TestID" variant="expired">
        Neaktivní
      </Tag>,
    );
    expect(screen.getByText('Neaktivní')).toBeInTheDocument();
  });

  it('renders denied variant correctly', () => {
    render(
      <Tag id="TestID" variant="denied">
        Zamítnuto
      </Tag>,
    );
    expect(screen.getByText('Zamítnuto')).toBeInTheDocument();
    const icon = screen.getByTestId('tag-icon');
    expect(icon).toBeInTheDocument();
    expect(screen.getByTestId('tag-svg-denied')).toBeInTheDocument();
  });
});
