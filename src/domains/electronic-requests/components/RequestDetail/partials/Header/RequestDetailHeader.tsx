/* eslint-disable no-console */
'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';

import { Badge, Button, Spinner, Text } from '@/design-system/atoms';
import { Breadcrumbs, Typography } from '@/design-system/molecules';
import { toast } from '@/design-system/molecules/Toast';
import { mapStatusToBadge } from '@/domain-electronic-requests/partials/RequestsDataTable/RequestsDataTable';
import {
  useDeleteRequest,
  useSubmitRequestForApproval,
} from '@/domains/electronic-requests/api/query';
import { useUpdateRequest } from '@/domains/electronic-requests/api/query/useUpdateRequest';
import {
  RequestDetailModel,
  RequestUpdateModel,
} from '@/domains/electronic-requests/api/services/types';
import { formatWorkflowState, getBadgeColor } from '@/domains/electronic-requests/utils';

import DetailHeader, { RequestHeaderDetail } from './DetailHeader/DetailHeader';
import { RequestDetailConfirmModal } from './partials/RequestDetailConfirmModal';
import styles from './RequestDetailHeader.module.css';

interface RequestDetailHeaderProps {
  data: RequestDetailModel | null;
  isApprover: boolean;
  isLoading: boolean;
  isError: boolean;
  refetchRequest: () => void;
}

const RequestDetailHeader = ({
  data,
  isApprover,
  isLoading,
  isError,
  refetchRequest,
}: RequestDetailHeaderProps) => {
  const t = useTranslations('requests');
  const tRequestDetail = useTranslations('requests.requestDetail');
  const tRequestButtons = useTranslations('requests.requestDetail.buttons');
  const tRequestSubmitModal = useTranslations('requests.submitForApprovalModal');
  const tCancelRequestModal = useTranslations('requests.cancelRequestModal');
  const tCommon = useTranslations('common');
  const tStatus = useTranslations('requests.filters.status');
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const requestDetailRegex = /^\/e-zadanky\/(.+)$/;
  const match = requestDetailRegex.exec(pathname);
  const requestId = match ? match[1] : null;
  const items = data ? data.items : [];
  const requestNumber = data?.requestNumber;
  const wfState = data?.wfState;

  const [headerData, setHeaderData] = useState<RequestHeaderDetail | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<
    'submit' | 'cancel' | 'returnRequest' | 'returnToApproval'
  >('submit');

  const requestStatus = headerData?.status;
  const resolution = headerData?.resolution;

  const {
    mutate: deleteRequest,
    isPending: isDeleting,
    isSuccess: isDeleteSuccess,
    isError: isDeleteError,
  } = useDeleteRequest({
    onSuccess: () => {
      setIsModalVisible(false);
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      setTimeout(() => {
        router.push('/e-zadanky');
      }, 500);
    },
    onError: () => {
      setIsModalVisible(false);
    },
  });

  const {
    mutate: submitForApproval,
    isPending: isSubmitting,
    isSuccess,
  } = useSubmitRequestForApproval({
    onSuccess: () => {
      toast.success(tRequestSubmitModal('successMessage'), {
        id: 'toast-request-submit-success',
      });

      refetchRequest();
      if (requestId) {
        queryClient.invalidateQueries({ queryKey: ['request', requestId] });
      }
    },
    onError: (err) => {
      console.error('Error submitting request:', err);

      if (err instanceof Error && 'status' in err) {
        const statusCode = (err as any).status;
        const errorMessage = (err as any).message || '';

        if (statusCode >= 400 && statusCode < 500) {
          toast.error(errorMessage || tRequestSubmitModal('errorMessage'), {
            id: 'toast-request-submit-client-error',
          });
        } else if (statusCode >= 500) {
          const serverErrorMsg = tRequestSubmitModal('errorMessage');
          toast.error(errorMessage ? `${serverErrorMsg} (${errorMessage})` : serverErrorMsg, {
            id: 'toast-request-submit-server-error',
          });
        } else {
          toast.error(tRequestSubmitModal('errorMessage'), {
            id: 'toast-request-submit-unknown-error',
          });
        }
      } else {
        toast.error(tRequestSubmitModal('errorMessage'), {
          id: 'toast-request-submit-error',
        });
      }
    },
  });

  const { mutate: updateRequest, isPending: isUpdating } = useUpdateRequest({
    onSuccess: () => {
      if (requestId) {
        submitForApproval(requestId);
      }
    },
    onError: (error) => {
      console.error('Error updating request:', error);
      toast.error(tRequestSubmitModal('errorMessage'), {
        id: 'toast-update-request-error',
      });
    },
  });

  const breadcrumbs = [{ value: t('title'), link: '/e-zadanky' }];

  const getRequestHeaderData = (data: RequestDetailModel): RequestHeaderDetail => {
    return {
      status: data.wfState,
      createdAt: data.createdAtUtc,
      createdBy: data.createdBy,
      recipient: data.recipient,
      approver: data.approver,
      requestNumber: data.wfState !== 'Draft' ? (data.requestNumber ?? data.id) : null,
      resolution: data.approveHistory?.[0]?.resolution,
    };
  };

  useEffect(() => {
    if (data && !isLoading && requestId) {
      const transformedData = getRequestHeaderData(data);
      setHeaderData(transformedData);
    }
  }, [data, isLoading, requestId]);

  useEffect(() => {
    if (isSuccess) {
      setIsModalVisible(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isDeleteSuccess) {
      setIsModalVisible(false);
      toast.success(tCancelRequestModal('successMessage'), {
        id: 'toast-request-delete-success',
      });
      queryClient.invalidateQueries({ queryKey: ['requests'] });

      setTimeout(() => {
        router.push('/e-zadanky');
      }, 500);
    }

    if (isDeleteError) {
      setIsModalVisible(false);
      toast.error(tCancelRequestModal('errorMessage'), {
        id: 'toast-request-delete-error',
      });
    }
  }, [isDeleteSuccess, isDeleteError, isDeleting, tCancelRequestModal, queryClient, router]);

  const [pendingUpdates, setPendingUpdates] = useState<{
    recipientId?: string;
    deliveryAddress?: string;
    justification?: string;
  } | null>(null);

  const handleOpenSubmitModal = () => {
    setModalType('submit');
    setIsModalVisible(true);
  };

  const handleOpenCancelModal = () => {
    setModalType('cancel');
    setIsModalVisible(true);
  };

  const handleOpenRequestReturnModal = () => {
    setModalType('returnRequest');
    setIsModalVisible(true);
  };

  const handleOpenReturnToApprovalModal = () => {
    setModalType('returnToApproval');
    setIsModalVisible(true);
  };

  const handleCloseSubmitModal = () => {
    setIsModalVisible(false);
  };

  const handleSendRequestForApproval = () => {
    if (!requestId || !data) return;
    if (pendingUpdates) {
      const payload: RequestUpdateModel = {
        recipientId: pendingUpdates.recipientId ?? data.recipient.id ?? '',
        description: data.description || '',
        justification: pendingUpdates.justification ?? data.justification ?? '',
        deliveryAddress: pendingUpdates.deliveryAddress ?? data.createdBy.defaultAddress ?? '',
      };

      updateRequest({
        requestId,
        payload,
      });
    } else {
      submitForApproval(requestId);
    }
  };

  const handleReturnRequest = () => {
    console.log('Request returned');
    setIsModalVisible(false);
  };

  const handleReturnToApproval = () => {
    console.log('Request returned to approval');
    setIsModalVisible(false);
  };

  const handleDeleteRequest = () => {
    if (requestId) {
      deleteRequest(requestId);
    }
  };

  useEffect(() => {
    const handleUserUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.type === 'recipient' && event.detail.users.length > 0) {
        setPendingUpdates((prev) => ({
          ...prev,
          recipientId: event.detail.users[0].id,
        }));
      }
    };

    const handleAddressUpdate = (event: CustomEvent) => {
      if (event.detail) {
        setPendingUpdates((prev) => ({
          ...prev,
          deliveryAddress: event.detail.address,
        }));
      }
    };

    const handleJustificationUpdate = (event: CustomEvent) => {
      if (event.detail) {
        setPendingUpdates((prev) => ({
          ...prev,
          justification: event.detail.justification,
        }));
      }
    };

    window.addEventListener('userUpdate', handleUserUpdate as EventListener);
    window.addEventListener('addressUpdate', handleAddressUpdate as EventListener);
    window.addEventListener('justificationUpdate', handleJustificationUpdate as EventListener);

    return () => {
      window.removeEventListener('userUpdate', handleUserUpdate as EventListener);
      window.removeEventListener('addressUpdate', handleAddressUpdate as EventListener);
      window.removeEventListener('justificationUpdate', handleJustificationUpdate as EventListener);
    };
  }, []);

  return (
    <>
      {requestId && isLoading && (
        <div className={styles.detailHeaderCont}>{tCommon('loading')}</div>
      )}

      {requestId && !isLoading && headerData && (
        <div className={styles.processDetailContainer}>
          <div className={styles.titleContainer}>
            <div className={styles.pageBreadCrumbs}>
              <Breadcrumbs breadcrumbs={breadcrumbs} showBackLink />
            </div>
            <div className={styles.titleRow}>
              <div className={styles.pageTitle}>
                {wfState === 'Draft' ? (
                  tRequestDetail('pageTitleDraft')
                ) : (
                  <Typography variant="H4/Bold" className={styles.pageTitle}>
                    {tRequestDetail('pageTitle')} {requestNumber}
                  </Typography>
                )}
                <Badge
                  id={`badge-request-${requestStatus}`}
                  color={getBadgeColor(formatWorkflowState(requestStatus || ''))}
                >
                  <Typography variant="Caption/Bold">
                    {mapStatusToBadge(formatWorkflowState(requestStatus || ''), tStatus)}
                  </Typography>
                </Badge>
              </div>

              <div className={styles.buttonContainer}>
                {requestStatus === 'Draft' && (
                  <Button
                    id="button-submit-for-approval"
                    disabled={isSubmitting || isUpdating || items?.length === 0}
                    onClick={handleOpenSubmitModal}
                  >
                    <Text variant="subtitle" selectable={false}>
                      {isSubmitting || isUpdating
                        ? tCommon('loading')
                        : tRequestButtons('submitForApproval')}
                    </Text>
                  </Button>
                )}
                {(requestStatus === 'PendingApprove' ||
                  requestStatus === 'PendingApprove1' ||
                  requestStatus === 'PendingApprove2') &&
                isApprover ? (
                  <div className={styles.approverButtonsContainer}>
                    <Button
                      id="button-approve-request"
                      variant="primary"
                      disabled={resolution === 'Pending'}
                    >
                      {tRequestButtons('confirmDecision')}
                    </Button>
                    <Button
                      id="button-approve-request"
                      variant="secondary"
                      onClick={handleOpenRequestReturnModal}
                    >
                      {tRequestButtons('returnToRequester')}
                    </Button>
                    {resolution !== 'Pending' && (
                      <Button
                        id="button-return-to-approval"
                        variant="secondary"
                        onClick={handleOpenReturnToApprovalModal}
                      >
                        {tRequestButtons('returnToApproval')}
                      </Button>
                    )}
                  </div>
                ) : (
                  requestStatus !== 'Withdrawn' && (
                    <Button
                      id="button-cancel-request"
                      variant="secondary"
                      icon={isDeleting && <Spinner width={24} height={24} />}
                      onClick={handleOpenCancelModal}
                      disabled={isDeleting}
                    >
                      <Text variant="subtitle" selectable={false}>
                        {isDeleting ? tCommon('loading') : tRequestDetail('buttons.cancelRequest')}
                      </Text>
                    </Button>
                  )
                )}
                <RequestDetailConfirmModal
                  isModalVisible={isModalVisible}
                  setIsModalVisible={setIsModalVisible}
                  handleCloseSubmitModal={handleCloseSubmitModal}
                  handleSendRequestForApproval={
                    modalType === 'returnRequest'
                      ? handleReturnRequest
                      : modalType === 'returnToApproval'
                        ? handleReturnToApproval
                        : handleSendRequestForApproval
                  }
                  handleDeleteRequest={handleDeleteRequest}
                  isDeleting={isDeleting}
                  modalType={modalType}
                  requestStatus={requestStatus}
                  requestId={requestId}
                  requestData={data}
                />
              </div>
            </div>
          </div>
          <DetailHeader process={headerData} />
        </div>
      )}

      {requestId && !isLoading && isError && <div className={styles.detailHeaderCont}>no data</div>}
    </>
  );
};

export default RequestDetailHeader;
