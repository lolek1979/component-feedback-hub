import { useEffect, useRef, useState } from 'react';

import { DarkmodeToggle } from '../../src/components/atoms/DarkmodeToggle/DarkmodeToggle';
// @ts-ignore
import styles from './modeDocerator.module.css';

export const ModeDecorator = (Story: any) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDocsMode, setIsDocsMode] = useState(false);
  const toggleRef = useRef(null);

  useEffect(() => {
    const savedDarkMode =
      localStorage.getItem('isDarkTheme') === 'true' || localStorage.getItem('darkMode') === 'true';

    localStorage.setItem('isDarkTheme', String(savedDarkMode));
    localStorage.setItem('darkMode', String(savedDarkMode));

    setIsDarkMode(savedDarkMode);

    document.documentElement.classList.toggle('dark', savedDarkMode);
    document.body.classList.toggle('dark', savedDarkMode);
    document.body.setAttribute('data-mode', savedDarkMode ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    const checkDocsMode = () => {
      const docsStoryElement = document.querySelector('.docs-story');
      setIsDocsMode(!!docsStoryElement);
    };

    checkDocsMode();

    const observer = new MutationObserver((mutations) => {
      checkDocsMode();

      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const darkModeActive = document.body.classList.contains('dark');
          setIsDarkMode(darkModeActive);
          document.documentElement.classList.toggle('dark', darkModeActive);
          localStorage.setItem('darkMode', String(darkModeActive));

          const iframe = document.querySelector('#storybook-preview-iframe') as HTMLIFrameElement;
          if (iframe && iframe.contentDocument) {
            iframe.contentDocument.documentElement.classList.toggle('dark', darkModeActive);
            iframe.contentDocument.body.setAttribute(
              'data-mode',
              darkModeActive ? 'dark' : 'light',
            );
          }
        }
      });
    });

    observer.observe(document.body, { attributes: true, childList: true, subtree: true });

    const handleUrlChange = () => {
      setTimeout(checkDocsMode, 100);
    };

    window.addEventListener('popstate', handleUrlChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  useEffect(() => {
    const iframe = document.querySelector('#storybook-preview-iframe') as HTMLIFrameElement;
    if (iframe && iframe.contentDocument) {
      iframe.contentDocument.documentElement.classList.toggle('dark', isDarkMode);
      iframe.contentDocument.body.setAttribute('data-mode', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode]);

  return (
    <>
      <div
        className={`${styles.modeContainer} ${isDocsMode ? styles.docsMode : ''}`}
        ref={toggleRef}
      >
        <DarkmodeToggle />
      </div>

      <div data-mode={isDarkMode ? 'dark' : 'light'} className={styles.storyContainer}>
        <Story />
      </div>
    </>
  );
};
