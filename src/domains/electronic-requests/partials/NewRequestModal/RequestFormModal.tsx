import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { Button, Divider, Option, Select, Text, Textarea } from '@/design-system/atoms';
import { Modal, Typography } from '@/design-system/molecules';
import { toast } from '@/design-system/molecules/Toast/Toast';
import { Person } from '@/design-system/molecules/UserSelect';
import { UsersSelect } from '@/design-system/molecules/UserSelect';

import { useRequestCSCAddresses } from '../../api/query';
import { createNewRequest } from '../../api/services';
import { GetRequestsUsersResponse } from '../../api/services/types';
import styles from './RequestFormModal.module.css';

import { handleFormNavigation } from '@/core';

export interface RequestFormModalData {
  requester: Person[];
  recipient: Person[];
  address: string;
  costCenter: string;
  orderDescription: string;
  requestCause: string;
}

interface RequestFormModalProps {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  onSubmit: (data: RequestFormModalData) => void;
  formData: RequestFormModalData;
  requestCause: string;
  userData: GetRequestsUsersResponse | null | undefined;
  isLoadingUser: boolean;
}

export const RequestFormModal = ({
  isVisible,
  setIsVisible,
  onSubmit,
  formData,
  requestCause,
  userData,
  isLoadingUser,
}: RequestFormModalProps) => {
  const { address, costCenter, orderDescription } = formData;
  const t = useTranslations('requests.newRequestModal');
  const tCommon = useTranslations('common');
  const queryClient = useQueryClient();
  const router = useRouter();
  const modalContentRef = useRef<HTMLDivElement | null>(null);

  const [localFormData, setLocalFormData] = useState<RequestFormModalData>({
    requester: [],
    recipient: [],
    address: address || '',
    costCenter: costCenter || '',
    orderDescription: orderDescription || '',
    requestCause: requestCause || '',
  });

  const [addressesEnabled, setAddressesEnabled] = useState(false);
  const [hasSubmittedForm, setHasSubmittedForm] = useState(false);
  useEffect(() => {
    const getCurrentUserData = async () => {
      if (!userData || isLoadingUser || localFormData.requester.length > 0) return;

      if (userData.payload) {
        const currentUser = userData.payload;
        const user: Person = {
          id: currentUser.id || '',
          displayName: `${currentUser.givenName} ${currentUser.surname}`.trim() || '',
          mail: currentUser.email || '',
          mobilePhone: currentUser.phoneNumber || '',
          givenName: currentUser.givenName || '',
          surname: currentUser.surname || '',
          jobsite: currentUser?.costCenter?.description || '',
        };

        setLocalFormData((prev) => ({
          ...prev,
          requester: [user],
          recipient: prev.recipient.length === 0 ? [user] : prev.recipient,
          requestCause: requestCause,
        }));
      }
    };

    getCurrentUserData();
  }, [userData, isLoadingUser, localFormData.requester.length, requestCause, t]);

  const createRequestMutation = useMutation({
    mutationFn: createNewRequest,
    onSuccess: (response) => {
      if (response.data) {
        setIsVisible(false);
        onSubmit(localFormData);
        queryClient.invalidateQueries({ queryKey: ['requests'] });
        router.push(`/e-zadanky/${response.data.payload?.id}?parent=${response.data.payload?.id}`);
        toast.success(t('successMessage') || 'Request created successfully');
      } else {
        toast.error(t('errorMessage') || 'Failed to create request');
      }
    },
    onError: (err) => {
      console.error('Error creating new request:', err);

      if (err instanceof Error && 'status' in err) {
        const statusCode = (err as any).status;
        const errorMessage = (err as any).message || '';

        if (statusCode >= 400 && statusCode < 500) {
          toast.error(errorMessage);
        } else if (statusCode >= 500) {
          const serverErrorMsg = t('errorMessages.somethingWrong') || 'Something went wrong';
          toast.error(errorMessage ? `${serverErrorMsg} (${errorMessage})` : serverErrorMsg);
        } else {
          toast.error(t('errorMessages.somethingWrong') || 'Something went wrong');
        }
      } else {
        toast.error(t('errorMessages.somethingWrong') || 'Something went wrong');
      }
    },
  });

  useEffect(() => {
    setAddressesEnabled(isVisible);
  }, [isVisible]);

  const { data: addressesData, isLoading: addressesLoading } = useRequestCSCAddresses({
    take: 100,
    enabled: addressesEnabled,
  });

  useEffect(() => {
    if ((addressesData?.payload?.items?.length ?? 0) > 0 && !localFormData.address) {
      setLocalFormData((prev) => ({
        ...prev,
        address: addressesData?.payload?.items?.[0]?.id ?? '',
      }));
    }
  }, [addressesData, localFormData.address]);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isVisible]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const isFormEmpty = () => {
    return Object.values(localFormData).every((value) => {
      if (typeof value === 'string') {
        return value.trim() === '';
      }
      if (Array.isArray(value)) {
        return value.length === 0;
      }

      return !value;
    });
  };

  const checkForDuplicates = (name: string, requests: RequestFormModalData[]): boolean => {
    if (!requests || requests.length === 0) return false;

    return requests.some((request) =>
      request.requester.some((person) => person.displayName === name),
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasSubmittedForm(true);

    if (
      localFormData.requester.length > 0 &&
      checkForDuplicates(localFormData.requester[0].displayName, [])
    ) {
      toast.error(t('duplicateRequesterError') || 'Duplicate requester found');

      return;
    }

    const requestSchema = z.object({
      requester: z.array(z.any()).min(1, t('validationErrorsMessages.requesterRequired')),
      recipient: z.array(z.any()).min(1, t('validationErrorsMessages.recipientRequired')),
      address: z.string().min(1, t('validationErrorsMessages.addressRequired')),
      costCenter: z.string(),
      orderDescription: z.string(),
      requestCause: z.string().min(1, t('validationErrorsMessages.requestCauseRequired')),
    });

    const validationResult = requestSchema.safeParse(localFormData);

    if (!validationResult.success) {
      validationResult.error.issues.forEach((issue) => {
        toast.error(issue.message);
      });

      return;
    }

    const selectedAddress = addressesData?.payload?.items?.find(
      (item) => item.id === localFormData.address,
    );

    const submitData = {
      recipientId: localFormData.recipient[0]?.id,
      justification: localFormData.requestCause,
      deliveryAddress: selectedAddress?.description || localFormData.address,
    };

    createRequestMutation.mutate(submitData);
  };

  useEffect(() => {
    if (isVisible && modalContentRef.current) {
      modalContentRef.current.focus();
    }
  }, [isVisible]);

  return (
    <Modal
      id="request-modal"
      size="large"
      closeOnEsc={false}
      closeOnOverlayClick={false}
      setIsVisible={setIsVisible}
      isVisible={isVisible}
    >
      <form
        onSubmit={handleSubmit}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        onKeyDown={handleFormNavigation}
      >
        <div className={styles.modalContent} ref={modalContentRef} aria-labelledby="modal-title">
          <div className={styles.modalHeader}>
            <Typography variant="Headline/Bold" id="modal-title" aria-level={1}>
              {t('title')}
            </Typography>
          </div>
          <div className={styles.modalContent}>
            <div className={styles.modalSubtitle}>
              <Typography variant="Headline/Bold" id="modal-description" aria-level={2}>
                {t('subtitle')}
              </Typography>
            </div>
            <div className={styles.modalContentMain}>
              <div className={styles.formRow}>
                <div className={styles.labelContainer}>
                  <Text
                    regular
                    variant="subtitle"
                    color="primary"
                    data-testid="requesterLabel"
                    id="requester-label"
                    role="label"
                  >
                    {t('fieldsLabels.requester')}
                  </Text>
                </div>
                <div className={styles.inputContainer}>
                  <UsersSelect
                    id="requester"
                    roles={['requester']}
                    onSelectsChange={(selected) =>
                      setLocalFormData((prev) => ({
                        ...prev,
                        requester: selected,
                      }))
                    }
                    initialUsers={localFormData.requester}
                    isMultiUsers={false}
                    width={307}
                    disabled={true}
                    aria-labelledby="requester-label"
                    aria-describedby="requester-description"
                  />
                  <span id="requester-description" className="sr-only">
                    {t('fieldsLabels.requester')}
                  </span>
                </div>
              </div>
              <Divider variant="dotted" />
              <div className={styles.formRow}>
                <div className={styles.labelContainer}>
                  <Text
                    regular
                    variant="subtitle"
                    color="primary"
                    data-testid="recipientLabel"
                    id="recipient-label"
                    role="label"
                  >
                    {t('fieldsLabels.recipient')}
                  </Text>
                </div>
                <div className={styles.inputContainer}>
                  <UsersSelect
                    id="recipient"
                    roles={['recipient']}
                    onSelectsChange={(selected) =>
                      setLocalFormData((prev) => ({
                        ...prev,
                        recipient: selected,
                      }))
                    }
                    initialUsers={localFormData.recipient}
                    isMultiUsers={false}
                    width={307}
                    source="csc"
                    aria-labelledby="recipient-label"
                    aria-describedby="recipient-description"
                  />
                  <span id="recipient-description" className="sr-only">
                    {t('fieldsLabels.recipient')}
                  </span>
                </div>
              </div>
              <Divider variant="dotted" />
              <div className={styles.formRow}>
                <div className={styles.labelContainer}>
                  <Text
                    regular
                    variant="subtitle"
                    color="primary"
                    data-testid="fieldsLabels.address"
                    id="address-label"
                    role="label"
                  >
                    {t('fieldsLabels.address')}
                  </Text>
                </div>
                <div className={styles.inputContainer}>
                  <Select
                    id="request-select-address"
                    inputName="address"
                    value={localFormData.address}
                    onChange={(value: string) =>
                      setLocalFormData((prev) => ({
                        ...prev,
                        address: value,
                      }))
                    }
                    aria-labelledby="address-label"
                    aria-describedby="address-description"
                    disabled={addressesLoading}
                  >
                    {addressesLoading && (
                      <Option key="loading" value="">
                        {tCommon('loading') || 'Loading...'}
                      </Option>
                    )}
                    {addressesData?.payload?.items?.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.description}
                      </Option>
                    ))}
                  </Select>
                  <span id="address-description" className="sr-only">
                    {t('fieldsLabels.address')}
                  </span>
                </div>
              </div>
              <Divider variant="dotted" />
              <div className={styles.formRow}>
                <div className={styles.labelContainer}>
                  <Text
                    regular
                    variant="subtitle"
                    color="primary"
                    data-testid="costCenterLabel"
                    id="cost-center-label"
                    role="label"
                  >
                    {t('fieldsLabels.costCenter')}
                  </Text>
                </div>
                <div className={styles.inputContainer}>
                  <Text variant="subtitle" aria-labelledby="cost-center-label" role="text">
                    {localFormData.requester[0]?.jobsite || ''}
                  </Text>
                </div>
              </div>
              <Divider variant="dotted" />
              <div className={styles.formRow}>
                <div className={styles.labelContainer}>
                  <Text
                    regular
                    variant="subtitle"
                    color="primary"
                    data-testid="orderDescriptionLabel"
                    id="order-label"
                    role="label"
                  >
                    {t('fieldsLabels.orderLabel')}
                  </Text>
                </div>
                <div className={styles.inputContainer}>
                  <Text variant="subtitle" aria-labelledby="order-label" role="text">
                    {userData?.payload?.order?.description || ''}
                  </Text>
                </div>
              </div>
            </div>

            <div className={styles.modalCause}>
              <div>
                <Typography variant="Headline/Bold" id="reason-section-title" aria-level={2}>
                  {t('fieldsLabels.reason')}
                </Typography>
              </div>
              <div className={styles.modalCauseContent}>
                <div className={styles.textareaRow}>
                  <div className={styles.textareaLabel}>
                    <Text
                      regular
                      variant="subtitle"
                      color="primary"
                      data-testid="costCenterLabel"
                      id="request-cause-label"
                      role="label"
                    >
                      {t('fieldsLabels.requestCause')}
                    </Text>
                  </div>
                  <div className={styles.textareaContainer}>
                    <Textarea
                      id="textarea-request-cause"
                      name="requestCause"
                      value={localFormData.requestCause}
                      placeholder={t('fieldsLabels.causePlaceHolder')}
                      onChange={handleInputChange}
                      maxLength={300}
                      isError={hasSubmittedForm && !localFormData.requestCause.trim()}
                      helperText={
                        hasSubmittedForm && !localFormData.requestCause.trim()
                          ? t('validationErrorsMessages.requestCauseRequired')
                          : ''
                      }
                      aria-labelledby="request-cause-label"
                      aria-describedby="request-cause-description request-cause-error"
                      aria-required="true"
                      aria-invalid={hasSubmittedForm && !localFormData.requestCause.trim()}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <div className={styles.modalFooterContent}>
              <Button
                id="button-request-form-cancel"
                variant="tertiary"
                onClick={() => setIsVisible(false)}
                aria-describedby="cancel-button-description"
              >
                {t('cancelButton')}
              </Button>
              <Button
                id="button-request-form-submit"
                variant="primary"
                type="submit"
                disabled={isFormEmpty()}
                aria-describedby="submit-button-description"
              >
                {t('submitButton')}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};
