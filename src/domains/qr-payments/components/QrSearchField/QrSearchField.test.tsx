import React from 'react';
import { render, screen } from '@testing-library/react';

import { Address } from '../InsurerInfo';
import { QrSearchField } from './QrSearchField';

// Mocks
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('@/design-system/atoms/SegmentedControl', () => ({
  SegmentedControl: (props: any) => (
    <div data-testid="segmented-control">{JSON.stringify(props.options)}</div>
  ),
}));

jest.mock('@/design-system', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  SearchInsuranceForm: ({ setSsnNumber, onSubmit }: any) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSsnNumber('123456789');
        onSubmit('123456789');
      }}
    >
      <input type="text" aria-label="ssn-input" onChange={(e) => setSsnNumber(e.target.value)} />
      <button type="submit">Submit</button>
    </form>
  ),
}));

describe('QrSearchField', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders SegmentedControl', () => {
    render(
      <QrSearchField
        setPrimAdress={function (add: Address): void {
          throw new Error('Function not implemented.');
        }}
        setSecAdress={function (add: Address | undefined): void {
          throw new Error('Function not implemented.');
        }}
        isSubmitting={false}
        setIsSubmitting={function (value: boolean): void {
          throw new Error('Function not implemented.');
        }}
      />,
    );
    expect(screen.getByTestId('segmented-control')).toBeInTheDocument();
  });

  it('renders SearchInsuranceForm', () => {
    render(
      <QrSearchField
        setPrimAdress={function (add: Address): void {
          throw new Error('Function not implemented.');
        }}
        setSecAdress={function (add: Address | undefined): void {
          throw new Error('Function not implemented.');
        }}
        isSubmitting={false}
        setIsSubmitting={function (value: boolean): void {
          throw new Error('Function not implemented.');
        }}
      />,
    );
    expect(screen.getByRole('textbox', { name: /ssn-input/i })).toBeInTheDocument();
  });

  it('does not show copy button initially', () => {
    render(
      <QrSearchField
        setPrimAdress={function (add: Address): void {
          throw new Error('Function not implemented.');
        }}
        setSecAdress={function (add: Address | undefined): void {
          throw new Error('Function not implemented.');
        }}
        isSubmitting={false}
        setIsSubmitting={function (value: boolean): void {
          throw new Error('Function not implemented.');
        }}
      />,
    );
    expect(screen.queryByRole('button', { name: 'QRCodes.copySSN' })).not.toBeInTheDocument();
  });
});
