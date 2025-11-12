import { IPublicClientApplication } from '@azure/msal-browser';

import { getCurrentToken } from '../../auth/tokenFetcher';
import { axiosInstance } from '../axiosInstance';

/**
 * Parameters for sending feedback to the Feedback Hub API.
 */
export type SendFeedbackHubParams = {
  ReportTime: string;
  UserIdentifier: string;
  Title?: string;
  Description: string;
  FeedBackData?: string;
  Url?: string;
  Attachments: string[];
  Browser: string;
  BrowserVersion: string;
  OperatingSystem: string;
  VersionOfOperatingSystem: string;
  FrontendUrl?: string;
  UserName: string;
};

/**
 * Response from the Feedback Hub API after sending feedback.
 */
export type SendFeedbackHubResponse = {
  success: boolean;
  message?: string;
};

/**
 * Sends feedback data to the Feedback Hub API.
 *
 * @param params - The feedback data to send.
 * @param msalInstance - The MSAL public client application instance for authentication.
 * @returns A promise that resolves to a {@link SendFeedbackHubResponse} object.
 *
 * @throws Will throw an error if the access token cannot be retrieved.
 *
 * @example
 * const response = await sendFeedbackHub(feedbackParams, msalInstance);
 * if (response.success) {
 *   // Handle success
 * }
 *
 * @see {@link SendFeedbackHubParams}
 * @see {@link SendFeedbackHubResponse}
 */
export const sendFeedbackHub = async (
  params: SendFeedbackHubParams,
  msalInstance: IPublicClientApplication,
): Promise<SendFeedbackHubResponse> => {
  const token = await getCurrentToken(msalInstance);

  if (!token) {
    throw new Error('Failed to get access token');
  }

  const formData = new FormData();

  for (const [key, value] of Object.entries(params)) {
    if (key === 'Attachments') continue;
    if (value !== undefined && value !== null) {
      formData.append(key, value as string);
    }
  }

  if (params.Attachments && params.Attachments.length > 0) {
    params.Attachments.forEach((attachment, index) => {
      if (attachment.startsWith('data:image')) {
        const blob = base64ToBlob(attachment);
        formData.append(`Attachments`, blob, `screenshot-${index}.png`);
      } else {
        formData.append(`Attachments`, attachment);
      }
    });
  }

  const response = await axiosInstance.post('feedback-hub/api/rest/v1/feedbackhub', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

/**
 * Converts a base64-encoded image string to a Blob object.
 *
 * @param base64 - The base64-encoded image string.
 * @returns A Blob representing the image.
 *
 * @internal
 */
const base64ToBlob = (base64: string): Blob => {
  const parts = base64.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
};
