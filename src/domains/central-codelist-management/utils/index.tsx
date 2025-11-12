import { codeListMode, CodeListStatus, codeListStatus } from '@/core/lib/definitions';
import { SortDirection } from '@/core/utils/types';
import { TableRowType } from '@/design-system/molecules/Table';
import { RowAction, RowValues } from '@/domains/central-codelist-management/stores/cscDataStore';

import { CodeListByIdResponse, tCodelistResponse } from '../api/services';
import { DraftsByIdResponse } from '../api/services/getDraftsById';
import { FilterOptions, TableItem, TableRecord } from '../types';

type ConvertArrayToObjectsParams = {
  keys: string[];
  data: string[][];
};

const extractCodeListData = (
  data: CodeListByIdResponse | DraftsByIdResponse | null | TableRowType[],
) => {
  if (!data) return { rows: [], keys: [], fields: [] };

  if ('payload' in data && data.payload?.content) {
    const structure = data.payload.content.structure ?? {};
    const fields = structure.fields ?? [];
    const content = data.payload.content.data ?? [];

    // If we have fields with structure, use them
    if (fields.length > 0) {
      return {
        rows: content,
        keys: [...fields].sort((a, b) => a.index - b.index).map((field) => field.name) ?? [],
        fields: fields ?? [],
      };
    }

    // If we only have content without structure (CSV import without XML), generate keys from content
    if (content.length > 0 && fields.length === 0) {
      const firstRow = content[0];
      const generatedKeys = firstRow ? firstRow.map((_, index) => `${index + 1}`) : [];

      return {
        rows: content,
        keys: generatedKeys,
        fields: [],
      };
    }

    return {
      rows: content,
      keys: [...fields].sort((a, b) => a.index - b.index).map((field) => field.name) ?? [],
      fields: fields ?? [],
    };
  }

  if ('content' in data) {
    const structure = data.structure ?? {};
    const fields = structure.fields ?? [];
    const content = data.content ?? [];

    // If we have fields with structure, use them
    if (fields.length > 0) {
      return {
        rows: content,
        keys: [...fields].sort((a, b) => a.index - b.index).map((field) => field.name) ?? [],
        fields: fields ?? [],
      };
    }

    // If we only have content without structure (CSV import without XML), generate keys from content
    if (content.length > 0 && fields.length === 0) {
      const firstRow = content[0];
      const generatedKeys = firstRow ? firstRow.map((_, index) => `${index + 1}`) : [];

      return {
        rows: content,
        keys: generatedKeys,
        fields: [],
      };
    }

    return {
      rows: content,
      keys: [...fields].sort((a, b) => a.index - b.index).map((field) => field.name) ?? [],
      fields: fields ?? [],
    };
  }

  return { rows: [], keys: [], fields: [] };
};

const filterParent = (parentData: tCodelistResponse) => {
  const currDate = new Date();

  return parentData
    .map((item) => ({
      ...item,
      versions: item.versions?.filter((version) => {
        const isActive = new Date(version.validFrom) <= currDate;
        const isPlanned = new Date(version.validFrom) > currDate && version.validTo === null;

        return isActive || isPlanned;
      }),
    }))
    .filter((item) => item.versions?.length > 0)
    .map((item) =>
      item.versions.map((version) => ({
        name: version.name,
        validFrom: version.validFrom,
        id: version.id,
        status: new Date(version.validFrom) <= currDate ? 'active' : 'planned',
      })),
    )
    .flat();
};

const getCSCBreadcrumbs = (
  t: (key: string) => string,
  parentId: string,
  parentResult: Record<string, string>[],
  codeListId: string,
  data: CodeListByIdResponse | DraftsByIdResponse | null,
  status?: CodeListStatus,
) => {
  const activeVersion = parentResult.find((item) => item.status === codeListStatus.active);
  const plannedVersion = parentResult.find((item) => item.status === codeListStatus.planned);

  if (
    (status === codeListStatus.concept && parentResult[0]) ||
    (status === codeListStatus.planned && activeVersion) ||
    (status === codeListStatus.approval && parentResult[0])
  ) {
    return [
      { value: 'Centrální správa číselníků', link: '/centralni-sprava-ciselniku' },
      {
        value: activeVersion?.name || plannedVersion?.name || '',
        link: `/centralni-sprava-ciselniku/${activeVersion?.id || plannedVersion?.id || ''}?parent=${parentId}&mode=${codeListMode.read}`,
      },
      {
        value: data && 'payload' in data ? data.payload?.name : data?.name || t('loading'),
        link: `/centralni-sprava-ciselniku/${codeListId}?parent=${parentId}&mode=${codeListMode.read}`,
      },
    ];
  }

  return [
    { value: 'Centrální správa číselníků', link: '/centralni-sprava-ciselniku' },
    {
      value: data && 'payload' in data ? data.payload?.name : data?.name || t('loading'),
      link: `/centralni-sprava-ciselniku/${codeListId}?parent=${parentId}&mode=${codeListMode.read}`,
    },
  ];
};

const getCSCParentInfo = (
  parentId: string,
  parentResult: Record<string, string>[],
  status?: CodeListStatus,
) => {
  const activeVersion = parentResult.find((item) => item.status === codeListStatus.active);
  const plannedVersion = parentResult.find((item) => item.status === codeListStatus.planned);

  if (
    (status === codeListStatus.concept && parentResult[0]) ||
    (status === codeListStatus.planned && activeVersion) ||
    (status === codeListStatus.approval && parentResult[0])
  ) {
    return {
      title: activeVersion?.name || plannedVersion?.name || '',
      validFrom: activeVersion?.validFrom || plannedVersion?.validFrom || '',
      link: `/centralni-sprava-ciselniku/${activeVersion?.id || plannedVersion?.id || ''}?parent=${parentId}`,
    };
  }
};

const getCSCObject = (
  data: CodeListByIdResponse | DraftsByIdResponse | null,
  codeListId: string,
) => {
  return {
    title: data && 'payload' in data ? data.payload?.name : data?.name || '',
    id: codeListId,
    guarantors: data && 'payload' in data ? data.payload?.garants : data?.garants || [],
    editors: data && 'payload' in data ? data.payload?.editors : data?.editors || [],
    validFrom:
      data && 'payload' in data && data.payload?.validFrom
        ? new Date(data.payload?.validFrom)
        : data && 'validFrom' in data
          ? new Date(data.validFrom)
          : undefined,
    types: data && 'payload' in data ? data.payload?.versionType : data?.versionType || '',
  };
};

const processTableData = (items: TableItem[], showSubconcepts: boolean): TableRecord[] => {
  const currentDate = new Date();

  const records: TableRecord[] = [];

  items.forEach((item) => {
    const activeVersion = item.versions?.find(
      (version) => new Date(version.validFrom) <= currentDate,
    );
    const activeVersionsList = item.versions?.filter(
      (version) => new Date(version.validFrom) <= currentDate,
    );

    const plannedVersionsList = item.versions?.filter(
      (version) => new Date(version.validFrom) > currentDate,
    );

    const isSubVersion = activeVersionsList.length > 0 && plannedVersionsList.length > 0;

    const plannedVersions: TableRecord[] = [];

    item.versions?.forEach((version) => {
      const validFrom = new Date(version.validFrom);
      const validTo = version.validTo ? new Date(version.validTo) : null;
      const status: string[] = [];

      if (validTo && currentDate > validTo) {
        status.push('expired');
      } else if (currentDate >= validFrom) {
        status.push('active');
      } else {
        status.push('planned');
      }

      const draftCount = status.includes('active') || !isSubVersion ? item.drafts.length : 0;

      const record = {
        codeListId: item.id,
        ...version,
        status,
        isDraft: false,
        isDuplicate: version !== activeVersion,
        isSubVersion: isSubVersion,
        draftCount: draftCount > 0 ? draftCount : undefined,
      };

      if (status.includes('planned')) {
        plannedVersions.push(record);
      } else if (!status.includes('expired')) {
        records.push(record);
      }
    });

    if (showSubconcepts || item.versions.length === 0) {
      records.push(...plannedVersions);
      item.drafts?.forEach((draft) => {
        const draftStatus =
          draft.state === 'WaitingForApproval' ? ['waitingForApproval'] : ['concept'];
        records.push({
          codeListId: item.id,
          ...draft,
          status: draftStatus,
          isDraft: true,
          isDuplicate: item.versions.length > 0,
          draftCount: undefined,
        });
      });
    }

    // Add planned versions after active versions
    !showSubconcepts && records.push(...plannedVersions);
  });

  return records;
};

const filterRecords = (records: TableRecord[], filters: FilterOptions): TableRecord[] => {
  return records.filter((record) => {
    const normalize = (str: string) =>
      str
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase();

    const matchesSearch =
      !filters.search || normalize(record.name).includes(normalize(filters.search));

    const typeMap: { [key: string]: string } = {
      Interní: 'Internal',
      'Interní - Placený': 'InternalPaid',
      'Interní - Veřejný': 'InternalPublic',
      Externí: 'External',
    };

    const stateMap: { [key: string]: string } = {
      Aktivní: 'active',
      Plánovaný: 'planned',
      Koncept: 'concept',
      WaitingApproval: 'waitingforapproval',
      Vypršený: 'expired',
    };

    const matchesType =
      !filters.type ||
      (Array.isArray(filters.type)
        ? filters.type.length === 0 ||
          filters.type.some((type) => record.versionType === typeMap[type])
        : record.versionType === typeMap[filters.type]);

    const matchesState =
      !filters.state ||
      (Array.isArray(filters.state)
        ? filters.state.length === 0 ||
          record.status.some((s) =>
            filters.state.some((state) => s.toLowerCase() === stateMap[state]?.toLowerCase()),
          )
        : record.status.some((s) => {
            if (typeof filters.state === 'string') {
              return s.toLowerCase() === stateMap[filters.state]?.toLowerCase();
            }

            return false;
          }));

    return matchesSearch && matchesType && matchesState;
  });
};

const paginateRecords = (records: TableRecord[], page: number, pageSize: number) => {
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;

  return records.slice(startIndex, endIndex);
};

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const sortRecords = (
  records: TableRecord[],
  column: keyof TableRecord,
  direction: SortDirection,
): TableRecord[] => {
  if (direction === 'none') return records;

  return [...records].sort((a, b) => {
    const aValue = a[column] ?? '';
    const bValue = b[column] ?? '';

    const compareResult = aValue
      .toString()
      .localeCompare(bValue.toString(), 'cs', { sensitivity: 'base' });

    return direction === 'asc' ? compareResult : -compareResult;
  });
};

const handleColumnVisibilityChange = (
  setVisibleColumns: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>,
  excludedKeys: string[],
  objectKeys: Record<string, string>[],
) => {
  setVisibleColumns((prev) => {
    const newColumns = { ...prev };
    objectKeys.forEach((key) => {
      newColumns[key.value] = !excludedKeys.includes(key.value);
    });

    return newColumns;
  });
};

function convertArrayToObjects<T>({ keys, data }: ConvertArrayToObjectsParams): T[] {
  if (!keys || !Array.isArray(keys)) {
    throw new Error('Keys must be a non-empty array');
  }

  return data.map((row) => {
    return keys.reduce(
      (obj, key, index) => {
        obj[key] = row[index];

        return obj;
      },
      {} as Record<string, string>,
    );
  }) as T[];
}

function convertObjectsToArray(objects: TableRowType[]): string[][] {
  if (!Array.isArray(objects) || objects.length === 0) {
    return [];
  }

  const keys: string[] = [];
  objects.forEach((obj) => {
    for (const key in obj) {
      if (!keys.includes(key)) {
        keys.push(key);
      }
    }
  });
  const result = objects.map((obj) => keys.map((key) => String(obj[key])));

  return [keys, ...result];
}

const extractTableData = (data: CodeListByIdResponse | DraftsByIdResponse | TableRowType[]) => {
  if (!data) return { rows: [], keys: [], fields: [] };

  if ('payload' in data && data.payload?.content) {
    const structure = data.payload.content.structure ?? {};
    const fields = structure.fields ?? [];

    return {
      rows: data.payload.content.data ?? [],
      keys: fields.map((field) => field.name) ?? [],
      fields: fields ?? [],
    };
  }

  if ('content' in data) {
    const structure = data.structure ?? {};
    const fields = structure.fields ?? [];

    return {
      rows: data.content ?? [],
      keys: fields.map((field) => field.name) ?? [],
      fields: fields ?? [],
    };
  }

  return { rows: [], keys: [], fields: [] };
};

const groupActions = (actions: RowAction[]) => {
  const batches: Array<{ type: string; actions: RowAction[] }> = [];
  let currentBatch: { type: string; actions: RowAction[] } | null = null;

  for (const action of actions) {
    if (!currentBatch || currentBatch.type !== action.type) {
      currentBatch = { type: action.type, actions: [action] };
      batches.push(currentBatch);
    } else {
      currentBatch.actions.push(action);
    }
  }

  return batches;
};

const groupStructureActions = <T extends { type: string }>(actions: T[]) => {
  const batches: Array<{ type: string; actions: T[] }> = [];
  let currentBatch: { type: string; actions: T[] } | null = null;

  for (const action of actions) {
    if (!currentBatch || currentBatch.type !== action.type) {
      currentBatch = {
        type: action.type,
        actions: [action],
      };
      batches.push(currentBatch);
    } else {
      currentBatch.actions.push(action);
    }
  }

  return batches;
};
const getRowValuesWithoutId = (rowObj: RowValues): string[] => {
  const values: string[] = [];
  for (const key in rowObj) {
    if (key !== 'rowId') {
      values.push(rowObj[key] as string);
    }
  }

  return values;
};

export {
  capitalizeFirstLetter,
  convertArrayToObjects,
  convertObjectsToArray,
  extractCodeListData,
  extractTableData,
  filterParent,
  filterRecords,
  getCSCBreadcrumbs,
  getCSCObject,
  getCSCParentInfo,
  getRowValuesWithoutId,
  groupActions,
  groupStructureActions,
  handleColumnVisibilityChange,
  paginateRecords,
  processTableData,
  sortRecords,
};
