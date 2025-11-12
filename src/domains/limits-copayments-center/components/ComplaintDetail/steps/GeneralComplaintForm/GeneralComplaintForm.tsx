'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { AttachmentsSection } from '../../../AttachmentsSection';
import { CommentsSection } from '../../../CommentsSection';
import styles from './GeneralComplaintForm.module.css';

import { Button } from '@/design-system';

interface GeneralComplaintFormProps {
  onBack: () => void;
  onContinue: (data: GeneralComplaintFormData) => void;
  initialData?: GeneralComplaintFormData;
}

export interface GeneralComplaintFormData {
  externalComment: string;
  internalComment: string;
  attachments: File[];
}

export const GeneralComplaintForm = ({
  onBack,
  onContinue,
  initialData,
}: GeneralComplaintFormProps) => {
  const t = useTranslations('GeneralComplaintForm');

  const [externalComment, setExternalComment] = useState(initialData?.externalComment || '');
  const [internalComment, setInternalComment] = useState(initialData?.internalComment || '');
  const [attachments, setAttachments] = useState<File[]>(initialData?.attachments || []);

  useEffect(() => {
    return () => {
      attachments.forEach((file) => {
        if (file instanceof File) {
          URL.revokeObjectURL(URL.createObjectURL(file));
        }
      });
    };
  }, [attachments]);

  const handleContinue = () => {
    onContinue?.({
      externalComment,
      internalComment,
      attachments,
    });
  };

  return (
    <div className={styles.container}>
      <CommentsSection
        title={t('commentsSectionTitle')}
        externalCommentLabel={t('externalCommentLabel')}
        externalCommentPlaceholder={t('externalCommentPlaceholder')}
        externalCommentHelper={t('externalCommentHelper')}
        externalCommentValue={externalComment}
        onExternalCommentChange={setExternalComment}
        internalCommentLabel={t('internalCommentLabel')}
        internalCommentPlaceholder={t('internalCommentPlaceholder')}
        internalCommentHelper={t('internalCommentHelper')}
        internalCommentValue={internalComment}
        onInternalCommentChange={setInternalComment}
        maxLength={100}
      />

      <AttachmentsSection
        title={t('attachmentsSectionTitle')}
        badgeColor="gray"
        optionalText={t('attachmentsOptionalText')}
        description={t('attachmentsDescription')}
        onFilesChange={setAttachments}
        maxFiles={5}
        maxFileSize={10}
        acceptedFileTypes={['.pdf', '.jpg', '.jpeg', '.png', '.gif']}
      />

      <div className={styles.buttonGroup}>
        <Button variant="secondary" size="medium" onClick={onBack} id="button-back">
          {t('backButton')}
        </Button>
        <Button variant="primary" size="medium" onClick={handleContinue} id="button-continue">
          {t('continueButton')}
        </Button>
      </div>
    </div>
  );
};
