import { Person } from '@/design-system/molecules/UserSelect';

/**
 * Normalizes CSC user data to Person format.
 *
 * @param cscUser - Raw CSC user object.
 * @returns Person - Normalized user object.
 */
export const mapCSCUserToPerson = (cscUser: any): Person => {
  return {
    id: cscUser.id || '',
    displayName: cscUser.fullName || `${cscUser.firstName || ''} ${cscUser.lastName || ''}`.trim(),
    mail: cscUser.email || '',
    mobilePhone: cscUser.phoneNumber || '',
    givenName: cscUser.firstName || '',
    surname: cscUser.lastName || '',
    jobsite: cscUser.departmentName || '',
  };
};

/**
 * Normalizes Graph API user data to Person format.
 *
 * If the displayName contains a jobsite in parentheses, it is extracted.
 *
 * @param graphUser - Raw Graph API user object.
 * @returns Person - Normalized user object.
 */
export const mapGraphUserToPerson = (graphUser: any): Person => {
  const user = { ...graphUser };
  const match = user.displayName?.match(/(.*)\((.*)\)/);
  if (match) {
    user.displayName = match[1].trim();
    user.jobsite = match[2].trim();
  }

  return user;
};
