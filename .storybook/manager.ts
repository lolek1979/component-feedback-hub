import { addons } from 'storybook/manager-api';

import customTheme from './CustomTheme';

addons.setConfig({
  theme: customTheme,
});

// Add custom favicon
const favicon = '/public/logo.svg';
const link = document.createElement('link');
link.setAttribute('rel', 'shortcut icon');
link.setAttribute('href', favicon);
document.head.appendChild(link);
