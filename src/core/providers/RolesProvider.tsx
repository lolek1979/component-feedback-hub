'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { jwtDecode } from 'jwt-decode';

import { getCurrentToken } from '@/core/auth/tokenFetcher';

/**
 * Context value type for user roles.
 *
 * @property roles - Array of role strings assigned to the user.
 * @property hasRole - Function to check if the user has a specific role.
 * @property cscEditor - Indicates if the user has the CodeList Editor role.
 * @property cscPublisher - Indicates if the user has the CodeList Publisher role.
 * @property suklReader - Indicates if the user has the Sukl Integration Reader role.
 * @property cscReader - Indicates if the user has the CodeList Reader role.
 * @property adminProceedingsReferent - Indicates if the user has the Administrative Proceedings Referent role.
 * @property adminProceedingsReader - Indicates if the user has the Administrative Proceedings Reader role.
 * @property isLoadingRoles - Indicates if roles are currently loading.
 * @property requestsReader - Indicates if the user has the Requests Reader role.
 * @property requestsApprover - Indicates if the user has the Requests Approver role.
 * @property auditReader - Indicates if the user has the Audit Reader role.
 * @property pdfComparisonReader - Indicates if the user has the PDF Comparison Reader role.
 */
interface RolesContextType {
  roles: string[];
  hasRole: (role: string) => boolean;
  cscEditor: boolean;
  cscPublisher: boolean;
  suklReader: boolean;
  cscReader: boolean;
  adminProceedingsReferent: boolean;
  adminProceedingsReader: boolean;
  isLoadingRoles: boolean;
  requestsReader: boolean;
  requestsApprover: boolean;
  auditReader: boolean;
  pdfComparisonReader: boolean;
  CLDReader: boolean;
  CLDComplAppr: boolean;
  CLDComplRevOZP: boolean;
  CLDComplRevOPSP: boolean;
  qrReader: boolean;
}

/**
 * React context for user roles.
 *
 * @see {@link RolesProvider}
 * @see {@link useRoles}
 */
const RolesContext = createContext<RolesContextType | undefined>(undefined);

/**
 * Provider component for user roles.
 *
 * Fetches roles from the MSAL token, decodes them, and provides role-based flags and utilities.
 * Stores roles in localStorage for persistence.
 *
 * @param props.children - The React children to render within the provider.
 *
 * @example
 * <RolesProvider>
 *   <App />
 * </RolesProvider>
 *
 * @see {@link useRoles}
 */
export const RolesProvider = ({ children }: { children: React.ReactNode }) => {
  const { instance: msalInstance } = useMsal();
  const [roles, setRoles] = useState<string[]>(
    typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userRoles') || '[]') : [],
  );
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      if (!msalInstance) return;
      const token = await getCurrentToken(msalInstance);
      if (token) {
        try {
          const decodedToken: RolesContextType = jwtDecode(token);
          const userRoles = decodedToken?.roles || [];
          setRoles(userRoles);
        } catch (error) {
          console.error('Failed to decode token:', error);
        }
      }
      setIsLoadingRoles(false);
    };
    fetchToken();
  }, [msalInstance]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userRoles', JSON.stringify(roles));
    }
  }, [roles]);

  const hasRole = (role: string) => roles.includes(role);
  const cscEditor = hasRole('NIS.CodeList-Editor');
  const cscPublisher = hasRole('NIS.CodeList-Publisher');
  const cscReader = hasRole('NIS.CodeList-Reader');
  const suklReader = hasRole('NIS.SuklIntegration-Reader');
  const adminProceedingsReferent = hasRole('APROC-Referent');
  const adminProceedingsReader = hasRole('APROC-Reader');
  // TODO: Update the request roles based on the roles defined in this file
  // https://vzpcr.sharepoint.com/:w:/s/NIS/EQN7iE_NsutEp3Gqhv0IvCABnhxZsy87GynTJ2r9JurNlg?e=Mwdjfb (page 11)
  const requestsReader = hasRole('CRF-Reader');
  const requestsApprover = hasRole('NIS.Requests-Approver');
  const pdfComparisonReader = hasRole('CPDF-Reader');
  const auditReader = hasRole('AUI-Reader');
  const CLDReader = hasRole('CLD-READER'); // Reader a ten kdo zakládá reklamaci (OSK front-office) - přejmenovaný Sukl.Integration.Reader
  const CLDComplAppr = hasRole('CLD-COMPLAPPR'); // Schvalovatel reklamace (OSK back-office)
  const CLDComplRevOZP = hasRole('CLD-COMPLREV-OZP'); // Odborný útvar za OZP, dává stanoviska
  const CLDComplRevOPSP = hasRole('CLD-COMPLREV-OPSP'); // Odborný útvar za OPSP, dává stanoviska
  const qrReader = hasRole('CDGQR-Reader');

  return (
    <RolesContext.Provider
      value={{
        roles,
        hasRole,
        cscEditor,
        cscPublisher,
        suklReader,
        cscReader,
        adminProceedingsReferent,
        adminProceedingsReader,
        isLoadingRoles,
        requestsReader,
        requestsApprover,
        pdfComparisonReader,
        auditReader,
        CLDReader,
        CLDComplAppr,
        CLDComplRevOZP,
        CLDComplRevOPSP,
        qrReader,
      }}
    >
      {children}
    </RolesContext.Provider>
  );
};

/**
 * Custom hook to access user roles context.
 *
 * Throws an error if used outside of {@link RolesProvider}.
 *
 * @returns The {@link RolesContextType} context value.
 *
 * @throws Error if used outside of {@link RolesProvider}.
 *
 * @example
 * const { roles, hasRole, cscEditor } = useRoles();
 */
export const useRoles = () => {
  const context = useContext(RolesContext);
  if (!context) {
    throw new Error('useRoles must be used within a RolesProvider');
  }

  return context;
};
