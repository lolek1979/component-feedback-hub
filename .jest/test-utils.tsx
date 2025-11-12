import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

type ProvidersProps = {
  readonly children?: any;
};

// Add in any providers here if necessary:
// (ReduxProvider, ThemeProvider, etc)
const Providers = ({ children }: ProvidersProps) => {
  return children;
};

const customRender = (ui: ReactElement<any>, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: Providers, ...options });

// re-export everything
export * from '@testing-library/react';
// override render method
export { customRender as render };
