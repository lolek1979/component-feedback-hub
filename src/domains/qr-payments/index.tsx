'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import IPDf from '@/core/assets/icons/picture_as_pdf.svg';
import { useRoles } from '@/core/providers/RolesProvider';
import { Button, Skeleton, Text } from '@/design-system/atoms';
import { toast } from '@/design-system/molecules/Toast';

import { postGeneratePDF } from './api/services/postGeneratePDF';
import { Address } from './components/InsurerInfo';
import { useClientStore } from './stores/clientStore';
import { usePaymentDetailsStore } from './stores/paymentStore';
import { InsurerInfo, PaymentDetails, QrSearchField } from './components';
import styles from './index.module.css';

const QRPayments = () => {
  const t = useTranslations('');
  const initialAddress = {
    addressType: '',
    city: '',
    street: '',
    houseNumber: null,
    zip: '',
  };
  const { qrReader, isLoadingRoles } = useRoles();
  const [isValidAmount, setIsValidAmount] = useState(false);
  const [primAdress, setPrimAdress] = useState<Address>(initialAddress);
  const [secAdress, setSecAdress] = useState<Address>();

  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [isLoadingPDF, setIsLoadingPDF] = useState<boolean>(false);

  const ssn = useClientStore((state) => state.insurer.ssn);
  const rows = usePaymentDetailsStore((state) => state.rows);
  const router = useRouter();

  useEffect(() => {
    // Check if some row is complete and other rows are empty. if so allow to send.
    const isAnyRowComplete = rows.some(
      ({ amount, symbol, type }) => !!amount && !!symbol && !!type,
    );
    const isAnyRowIncomplete = rows.some(({ amount, symbol, type }) => {
      const filledCount = [amount, symbol, type].filter(Boolean).length;

      return filledCount > 0 && filledCount < 3;
    });

    setIsValidAmount(isAnyRowComplete && !isAnyRowIncomplete);
  }, [rows]);

  const handleClick = async () => {
    const client = useClientStore.getState();
    const formattedAmounts = rows.map((row) => {
      const cleaned = row.amount.replace(/\u00A0/g, '').replace(',', '.');
      const amount = Number(cleaned);

      return Math.round(amount * 100) / 100;
    });
    //Filter payments without data
    const filteredPayments = rows
      .map((row, index) => ({
        paymentPurpose: row.type,
        amount: formattedAmounts[index],
        reference: row.symbol,
      }))
      .filter((payment) => payment.amount !== 0);
    const type = client.payerType === '1' ? 'Bulk' : 'Individual';
    // Prepate template for postGeneratePDF
    const template = {
      payerType: type,
      clientNumber: client.insurer.ssn,
      payments: filteredPayments,
      addressType: client.insurer.addressType,
    };

    try {
      setIsLoadingPDF(true);
      await postGeneratePDF(template);

      useClientStore.getState().resetStates();
      usePaymentDetailsStore.getState().resetStates();
      setSecAdress(undefined);
      setPrimAdress(initialAddress);
    } catch {
      toast.error(t('common.cannotGeneratePDF'));
    }
    setIsLoadingPDF(false);
  };

  useEffect(() => {
    if (!isLoadingRoles && !qrReader) {
      router.push('/');
    }
  }, [isLoadingRoles, qrReader, router]);

  return (
    <div className={styles.qrPage}>
      <Text variant="h4"> {t('QRCodes.title')}</Text>
      <QrSearchField
        isSubmitting={isLoadingData}
        setPrimAdress={setPrimAdress}
        setSecAdress={setSecAdress}
        setIsSubmitting={setIsLoadingData}
      />

      {primAdress.addressType && (
        <>
          <InsurerInfo permAdress={primAdress} mailAdress={secAdress} />
          <PaymentDetails ssn={ssn} />
          <div>
            <Button
              icon={!isLoadingPDF && <IPDf id="icon-payment-details-pdf" width={24} height={24} />}
              id="button-payment-details-pdf"
              disabled={!isValidAmount}
              onClick={handleClick}
              loading={isLoadingPDF}
            >
              {t('QRCodes.pdfBtn')}
            </Button>
          </div>
        </>
      )}
      {isLoadingData && (
        <>
          <Skeleton size="small" />
          <Skeleton size="small" />
          <Skeleton size="large" />
          <Skeleton size="large" />
          <Skeleton size="small" />
          <Skeleton size="medium" />
          <Skeleton size="large" />
          <Skeleton size="large" />
        </>
      )}
    </div>
  );
};

export default QRPayments;
