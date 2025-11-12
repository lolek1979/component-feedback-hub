'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import IAdd from '@/core/assets/icons/add.svg';
import IMoreHoriz from '@/core/assets/icons/more_horiz.svg';
import { Button, Text } from '@/design-system/atoms';
import { Popover } from '@/design-system/molecules';

import { useRequestById, useRequestsUsers } from '../../api/query';
import { useClearImpersonation } from '../../api/query/Impersonate/useClearImpersonation';
import { useImpersonateUser } from '../../api/query/Impersonate/useImpersonateUser';
import { useRequestsUserRoles } from '../../hooks/useRequestsUserRoles';
import {
  RequestFormModal,
  RequestFormModalData,
} from '../../partials/NewRequestModal/RequestFormModal';
import RequestDetailHeader from '../RequestDetail/partials/Header/RequestDetailHeader';
import styles from './RequestHeader.module.css';

export const RequestHeader = () => {
  const t = useTranslations('requests');

  const tApprover = useTranslations('requests.approver.header');
  const pathname = usePathname();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const isMainRoute = pathname === '/e-zadanky';
  const requestDetailRegex = /^\/e-zadanky\/(.+)$/;
  const match = requestDetailRegex.exec(pathname);
  const requestId = match ? match[1] : null;

  const { roles } = useRequestsUserRoles();
  const isApprover = roles.isApprover;
  const { mutate: clearImpersonationMutate } = useClearImpersonation();
  const { mutate: ImpersonateApprover } = useImpersonateUser();

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const handleToggleVisibility = () => setIsVisible((prevState) => !prevState);

  const {
    data: requestData,
    isLoading,
    isError,
    refetch,
  } = useRequestById({
    id: requestId ?? '',
    enabled: !!requestId,
  });

  const { data: userData, isLoading: isLoadingUser } = useRequestsUsers({
    enabled: isModalVisible,
  });

  const initialFormData = {
    requester: [],
    recipient: [],
    description: '',
    address: '',
    costCenter: '',
    orderNumber: '',
    orderDescription: '',
    requestCause: '',
  };

  const handleFormSubmit = (data: RequestFormModalData) => {
    //TODO: Implement form submission logic
    // eslint-disable-next-line no-console
    console.log('Form submitted with data:', data);
    setIsModalVisible(false);
  };

  const handleOutOfOffice = () => {
    clearImpersonationMutate();
    setIsVisible(false);
  };

  const handleApproverMode = () => {
    ImpersonateApprover('1approver99t');
    setIsVisible(false);
  };

  return (
    <>
      {isMainRoute && (
        <div className={styles.requestHeaderContainer}>
          <div className={styles.requestHeaderContent}>
            <Text variant="h4" id="requests-page-title">
              {t('title')}
            </Text>
            <div className={styles.buttonContainer}>
              <Button
                variant="primary"
                id="button-request-create-new"
                icon={<IAdd id="icon-new-request" width={24} height={24} className="icon_white" />}
                onClick={() => setIsModalVisible(true)}
              >
                <Text id="new-request-modal-title" variant="subtitle">
                  {t('newRequestModal.title')}
                </Text>
              </Button>

              <Popover
                content={() => (
                  <div className={styles.outOfOfficeButton}>
                    {isApprover ? (
                      <Button
                        id="button-outside-office"
                        variant="unstyled"
                        onClick={() => handleOutOfOffice()}
                      >
                        {tApprover('outOfOffice')}
                      </Button>
                    ) : (
                      <Button
                        id="approver-mode"
                        variant="unstyled"
                        onClick={() => handleApproverMode()}
                      >
                        Schvalovatel
                      </Button>
                    )}
                  </div>
                )}
                placement="tooltip-bottom-end"
                isVisible={isVisible}
                setIsVisible={setIsVisible}
                trigger={
                  <Button id="button-test" variant="secondary" onClick={handleToggleVisibility}>
                    <IMoreHoriz
                      id="icon-more-horiz"
                      width={24}
                      height={24}
                      className="icon_black"
                    />
                  </Button>
                }
              />
            </div>
            <RequestFormModal
              isVisible={isModalVisible}
              setIsVisible={setIsModalVisible}
              onSubmit={handleFormSubmit}
              formData={initialFormData}
              requestCause=""
              userData={userData}
              isLoadingUser={isLoadingUser}
            />
          </div>
        </div>
      )}

      {requestId && (
        <RequestDetailHeader
          data={requestData ?? null}
          isApprover={isApprover}
          isLoading={isLoading}
          isError={isError}
          refetchRequest={refetch}
        />
      )}
    </>
  );
};
