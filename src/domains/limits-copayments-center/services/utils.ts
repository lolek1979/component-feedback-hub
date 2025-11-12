// @ts-nocheck
// TEMP! CHANGE PARSING DATA WHEN BE WILL BE READY!

import { GetSuklDataParams } from '../api/query/useSuklData';
import { SuklDataResponse } from '../api/services/getSuklData';
import { ComplaintStatus } from '../components/LimitsCopaymentsTable/LimitsCopaymentsTable';

export const DISPLAY_COLUMNS = {
  ID_DOKLADU_VYDEJ: 2,
  ID_VLP: 3,
  ZAPOCITATELNY_DOPLATEK: 4,
  ZAPOCITATELNY_DOPLATEK_PACIENT: 5,
  ZAPOCITATELNY_DOPLATEK_ZP: 6,
  ZBYTEK_DO_LIMITU: 7,
} as const;

export interface MonthTable {
  date: string;
  eRecept: string;
  limit: number;
  total: Array<string> | null;
  rows: Array<Array<string>>;
}

export interface TMonthData {
  monthLimit: number;
  monthTables: Array<MonthTable>;
  beforeMonthLimit?: number | null;
}

export type TGroupedData = {
  [key: string]: TMonthData;
};

function groupByMonth(data, index) {
  const result = data.reduce((acc, row) => {
    const date: string = row[index];
    const month: string = date.split('-')[1].replace(/^0+/, '');
    if (!acc[month]) {
      acc[month] = {
        tableData: [],
      };
    }

    acc[month].tableData.push(row);

    return acc;
  }, {});

  return result;
}

const groupByDate = (data) => {
  const result = {};

  Object.keys(data).forEach((month) => {
    // 1 - group rows by date
    const dateIndex = 9;
    const grouped = data[month].tableData.reduce((acc, item) => {
      const primaryKey = item[dateIndex];
      if (!acc[primaryKey]) {
        acc[primaryKey] = {
          rows: [],
          total: null,
          eRecept: null,
          limit: null,
        };
      }
      acc[primaryKey].rows.push(item);
      acc[primaryKey].eRecept = item[1];
      acc[primaryKey].limit = item[8];
      acc[primaryKey].lastPayment = item[7];

      return acc;
    }, {});

    // 2 - if date has more than one row - calculate total
    Object.keys(grouped).forEach((date) => {
      if (grouped[date].rows.length > 1) {
        // Najdi řádek s nejmenší hodnotou v row[7]
        const minRow = grouped[date].rows.reduce((min, row) => (+row[7] < +min[7] ? row : min));

        // Sestav total podle původní struktury
        grouped[date].total = [
          minRow[2], // Výdej
          grouped[date].rows.length, // Počet položek
          grouped[date].rows.reduce((sum, row) => sum + +row[4], 0), // Započitatelné doplatky celkem (sum)
          grouped[date].rows.reduce((sum, row) => sum + +row[5], 0), // Doplatky hrazené pojištěncem (sum)
          grouped[date].rows.reduce((sum, row) => sum + +row[6], 0), // Doplatky hrazené pojišťovnou (sum)
          +minRow[7], // Zbývá do limitu
        ];
      }
    });

    // 3 - sort from newest date to oldest date and normalize object to array

    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

    const monthTables = [];
    sortedDates.forEach((date) => {
      monthTables.push({
        date: date,
        eRecept: grouped[date].eRecept,
        limit: grouped[date].limit,
        total: grouped[date].total,
        rows: grouped[date].rows,
      });
    });
    result[month] = {
      monthLimit: monthTables[0].limit,
      monthTables,
    };
  });

  return result;
};

function addBeforeMonthLimit(data) {
  const keys = Object.keys(data).sort((a, b) => Number(a) - Number(b));

  keys.forEach((key, index) => {
    if (index === 0) {
      data[key].beforeMonthLimit = null; // The first month has no previous one.
    } else {
      const previousKey = keys[index - 1];
      data[key].beforeMonthLimit = data[previousKey].monthLimit;
    }
  });

  return data;
}

const parseKDPresults = (data: SuklDataResponse['rows']): TGroupedData => {
  // 1 - group by Mounths
  const grouppedDataByMounth = groupByMonth(data, 9);

  // 2 - group rows by date
  const grouppedDataByDate = groupByDate(grouppedDataByMounth);

  // 3 - add before month limit
  const result = addBeforeMonthLimit(grouppedDataByDate);

  return result;
};

const mergeKDPObjects = (obj1: TGroupedData, obj2: TGroupedData): TGroupedData => {
  const result: TGroupedData = { ...obj1 };

  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (result[key]?.monthTables && obj2[key]?.monthTables) {
        // Merge monthTables and remove duplicates by `date`
        const combinedTables = [...result[key].monthTables, ...obj2[key].monthTables];

        const uniqueTables = combinedTables.filter(
          (table, index, self) => index === self.findIndex((t) => t.date === table.date),
        );

        result[key].monthTables = uniqueTables;
      } else {
        // If there is no key or it does not require merging arrays, we rewrite
        result[key] = obj2[key];
      }
    }
  }

  return result;
};

const getPeriod = (year: number, month?: number | null): string => {
  if (!month) {
    // If the month is not specified, we return the whole year
    return `1. 1. ${year} - 31. 12. ${year}`;
  }

  // Determine the number of days in a month
  const daysInMonth = new Date(year, month, 0).getDate();

  return `1. ${month}. ${year} - ${daysInMonth}. ${month}. ${year}`;
};
const buildQueryParams = (params: GetSuklDataParams): string => {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&');
};

const createLoadingIndicator = (t?: (key: string) => string): HTMLDivElement => {
  const indicator = document.createElement('div');
  indicator.style.position = 'fixed';
  indicator.style.top = '50%';
  indicator.style.left = '50%';
  indicator.style.transform = 'translate(-50%, -50%)';
  indicator.style.background = 'rgba(255, 255, 255, 0.9)';
  indicator.style.padding = '20px';
  indicator.style.borderRadius = '8px';
  indicator.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
  indicator.style.zIndex = '9999';
  indicator.innerHTML = `
    <div style="text-align: center;">
      <div style="width: 30px; height: 30px; border: 3px solid #eee;
           border-top: 3px solid #3498db; border-radius: 50%;
           margin: 0 auto 10px; animation: spin 1s linear infinite;"></div>
      <div>${t('printingLoading')}</div>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;

  return indicator;
};

const getStatusVariant = (status: ComplaintStatus): string => {
  const statusMap: Record<ComplaintStatus, string> = {
    registered: 'waitingforapproval',
    cancelled: 'denied',
    resolved: 'active',
    'in-progress': 'concept',
  };

  return statusMap[status];
};

const getStatusLabel = (status: ComplaintStatus): string => {
  const labelMap: Record<ComplaintStatus, string> = {
    registered: 'Registrováno',
    cancelled: 'Stornováno',
    resolved: 'Vyřízeno',
    'in-progress': 'V řešení',
  };

  return labelMap[status];
};

const VZP_ERROR_CODES = ['SUK-10001', 'SUK-10002'];

export const getErrorMessage = (
  error?: {
    status: string | number;
    message?: string;
    description?: string;
  },
  tErrors?: (key: string) => string,
) => {
  if (!error || !tErrors) return tErrors?.('errorData') || 'Error occurred';

  const status = error.status || '';

  if (status === 403) return tErrors('forbiddenError');
  if (status === 500 || status === 502 || status === 504) return tErrors('badGatewayError');
  if (VZP_ERROR_CODES.includes(String(status))) return tErrors('noVZPError');

  // For other errors, display status code: message format
  if (error.message) return `${status}: ${error.message}`;
  if (error.description) return `${status}: ${error.description}`;

  return tErrors('errorData');
};

export const showRetryButton = (error?: { status: string | number }) => {
  if (!error) return false;

  const status = error.status || '';

  return status === 500 || status === 502 || status === 504;
};

const APPLICANT_NAME_REGEX = /[^a-zA-ZÀ-ž\s]/g;

export {
  APPLICANT_NAME_REGEX,
  buildQueryParams,
  createLoadingIndicator,
  getPeriod,
  getStatusLabel,
  getStatusVariant,
  mergeKDPObjects,
  parseKDPresults,
};
