import { API_VERSION, axiosInstance } from '@/core/api/axiosInstance';

import { useCodeListBycodeParams } from '../query/useCodeListBycode';

/** Represents a single field in the code list structure */
interface Field {
  code: string; // Field code
  name: string; // Field name
  index: number; // Position index in the structure
  length: number; // Length of the field
  default: string; // Default value
  valueType: number; // Type of value (e.g., string, number)
  valueFormat: string; // Format of the value
  description: string; // Description of the field
  validations: undefined[]; // Validation rules (currently undefined)
}

/** Structure of the code list, including its fields */
interface Structure {
  name: string; // Name of the structure
  fields: Field[]; // Array of fields in the structure
}

/** User information used for garants and editors */
interface Users {
  id: string; // User ID
  abbrev: string; // Abbreviation of the user's name
  fullName: string; // Full name of the user
  mail: string; // Email address
  department: string; // Department name
  businessPhones: string[]; // List of business phone numbers
}

/** Content of the code list, including data and structure */
interface Content {
  data: string[][]; // 2D array of data rows
  structure: Structure; // Structure definition of the data
}

/** Response model for the code list fetched by code */
export interface CodeListBycodeResponse {
  id: string; // Unique ID of the code list version
  codeListId: string; // ID of the code list
  name: string; // Name of the code list
  description: string; // Description of the code list
  validFrom: string; // Validity start date
  garants: Users[]; // List of guarantors
  editors: Users[]; // List of editors
  content: Content;
  versionType: string;
}

/**
 * Sends a POST request to fetch a code list by its code and optional time.
 * @param params - Parameters including code and optional time
 * @returns CodeListBycodeResponse or null if the request fails
 */
export const postCodeListBycode = async (
  params: useCodeListBycodeParams,
): Promise<CodeListBycodeResponse | null> => {
  const queryParams = {
    ...(params.time && { time: params.time }),
    ...{ code: params.code },
  };

  const result = await axiosInstance
    .post(
      `codelists/api/rest/v${API_VERSION}/codelists/bycode`,
      {},
      {
        params: queryParams,
      },
    )
    .then((res) => {
      return res.data as CodeListBycodeResponse;
    })
    .catch(() => {
      return null;
    });

  return result;
};
