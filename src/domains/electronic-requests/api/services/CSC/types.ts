import { CategoryType, UserPublicInfoModel } from '../types';

export interface GetRequestCSCUsersResponse {
  payload: {
    total: number;
    items: UserPublicInfoModel[];
  };
  state: string;
  messages: Array<{
    severity: string;
    code: string;
    data: Record<string, string>;
  }>;
}

export interface CSCAddress {
  id: string;
  code: string;
  description: string;
}

export interface GetRequestCSCAddressesResponse {
  payload: {
    total: number;
    items: CSCAddress[];
  };
  state: string;
  messages: Array<{
    severity: string;
    code: string;
    data: Record<string, string>;
  }>;
}

export interface AttachmentModal {
  id: string;
  fileName: string;
}

export interface CategoryDetailModal {
  id: string;
  description?: string;
  categoryType: CategoryType;
  parentCategoryId?: string;
}

export interface CSCCatalogueItem {
  id: string;
  description: string;
  category: CategoryDetailModal;
  sapNumber: string;
  supplierArticleNumber: string;
  unitOfMeasure: string;
  unitPrice: number;
  isFavorite: boolean;
  contract: string;
  externalUrl: string;
  attachments?: AttachmentModal[];
}

export interface GetRequestCSCCatalogueResponse {
  payload: {
    total: number;
    items: CSCCatalogueItem[];
  };
  state: string;
  messages: Array<{
    severity: string;
    code: string;
    data: Record<string, string>;
  }>;
}

export interface CSCCategory {
  id: string;
  description: string;
  categoryType: CategoryType;
}

export interface GetRequestCSCCategoriesResponse {
  payload: {
    total: number;
    items: CSCCategory[];
  };
  state: string;
  messages: Array<{
    severity: string;
    code: string;
    data: Record<string, string>;
  }>;
}

export interface UseRequestCSCOptions {
  skip?: number | null;
  take?: number | null;
  fulltextSearch?: string | null;
  enabled?: boolean;
}
