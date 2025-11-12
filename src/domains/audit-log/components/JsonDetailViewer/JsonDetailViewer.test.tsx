import { render, screen } from '@testing-library/react';

import { JsonDetailViewer } from './JsonDetailViewer';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
}));

describe('JsonDetailViewer', () => {
  it('renders flat JSON object correctly', () => {
    const data = {
      name: 'Alice',
      age: 30,
      active: true,
    };

    render(<JsonDetailViewer data={data} translation="user" />);

    expect(screen.getByText((content) => content.includes('user.name'))).toBeInTheDocument();
    expect(screen.getByText('"Alice"')).toBeInTheDocument();

    expect(screen.getByText((content) => content.includes('user.age'))).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();

    expect(screen.getByText((content) => content.includes('user.active'))).toBeInTheDocument();
    expect(screen.getByText('true')).toBeInTheDocument();
  });

  it('renders nested JSON object with indentation', () => {
    const data = {
      user: {
        name: 'Bob',
        details: {
          age: 25,
          city: 'Prague',
        },
      },
    };

    render(<JsonDetailViewer data={data} translation="profile" />);

    expect(screen.getByText((content) => content.includes('profile.name'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('profile.user'))).toBeInTheDocument();
    expect(screen.getByText('"Bob"')).toBeInTheDocument();
    expect(screen.getByText('profile.details')).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('profile.age'))).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('profile.city'))).toBeInTheDocument();
    expect(screen.getByText('"Prague"')).toBeInTheDocument();
  });

  it('renders null values', () => {
    const data = {
      nullable: null,
    };

    render(<JsonDetailViewer data={data} translation="test" />);
    expect(screen.getByText((content) => content.includes('test.nullable'))).toBeInTheDocument();
    expect(screen.getByText('null')).toBeInTheDocument();
  });
});
