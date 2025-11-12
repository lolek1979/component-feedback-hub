import { render, screen } from '@/core/tests/test-utils';

import { AvatarWithName } from '.';

describe('UserAvatarWithName', () => {
  it('should render the user name', () => {
    render(
      <AvatarWithName
        name="Pepa z Depa (VZP ČR Ústředí), pepa.z.depa@vzp.cz"
        displayNameOnly={true}
      />,
    );
    expect(screen.getByText('Pepa z Depa')).toBeInTheDocument();
  });

  it('should render the user name with organization', () => {
    render(
      <AvatarWithName
        name="Pepa z Depa (VZP ČR Ústředí), pepa.z.depa@vzp.cz"
        displayNameOnly={false}
      />,
    );
    expect(screen.getByText('(VZP ČR Ústředí)')).toBeInTheDocument();
  });

  it('should render the user name with email', () => {
    render(
      <AvatarWithName
        name="Pepa z Depa (VZP ČR Ústředí), pepa.z.depa@vzp.cz"
        displayNameOnly={false}
      />,
    );
    expect(screen.getByText('pepa.z.depa@vzp.cz')).toBeInTheDocument();
  });

  it('should render the - only', () => {
    render(<AvatarWithName name="Pepa z Depa  pepa.z.depa@vzp.cz" displayNameOnly={false} />);
    expect(screen.getByText('pepa.z.depa@vzp.cz')).toBeInTheDocument();
  });
});
