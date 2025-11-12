import clsx from 'clsx';

import styles from './RadioGroupSection.module.css';

import { RadioGroup, Typography } from '@/design-system';

export interface RadioGroupSectionProps {
  title: string;
  description: string;
  radioButton: {
    value: string;
    label: string;
  }[];
  value: string;
  radioName: string;
  onChange: (value: string) => void;
  className?: string;
}

export const RadioGroupSection = ({
  title,
  description,
  radioButton,
  radioName,
  value,
  onChange,
  className,
}: RadioGroupSectionProps) => {
  return (
    <div className={clsx(styles.radioGroupSection, className)}>
      <Typography variant="Headline/Bold">{title}</Typography>

      <div className={styles.radioGroup}>
        <Typography variant="Subtitle/Default/Regular">{description}</Typography>
        <RadioGroup
          options={radioButton}
          name={radioName}
          onChange={onChange}
          value={value}
          id={'radio-group-' + radioName}
        ></RadioGroup>
      </div>
    </div>
  );
};
