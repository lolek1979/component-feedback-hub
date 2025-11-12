// @ts-nocheck
// TEMP! CHANGE PARSING DATA WHEN BE WILL BE READY!

/**
 * Returns the initials from a full name string.
 *
 * @param fullName - The full name to extract initials from.
 * @returns The initials (max 2 characters).
 */
const getInitials = (fullName: string | undefined) => {
  return fullName
    ? fullName
        .split(' ')
        .map((word) => word[0]?.toUpperCase() || '')
        .join('')
        .slice(0, 2)
    : '';
};

/**
 * Formats a date as 'D. M. YYYY'.
 *
 * @param date - The date to format.
 * @returns The formatted date string or '-' if invalid.
 */
const formatDateWithDots = (date: Date | string | null | undefined): string => {
  if (!date) return '-';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return '-';

  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();

  return `${day}. ${month}. ${year}`;
};

/**
 * Formats a date as 'D. M. YYYY HH:mm'.
 *
 * @param date - The date to format.
 * @returns The formatted date string.
 */
const formatDateWithTime = (date: Date | undefined): string => {
  if (!date) return '';

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}. ${month}. ${year} ${hours}:${minutes}`;
};

const formatter = new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK' });

/**
 * Formats a number as CZK currency.
 *
 * @param number - The number to format.
 * @returns The formatted currency string or the original value if undefined/null.
 */
const formatNumber = (number: number | undefined | null) => {
  if (number === undefined || number === null) return number;

  return formatter.format(number);
};

/**
 * Formats a number to two decimal places and replaces '.' with ','.
 *
 * @param number - The number to format.
 * @returns The formatted decimal string.
 */
const formatDecimal = (number: number | undefined): string => {
  const formatted = new Intl.NumberFormat('cs-CZ', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);

  return formatted;
};

/**
 * Formats a number with spaces as thousands separators.
 *
 * @param number - The number to format.
 * @returns The formatted string or null if input is invalid.
 */
const formatBigNumber = (number: number | undefined | null): string | null => {
  if (number === undefined || number === null) return null;

  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

/**
 * Formats a date in Czech language, e.g. 'pondělí 1. ledna 2024'.
 *
 * @param date - The date to format.
 * @returns The formatted Czech date string.
 */
const formatDateInCzech = (date: Date): string => {
  const days = ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'];

  const months = [
    'ledna',
    'února',
    'března',
    'dubna',
    'května',
    'června',
    'července',
    'srpna',
    'září',
    'října',
    'listopadu',
    'prosince',
  ];

  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName} ${day}. ${month} ${year}`;
};

/**
 * Creates a hidden iframe for printing purposes.
 *
 * @returns The created HTMLIFrameElement.
 */
const createPrintFrame = (): HTMLIFrameElement => {
  const frame = document.createElement('iframe');
  frame.style.position = 'fixed';
  frame.style.right = '0';
  frame.style.bottom = '0';
  frame.style.width = '0';
  frame.style.height = '0';
  frame.style.border = '0';
  frame.style.opacity = '0';

  return frame;
};

interface NavigatorUAData {
  platform: string;
  brands: Array<{
    brand: string;
    version: string;
  }>;
  mobile: boolean;
  getHighEntropyValues(hints: string[]): Promise<UADataValues>;
}

interface UADataValues {
  platform: string;
  platformVersion: string;
  architecture: string;
  model: string;
  uaFullVersion: string;
}

/**
 * Detects the browser name from the user agent string.
 *
 * @returns The browser name.
 */
const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  let browser = 'Unknown';

  if (ua.includes('Edg/')) browser = 'Edge';
  else if (ua.includes('OPR/') || ua.includes('Opera')) browser = 'Opera';
  else if (ua.includes('Firefox/')) browser = 'Firefox';
  else if (ua.includes('Chrome/')) browser = 'Chrome';
  else if (ua.includes('Safari/')) browser = 'Safari';
  else if (ua.includes('Trident/') || ua.includes('MSIE')) browser = 'Internet Explorer';
  else if (ua.includes('Samsung')) browser = 'Samsung Browser';

  return browser;
};

/**
 * Detects the operating system from the user agent string.
 *
 * @returns The operating system name.
 */
const getOSInfo = () => {
  const ua = navigator.userAgent;
  let os = 'Unknown';

  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'MacOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS';

  return os;
};

/**
 * Maps Windows NT version to user-friendly Windows version name.
 *
 * @param ntVersion - The NT version string.
 * @returns The Windows version name.
 */
const getWindowsVersion = (ntVersion: string): string => {
  const versions: Record<string, string> = {
    '10.0': 'Windows 11/10',
    '6.3': 'Windows 8.1',
    '6.2': 'Windows 8',
    '6.1': 'Windows 7',
    '6.0': 'Windows Vista',
    '5.2': 'Windows Server 2003/XP x64',
    '5.1': 'Windows XP',
    '5.0': 'Windows 2000',
  };

  return versions[ntVersion] || `Windows (NT ${ntVersion})`;
};

/**
 * Detects the operating system version using user agent data or string parsing.
 *
 * @returns A promise that resolves to the OS version string.
 */
const getOSVersion = async (): Promise<string> => {
  try {
    if ('userAgentData' in navigator) {
      const uaData = navigator.userAgentData as NavigatorUAData;
      const platformInfo = await uaData.getHighEntropyValues([
        'platformVersion',
        'platform',
        'architecture',
      ]);

      if (platformInfo.platform === 'Windows') {
        const ntVersion = platformInfo.platformVersion;

        return `${getWindowsVersion(ntVersion)} (Build ${ntVersion})`;
      }

      if (platformInfo.platformVersion) {
        return `${platformInfo.platform} ${platformInfo.platformVersion} ${platformInfo.architecture}`;
      }
    }

    const ua = navigator.userAgent;
    let version = 'Unknown';

    if (ua.includes('Windows')) {
      const match = ua.match(/Windows NT (\d+\.\d+)/);
      if (match) {
        const ntVersion = match[1];

        return getWindowsVersion(ntVersion);
      }
    } else if (ua.includes('Mac')) {
      const match = ua.match(/Mac OS X (\d+[._]\d+)/);
      if (match) version = match[1].replace('_', '.');
    } else if (ua.includes('Android')) {
      const match = ua.match(/Android (\d+\.\d+)/);
      if (match) version = match[1];
    } else if (/iPhone|iPad|iPod/.test(ua)) {
      const match = ua.match(/OS (\d+_\d+)/);
      if (match) version = match[1].replace('_', '.');
    }

    return version;
  } catch (error: unknown) {
    console.error('Error getting OS version:', error);

    return 'Version detection failed';
  }
};

/**
 * Gets the last two segments of the current URL path as a breadcrumb.
 *
 * @returns The breadcrumb string.
 */
const getBreadcrumb = () => {
  const path = window.location.pathname;
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) return 'Home';
  const relevantSegments = segments.slice(-2);

  return relevantSegments.join('/');
};

/**
 * Inserts soft hyphens into long words for better text wrapping.
 *
 * @param text - The text to hyphenate.
 * @param width - The max word length before hyphenation.
 * @returns The hyphenated text.
 */
const hyphenateText = (text: string, width = 20): string => {
  const words = text.split(' ');

  return words
    .map((word) => {
      if (word.length <= width) return word;

      let result = '';
      for (let i = 0; i < word.length; i += width - 1) {
        if (i > 0 && i < word.length) {
          result += '\u00AD';
        }
        result += word.substring(i, Math.min(i + width - 1, word.length));
      }

      return result;
    })
    .join(' ');
};

/**
 * Inserts line breaks into text at specified intervals.
 *
 * @param text - The text to process.
 * @param length - The max line length.
 * @returns The text with line breaks.
 */
const insertLineBreaks = (text: string, length = 20): string => {
  const hyphenatedText = hyphenateText(text);

  const regex = new RegExp(`(.{1,${length}})`, 'g');

  return hyphenatedText.match(regex)?.join('\n') || hyphenatedText;
};

/**
 * Removes multiple query parameters from a URL.
 *
 * @param url - The URL to process.
 * @param parametersToRemove - Array of parameter names to remove.
 * @returns The updated URL string.
 */
function removeMultipleQueryParameters(url: string, parametersToRemove: string[]): string {
  const urlObj = new URL(url);
  parametersToRemove.forEach((param) => {
    urlObj.searchParams.delete(param);
  });

  return urlObj.toString();
}

export {
  createPrintFrame,
  formatBigNumber,
  formatDateInCzech,
  formatDateWithDots,
  formatDateWithTime,
  formatDecimal,
  formatNumber,
  getBreadcrumb,
  getBrowserInfo,
  getInitials,
  getOSInfo,
  getOSVersion,
  getWindowsVersion,
  insertLineBreaks,
  removeMultipleQueryParameters,
};
