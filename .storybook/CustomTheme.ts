import { create } from 'storybook/theming/create';

export default create({
  base: 'light',
  // Typography
  fontBase: '"Inter", sans-serif',
  fontCode: 'monospace',

  brandTitle: 'VZP NIS Storybook',
  brandUrl: 'https://designsystem.ndev1.vzpdev.cz',
  brandImage: 'public/vzp_nis.png',
  brandTarget: '_self',
  colorPrimary: '#D22D0F',
  colorSecondary: '#D22D0F',

  // UI
  appBorderRadius: 4,

  // Text colors
  textColor: '#10162F',
  textInverseColor: '#ffffff',

  // Toolbar default and active colors
  barTextColor: '#9E9E9E',
  barSelectedColor: '#D22D0F',
  barHoverColor: '#B9B9C0',
});
