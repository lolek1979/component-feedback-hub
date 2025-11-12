import { SuklLimitsResponse } from '../../api/services/getSuklLimits';
import { TGroupedData } from '../../services/utils';

type TranslationFunction = (key: string, values?: Record<string, string | number>) => string;

export interface FeesPageProps {
  suklData: TGroupedData;
  period: string;
  translations: {
    t: TranslationFunction;
    tKDPResultHeader: TranslationFunction;
    tTable: TranslationFunction;
    tErrors: TranslationFunction;
  };
  suklLimits?: SuklLimitsResponse;
  insuranceNum: string;
  hasToPayTotal?: number;
  downloadDate: string;
  sumInsuer: number;
  sumVZP: number;
  year: number;
  dayLimitReached: string;
  noDataMessage: boolean;
  isFormerVZPClient: boolean;
  formerVZPMessage: string | null;
  onDownload: () => void;
  onPrint: (orientation: 'portrait' | 'landscape') => void;
  selectedYear: string;
  selectedMonth: string;
  searchQuery: string;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
  onSearchChange: (query: string) => void;
}
