'use client';

import Link from 'next/link';
import { useTranslations } from 'use-intl';

import SubdirectoryIcon from '@/core/assets/icons/icon_subdirectory_arrow_right.svg';
import { codeListStatus } from '@/core/lib/definitions';
import { useRoles } from '@/core/providers/RolesProvider';
import { Text } from '@/design-system/atoms';
import { Breadcrumbs } from '@/design-system/molecules';
import { Tag, TagVariant } from '@/design-system/molecules/Tag/Tag';
import { toast } from '@/design-system/molecules/Toast';

import useCSCAuth from '../../hooks/useCSCAuth';
import styles from './CSCHeader.module.css';
import {
  CopyLinkButton,
  DeleteButton,
  DepublishConceptButton,
  EditConceptButton,
  NewVersionButton,
  PublishConceptButton,
  ReturnToReworkConceptButton,
  SaveAndPublishConceptButton,
  SaveAndSendForApprovalConceptButton,
  SaveConceptButton,
  SendForApprovalConceptButton,
} from './partials';

interface CSCHeaderProps {
  isEditing?: boolean;
  isValid?: boolean;
  title: string;
  status?: TagVariant;
  codeListId: string;
  breadcrumbs: Array<{
    value: string;
    link: string;
    onClick?: () => void;
  }>;
  parentInfo?: {
    title: string;
    validFrom: string;
    link: string;
  };
  handleEdit: () => void;
  handlePublish: () => void;
  handleDelete: () => void;
  handleSave: () => void;
  handleSavePublish: () => void;
  handeSaveAndSendForApproval: () => void;
  handleSendForApproval: () => void;
  handleUnpublish: () => void;
  handleNewVersion: () => void;
  onBreadcrumbClick?: () => void;
  handleReturn: () => void;
}

export const CSCHeader = ({
  isEditing,
  isValid,
  title,
  status,
  codeListId,
  breadcrumbs,
  parentInfo,
  handleDelete,
  handleEdit,
  handlePublish,
  handeSaveAndSendForApproval,
  handleSendForApproval,
  handleSave,
  handleUnpublish,
  handleReturn,
  handleSavePublish,
  handleNewVersion,
  onBreadcrumbClick,
}: CSCHeaderProps) => {
  const t = useTranslations();
  const tStates = useTranslations('statuses');
  const tHeaderButtons = useTranslations('CSCButtons.ButtonTitles');
  const statusName = status ? tStates(status) : '';
  const isActive = status === codeListStatus.active;
  const isConcept = status === codeListStatus.concept;
  const isWaitingApproval = status === codeListStatus.approval;
  const isPlanned = status === codeListStatus.planned;
  const { cscEditor, cscPublisher } = useRoles();

  const { isEditAuth, isGarant, isEditor, isLoading } = useCSCAuth(codeListId, status);

  if (isLoading) {
    return null;
  }

  const handleCopyLink = () => {
    const url = window.location.href;
    toast.success(t('common.copyLinkMessage'), {
      id: 'toast-cscHeader-copyLink',
    });
    navigator.clipboard.writeText(url).catch((err) => {
      console.error('Failed to copy link: ', err);
    });
  };

  const breadcrumbsWithReset = breadcrumbs.map((crumb) => ({
    ...crumb,
    onClick: onBreadcrumbClick,
  }));

  return (
    <header className={styles.header}>
      <div className={styles.navigation}>
        <Breadcrumbs breadcrumbs={breadcrumbsWithReset} />
      </div>

      <div className={styles.mainContent}>
        <div className={styles.titleContainer}>
          <Text variant="h4" noWrap selectable={false}>
            {title}
          </Text>
          {status && (
            <Tag id={'tag-csc-header-' + statusName} variant={status}>
              {statusName}
            </Tag>
          )}
        </div>

        <div className={styles.actions}>
          {isGarant ? (
            <>
              {isConcept && isEditing ? (
                <>
                  <SaveConceptButton
                    title={tHeaderButtons('SaveConcept')}
                    text={t('CSCButtons.SaveConcept')}
                    onClick={handleSave}
                    ariaLabel={t('CSCButtons.SaveConcept')}
                    isValid={isValid}
                    tooltipText={t('CSCButtons.toolTipTextDisabledSave')}
                    disabled={!isValid}
                  />
                  <SaveAndPublishConceptButton
                    title={tHeaderButtons('SaveAndPublish')}
                    text={t('CSCButtons.SaveAndPublish')}
                    onClick={handleSavePublish}
                    ariaLabel={t('CSCButtons.SaveAndPublish')}
                    isValid={isValid}
                    tooltipText={t('CSCButtons.toolTipTextDisabledSave&Publish')}
                    disabled={!isValid}
                  />
                  <CopyLinkButton
                    title={tHeaderButtons('CopyLink')}
                    text={t('CSCButtons.CopyLink')}
                    onClick={handleCopyLink}
                    ariaLabel={t('CSCButtons.CopyLink')}
                  />
                  <DeleteButton
                    title={tHeaderButtons('DeleteConcept')}
                    text={t('CSCButtons.DeleteConcept')}
                    onClick={handleDelete}
                    ariaLabel={t('CSCButtons.DeleteConcept')}
                    className={styles.deleteText}
                  />
                </>
              ) : isConcept ? (
                <>
                  <PublishConceptButton
                    title={tHeaderButtons('PublishConcept')}
                    text={t('CSCButtons.PublishConcept')}
                    onClick={handlePublish}
                    ariaLabel={t('CSCButtons.PublishConcept')}
                    isValid={isValid}
                    tooltipText={t('CSCButtons.toolTipTextDisabledSave&Publish')}
                  />
                  <EditConceptButton
                    title={tHeaderButtons('EditConcept')}
                    text={t('CSCButtons.EditConcept')}
                    onClick={handleEdit}
                    ariaLabel={t('CSCButtons.EditConcept')}
                  />
                  <CopyLinkButton
                    title={tHeaderButtons('CopyLink')}
                    text={t('CSCButtons.CopyLink')}
                    onClick={handleCopyLink}
                    ariaLabel={t('CSCButtons.CopyLink')}
                  />
                  <DeleteButton
                    title={tHeaderButtons('DeleteConcept')}
                    text={t('CSCButtons.DeleteConcept')}
                    onClick={handleDelete}
                    ariaLabel={t('CSCButtons.DeleteConcept')}
                    className={styles.deleteText}
                  />
                </>
              ) : isWaitingApproval ? (
                <>
                  <PublishConceptButton
                    title={tHeaderButtons('PublishConcept')}
                    text={t('CSCButtons.PublishConcept')}
                    onClick={handlePublish}
                    ariaLabel={t('CSCButtons.PublishConcept')}
                    isValid={isValid}
                    tooltipText={t('CSCButtons.toolTipTextDisabledSave&Publish')}
                  />
                  <ReturnToReworkConceptButton
                    title={tHeaderButtons('ReworkConcept')}
                    text={t('CSCButtons.ReworkConcept')}
                    onClick={handleReturn}
                    ariaLabel={t('CSCButtons.ReworkConcept')}
                  />
                  <CopyLinkButton
                    title={tHeaderButtons('CopyLink')}
                    text={t('CSCButtons.CopyLink')}
                    onClick={handleCopyLink}
                    ariaLabel={t('CSCButtons.CopyLink')}
                  />
                </>
              ) : isPlanned ? (
                <>
                  <DepublishConceptButton
                    title={tHeaderButtons('DepublishConcept')}
                    text={t('CSCButtons.DepublishConcept')}
                    onClick={handleUnpublish}
                    ariaLabel={t('CSCButtons.DepublishConcept')}
                  />
                  <CopyLinkButton
                    title={tHeaderButtons('CopyLink')}
                    text={t('CSCButtons.CopyLink')}
                    onClick={handleCopyLink}
                    ariaLabel={t('CSCButtons.CopyLink')}
                  />
                </>
              ) : isActive ? (
                <>
                  <>
                    <NewVersionButton
                      title={tHeaderButtons('NewVersion')}
                      text={t('CSCButtons.NewVersion')}
                      onClick={handleNewVersion}
                      ariaLabel={t('CSCButtons.NewVersion')}
                    />
                    <CopyLinkButton
                      title={tHeaderButtons('CopyLink')}
                      text={t('CSCButtons.CopyLink')}
                      onClick={handleCopyLink}
                      ariaLabel={t('CSCButtons.CopyLink')}
                    />
                  </>
                </>
              ) : (
                <>
                  <CopyLinkButton
                    title={tHeaderButtons('CopyLink')}
                    text={t('CSCButtons.CopyLink')}
                    onClick={handleCopyLink}
                    ariaLabel={t('CSCButtons.CopyLink')}
                  />
                </>
              )}
            </>
          ) : isEditor ? (
            <>
              {isConcept && isEditing ? (
                <>
                  <SaveConceptButton
                    title={tHeaderButtons('SaveConcept')}
                    text={t('CSCButtons.SaveConcept')}
                    onClick={handleSave}
                    ariaLabel={t('CSCButtons.SaveConcept')}
                    isValid={isValid}
                    tooltipText={t('CSCButtons.toolTipTextDisabledSave')}
                    disabled={!isValid}
                  />
                  <SaveAndSendForApprovalConceptButton
                    title={tHeaderButtons('SaveAndSendForApproval')}
                    text={t('CSCButtons.SaveAndSendForApproval')}
                    onClick={handeSaveAndSendForApproval}
                    ariaLabel={t('CSCButtons.SaveAndSendForApproval')}
                    isValid={isValid}
                    tooltipText={t('CSCButtons.toolTipTextDisabledSave&Publish')}
                    disabled={!isValid}
                  />
                  <CopyLinkButton
                    title={tHeaderButtons('CopyLink')}
                    text={t('CSCButtons.CopyLink')}
                    onClick={handleCopyLink}
                    ariaLabel={t('CSCButtons.CopyLink')}
                  />
                  <DeleteButton
                    title={tHeaderButtons('DeleteConcept')}
                    text={t('CSCButtons.DeleteConcept')}
                    onClick={handleDelete}
                    ariaLabel={t('CSCButtons.DeleteConcept')}
                    className={styles.deleteText}
                    disabled={!((cscEditor || cscPublisher) && isEditAuth)}
                  />
                </>
              ) : isConcept ? (
                <>
                  <SendForApprovalConceptButton
                    title={tHeaderButtons('SendForApproval')}
                    text={t('CSCButtons.SendForApproval')}
                    onClick={handleSendForApproval}
                    ariaLabel={t('CSCButtons.SendForApproval')}
                    isValid={isValid}
                    tooltipText={t('CSCButtons.toolTipTextDisabledSave&Publish')}
                    disabled={!((cscEditor || cscPublisher) && isEditAuth)}
                  />
                  <EditConceptButton
                    title={tHeaderButtons('EditConcept')}
                    text={t('CSCButtons.EditConcept')}
                    onClick={handleEdit}
                    ariaLabel={t('CSCButtons.EditConcept')}
                    disabled={!((cscEditor || cscPublisher) && isEditAuth)}
                  />
                  <CopyLinkButton
                    title={tHeaderButtons('CopyLink')}
                    text={t('CSCButtons.CopyLink')}
                    onClick={handleCopyLink}
                    ariaLabel={t('CSCButtons.CopyLink')}
                  />
                  <DeleteButton
                    title={tHeaderButtons('DeleteConcept')}
                    text={t('CSCButtons.DeleteConcept')}
                    onClick={handleDelete}
                    ariaLabel={t('CSCButtons.DeleteConcept')}
                    className={styles.deleteText}
                    disabled={!((cscEditor || cscPublisher) && isEditAuth)}
                  />
                </>
              ) : isActive ? (
                <>
                  <>
                    <NewVersionButton
                      title={tHeaderButtons('NewVersion')}
                      text={t('CSCButtons.NewVersion')}
                      onClick={handleNewVersion}
                      ariaLabel={t('CSCButtons.NewVersion')}
                    />
                    <CopyLinkButton
                      title={tHeaderButtons('CopyLink')}
                      text={t('CSCButtons.CopyLink')}
                      onClick={handleCopyLink}
                      ariaLabel={t('CSCButtons.CopyLink')}
                    />
                  </>
                </>
              ) : (
                <>
                  <CopyLinkButton
                    title={tHeaderButtons('CopyLink')}
                    text={t('CSCButtons.CopyLink')}
                    onClick={handleCopyLink}
                    ariaLabel={t('CSCButtons.CopyLink')}
                  />
                </>
              )}
            </>
          ) : (
            <CopyLinkButton
              title={tHeaderButtons('CopyLink')}
              text={t('CSCButtons.CopyLink')}
              onClick={handleCopyLink}
              ariaLabel={t('CSCButtons.CopyLink')}
            />
          )}
        </div>
      </div>
      {(isConcept || isPlanned || isWaitingApproval) && parentInfo && (
        <div className={styles.parentInfo}>
          <SubdirectoryIcon id="icon-csc-header-sub-arrow" aria-hidden="true" />
          <Text variant="caption" className={styles.parentText} selectable={false}>
            {t('CSCHeader.parentInfoPrefix')}{' '}
            <Link
              href={parentInfo.link}
              className={styles.parentLink}
              aria-label={`Parent: ${parentInfo.title}`}
              id={`link-csc-header-parent`}
            >
              {parentInfo.title}
            </Link>{' '}
            {t('CSCHeader.parentInfoSuffix', {
              validFrom: new Date(parentInfo.validFrom).toLocaleDateString('cs-CZ'),
            })}
          </Text>
        </div>
      )}
    </header>
  );
};
