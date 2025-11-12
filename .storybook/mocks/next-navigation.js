// Mock for next/navigation to work in Storybook
/* eslint-disable */

export const useRouter = () => ({
  push: (url) => {
    console.log('Storybook: Navigate to:', url);
  },
  replace: (url) => {
    console.log('Storybook: Replace with:', url);
  },
  back: () => {
    console.log('Storybook: Go back');
  },
  forward: () => {
    console.log('Storybook: Go forward');
  },
  refresh: () => {
    console.log('Storybook: Refresh');
  },
  prefetch: () => Promise.resolve(),
});

export const usePathname = () => '/storybook';

export const useSearchParams = () => ({
  get: (key) => null,
  has: (key) => false,
  toString: () => '',
});

export const useParams = () => ({});

export const notFound = () => {
  console.log('Storybook: notFound() called');
};

export const redirect = (url) => {
  console.log('Storybook: Redirect to:', url);
};
