'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { IContentCopy, IDownload } from '@/core/assets/icons';
import { useRoles } from '@/core/providers/RolesProvider';
import { Badge, Button, Divider, Spinner, Text } from '@/design-system/atoms';
import { AvatarWithName, Breadcrumbs, TabGroup } from '@/design-system/molecules';
import useAuditDetail from '@/domains/audit-log/api/query/useAuditDetail';

import { AuditTable, JsonDetailViewer } from '../components';
import { composeCallBackQuery } from './utils/utils';
import styles from './index.module.css';

/**
 * This component renders the details of a specific audit entry.
 * It fetches the audit data based on the ID from the URL parameters and displays it in a structured format.
 * It includes a header with the audit ID, a button to export the audit data as JSON,
 * and a tabbed interface to view the audit details, JSON representation, and related context.
 *
 * @returns
 */
export default function AuditDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const router = useRouter();
  const t = useTranslations('AuditPage');
  const th = useTranslations('AuditPage.headers');
  const searchParams = useSearchParams();
  const [selectedTab, setSelectedTab] = useState('details-tab-id');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(audit, null, 4));
  };

  const breadcrumbs = [
    { value: t('title'), link: '/audit-list?' + composeCallBackQuery(searchParams) },
  ];

  const { auditReader, isLoadingRoles } = useRoles();

  const shouldFetch = !isNaN(id) && auditReader && !isLoadingRoles;

  const {
    data: audit,
    isLoading,
    isError,
  } = useAuditDetail(shouldFetch ? { id } : null, {
    enabled: shouldFetch,
  });

  useEffect(() => {
    if (!isLoadingRoles && !auditReader) {
      router.push('/');
    }
  }, [auditReader, isLoadingRoles, router]);

  // While the data is loading, render a spinner
  if ((isLoading || !audit) && !isError && !isNaN(id))
    return (
      <div className={styles.spinnerContainer}>
        <Spinner fullScreen={false} />
      </div>
    );

  // If there's an error or the audit data is not found, render the Not Found page
  if (isError || !audit || isNaN(id)) notFound();

  // This function converts the audit data to JSON and triggers a download
  const handleDownloadJson = () => {
    const json = JSON.stringify(audit, null, 2); // Pretty print JSON with 2 spaces indentation
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-detail-${audit.id}.json`;
    a.click();

    URL.revokeObjectURL(url); // Clean up the URL object
  };

  return (
    <div className={styles.container}>
      <div>
        <Breadcrumbs showBackLink={true} breadcrumbs={breadcrumbs}></Breadcrumbs>
      </div>

      <div className={styles.headerRow}>
        <Text variant="h4" id="headerTitleId">
          {id}
        </Text>
        <Button
          id={'export-to-json'}
          variant="primary"
          onClick={handleDownloadJson}
          icon={<IDownload id="icon-download-json" className="icon_white" width={24} height={24} />}
        >
          {t('jsonExport')}
        </Button>
      </div>

      <div className={styles.auditGrid}>
        <div className={styles.auditCell}>
          <div>
            <label htmlFor={'identityId'} className={styles.auditLabel}>
              <Text>{th('authentication')}</Text>
            </label>
          </div>
          <div className={styles.auditValue}>
            <AvatarWithName displayNameOnly={false} name={audit.messageBody.authentication} />
          </div>
        </div>
        <div className={styles.auditCell}>
          <div>
            <label htmlFor={'timestamp'} className={styles.auditLabel}>
              <Text>{th('timestamp')}</Text>
            </label>
          </div>
          <div className={styles.auditValue}>
            <Text regular id="text-audit-detail-timestamp-id">
              {new Date(audit.timestamp).toLocaleString()}
            </Text>
          </div>
        </div>
        <div className={styles.auditCell}>
          <label htmlFor={'success'} className={styles.auditLabel}>
            <Text>{th('success')}</Text>
          </label>
          <div className={styles.auditValue}>
            {audit.success ? (
              <Badge color="lightGreen" children={t('success')} className={styles.badge}></Badge>
            ) : (
              <Badge color="red" children={t('failure')} className={styles.badge}></Badge>
            )}
          </div>
        </div>
        <div className={styles.auditCell}>
          <label htmlFor={'entityId'} className={styles.auditLabel}>
            <Text>{th('entityId')}</Text>
          </label>
          <div className={styles.auditValue}>
            <Text regular id="badge-audit-detail-entity-id">
              {audit.entityId}
            </Text>
          </div>
        </div>
      </div>

      <Divider className={styles.divider} />

      <TabGroup
        tabs={[
          { id: 'details-tab-id', value: <Text regular> {t('details')}</Text> },
          { id: 'json-tab-id', value: <Text regular> {t('json')} </Text> },
          { id: 'context-tab-id', value: <Text regular> {t('context')} </Text> },
        ]}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      >
        <div>
          <pre>
            <JsonDetailViewer data={audit} translation="AuditPage.headers"></JsonDetailViewer>
          </pre>
        </div>
        <div className={styles.jsonViewer}>
          <Button
            id="audit-detail-copy-json-button"
            variant="secondary"
            children={t('copy')}
            className={styles.copyButton}
            onClick={handleCopy}
            icon={<IContentCopy width={20} height={20} />}
            aria-label="Copy JSON"
          />
          <pre>{JSON.stringify(audit, null, 4)}</pre>
        </div>
        <div>
          {' '}
          <AuditTable
            shouldFetch={true}
            initialPage={0}
            initialPageSize={'10'}
            identityId={audit.identityId}
            sort="timestamp,desc"
            timestampTo={new Date(audit.timestamp)}
          />
        </div>
      </TabGroup>
    </div>
  );
}
