/**
 * Validates a Czech social security number (rodné číslo).
 *
 * Supports both 9-digit (born in or before 1954) and 10-digit (born after 1954) formats.
 * Applies official rules from CSSZ, including checks for valid date segments and divisibility by 11.
 *
 * @param value - The social security number string to validate.
 * @returns `true` if the number is valid, otherwise `false`.
 *
 * @see {@link https://www.cssz.cz/standardni-kontrola-rodneho-cisla-a-evidencniho-cisla-pojistence}
 *
 * @example
 * const isValid = validateSocialSecurityNumber('8501011234'); // true or false
 */

// Provide at least one export so TypeScript treats this file as a module.
// Based on the official guidelines from CSSZ:
// https://www.cssz.cz/standardni-kontrola-rodneho-cisla-a-evidencniho-cisla-pojistence
const validateSocialSecurityNumber = (value: string): boolean => {
  // 9-digit format is only valid for people born in or before 1954
  if (/^\d{9}$/.test(value)) {
    const year = parseInt(value.slice(0, 2));
    let month = parseInt(value.slice(2, 4));
    let day = parseInt(value.slice(4, 6));

    // For 9-digit numbers, we always add 1900 since it's only for people born in or before 1954
    const fullYear = 1900 + year;

    // Must be born in or before 1954
    if (fullYear > 1954) return false;

    if (month > 50) {
      month -= 50;
    }

    if (day > 50) {
      day -= 50;
    }

    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    return true;
  }

  // 10-digit format is for people born after 1954
  if (/^\d{10}$/.test(value)) {
    const year = parseInt(value.slice(0, 2));
    let month = parseInt(value.slice(2, 4));
    let day = parseInt(value.slice(4, 6));

    // For years 00-99:
    // - If year is 54 or less (00-54), add 2000 (2000-2054)
    // - If year is 55 or more (55-99), add 1900 (1955-1999)
    const fullYear = year + (year <= 54 ? 2000 : 1900);

    // Must be born after 1954
    if (fullYear <= 1954) return false;

    if (month > 50) {
      month -= 50;
    } else if (month > 20 && month < 33) {
      month -= 20;
    } else if (month > 70 && month < 83) {
      month -= 70;
    }

    if (day > 40) {
      day -= 40;
    }
    if (month < 1 || month > 12) return false;

    if (day < 1 || day > 31) return false;
    // Check divisibility by 11 for numbers after 1954

    return parseInt(value) % 11 === 0;
  }

  return false;
};
export { validateSocialSecurityNumber };
