'use client';

import { useTranslations } from 'next-intl';

import { Avatar, Text, Tooltip } from '@/design-system/atoms';
import {
  InsurancePayerSimpleResponse,
  UserDto,
} from '@/domains/administrative-proceedings/api/services/getAdminProcesses';

import styles from './DetailHeader.module.css';

export interface AdminProcess {
  agendaNumber?: string;
  recordNumber?: string;
  responsibleUsers?: UserDto[];
  insurancePayer?: InsurancePayerSimpleResponse;
}

interface DetailHeaderProps {
  process: AdminProcess;
}

const DetailHeader = ({ process }: DetailHeaderProps) => {
  const { agendaNumber, recordNumber, responsibleUsers, insurancePayer } = process;
  const t = useTranslations('administrativeProceedings');

  return (
    <div
      data-testid="admin-process-detail-header"
      className={styles.detailHeaderWrapper}
      role="region"
      aria-label={t('pageTitle')}
    >
      <ul className={styles.detailInfoList}>
        <li>
          <Text variant="subtitle" id="headerAgendaNumberId" selectable={false}>
            {t('columns.agendaNumber')}
          </Text>
          <div
            className={styles.listValue}
            role="definition"
            aria-labelledby="headerAgendaNumberId"
          >
            {agendaNumber || '-'}
          </div>
        </li>
        <li>
          <Text variant="subtitle" id="headerRecordNumberId" selectable={false}>
            {t('columns.recordNumber')}
          </Text>
          <div
            className={styles.listValue}
            role="definition"
            aria-labelledby="headerRecordNumberId"
          >
            {recordNumber || '-'}
          </div>
        </li>
        <li>
          <Text variant="subtitle" id="headerInsurancePayerId" selectable={false}>
            {t('columns.insurancePayer')}
          </Text>
          <div
            className={styles.listValue}
            role="definition"
            aria-labelledby="headerInsurancePayerId"
          >
            {insurancePayer && (insurancePayer.name || insurancePayer.id) ? (
              <div className={styles.userContainer}>
                {insurancePayer.name && insurancePayer.name.trim().length > 0 && (
                  <Avatar name={insurancePayer.name} className={styles.user} />
                )}
                <span>{insurancePayer.name || insurancePayer.id}</span>
              </div>
            ) : null}
          </div>
        </li>
        <li>
          <Text variant="subtitle" id="headerResponsibleUsersId" selectable={false}>
            {t('columns.responsibleUsers')}
          </Text>
          <div
            className={styles.listValue}
            role="definition"
            aria-labelledby="headerResponsibleUsersId"
          >
            {responsibleUsers && responsibleUsers.length > 0 && responsibleUsers[0].name ? (
              responsibleUsers.length > 1 ? (
                <Tooltip
                  variant="inverse"
                  content={responsibleUsers
                    .filter((user) => user.name)
                    .map((user) => user.name)
                    .join(', ')}
                  id="tooltip-responsible-users"
                >
                  <div className={styles.userContainer}>
                    <Avatar name={responsibleUsers[0].name} className={styles.user} />
                    <span>
                      {responsibleUsers[0].name}
                      {responsibleUsers.slice(1).filter((user) => user.name).length > 0 &&
                        ` +${responsibleUsers.slice(1).filter((user) => user.name).length}`}
                    </span>
                  </div>
                </Tooltip>
              ) : (
                <div className={styles.userContainer}>
                  <Avatar name={responsibleUsers[0].name} className={styles.user} />
                  <span>{responsibleUsers[0].name}</span>
                </div>
              )
            ) : null}
          </div>
        </li>
      </ul>
    </div>
  );
};

export default DetailHeader;
