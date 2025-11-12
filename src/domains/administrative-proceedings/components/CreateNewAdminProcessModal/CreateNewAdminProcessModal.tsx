'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMutation } from '@tanstack/react-query';
import { parseAsBoolean, useQueryState } from 'nuqs';
import { z } from 'zod';

import IAdd from '@/core/assets/icons/add.svg';
import InfoIcon from '@/core/assets/icons/info.svg';
import { useRoles } from '@/core/providers/RolesProvider';
import { Button, FieldLabel, Input, Option, Select, Tooltip } from '@/design-system/atoms';
import { Modal } from '@/design-system/molecules';
import { toast } from '@/design-system/molecules/Toast';
import { useAdminProcessAgendas } from '@/domains/administrative-proceedings/api';

import { postNewAdminProcess } from '../../api/services';
import { AdminProcessCreateDto } from '../../api/services/postNewAdminProcess';
import styles from './CreateNewAdminProcessModal.module.css';

export const CreateNewAdminProcessModal = () => {
  const t = useTranslations('administrativeProceedings.newCaseModal');
  const router = useRouter();
  const { adminProceedingsReferent } = useRoles();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [isModalOpen, setIsModalOpen] = useQueryState(
    'createAdminProcess',
    parseAsBoolean.withDefault(false),
  );
  const { data: agendas } = useAdminProcessAgendas();
  const newAdminProcessMutation = useMutation({
    mutationFn: postNewAdminProcess,
    onSuccess: (resp) => {
      if (resp.data) {
        router.push('/spravni-rizeni/' + resp.data.id);
      } else {
        toast.error(t('errorMessage'), {
          id: 'toast-createNewAdminProcessModal-errorMessage',
        });
      }
    },
    onError: (err) => {
      console.error('Error creating new admin process:', err);

      // Check if error has HTTP status code
      if (err instanceof Error && 'status' in err) {
        const statusCode = (err as any).status;
        const errorMessage = (err as any).message || '';

        // Handle client errors (4xx)
        if (statusCode >= 400 && statusCode < 500) {
          toast.error(errorMessage, { id: 'toast-createNewAdminProcessModal-clientError' });
        }
        // Handle server errors (5xx)
        else if (statusCode >= 500) {
          const serverErrorMsg = t('errorMessages.somethingWrong');
          toast.error(errorMessage ? `${serverErrorMsg} (${errorMessage})` : serverErrorMsg, {
            id: 'toast-createNewAdminProcessModal-serverError',
          });
        }
        // Handle unknown status codes
        else {
          toast.error(t('errorMessages.somethingWrong'), {
            id: 'toast-createNewAdminProcessModal-unknownError',
          });
        }
      } else {
        // Fallback for non-HTTP errors
        toast.error(t('errorMessages.somethingWrong'), {
          id: 'toast-createNewAdminProcessModal-unknownError',
        });
      }
    },
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const insurancePayerNumber = formData.get('insurancePayerNumber') as string;
    const agendaCode = formData.get('agendaCode') as string;
    const recordFolderNumber = formData.get('recordFolderNumber') as string;
    const payload: AdminProcessCreateDto = {
      agendaCode,
      insurancePayerNumber,
      recordFolderNumber,
    };

    const newAdminProcessSchema = z.object({
      insurancePayerNumber: z
        .string()
        .regex(/^\d+$/, t('errorMessages.insurancePayerNumberDigitsOnly'))
        .min(9, t('errorMessages.insurancePayerNumberMinLength'))
        .max(10, t('errorMessages.insurancePayerNumberMaxLength')),
      agendaCode: z
        .string()
        .refine(
          (val) => agendas?.some((a) => String(a.code) === val),
          t('errorMessages.agendaCodeInvalid'),
        ),
      recordFolderNumber: z
        .string()
        .regex(/^[a-zA-Z0-9]{14,16}$/, t('errorMessages.recordFolderNumberInvalid')),
    });

    const validatedData = newAdminProcessSchema.safeParse(payload);

    if (!validatedData.success) {
      if (validatedData.error.issues.length === 0) {
        toast.error(t('formError'), { id: 'toast-createNewAdminProcessModal-formError' });
      } else {
        validatedData.error.issues.forEach((issue) => {
          toast.error(issue.message, {
            id: `toast-createNewAdminProcessModal-validation-${issue.path?.[0] || 'unknown'}`,
          });
        });
      }

      return;
    }

    newAdminProcessMutation.mutate(validatedData.data);
  };

  return (
    <>
      <Button
        id="button-admin-process-modal"
        data-testid="newCodeListBtn"
        icon={
          <IAdd
            id="icon-create-new-admin-process-add"
            width={24}
            height={24}
            className="icon_white"
          />
        }
        iconAlign="left"
        variant="primary"
        size="large"
        onClick={handleOpenModal}
        disabled={!adminProceedingsReferent}
      >
        {t('newCaseButton')}
      </Button>

      <Modal
        id="createNewAdminProcess-modal"
        title={t('title')}
        size="medium"
        isVisible={isModalOpen}
        setIsVisible={setIsModalOpen}
        closeOnEsc={true}
        onClose={handleCloseModal}
      >
        <form ref={formRef} onSubmit={(e) => handleFormSubmit(e)}>
          <div className={styles.formRow}>
            <div className={styles.labelContainer}>
              <FieldLabel
                data-testid="insurancePayerNumberLabel"
                text={t('insurancePayerNumberLabel')}
                htmlFor="newAdminCase-input-insurancePayerNumber"
              />
            </div>
            <div className={styles.inputContainer}>
              <Input
                id="newAdminCase-input-insurancePayerNumber"
                name="insurancePayerNumber"
                type="text"
                placeholder={t('insurancePayerNumberPlaceholder')}
                pattern="\d{9,10}"
                autoFocus
              />
            </div>
          </div>
          <div className={styles.dottedLine} />
          <div className={styles.formRow}>
            <div className={styles.labelContainer}>
              <FieldLabel
                data-testid="agendaCodeLabel"
                text={t('agendaCodeLabel')}
                htmlFor="newAdminCase-select-agendaCode"
              />
            </div>
            <div className={styles.inputContainer}>
              <Select
                key="newAdminCase-select-agenda"
                id="newAdminCase-select-agendaCode"
                inputName="agendaCode"
                aria-label={t('agendaCodeLabel')}
                placeholder={t('agendaCodePlaceholder')}
              >
                {agendas &&
                  agendas.map((agenda) => (
                    <Option key={agenda.code} value={String(agenda.code)}>
                      {agenda.name}
                    </Option>
                  ))}
              </Select>
            </div>
          </div>
          <div className={styles.dottedLine} />
          <div className={styles.formRow}>
            <div className={styles.labelContainer}>
              <FieldLabel
                data-testid="recordFolderNumberLabel"
                text={t('recordFolderNumberLabel')}
                htmlFor="newAdminCase-input-recordFolderNumber"
              />
              <Tooltip
                id="newAdminCase-tooltip-recordFolderNumber"
                variant="inverse"
                content={t('recordFolderNumberTooltip')}
                placement="tooltipBottom"
              >
                <InfoIcon id="icon-create-new-admin-process-info" className={styles.infoIcon} />
              </Tooltip>
            </div>
            <div className={styles.inputContainer}>
              <Input
                id="newAdminCase-input-recordFolderNumber"
                name="recordFolderNumber"
                type="text"
                placeholder={t('recordFolderNumberPlaceholder')}
                helperText={t('recordFolderNumberHint')}
              />
            </div>
          </div>
          <footer className={styles.modalFooter}>
            <div className={styles.buttonGroup}>
              <Button
                id="newAdminCase-button-cancel"
                variant="tertiary"
                onClick={handleCloseModal}
                type="button"
              >
                {t('cancelButton')}
              </Button>
              <Button id="newAdminCase-button-create" variant="primary" type="submit">
                {t('createButton')}
              </Button>
            </div>
          </footer>
        </form>
      </Modal>
    </>
  );
};
