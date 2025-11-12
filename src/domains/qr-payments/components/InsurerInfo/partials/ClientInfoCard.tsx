import { useTranslations } from 'next-intl';

import { RadioButton, Text } from '@/design-system/atoms';

import { Address } from '../InsurerInfo';
import styles from '../InsurerInfo.module.css';

interface ClientInfoCardProps {
  adress: Address;
  radioName: string;
  radioId: string;
  radioLabel: string;
  onRadioChange: () => void;
  selected: boolean;
}

const ClientInfoCard = ({
  adress,
  radioName,
  radioId,
  radioLabel,
  selected,
  onRadioChange,
}: ClientInfoCardProps) => {
  const t = useTranslations('QRCodes.InsurerInfo');

  return (
    <div className={styles.infoBlock}>
      <div className={styles.infoHeader}>
        <RadioButton
          name={radioName}
          checked={selected}
          id={radioId}
          onChange={onRadioChange}
          label={radioLabel}
        />
        <Text regular variant="label" htmlFor={radioId}>
          {radioLabel}
        </Text>
      </div>
      <div className={styles.infoBody}>
        <div className={styles.infoColumn}>
          <Text variant="subtitle" regular>
            {t('street')}
          </Text>
          <Text variant="subtitle" regular>
            {t('zipCode')}
          </Text>
          <Text variant="subtitle" regular>
            {t('town')}
          </Text>
        </div>
        <div className={styles.infoColumn}>
          <Text variant="subtitle" regular>
            {adress.street ?? '-'}
          </Text>
          <Text variant="subtitle" regular>
            {adress.zip ?? '-'}
          </Text>
          <Text variant="subtitle" regular>
            {adress.city ?? '-'}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default ClientInfoCard;
