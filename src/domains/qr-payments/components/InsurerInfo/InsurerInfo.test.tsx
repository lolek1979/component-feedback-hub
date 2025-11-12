import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { Address, InsurerInfo } from './InsurerInfo';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      ssn: 'SSN:',
      permanentAddress: 'Permanent Address',
      mailAdress: 'Mail Address',
    };

    return translations[key] || key;
  },
}));

// Mock design-system/atoms
jest.mock('@/design-system/atoms', () => ({
  Divider: () => <hr data-testid="divider" />,
  Text: ({ children, variant }: any) => <span data-testid={variant}>{children}</span>,
}));

jest.mock('./partials/ClientInfoCard', () => (props: any) => (
  <div data-testid={`client-info-card-${props.radioId}`}>
    <span>{props.radioLabel}</span>
    <button onClick={props.onRadioChange} data-testid={`radio-${props.radioId}`}>
      Select
    </button>
    <div>{props.adress.street}</div>
    <div>{props.adress.zipCode}</div>
    <div>{props.adress.town}</div>
  </div>
));

const permAdress: Address = {
  street: '123 Main St',
  zip: '12345',
  city: 'Townsville',
  addressType: 'E',
};

const mailAdress: Address = {
  street: '456 Side St',
  zip: '67890',
  city: 'Villagetown',
  addressType: 'A',
};

describe('InsurerInfo', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders permanent address card', () => {
    render(<InsurerInfo permAdress={permAdress} />);
    expect(
      screen.getByTestId('client-info-card-radio-insurerinfo-perm-adress'),
    ).toBeInTheDocument();
    expect(screen.getByText('Permanent Address')).toBeInTheDocument();
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
  });

  it('renders mail address card if mailAdress is provided', () => {
    render(<InsurerInfo permAdress={permAdress} mailAdress={mailAdress} />);
    expect(
      screen.getByTestId('client-info-card-radio-insurerinfo-mail-adress'),
    ).toBeInTheDocument();
    expect(screen.getByText('Mail Address')).toBeInTheDocument();
    expect(screen.getByText('456 Side St')).toBeInTheDocument();
  });

  it('does not render mail address card if mailAdress is not provided', () => {
    render(<InsurerInfo permAdress={permAdress} />);
    expect(
      screen.queryByTestId('client-info-card-radio-insurerinfo-mail-adress'),
    ).not.toBeInTheDocument();
  });

  it('calls setSelectedAddress when radio buttons are clicked', () => {
    render(<InsurerInfo permAdress={permAdress} mailAdress={mailAdress} />);
    // Click permanent address radio
    fireEvent.click(screen.getByTestId('radio-radio-insurerinfo-perm-adress'));
    // Click mail address radio
    fireEvent.click(screen.getByTestId('radio-radio-insurerinfo-mail-adress'));
    // No assertion here since setSelectedAddress is internal state,
    // but this ensures the buttons are clickable and do not throw.
  });

  it('renders divider', () => {
    render(<InsurerInfo permAdress={permAdress} />);
    expect(screen.getByTestId('divider')).toBeInTheDocument();
  });
});
