import { useTranslations } from 'next-intl';

import { Text } from '@/design-system/atoms';

import styles from './JsonDetailViewer.module.css';

/**
 * This component renders a JSON detail viewer that displays the properties of a JSON object in a structured format.
 *
 * @param {Object} props - The properties for the JsonDetailViewer component.
 * @param {any} props.data - The JSON data to be displayed.
 * @param {string} props.translation - The translation namespace to be used for labels.
 * @returns
 */
export const JsonDetailViewer = ({ data, translation }: { data: any; translation: string }) => {
  const t = useTranslations(translation);

  const renderJson = (obj: any, indent = 0) => {
    const elements: React.ReactNode[] = [];

    Object.entries(obj).forEach(([key, value]) => {
      const padding = { paddingLeft: `${indent * 16}px` };

      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        elements.push(
          <div key={key} style={padding} className={styles.row}>
            <Text variant="subtitle" className={styles.label}>
              {t(key)}
            </Text>
          </div>,
        );
        elements.push(...renderJson(value, indent + 1));
      } else {
        elements.push(
          <div key={`${key}-${indent}`} style={padding} className={styles.row}>
            <Text className={styles.label} variant="subtitle">
              {t(key)}:{' '}
            </Text>
            <Text regular className={styles.value} variant="subtitle">
              {JSON.stringify(value)}
            </Text>
          </div>,
        );
      }
    });

    return elements;
  };

  return <div className={styles.container}>{renderJson(data)}</div>;
};
