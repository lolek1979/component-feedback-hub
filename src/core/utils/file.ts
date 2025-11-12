/**
 * Returns the file extension from a file name.
 *
 * @param fileName - The name of the file.
 * @returns The file extension in lowercase, or `undefined` if not found.
 *
 * @example
 * const ext = getFileExtension('document.pdf'); // 'pdf'
 */
export const getFileExtension = (fileName: string): string | undefined => {
  return fileName.split('.').pop()?.toLowerCase();
};

/**
 * Truncates a file name to a specified maximum length, preserving the extension.
 *
 * If the file name exceeds the max length, it is shortened and '...' is added before the extension.
 *
 * @param fileName - The name of the file to truncate.
 * @param maxLength - The maximum allowed length (default: 50).
 * @returns The truncated file name.
 *
 * @example
 * const shortName = truncateFileName('verylongfilename.txt', 10); // 'verylo...txt'
 */
export const truncateFileName = (fileName: string, maxLength: number = 50): string => {
  if (fileName.length <= maxLength) return fileName;

  const extension = fileName.split('.').pop();
  const nameWithoutExtension = fileName.slice(0, fileName.lastIndexOf('.'));

  const truncatedName = nameWithoutExtension.slice(0, maxLength - extension!.length - 3);

  return `${truncatedName}...${extension}`;
};
