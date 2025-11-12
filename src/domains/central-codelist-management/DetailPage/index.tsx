'use client';

import React, { createContext, useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { parseAsStringLiteral, useQueryState } from 'nuqs';

import { codeListMode, CodeListStatus, codeListStatus } from '@/core/lib/definitions';
import { useRoles } from '@/core/providers/RolesProvider';
import { useUnsavedChanges } from '@/core/providers/UnsavedChangesProvider';
import { Divider, Spinner } from '@/design-system/atoms';
import { type FileType, FileUpload } from '@/design-system/molecules/FileUpload/FileUpload';
import { ConfirmModal } from '@/design-system/molecules/Table/actions/ConfirmModal';
import { ColumnType, TableRowType } from '@/design-system/molecules/Table/Table';
import { toast } from '@/design-system/molecules/Toast';
import {
  RowValues,
  useCSCDataStore,
} from '@/domains/central-codelist-management/stores/cscDataStore';
import { useTableDataStore } from '@/domains/central-codelist-management/stores/cscTableDataStore';
import {
  extractCodeListData,
  filterParent,
  getCSCBreadcrumbs,
  getCSCObject,
  getCSCParentInfo,
  getRowValuesWithoutId,
  groupActions,
  groupStructureActions,
} from '@/domains/central-codelist-management/utils';

import {
  useCodeLists,
  useDraftsById,
  usePostCreateCodelistVersion,
  usePostImportCodelistVersion,
} from '../api/query';
import useCodeListsById from '../api/query/useCodeListById';
import {
  CodeListByIdResponse,
  deleteCodeListDraft,
  patchDraftData,
  PostCreateCodelistVersionParams,
  PostCreateCodelistVersionResponse,
  PostDraftDataUpdate,
  postDraftDataUpdate,
  PostImportCodelistVersionParams,
  PostImportCodelistVersionResponse,
  postStateCodeListDraft,
  publishCodeListDraft,
  tCodelistResponse,
  unPublishCodeListVersion,
} from '../api/services';
import { DraftsByIdResponse } from '../api/services/getDraftsById';
import { Field } from '../api/services/patchDraftStructure';
import { postStructureAdd } from '../api/services/postStructureAdd';
import { postStructureRemove } from '../api/services/postStructureRemove';
import { CscFormModal, CSCHeader, CSCTabsContainer, CSMainInfo } from '../components';
import { CSCFormData } from '../components/CscFormModal';
import useCSCAuth from '../hooks/useCSCAuth';
import { useCscStructureStore } from '../stores/cscStructureStore';
import styles from './index.module.css';

interface DetailPageProps {
  codeListId: string;
  parentId: string;
}
interface DetailsPageContextProps {
  setIsValid: (value: boolean) => void;
  isValid: boolean;
}
export const DetailsPageContext = createContext<DetailsPageContextProps>({
  setIsValid: () => true,
  isValid: true,
});

interface CodeListField {
  index: number;
  length: number;
  name: string;
  code: string;
  description: string;
  valueType: string;
  valueFormat: string;
  validations: any[];
  default: string;
}

const DetailPage = ({ codeListId, parentId }: DetailPageProps) => {
  // Move localStorage keys to the top to ensure they're defined before hooks
  const localStorageKey = `tableData_${codeListId}`;
  const localStorageTypesKey = `columnTypes_${codeListId}`;
  const localStorageHeadersKey = `headers_${codeListId}`;

  const [mode, setMode] = useQueryState(
    'mode',
    parseAsStringLiteral(Object.values(codeListMode)).withDefault(codeListMode.read),
  );
  const [status, setStatus] = useState<CodeListStatus>('concept');
  const parentDataQuery = useCodeLists({ id: parentId, time: 'all' });
  useEffect(() => {
    const currDate = new Date();
    parentDataQuery?.data?.find((item) => {
      if (
        item.drafts.some((draft) => draft.state === 'WaitingForApproval' && draft.id === codeListId)
      ) {
        setStatus('waitingforapproval');

        return true;
      } else if (
        item.drafts.some((draft) => draft.state === 'Rejected' && draft.id === codeListId)
      ) {
        setStatus('rejected');

        return true;
      } else if (
        item.drafts.some((draft) => draft.state === 'Editing' && draft.id === codeListId)
      ) {
        setStatus('concept');

        return true;
      }

      return item.versions.some((version) => {
        if (version.id === codeListId) {
          if (version.validTo && currDate > new Date(version.validTo)) {
            setStatus('expired');
          } else if (currDate >= new Date(version.validFrom)) {
            setStatus('active');
          } else {
            setStatus('planned');
          }

          return true;
        }

        return false;
      });
    });
  }, [parentDataQuery.data, codeListId]);
  const { updateUnsavedChanges } = useUnsavedChanges();
  const [isSaveBtn, setIsSaveBtn] = useState(mode === codeListMode.edit);
  const tCommon = useTranslations('common');
  const t = useTranslations('CSCDetailPage');
  const tStates = useTranslations('statuses');
  const tTable = useTranslations('Table');
  const tToasts = useTranslations('cscToasts');
  const isConcept =
    status === codeListStatus.concept ||
    status === codeListStatus.approval ||
    status === codeListStatus.rejected;
  const isCodelist =
    status === codeListStatus.active ||
    status === codeListStatus.planned ||
    status === codeListStatus.expired;

  const [selectedTab, setSelectedTab] = useState<string>('tab-csc-tabs-container-codelist');
  const [isValid, setIsValid] = useState<boolean>(true);

  const [data, setData] = useState<CodeListByIdResponse | DraftsByIdResponse>(
    {} as CodeListByIdResponse | DraftsByIdResponse,
  );
  const [parentData, setParentData] = useState<tCodelistResponse>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPublishModalVis, setIsPublishModalVis] = useState(false);
  const [isNewConceptModal, setIsNewConceptModal] = useState(false);
  const [isNewVersionModal, setIsNewVersionModal] = useState(false);
  const [isNewVersionFileUploadModal, setIsNewVersionFileUploadModal] = useState(false);
  const [isNewVersionProcessing, setIsNewVersionProcessing] = useState(false);
  const [newVersionImportError, setNewVersionImportError] = useState('');
  const [savedNewVersionFormData, setSavedNewVersionFormData] = useState<CSCFormData | null>(null);
  const [newVersionFiles, setNewVersionFiles] = useState<File[]>([]);
  const [newVersionFileTypes, setNewVersionFileTypes] = useState<Record<string, any>>({});
  const [modalStatus, setModalStatus] = useState<string | null>(null);
  const draftsQuery = useDraftsById({ id: codeListId, isConcept: isConcept });
  const codeListsQuery = useCodeListsById({ id: codeListId, isCodelist: isCodelist });

  const queryClient = useQueryClient();
  const { mutate: postImportNewVersion } = usePostImportCodelistVersion();
  const { mutate: postCreateNewVersion } = usePostCreateCodelistVersion();

  const parentCodeData = parentDataQuery.data;
  const codeData = isConcept ? draftsQuery.data : codeListsQuery.data;
  const isCSCDataLoading = isConcept ? draftsQuery.isLoading : codeListsQuery.isLoading;
  const isCSCDataError = isConcept ? draftsQuery.isError : codeListsQuery.isError;
  const isFetchingCSCData = isConcept ? draftsQuery.isFetching : codeListsQuery.isFetching;
  const parentResult = parentData ? filterParent(parentData) : [];
  const [tableData, setTableData] = useState<TableRowType[]>([]);
  const [headers, setHeaders] = useState(() => {
    const headers: string[] = [];
    tableData.forEach((row) => {
      for (const key in row) {
        if (!headers.includes(key)) {
          headers.push(key);
        }
      }
    });

    return headers;
  });
  const [columnTypes, setColumnTypes] = useState<{ [key: string]: ColumnType }>({});
  const [columnNames, setColumnNames] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const tableDataStore = useTableDataStore();
  const { cscReader, isLoadingRoles } = useRoles();
  const name = data && 'payload' in data ? data.payload?.name : data?.name;
  const validFrom = data && 'payload' in data ? data.payload?.validFrom : data?.validFrom;
  const { isEditAuth, isPublisherAuth, isLoading } = useCSCAuth(codeListId, status);
  const breadcrumbs = getCSCBreadcrumbs(t, parentId, parentResult, codeListId, data, status);
  const parentInfo = getCSCParentInfo(parentId, parentResult, status);
  const hasDefaultHeaders = columnNames.some(
    (header) =>
      header &&
      (header.trim().match(/^(Column Header|Záhlaví sloupce) [0-9]+$/) ||
        header.trim().match(/^col_\d+_\d+$/)),
  );
  const hasEmptyHeader = columnNames.some((header) => !header?.trim());

  const hasDataInAnyColumn = columnNames.some((columnName) =>
    tableData.some((row) => {
      const value = row[columnName];

      return value !== undefined && value !== null && value !== '';
    }),
  );

  const cscObject = getCSCObject(data, codeListId);

  const { mutate: sendForApprovalMutation } = useMutation({
    mutationFn: () => postStateCodeListDraft(codeListId ?? '', 'WaitingForApproval'),
    onSuccess: () => {
      toast.success(tCommon('sendForApprovalSuccess'), {
        id: `toast-statusRowActions-sendForApprovalSuccess`,
      });
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error('Error sending for approval:', error);
      toast.error(tCommon('sendForApprovalError'), {
        id: `toast-statusRowActions-sendForApprovalError`,
      });
    },
  });
  // When process for rejected edit from "Editing" to "Rejected"
  const { mutate: reworkMutation } = useMutation({
    mutationFn: () => postStateCodeListDraft(codeListId ?? '', 'Editing'),
    onSuccess: () => {
      toast.success(tCommon('sendForReworkSuccess'), {
        id: `toast-statusRowActions-sendForReworkSuccess`,
      });
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error('Error sending for rework:', error);
      toast.error(tCommon('sendForReworkError'), {
        id: `toast-statusRowActions-sendForReworkError}`,
      });
    },
  });
  const { mutate: unpublishMutation } = useMutation({
    mutationFn: async () => {
      if (data && 'payload' in data) {
        return await unPublishCodeListVersion(data.payload?.id);
      } else {
        throw new Error('ID is undefined');
      }
    },
    onSuccess: (response) => {
      if (response.state === 'Success') {
        toast.success(tCommon('unPublishPlanned'), {
          id: 'toast-cscDetailPage-unPublishPlanned',
          onAutoClose: () => {
            window.location.reload();
          },
          onDismiss: () => {
            window.location.reload();
          },
        });
      }
    },
    onError: (error) => {
      console.error('Failed to unpublish:', error);
    },
  });

  const { mutate: deleteConceptMutation } = useMutation({
    mutationFn: async () => {
      if (!codeListId) throw new Error('ID is undefined');

      return await deleteCodeListDraft(codeListId);
    },
    onSuccess: () => {
      setIsModalVisible(false);
      toast.success(
        tCommon('deleteConceptSuccess') +
          (data && 'payload' in data ? data.payload?.name : data?.name) +
          tCommon('deleteConceptSuccess2'),
        {
          id: 'toast-cscDetailPage-deleteConceptSuccess',
          onAutoClose: () => router.push('/centralni-sprava-ciselniku'),
          onDismiss: () => router.push('/centralni-sprava-ciselniku'),
        },
      );
    },
    onError: (error) => {
      console.error('Failed to delete concept:', error);
      toast.error(tCommon('deleteConceptError'), {
        id: 'toast-cscDetailPage-deleteConceptError',
      });
    },
  });

  const { mutate: saveAndSendForApprovalMutation } = useMutation({
    mutationFn: async () => {
      await handleSave();

      return await postStateCodeListDraft(codeListId, 'WaitingForApproval');
    },
    onSuccess: () => {
      toast.success(tCommon('sendForApprovalSuccess'), {
        id: `toast-statusRowActions-sendForApprovalSuccess`,
      });
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error('Error sending for approval:', error);
      toast.error(tCommon('sendForApprovalError'), {
        id: `toast-statusRowActions-sendForApprovalError`,
      });
    },
  });

  useEffect(() => {
    if (isLoading) {
      return;
    }
    const currDate = new Date();
    parentDataQuery?.data?.find((item) => {
      if (
        item.drafts.some((draft) => draft.state === 'WaitingForApproval' && draft.id === codeListId)
      ) {
        setStatus('waitingforapproval');

        return true;
      } else if (
        item.drafts.some((draft) => draft.state === 'Rejected' && draft.id === codeListId)
      ) {
        setStatus('rejected');

        return true;
      } else if (
        item.drafts.some((draft) => draft.state === 'Editing' && draft.id === codeListId)
      ) {
        setStatus('concept');

        return true;
      }

      return item.versions.some((version) => {
        if (version.id === codeListId) {
          if (version.validTo && currDate > new Date(version.validTo)) {
            setStatus('expired');
          } else if (currDate >= new Date(version.validFrom)) {
            setStatus('active');
          } else {
            setStatus('planned');
          }

          return true;
        }

        return false;
      });
    });
  }, [parentDataQuery?.data, codeListId, isLoading]);

  useEffect(() => {
    if (isLoadingRoles) return;
    if (!cscReader) {
      router.push('/');
    }
  }, [cscReader, isLoadingRoles, router]);

  useEffect(() => {
    if (mode === codeListMode.read) {
      tableDataStore.getState().clearActions();
    }
  });

  useEffect(() => {
    if (codeData && !isCSCDataError && !isCSCDataLoading && !isFetchingCSCData && parentCodeData) {
      setData(codeData);
      setParentData(parentCodeData);
    }
  }, [
    codeData,
    isCSCDataError,
    isCSCDataLoading,
    isConcept,
    isFetchingCSCData,
    parentCodeData,
    status,
  ]);

  useEffect(() => {
    if (mode === codeListMode.edit && tableData.length > 0) {
      tableDataStore.setState({ tableData: tableData });
    }
  }, [tableData, mode, localStorageKey, tableDataStore]);
  useEffect(() => {
    if (mode === codeListMode.edit && Object.keys(columnTypes).length > 0) {
      tableDataStore.setState({ columnTypes: columnTypes });
    }
  }, [columnTypes, mode, localStorageTypesKey, tableDataStore]);
  useEffect(() => {
    if (mode === codeListMode.edit && headers.length > 0) {
      tableDataStore.setState({ headers: headers });
    }
  }, [headers, mode, localStorageHeadersKey, tableDataStore]);

  useEffect(() => {
    if (mode === codeListMode.edit) {
      const savedData = tableDataStore.getState().tableData;
      if (savedData && Array.isArray(savedData) && savedData.length > 0) {
        setTableData(savedData);
      }
      const savedTypes = tableDataStore.getState().columnTypes;
      if (savedTypes && typeof savedTypes === 'object') {
        setColumnTypes(savedTypes);
      }
      const savedHeaders = tableDataStore.getState().headers;
      if (savedHeaders && Array.isArray(savedHeaders) && savedHeaders.length > 0) {
        setHeaders(savedHeaders);
        setColumnNames(savedHeaders);
      }
    }
  }, [
    mode,
    localStorageKey,
    localStorageTypesKey,
    localStorageHeadersKey,
    setColumnNames,
    setColumnTypes,
    setHeaders,
    setTableData,
    tableDataStore,
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (
        searchParams.get('autoEdit') === 'true' &&
        !isCSCDataLoading &&
        !isFetchingCSCData &&
        codeData &&
        mode === codeListMode.read
      ) {
        searchParams.delete('autoEdit');
        window.history.replaceState(
          {},
          '',
          `${window.location.pathname}?${searchParams.toString()}`,
        );

        handleEditClick();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCSCDataLoading, isFetchingCSCData, codeData, mode]);

  if (!isCSCDataLoading && (isCSCDataError || !codeData)) {
    notFound();
  }

  if (isCSCDataLoading) {
    return <Spinner fullScreen />;
  }

  const handleBreadcrumbClick = () => {
    setCurrentPage(1);
  };

  const handleEditClick = () => {
    if (
      tStates(status ?? '') === tStates('active') ||
      tStates(status ?? '') === tStates('planned')
    ) {
      setIsNewConceptModal(!isNewConceptModal);
    } else {
      setSelectedTab('tab-csc-tabs-container-codelist');
      setIsValid(true);
      setCurrentPage(1);

      if (draftsQuery.data || codeListsQuery.data) {
        const { keys, rows } = extractCodeListData(codeData ?? null);
        if (keys.length > 0 && rows.length > 0) {
          const dataObjects = rows.map((row, idx) => {
            const obj: TableRowType = { rowId: idx };
            keys.forEach((key, colIdx) => {
              obj[key] = row[colIdx] ?? '';
            });

            return obj;
          });
          setTableData(dataObjects);
        }
      }

      setTimeout(() => {
        setMode(codeListMode.edit).then(() => {
          setIsSaveBtn(!isSaveBtn);
          setTimeout(() => setIsValid(true), 100);
        });
      }, 200);
    }
  };

  const handleDeleteConcept = () => {
    deleteConceptMutation();
  };

  const handlePublish = async () => {
    if (hasDefaultHeaders) {
      toast.error(tTable('emptyHeaderError'), {
        id: 'toast-cscDetailPage-emptyHeaderError',
      });

      return;
    }
    if (hasEmptyHeader) {
      toast.error(tTable('emptyHeaderError'), {
        id: 'toast-cscDetailPage-emptyHeaderError-2',
      });

      return;
    }
    if (!hasDataInAnyColumn) {
      toast.error(tTable('atLeastOneColumnHasDataError'), {
        id: 'toast-cscDetailPage-atLeastOneColumnHasDataError',
      });

      return;
    }

    try {
      const response = await publishCodeListDraft(codeListId);
      if (
        response &&
        response.state == 'Failure' &&
        response.messages.some((messages) => messages.code === 'ExtraValues')
      ) {
        toast.error(tCommon('publishConceptErrorStructure'), {
          id: 'toast-cscDetailPage-publishConceptErrorStructure',
        });
      } else if (
        response &&
        response.state == 'Failure' &&
        response.messages.some((messages) => messages.code === 'PublishToPast')
      ) {
        toast.error(tCommon('publishConceptError'), {
          id: 'toast-cscDetailPage-publishConceptError',
        });
      } else if (
        response &&
        response.state == 'Failure' &&
        response.messages.some((messages) => messages.code === 'NoColumns')
      ) {
        toast.error(tCommon('publishConceptErrorNoColumns'), {
          id: 'toast-cscDetailPage-publishConceptErrorNoColumns',
        });
      } else if (
        response &&
        response.state == 'Failure' &&
        response.messages.some((messages) => messages.code === 'EmptyContent')
      ) {
        toast.error(tCommon('publishConceptErrorEmptyContent'), {
          id: 'toast-cscDetailPage-publishConceptErrorEmptyContent',
        });
      } else if (
        response &&
        response.state == 'Failure' &&
        response.messages[0].code === 'CDL-CodeNotUnique'
      ) {
        toast.error(tCommon('publishConceptErrorCode'), {
          id: 'toast-cscDetailPage-publishConceptErrorCode',
        });
      } else if (
        response &&
        response.state == 'Failure' &&
        response.messages.some((messages) => messages.code === 'WrongType')
      ) {
        toast.error(tCommon('publishConceptErrorWrongType'), {
          id: 'toast-cscDetailPage-publishConceptErrorWrongType',
        });
      } else if (
        response &&
        response.state == 'Failure' &&
        response.messages.some((message) => message.code === 'DuplicitValue')
      ) {
        const columnNames = response?.messages
          ?.filter((message) => message.code === 'DuplicitValue')
          //@ts-ignore
          ?.map((message) => message.data?.ColName || 'Unknown');

        columnNames.forEach((columnName) => {
          toast.error(tCommon('publishConcpetErrorDuplicate', { columnName }), {
            id: `toast-cscDetailPage-publishConcpetErrorDuplicate-${columnName}`,
          });
        });
      } else if (response && response.state == 'Failure') {
        toast.error(tCommon('publishConceptErrorGeneral'), {
          id: 'toast-cscDetailPage-publishConceptErrorGeneral',
        });
      } else {
        toast.success(tCommon('publishConcept'), {
          id: 'toast-cscDetailPage-publishConcept',
          onAutoClose: () => {
            window.location.reload();
          },
          onDismiss: () => {
            window.location.reload();
          },
        });
      }
    } catch (error) {
      console.error('Failed to publish code list draft:', error);
    }
  };

  const handleUnpublish = () => {
    unpublishMutation();
  };

  const handleSave = async () => {
    // Only check column types for columns that exist in columnNames
    const existingColumnTypes = headers
      .filter((key) => columnNames.includes(key))
      .reduce(
        (obj, key) => {
          obj[key] = columnTypes[key];

          return obj;
        },
        {} as { [key: string]: ColumnType },
      );

    const hasNullColumnType = Object.values(existingColumnTypes).some((type) => type === 'Null');
    if (hasNullColumnType) {
      toast.error(tTable('columnTypes.columnTypeError'), {
        id: 'toast-cscDetailPage-columnTypeError',
      });

      return;
    }

    if (!name?.trim()) {
      toast.error(tTable('emptyHeaderError'), {
        id: 'toast-cscDetailPage-emptyHeaderError',
      });

      return;
    }

    // Check for default/initial header names
    if (hasDefaultHeaders) {
      toast.error(tTable('emptyHeaderError'), {
        id: 'toast-cscDetailPage-emptyHeaderError',
      });

      return;
    }

    if (hasEmptyHeader) {
      toast.error(tTable('emptyHeaderError'), {
        id: 'toast-cscDetailPage-emptyHeaderError',
      });

      return;
    }
    const filteredTableData = tableData.filter((row) =>
      columnNames.some((columnName) => row[columnName] !== ''),
    );

    if (filteredTableData.length !== tableData.length) {
      setTableData(filteredTableData);
    }

    // Only check columns that have data
    const columnsWithData = columnNames.filter((_, index) =>
      tableData.some(
        (row) => Object.values(row)[index] !== undefined && Object.values(row)[index] !== null,
      ),
    );

    const hasEmptyRequiredHeader = columnsWithData.some((name) => !name?.trim());
    if (hasEmptyRequiredHeader) {
      toast.error(tTable('emptyHeaderError'), { id: 'toast-cscDetailPage-emptyHeaderError' });

      return;
    }

    setIsSaveBtn(!isSaveBtn);

    const draftData = draftsQuery.data || codeListsQuery.data;

    let existingFields: CodeListField[] = [];

    try {
      if (draftData) {
        if ('structure' in draftData && draftData.structure) {
          existingFields = (draftData.structure.fields || []) as CodeListField[];
        } else if ('payload' in draftData && draftData.payload?.content?.structure) {
          existingFields = (draftData.payload.content.structure.fields ||
            []) as unknown as CodeListField[];
        } else {
          console.warn('Could not find fields in data structure:', draftData);
        }
      }
    } catch (error) {
      console.error('Error extracting fields from data:', error);
      existingFields = [];
    }

    const originalTableKeys: string[] = [];
    filteredTableData.forEach((row) => {
      for (const key in row) {
        if (!originalTableKeys.includes(key)) {
          originalTableKeys.push(key);
        }
      }
    });

    for (const [index, columnName] of columnNames.entries()) {
      if (columnTypes[columnName] === 'Integer') {
        const key = originalTableKeys[index];
        const hasDecimal = filteredTableData.some((row) => {
          const rawValue = row[key];
          if (rawValue === null || rawValue === undefined || rawValue === '') return false;

          const num = parseFloat(rawValue.toString());

          return !Number.isNaN(num) && !Number.isInteger(num);
        });

        if (hasDecimal) {
          columnTypes[columnName] = 'Decimal';
          console.warn(`Column "${columnName}" changed from Integer to Decimal`);
        }
      }
    }

    columnNames.map((columnName, index) => {
      const existingField =
        existingFields.find((field: CodeListField) => field && field.name === columnName) ||
        existingFields.find((field: CodeListField) => field && field.index === index);

      useCscStructureStore
        .getState()
        .updateAction(
          index,
          existingField?.code ?? '',
          existingField?.default ?? '',
          Array.isArray(existingField?.validations) ? existingField.validations : [],
        );
    });

    const structureActions = useCscStructureStore.getState().actions;

    // Format DateType columns from dd-MM-yyyy to yyyy-MM-dd
    columnNames.forEach((columnName) => {
      if (columnTypes[columnName] === 'DateTime') {
        filteredTableData.forEach((row) => {
          const value = row[columnName];
          if (typeof value === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(value)) {
            const [day, month, year] = value.split('-');
            row[columnName] = `${year}-${month}-${day}`;
          }
        });
      }
    });

    try {
      const batches = groupStructureActions(structureActions);
      for (const batch of batches) {
        if (batch.type === 'add') {
          const fields = batch.actions.map((action) => action.payload as Field);
          await postStructureAdd(codeListId, { fields });
        } else if (batch.type === 'remove' || batch.type === 'delete') {
          const indexes = batch.actions.map((action) => action.payload as number);
          await postStructureRemove(codeListId, { indexes });
        }
      }

      toast.success(tCommon('saveSuccess'), { id: 'toast-cscDetailPage-saveSuccess' });

      try {
        updateUnsavedChanges(false);
        setIsValid(true);
        await setMode(codeListMode.read);

        setTimeout(() => {
          queryClient.invalidateQueries();
          queryClient.refetchQueries();

          setIsValid(true);
        }, 300);
      } catch (modeError) {
        console.error('Failed to switch to read mode:', modeError);
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to save changes:', error);
      toast.error(tCommon('saveError'), { id: 'toast-cscDetailPage-saveError' });
    }

    const filteredRowIds = filteredTableData.map((item) => item.rowId);
    tableData
      .filter((item2) => !filteredRowIds.includes(item2.rowId))
      .forEach((item2) => {
        useCSCDataStore.getState().addAction({
          type: 'delete',
          rowId: item2.rowId,
          payload: { values: item2.rowId },
        });
      });

    // Get pending actions from the store
    useCSCDataStore.getState().updateDates();

    const actions = useCSCDataStore.getState().actions;

    // Group actions by type (add, update, delete)
    const grouped = groupActions(actions);

    // Process each group of actions
    for (const group of grouped) {
      let payload: PostDraftDataUpdate = { delete: [], update: {}, add: [] };

      // Prepare payload for 'add' actions
      if (group.type === 'add') {
        payload.add = group.actions.map((action) => ({
          rowNr: action.rowId,
          values: getRowValuesWithoutId(action.payload.values as RowValues),
        }));
        // Prepare payload for 'update' actions
      } else if (group.type === 'update') {
        payload.update = group.actions.reduce(
          (acc, action) => {
            acc[action.rowId] = getRowValuesWithoutId(action.payload.values as RowValues);

            return acc;
          },
          {} as Record<string, string[]>,
        );
        // Prepare payload for 'delete' actions
      } else if (group.type === 'delete') {
        payload.delete = group.actions.map((action) => action.rowId);
      }

      try {
        // Try to update draft data with the prepared payload
        await postDraftDataUpdate(codeListId, payload);
        toast.success(tCommon('saveSuccess'), { id: 'toast-cscDetailPage-saveSuccess' });
        updateUnsavedChanges(false);
        setIsValid(true);
        await setMode(codeListMode.read);
        setTimeout(() => {
          queryClient.invalidateQueries();
          queryClient.refetchQueries();
          setIsValid(true);
        }, 300);
      } catch (error) {
        // If update fails, show error and try to rollback to original data
        console.error('Failed to save changes:', error);
        toast.error(tCommon('saveError'), { id: 'toast-cscDetailPage-saveError' });

        let originalRows: string[][] = [];
        if (draftData) {
          if ('content' in draftData && draftData.content) {
            originalRows = draftData.content;
          } else if ('payload' in draftData && draftData.payload?.content) {
            originalRows = draftData.payload.content.data ?? [];
          }
        }
        try {
          await patchDraftData(codeListId, originalRows);
          toast.error(tCommon('rollbackSuccess'), { id: 'toast-cscDetailPage-rollbackSuccess' });
        } catch (rollbackError) {
          // If rollback also fails, show rollback error
          console.error('Failed to rollback', rollbackError);
          toast.error(tCommon('rollbackError'), { id: 'toast-cscDetailPage-rollbackError' });
        }
        break;
      }
    }
    useCscStructureStore.getState().resetState();
    useCSCDataStore.getState().resetState();
  };
  const handleFileUploadBack = () => {
    setIsNewVersionFileUploadModal(false);
    setIsNewVersionModal(true);
    setNewVersionImportError('');
  };

  const handleSaveAndSendForApproval = () => {
    saveAndSendForApprovalMutation();
  };

  const handleSendForApproval = () => {
    sendForApprovalMutation();
  };

  const handleRework = () => {
    reworkMutation();
  };

  const handleSavePublish = async () => {
    setIsSaveBtn(!isSaveBtn);
    await handleSave().then(() => {
      handlePublish();
    });
  };

  const handleCSCSendForApproval = () => {
    setModalStatus('SendForApproval');
    setIsModalVisible(true);
  };
  const handleCSCSaveAndSendForApproval = () => {
    setModalStatus('SaveAndSendForApproval');
    setIsModalVisible(true);
  };
  const handleCSCSendForRework = () => {
    setModalStatus('SendForRework');
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    setIsPublishModalVis(false);
  };

  const handleCSCPublish = () => {
    setModalStatus('ConceptPublish');
    setIsPublishModalVis(true);
  };

  const handleCSCSavePublish = () => {
    setModalStatus('ConceptSaveAndPublish');
    setIsModalVisible(true);
  };

  const handleCSCUnpublish = () => {
    setModalStatus('Planned');
    setIsModalVisible(true);
  };

  const handleCSCDelete = () => {
    setModalStatus('Concept');
    setIsModalVisible(true);
  };

  const handleNewVersion = () => {
    setIsNewVersionModal(true);
  };

  const handleNewVersionFiles = (files: File[], types: Record<string, FileType>) => {
    setNewVersionFiles(files);
    setNewVersionFileTypes(types);
  };

  const processNewVersionByManual = (formData: CSCFormData) => {
    const payload: PostCreateCodelistVersionParams = {
      codeListId: parentId,
      name: formData.cscName,
      description: formData.description,
      validFrom: formData.startDate,
      garants: formData.garants.map((g) => g.id),
      editors: formData.editors.map((e) => e.id),
      versionType: formData.type,
    };

    postCreateNewVersion(payload, {
      onSuccess: (response: PostCreateCodelistVersionResponse) => {
        if (response && response.draftId) {
          toast.success(tToasts('create.204'), {
            id: 'toast-cscDetailPage-importSuccess',
          });
          router.push(
            `/centralni-sprava-ciselniku/${response.draftId}?parent=${response.codeListId}`,
          );
        }
      },
      onError: (error: Error | AxiosError) => {
        let errorCode = '500';
        if (error instanceof AxiosError && error.response) {
          errorCode = error.response.status?.toString();
        }
        toast.error(tToasts(`create.${errorCode}`), { id: 'toast-cscHeaderButtons-importError' });
      },
    });
  };

  const processNewVersionByTakeover = (formData: CSCFormData) => {
    const payload: PostCreateCodelistVersionParams = {
      codeListId: parentId,
      name: formData.cscName,
      description: formData.description,
      validFrom: formData.startDate,
      garants: formData.garants.map((g) => g.id),
      editors: formData.editors.map((e) => e.id),
      versionType: formData.type,
    };

    postCreateNewVersion(payload, {
      onSuccess: (response: PostCreateCodelistVersionResponse) => {
        if (response && response.draftId) {
          toast.success(tToasts('create.204'), {
            id: 'toast-cscDetailPage-importSuccess',
          });
          router.push(
            `/centralni-sprava-ciselniku/${response.draftId}?parent=${response.codeListId}&autoEdit=true`,
          );
        }
      },
      onError: (error: Error | AxiosError) => {
        let errorCode = '500';
        if (error instanceof AxiosError && error.response) {
          errorCode = error.response.status?.toString();
        }
        toast.error(tToasts(`create.${errorCode}`), { id: 'toast-cscHeaderButtons-importError' });
      },
    });
  };

  const processNewVersionByImport = () => {
    if (!savedNewVersionFormData || newVersionFiles.length === 0) {
      toast.error('No form data or files selected', {
        id: 'toast-cscDetailPage-noFilesSelected',
      });

      return;
    }

    setIsNewVersionProcessing(true);
    setNewVersionImportError('');

    const dataToSubmit: PostImportCodelistVersionParams = {
      id: parentId,
      name: savedNewVersionFormData.cscName,
      description: savedNewVersionFormData.description,
      validFrom: savedNewVersionFormData.startDate,
      garants: savedNewVersionFormData.garants.map((g) => g.id),
      editors: savedNewVersionFormData.editors.map((e) => e.id),
      versionType: savedNewVersionFormData.type,
      uploadedFiles: newVersionFiles.map((file) => ({
        file,
        type: newVersionFileTypes[file.name],
      })),
    };

    postImportNewVersion(dataToSubmit, {
      onSuccess: (response: PostImportCodelistVersionResponse) => {
        setIsNewVersionProcessing(false);
        if (response && response.draftId) {
          toast.success(tToasts('import.204'), {
            id: 'toast-cscDetailPage-importSuccess',
          });
          router.push(
            `/centralni-sprava-ciselniku/${response.draftId}?parent=${response.codeListId}`,
          );
        }
      },
      onError: (error: Error | AxiosError) => {
        setIsNewVersionProcessing(false);
        let errorCode = '500';
        let errorMessage = t('error.importError');
        if (error instanceof AxiosError && error.response) {
          errorCode = error.response.status?.toString();
          errorMessage = tToasts(`import.${errorCode}`);
        }
        setNewVersionImportError(errorMessage);
      },
    });
  };

  const startNewVersionProcessByImport = (formData: CSCFormData) => {
    setSavedNewVersionFormData(formData);
    setIsNewVersionFileUploadModal(true);
  };

  const handleNewVersionSubmit = async (
    formData: CSCFormData,
    actionType?: 'import' | 'manual' | 'takeover' | '',
  ) => {
    switch (actionType) {
      case 'import':
        startNewVersionProcessByImport(formData);

        return;
      case 'manual':
      case '':
        processNewVersionByManual(formData);

        return;
      case 'takeover':
        processNewVersionByTakeover(formData);

        return;
      default:
        toast.warning(tToasts('newVersionUnknownMethod'), {
          id: 'toast-cscHeaderButtons-new-version-unknown-method',
        });

        return;
    }
  };

  const handleConfirm = () => {
    if (modalStatus === 'Concept') {
      handleDeleteConcept();
    } else if (modalStatus === 'ConceptPublish') {
      handlePublish();
    } else if (modalStatus === 'ConceptSaveAndPublish') {
      handleSavePublish();
    } else if (modalStatus === 'Planned') {
      handleUnpublish();
    } else if (modalStatus === 'SendForApproval') {
      handleSendForApproval();
    } else if (modalStatus === 'SendForRework') {
      handleRework();
    } else if (modalStatus === 'SaveAndSendForApproval') {
      handleSaveAndSendForApproval();
    }
    setIsModalVisible(false);
    setIsPublishModalVis(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <CSCHeader
          isEditing={mode === codeListMode.edit && (isEditAuth || isPublisherAuth)}
          isValid={isValid}
          title={name || t('loading')}
          codeListId={codeListId}
          parentInfo={parentInfo}
          status={status}
          breadcrumbs={breadcrumbs}
          onBreadcrumbClick={handleBreadcrumbClick}
          handleEdit={handleEditClick}
          handlePublish={handleCSCPublish}
          handeSaveAndSendForApproval={handleCSCSaveAndSendForApproval}
          handleReturn={handleCSCSendForRework}
          handleSendForApproval={handleCSCSendForApproval}
          handleDelete={handleCSCDelete}
          handleSave={handleSave}
          handleSavePublish={handleCSCSavePublish}
          handleUnpublish={handleCSCUnpublish}
          handleNewVersion={handleNewVersion}
        />
        <CSMainInfo CSObject={cscObject} />
      </div>
      <Divider />
      <DetailsPageContext.Provider value={{ isValid, setIsValid }}>
        <CSCTabsContainer
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          data={data}
          headers={headers}
          setHeaders={setHeaders}
          parentId={parentId}
          isEditable={mode === codeListMode.edit && (isEditAuth || isPublisherAuth)}
          codeListId={codeListId}
          status={status}
          setColumnTypes={setColumnTypes}
          setColumnNames={setColumnNames}
          setTableData={setTableData}
          tableData={tableData}
          columnTypes={columnTypes}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </DetailsPageContext.Provider>
      <ConfirmModal
        name={name}
        validFrom={validFrom}
        status={modalStatus || 'Concept'}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        isVisible={isModalVisible || isPublishModalVis}
        setIsVisible={(value) => {
          setIsModalVisible(value);
          setIsPublishModalVis(value);
        }}
      />

      <CscFormModal
        presetName={name ?? ''}
        isVisible={isNewVersionModal}
        setIsVisible={setIsNewVersionModal}
        onSubmit={handleNewVersionSubmit}
        perviousDate={validFrom || ''}
        creationType={'edit'}
        state={data && 'payload' in data ? data.payload?.versionType : data?.versionType || ''}
        description={
          data && 'payload' in data ? data.payload?.description : data?.description || ''
        }
        parentGarants={
          data && 'payload' in data ? (data.payload?.garants.map((g) => g.fullName) ?? []) : []
        }
        parentEditors={
          data && 'payload' in data ? (data.payload?.editors.map((e) => e.fullName) ?? []) : []
        }
      />

      <FileUpload
        onFilesSelected={handleNewVersionFiles}
        limitLabel={t('fileUploadLimit')}
        dropLabel={t('fileUploadLabel')}
        isVisible={isNewVersionFileUploadModal}
        setIsVisible={() => setIsNewVersionFileUploadModal(false)}
        isUploaded={newVersionFiles.length === 0}
        isProcessing={isNewVersionProcessing}
        error={newVersionImportError}
        setIsAbleToContinue={(canContinue) => {
          if (canContinue) {
            processNewVersionByImport();
          } else {
            setIsNewVersionFileUploadModal(!canContinue);
          }
        }}
        onBack={handleFileUploadBack}
        isModal={true}
      />
    </div>
  );
};

export default DetailPage;
