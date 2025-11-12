import { useTranslations } from 'next-intl';

import { useUserInfoStore } from '../../stores';
import styles from './ClientTable.module.css';

import { Input, Table, TableBody, TableCell, TableRow, Typography } from '@/design-system';
/**
 * Represents the structure of client information displayed in the ClientTable.
 */
type ClientInfo = {
  /** Client's first name */
  firstName?: string;

  /** Client's surname */
  surname?: string;

  /** Name of the applicant organization */
  applicant?: string;

  /** Client's mobile phone number */
  mobilePhone?: string;

  /** Country code for the mobile phone */
  countryCode?: string;

  /** Client's email address */
  email?: string;

  /** Bank account details */
  bankAccount?: {
    /** Bank account number */
    accountNumber: string;

    /** Bank code */
    bankCode: string;
  };

  /** Client's address details */
  address?: {
    /** Street name */
    street: string;

    /** City name */
    city: string;

    /** ZIP code */
    zip: string;

    /** House number (can be null) */
    houseNumber: string | null;
  };

  /** Data box identifier */
  dataBox?: string;

  /** Date when judgment was made */
  judgmentDate?: string;

  /** Reference number */
  referenceNumber?: string;

  /** Result of the judgment (e.g., "Schváleno", "Zamítnuto") */
  result?: string;

  /** Approved amount in CZK */
  approvedAmount?: string;

  /** Name of the resolver */
  resolver?: string;

  /** Resolver group/team */
  resolverGroup?: string;

  /** Comment/notes about the judgment */
  comment?: string;
};

/**
 * Props for the ClientTable component.
 */
interface ClientTableProps {
  /** Client data to be displayed in the table */
  data: ClientInfo;
}

/**
 * `ClientTable` is a presentational component that renders a table of client information.
 * It uses localized labels via `useTranslations('ClientTable')` and displays fields such as name,
 * contact details, bank account, address, and data box.
 *
 * @param {ClientTableProps} props - The props containing client data.
 * @returns {JSX.Element} A table displaying the client's information.
 *
 * @example
 * ```tsx
 * <ClientTable data={clientData} />
 * ```
 */

const TableRowItem = ({
  label,
  value,
  isBank = false,
}: {
  label: string;
  value: string | null;
  isBank?: boolean;
}) => {
  const { userInfo, setBankInfo } = useUserInfoStore();
  const currentBank = userInfo?.userData.bankAccounts[0];

  const parseBankAccount = (bankValue: string | null): [string, string] => {
    if (!bankValue) return ['', ''];
    const parts = bankValue.split('/');

    return [parts[0] || '', parts[1] || ''];
  };

  const [accountNumber, bankCode] = parseBankAccount(value);

  const updateBankInfo = (field: 'accountNumber' | 'bankCode', newValue: string) => {
    if (!currentBank) return;

    setBankInfo({
      accountId: currentBank.accountId ?? '',
      accountNumber: field === 'accountNumber' ? newValue : (currentBank.accountNumber ?? ''),
      bankCode: field === 'bankCode' ? newValue : (currentBank.bankCode ?? ''),
      accountType: currentBank.accountType ?? '',
      iban: currentBank.iban ?? '',
      bic: currentBank.bic ?? '',
      specSymbol: currentBank.specSymbol ?? '',
    });
  };

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateBankInfo('accountNumber', e.target.value);
  };

  const handleBankCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateBankInfo('bankCode', e.target.value);
  };

  return (
    <TableRow>
      <TableCell>
        <Typography variant="Subtitle/Default/Regular">{label}</Typography>
      </TableCell>
      <TableCell>
        {isBank && value ? (
          <div className={styles.bankInputWrapper}>
            <Input
              onChange={handleAccountNumberChange}
              id="input-bank-info-user-1"
              type="text"
              value={accountNumber}
            />
            /
            <Input
              width={70}
              id="input-bank-info-user-2"
              type="text"
              onChange={handleBankCodeChange}
              value={bankCode}
            />
          </div>
        ) : (
          <Typography variant="Subtitle/Default/Bold">{value || '-'}</Typography>
        )}
      </TableCell>
    </TableRow>
  );
};

export const ClientTable = ({ data }: ClientTableProps) => {
  const t = useTranslations('ClientTable');
  const {
    judgmentDate,
    referenceNumber,
    result,
    approvedAmount,
    resolver,
    resolverGroup,
    comment,
    firstName,
    surname,
    applicant,
    mobilePhone,
    countryCode,
    email,
    bankAccount,
    address,
    dataBox,
  } = data;

  const clientFields = [
    judgmentDate && {
      key: 'judgmentDate',
      label: t('judgmentDate'),
      value: judgmentDate,
    },
    referenceNumber && {
      key: 'referenceNumber',
      label: t('referenceNumber'),
      value: referenceNumber,
    },
    result && { key: 'result', label: t('result'), value: result },
    approvedAmount && {
      key: 'approvedAmount',
      label: t('approvedAmount'),
      value: approvedAmount,
    },
    resolver && { key: 'resolver', label: t('resolver'), value: resolver },
    resolverGroup && {
      key: 'resolverGroup',
      label: t('resolverGroup'),
      value: resolverGroup,
    },
    comment && { key: 'comment', label: t('comment'), value: comment },
    firstName && { key: 'firstName', label: t('firstName'), value: firstName },
    surname && { key: 'surname', label: t('surname'), value: surname },
    applicant && { key: 'applicant', label: t('applicant'), value: applicant },
    mobilePhone && {
      key: 'mobilePhone',
      label: t('mobilePhone'),
      value: `${countryCode} - ${mobilePhone}`,
    },
    email && { key: 'email', label: t('email'), value: email },
    bankAccount && {
      key: 'bank',
      label: t('bank'),
      value: `${bankAccount.accountNumber}/${bankAccount.bankCode}`,
    },
    address && {
      key: 'address',
      label: t('address'),
      value: `${address.street} ${address.houseNumber}, ${address.zip} ${address.city}`,
    },
    dataBox && { key: 'dataBox', label: t('dataBox'), value: dataBox },
  ].filter(Boolean) as Array<{ key: string; label: string; value: string }>;

  return (
    <div>
      <Table className={styles.clientTable}>
        <TableBody>
          {clientFields.map(({ key, label, value }) => (
            <TableRowItem key={key} label={label} value={value} isBank={key === 'bank'} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
