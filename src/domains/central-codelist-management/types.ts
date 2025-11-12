export type Version = {
  id: string;
  name: string;
  versionType: string;
  description: string;
  validFrom: string;
  validTo: string | null;
};

export type Draft = {
  id: string;
  name: string;
  versionType: string;
  description: string;
  validFrom: string;
  validTo: string | null;
  state: string;
};

export type TableItem = {
  id: string;
  versions: Version[];
  drafts: Draft[];
};

export type TableRecord = Version & {
  codeListId: string;
  status: string[];
  isDraft: boolean;
  isDuplicate: boolean;
  isSubVersion?: boolean;
  draftCount?: number;
};

export type FilterOptions = {
  search: string;
  type: string[];
  state: string[];
  showSubconcepts: boolean;
};

export type SortDirection = 'asc' | 'desc' | 'none';
