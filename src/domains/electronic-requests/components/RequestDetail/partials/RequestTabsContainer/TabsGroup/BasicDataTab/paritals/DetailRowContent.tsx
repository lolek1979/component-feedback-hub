import { useCallback, useMemo } from 'react';

import { Person, UsersSelect } from '@/design-system/molecules/UserSelect';
import { RequestDetailModel } from '@/domains/electronic-requests/api/services/types';

import { BasicRequestDataItem } from '../BasicDataTab';
import styles from '../BasicDataTab.module.css';
import { AddressInput } from './AddressInput';
import { JustificationInput } from './JustificationInput';
import { useRequestUpdater } from './useRequestUpdater';

import { Avatar, Badge, Text } from '@/design-system';

interface BasicRequestDataItemProps {
  item: BasicRequestDataItem;
  t: (key: string) => string;
  requestData: RequestDetailModel | null | undefined;
}

export const DetailRowContent = ({ item, t, requestData }: BasicRequestDataItemProps) => {
  const { updateRequestField } = useRequestUpdater(requestData);

  const handleUserChange = useCallback(
    (type: 'requester' | 'recipient', selected: Person[]) => {
      if (selected.length > 0) {
        if (type === 'recipient') {
          updateRequestField({ recipientId: selected[0].id ?? undefined });
        }

        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('userUpdate', {
              detail: { type, users: selected },
            }),
          );
        }
      }
    },
    [updateRequestField],
  );

  const handleAddressUpdate = useCallback(
    (address: string) => {
      updateRequestField({ deliveryAddress: address });
    },
    [updateRequestField],
  );

  const handleJustificationUpdate = useCallback(
    (justification: string) => {
      updateRequestField({ justification });
    },
    [updateRequestField],
  );

  const initialUsers = useMemo(() => {
    if (item.label === t('recipient') && requestData) {
      return [
        {
          displayName: `${requestData.recipient.givenName} ${requestData.recipient.surname}`,
          id: requestData.recipient.id || '',
          mail: requestData.recipient.email || '',
          mobilePhone: requestData.recipient.phoneNumber || '',
          givenName: requestData.recipient.givenName || '',
          surname: requestData.recipient.surname || '',
          jobSite: requestData.recipient.defaultAddress || '',
        },
      ];
    }

    return [
      {
        displayName: item.value,
        id: '',
        mail: '',
        mobilePhone: '',
        givenName: item.value.split(' ')[0] || '',
        surname: item.value.split(' ')[1] || '',
      },
    ];
  }, [item, requestData, t]);

  const renderContent = () => {
    switch (item.label) {
      case t('status'):
        return <Badge>{item.value}</Badge>;

      case t('requester'):
        return (
          <div className={styles.userContainer}>
            <Avatar name={item.value} className={styles.user} />
            <Text variant="subtitle" regular className={styles.userText}>
              {item.value}
            </Text>
          </div>
        );

      case t('recipient'):
        return (
          <div className={styles.inputContainer}>
            <UsersSelect
              id="recipient"
              roles={['recipient']}
              onSelectsChange={(selected) => handleUserChange('recipient', selected)}
              initialUsers={initialUsers}
              isMultiUsers={false}
              width={493}
              source="csc"
            />
          </div>
        );

      case t('address'):
        return <AddressInput requestData={requestData} onUpdate={handleAddressUpdate} />;

      case t('requestCause'):
        return (
          <JustificationInput requestData={requestData} onUpdate={handleJustificationUpdate} />
        );

      default:
        return <Text variant="subtitle">{item.value}</Text>;
    }
  };

  return <div>{renderContent()}</div>;
};
