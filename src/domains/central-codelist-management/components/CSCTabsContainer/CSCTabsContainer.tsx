'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { CodeListStatus } from '@/core/lib/definitions';
import { TabProps } from '@/design-system/atoms/Tab';
import { TabGroup } from '@/design-system/molecules';
import { ColumnType, TableRowType } from '@/design-system/molecules/Table';

import { useCodeLists } from '../../api/query';
import { CodeListByIdResponse } from '../../api/services';
import { DraftsByIdResponse } from '../../api/services/getDraftsById';
import styles from './CSCTabsContainer.module.css';
import { CodelistTab, ConceptsTab, DetailsTab, VersionsTab } from './tabs';

interface TabContentProps {
  icon?: React.FC<React.SVGProps<SVGElement>>;
  text: string;
  selected?: boolean;
  disabled?: boolean;
}
interface CSCTabsContainerProps {
  data: CodeListByIdResponse | DraftsByIdResponse;
  headers?: string[];
  setHeaders?: React.Dispatch<React.SetStateAction<string[]>>;
  codeListId: string;
  status?: CodeListStatus;
  parentId: string;
  isEditable?: boolean;
  setTableData: (data: TableRowType[]) => void;
  setColumnTypes: (
    types:
      | { [key: string]: ColumnType }
      | ((prev: { [key: string]: ColumnType }) => { [key: string]: ColumnType }),
  ) => void;
  setColumnNames: (columnNames: string[]) => void;
  tableData: TableRowType[];
  columnTypes?: { [key: string]: ColumnType };
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  selectedTab?: string;
  setSelectedTab?: (value: string) => void;
}

const getIconColorClass = (selected?: boolean, disabled?: boolean): string => {
  if (selected) return 'icon_red-500';
  if (disabled) return 'icon_black-300';

  return 'icon_black-950';
};

const TabContent = ({ icon: Icon, text, selected, disabled = true }: TabContentProps) => (
  <div className={styles.tabContent}>
    {Icon && <Icon className={`${styles.tabIcon} ${getIconColorClass(selected, disabled)}`} />}
    {text}
  </div>
);

export const CSCTabsContainer = ({
  data,
  headers,
  setHeaders,
  codeListId,
  status,
  isEditable,
  parentId,
  setTableData,
  setColumnTypes,
  setColumnNames,
  tableData,
  columnTypes = {},
  currentPage,
  setCurrentPage,
  setSelectedTab,
  selectedTab,
}: CSCTabsContainerProps) => {
  const t = useTranslations('CSCTabsContainer');
  const getCodeListsQuery = useCodeLists({ id: parentId, time: 'all' });

  const wholeCodeListData = getCodeListsQuery.data;

  const tabs = useMemo(
    () => [
      {
        id: 'tab-csc-tabs-container-codelist',
        disabled: false,
        value: ({ selected, disabled }: TabProps) => (
          <TabContent text={t('tabs.codelist')} selected={selected} disabled={disabled} />
        ),
      },
      {
        id: 'tab-csc-tabs-container-details',
        disabled: false,
        value: ({ selected, disabled }: TabProps) => (
          <TabContent text={t('tabs.details')} selected={selected} disabled={disabled} />
        ),
      },
      {
        id: 'tab-csc-tabs-container-versions',
        disabled: !((wholeCodeListData ?? []).flatMap((version) => version.versions).length > 1),
        value: ({ selected, disabled }: TabProps) => (
          <TabContent text={t('tabs.versions')} selected={selected} disabled={disabled} />
        ),
      },
      {
        id: 'tab-csc-tabs-container-concepts',
        disabled:
          !((wholeCodeListData ?? []).flatMap((version) => version.versions).length > 0) ||
          wholeCodeListData?.some((item) => item.drafts.length === 0),
        value: ({ selected, disabled }: TabProps) => (
          <TabContent text={t('tabs.concepts')} selected={selected} disabled={disabled} />
        ),
      },
    ],
    [t, wholeCodeListData],
  );

  return (
    <div className={styles.container}>
      <TabGroup
        tabs={tabs}
        isEditable={isEditable}
        setSelectedTab={setSelectedTab}
        selectedTab={selectedTab}
      >
        <CodelistTab
          data={data}
          headers={headers}
          setHeaders={setHeaders}
          editable={isEditable}
          status={status}
          setTableData={setTableData}
          setColumnTypes={setColumnTypes}
          setColumnNames={setColumnNames}
          tableData={tableData}
          columnTypes={columnTypes}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        <DetailsTab parentId={parentId} codeListId={codeListId} data={data} status={status} />
        <VersionsTab
          data={wholeCodeListData?.flatMap((version) => version.versions)}
          parentId={wholeCodeListData?.flatMap((version) => version.id)}
          codeListId={codeListId}
        />
        <ConceptsTab
          data={wholeCodeListData?.flatMap((drafts) => drafts.drafts)}
          parentId={wholeCodeListData?.flatMap((drafts) => drafts.id)}
        />
      </TabGroup>
    </div>
  );
};
