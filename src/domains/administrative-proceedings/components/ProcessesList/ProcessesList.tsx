'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';

import IError from '@/core/assets/icons/icon-error.svg';
import { useRoles } from '@/core/providers/RolesProvider';
import { InlineMessage } from '@/design-system/molecules';
import DataTableSkeleton from '@/design-system/organisms/DataTableSkeleton/DataTableSkeleton';

import { useAdminProcesses } from '../../api';
import { AdminProcessTableRow, columns } from './Columns';
import { DataTable } from './DataTable';
import ProcessListFilter from './ProcessListFilter';

export const ProcessesList = () => {
  const t = useTranslations('common');
  const tAdminProceedings = useTranslations('administrativeProceedings');
  const [fullText] = useQueryState('fullText');
  const [responsibleUserId] = useQueryState('responsibleUserId');
  const [adminProcessStatusCode] = useQueryState('adminProcessStatusCode');
  const { data, isLoading } = useAdminProcesses(
    fullText,
    responsibleUserId,
    adminProcessStatusCode,
  );
  const [tableData, setTableData] = useState<AdminProcessTableRow[]>([]);
  const { adminProceedingsReferent } = useRoles();

  useEffect(() => {
    if (data?.length) {
      setTableData(
        data.map((item) => {
          return {
            id: item.id,
            agendaNumber: item.number,
            agendaCode: item.agenda.code,
            recordNumber: item.recordFolder.number,
            insurancePayer: item.insurancePayer,
            status: item.status.code,
            resolutionDeadline: item.dateResolutionDeadline ?? null,
            responsibleUsers: item.responsibleUsers ?? [],
            tStatusPrefix: (key: string) => tAdminProceedings(key),
          };
        }) as AdminProcessTableRow[],
      );
    } else {
      setTableData([]);
    }
  }, [data, tAdminProceedings]);

  if (!adminProceedingsReferent) {
    return (
      <InlineMessage
        id="inline-message-missing-role"
        data-testid="inline-message-missing-role"
        icon={
          <IError
            id={'icon-admin-process-inline-message-error'}
            className="icon_red-500"
            width={20}
            height={20}
          />
        }
        message={t('missingRole')}
        variant="error"
      />
    );
  }

  return (
    <>
      <ProcessListFilter />
      {isLoading && <DataTableSkeleton size={'quarter'} />}
      {!isLoading && <DataTable columns={columns} data={tableData} />}
    </>
  );
};
