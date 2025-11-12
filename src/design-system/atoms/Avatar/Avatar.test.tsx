import React from 'react';
import { render, screen } from '@testing-library/react';

import { Avatar } from './Avatar';

import '@testing-library/jest-dom';

describe('Avatar Component', () => {
  it('renders initials for a full name', () => {
    render(<Avatar name="John Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders initials for a long name', () => {
    render(<Avatar name="Alexander Hamilton" />);
    expect(screen.getByText('AH')).toBeInTheDocument();
  });

  it('renders initials for a single name', () => {
    render(<Avatar name="Madonna" />);
    expect(screen.getByText('M')).toBeInTheDocument();
  });

  it('renders initials for a name with multiple spaces', () => {
    render(<Avatar name="  John   Doe  " />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders initials for a name with special characters', () => {
    render(<Avatar name="Jean-Luc Picard" />);
    expect(screen.getByText('JP')).toBeInTheDocument();
  });
});
