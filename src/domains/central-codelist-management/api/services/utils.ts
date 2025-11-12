const formatNumberWithSpaces = (value: string | number, allowDecimals = true): string => {
  const stringValue = String(value);

  const cleanVal = allowDecimals
    ? stringValue.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1')
    : stringValue.replace(/[^\d]/g, '');

  if (!cleanVal) return '';

  const parts = allowDecimals ? cleanVal.split('.') : [cleanVal];

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return allowDecimals && parts.length > 1 ? `${parts[0]}.${parts[1]}` : parts[0];
};

const removeSpaces = (value: string): string => {
  return value.replace(/\s/g, '');
};

const validateNumericString = (
  value: string,
  allowDecimals = false,
  allowSpaces = false,
): boolean => {
  const regex = new RegExp(`^[0-9${allowDecimals ? '.' : ''}${allowSpaces ? '\\s' : ''}]*$`, 'g');

  return regex.test(value);
};

const validateMaxLength = (value: string, maxLength: number, countSpaces = true): boolean => {
  if (!maxLength) return true;

  const valueToCheck = countSpaces ? value : removeSpaces(value);

  return valueToCheck.length <= maxLength;
};

export { formatNumberWithSpaces, removeSpaces, validateMaxLength, validateNumericString };
