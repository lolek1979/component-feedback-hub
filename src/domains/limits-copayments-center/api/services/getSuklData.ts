import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

import { GetSuklDataParams } from '../query/useSuklData';

type Validation = Record<string, never>;

type Field = {
  index: number;
  code: string;
  name: string;
  description: string;
  valueType: 'String' | 'Decimal' | 'DateTime';
  default: string;
  validations: Validation[];
};

type Structure = {
  structGuid: string;
  version: string;
  name: string;
  fields: Field[];
};

type DataRow = [
  string, // insuredId
  string, // ID_Dokladu_ERP
  string, // ID_Dokladu_Vydej
  string, // IdVlp
  string, // ZapocitatelnyDoplatek
  string, // ZapocitatelnyDoplatekPacient
  string, // ZapocitatelnyDoplatekZP
  string, // ZbytekDoLimitu
  string, // Limit
  string, // Zalozeni
  string, // Zmena
  string, // DatumCasZruseni
  string, // DuvodZruseni
  string, // VydPzsAdresaCo
  string, // VydPzsAdresaCp
  string, // VydPzsAdresaObec
  string, // VydPzsAdresaPsc
  string, // VydPzsAdresaUlice
  string, // VydPzsNazev
  string, // VydLekNazev
];

type Payload = {
  insuredId: string;
  data: {
    structure: Structure;
    data: DataRow[];
  };
  totalCount: number;
};

export type SuklDataResponse = {
  state: string; // or other states if applicable
  messages: [
    {
      severity: string;
      code: string;
      data: {
        Description: string;
      };
    },
  ];
  payload: Payload;
  error?: {
    status: number | string;
    message: string;
  };
};

export const getSuklData = async (params: GetSuklDataParams): Promise<SuklDataResponse | null> => {
  const queryParams = {
    ...(params.year && { yr: params.year }),
    ...(params.month && { month: params.month }),
    ...(params.limit && { pgSize: params.limit }),
    ...(params.skip && { skip: params.skip }),
    ...(params.searchFilter && { searchFilter: params.searchFilter }),
  };

  const result = await axiosInstance
    .get(
      `integration-sukl/api/rest/v${API_VERSION}/sukl-cuer-data/${params.insuranceNum}/creditable-surcharges`,
      {
        params: queryParams,
      },
    )
    .then((res) => {
      const result = res?.data;

      if (result.state !== 0 && !result.payload) {
        return {
          state: 'Error',
          error: {
            status: result.messages?.[0].code,
            message: result.messages?.[0]?.data?.Description,
          },
          messages: result.messages,
          payload: null,
        };
      }

      return result || null;
    })
    .catch((error) => {
      return {
        state: 'Error',
        error: {
          status: error.status,
          message: error.response.data.message || error.response.data?.messages?.[0].code,
        },
        messages: [error.message],
        payload: null,
      };
    });

  return result;
};
