import { axiosInstanceGraph } from '../axiosInstance';

/**
 * Fetches the current user's profile photo from Microsoft Graph API.
 *
 * @returns A promise that resolves to an object URL string for the user's photo, or `null` if not available or on error.
 *
 * @example
 * const photoUrl = await getUserPhoto();
 * if (photoUrl) {
 *   // Use photoUrl as the src for an <img> element
 * }
 *
 * @see {@link https://learn.microsoft.com/en-us/graph/api/profilephoto-get}
 */
export const getUserPhoto = async (): Promise<string | null> => {
  const result = await axiosInstanceGraph
    .get(`/me/photo/$value`, {
      responseType: 'blob',
    })
    .then((res) => {
      const responseBlob = res?.data;
      if (!responseBlob) {
        return null;
      }
      const photoObjectUrl = URL.createObjectURL(responseBlob);

      return photoObjectUrl;
    })
    .catch(() => {
      return null;
    });

  return result;
};
