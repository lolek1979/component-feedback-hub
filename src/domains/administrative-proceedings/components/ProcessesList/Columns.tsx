'use client';

import { ColumnDef } from '@tanstack/react-table';

import { AppLink, Badge, Text } from '@/design-system/atoms';

import { InsurancePayerSimpleResponse, UserDto } from '../../api/services/getAdminProcesses';
import HeaderCellContent from './Table/Helpers/HeaderCellContent';
import InsurancePayer from './Table/Helpers/InsurancePayer';
import RemainingDays from './Table/Helpers/RemainingDays';
import ResponsibleUsers from './Table/Helpers/ResponsibleUsers';
import styles from './ProcessesList.module.css';

export type AdminProcessTableRow = {
  id?: string;
  agendaNumber: string;
  agendaCode: string;
  recordNumber: string;
  insurancePayer: InsurancePayerSimpleResponse;
  responsibleUsers: UserDto[];
  status: string;
  tStatusPrefix: (key: string) => string;
  resolutionDeadline: string | null;
};

const getStatusBadgeColor = (statusCode: string) => {
  switch (statusCode) {
    case 'APPL_PROC':
      return 'lightGreen';
    case 'DEMO_END':
      return 'lightBlue';
    default:
      return 'gray';
  }
};

export const columns: ColumnDef<AdminProcessTableRow>[] = [
  {
    id: 'agendaNumber',
    accessorKey: 'agendaNumber',
    enableHiding: false,
    header: ({ column }) => (
      <HeaderCellContent translationKey="agendaNumber" column={column} sortable />
    ),
    cell: ({ row }) => {
      const value = row.getValue('agendaNumber') as AdminProcessTableRow['agendaNumber'];
      const adminProcessId = row.original.id;

      return (
        <Text className={styles.agenda}>
          <AppLink link={`/spravni-rizeni/${adminProcessId}`} target={'_self'} variant="primary">
            <Text variant="footnote">{value}</Text>
          </AppLink>
        </Text>
      );
    },
  },
  /*
   * Hide it for POC1; keep it commented for the next iteration
  {
    id: 'agendaCode',
    accessorKey: 'agendaCode',
    enableHiding: true,
    header: ({ column }) => <HeaderCellContent translationKey="agendaCode" column={column} />,
    cell: (info) => {
      const value = info.getValue() as AdminProcessTableRow['agendaCode'];

      return <Text>{value}</Text>;
    },
    meta: {
      isHiddenByDefault: true,
    },
  },
  */
  {
    id: 'recordNumber',
    accessorKey: 'recordNumber',
    enableHiding: false,
    header: ({ column }) => (
      <HeaderCellContent translationKey="recordNumber" column={column} sortable />
    ),
    cell: ({ row }) => {
      const value = row.getValue('recordNumber') as AdminProcessTableRow['recordNumber'];

      return (
        <Text variant="subtitle" regular>
          {value}
        </Text>
      );
    },
  },
  {
    id: 'insurancePayer',
    accessorKey: 'insurancePayer',
    enableHiding: false,
    header: ({ column }) => (
      <HeaderCellContent translationKey="insurancePayer" column={column} sortable />
    ),
    cell: ({ row }) => {
      const value = row.getValue('insurancePayer') as AdminProcessTableRow['insurancePayer'];

      return <InsurancePayer name={value.name} id={value.id} />;
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    enableHiding: false,
    header: ({ column }) => <HeaderCellContent translationKey="status" column={column} sortable />,
    cell: ({ row }) => {
      const value = row.getValue('status') as AdminProcessTableRow['status'];

      return (
        <Badge color={getStatusBadgeColor(value)}>
          {row.original.tStatusPrefix(`statuses.${value}`)}
        </Badge>
      );
    },
  },
  {
    id: 'responsibleUsers',
    accessorKey: 'responsibleUsers',
    enableHiding: false,
    header: ({ column }) => (
      <HeaderCellContent translationKey="responsibleUsers" column={column} sortable />
    ),
    cell: ({ row }) => {
      const value = row.getValue('responsibleUsers') as AdminProcessTableRow['responsibleUsers'];

      return <ResponsibleUsers users={value} />;
    },
  },
  {
    id: 'resolutionDeadline',
    accessorKey: 'resolutionDeadline',
    enableHiding: false,
    header: ({ column }) => (
      <HeaderCellContent translationKey="resolutionDeadline" column={column} sortable />
    ),
    cell: ({ row }) => {
      const value = row.getValue(
        'resolutionDeadline',
      ) as AdminProcessTableRow['resolutionDeadline'];

      return <RemainingDays deadlineDate={value} />;
    },
  },
];
