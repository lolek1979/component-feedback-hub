'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { IAudit } from '@/core/assets/icons';
import IDataTable from '@/core/assets/icons/icon_datatable.svg';
import IAdministrativeProceedings from '@/core/assets/icons/icon-administrative_proceedings.svg';
import IApprove from '@/core/assets/icons/icon-order-approve.svg';
import IPictureAsPdf from '@/core/assets/icons/picture_as_pdf.svg';
import IQr from '@/core/assets/icons/qr_code_2.svg';
import IRequests from '@/core/assets/icons/shopping_bag.svg';
import { formatDateInCzech } from '@/core/auth/utils';
import { ROUTES } from '@/core/config';
import { useRoles } from '@/core/providers/RolesProvider';
import { Card, Text } from '@/design-system/atoms';

import styles from './index.module.css';

const HomePage = () => {
  const t = useTranslations('HomePage');
  const router = useRouter();
  const {
    suklReader,
    cscReader,
    auditReader,
    adminProceedingsReferent,
    requestsReader,
    pdfComparisonReader,
    qrReader,
  } = useRoles();

  return (
    <div className={styles.homePage}>
      <div>
        <Text variant="h4" selectable={false}>
          {t('title')}
        </Text>
        <div className={styles.subtitle}>
          <Text regular variant="subtitle" selectable={false}>
            {t('subtitle')}
          </Text>
          <Text variant="subtitle" className={styles.dateColor} selectable={false}>
            {formatDateInCzech(new Date())}
          </Text>
        </div>
      </div>
      <div>
        <Text variant="headline" className={styles.applications} selectable={false}>
          {t('applications')}
        </Text>
        <div className={styles.cardsGrid}>
          {suklReader && (
            <Card
              id="card-home-page-cld"
              title={t('KDPApplication')}
              onClick={() => router.push(ROUTES.FEES)}
              icon={<IApprove id="icon-home-page-cld" width={32} height={32} />}
            />
          )}
          {cscReader && (
            <Card
              id="card-home-page-csc"
              title={t('CSCApplication')}
              onClick={() => router.push(ROUTES.CSC)}
              icon={<IDataTable id="icon-home-page-csc" width={32} height={32} />}
            />
          )}
          {auditReader && (
            <Card
              id="card-home-page-audit"
              title={t('Audit')}
              onClick={() => router.push(ROUTES.AUDIT_LIST)}
              icon={<IAudit id="icon-audit" width={32} height={32} />}
            />
          )}
          {adminProceedingsReferent && (
            <Card
              id="card-home-page-adm-proceedings"
              title={t('AdministrativeProcessApplication')}
              onClick={() => router.push(ROUTES.ADM_PROCEEDINGS)}
              icon={
                <IAdministrativeProceedings
                  id="icon-home-page-adm-proceedings"
                  width={32}
                  height={32}
                />
              }
            />
          )}

          {requestsReader && (
            <Card
              id="card-home-page-requests"
              title={t('RequestsApplication')}
              onClick={() => router.push(ROUTES.REQUESTS)}
              icon={<IRequests id="icon-home-page-requests" width={32} height={32} />}
            />
          )}
          {pdfComparisonReader && (
            <Card
              id="card-home-page-pdf-comparison"
              title={t('PdfComparison')}
              onClick={() => router.push(ROUTES.PDF_COMPARISON)}
              icon={<IPictureAsPdf id="icon-home-page-pdf-comparison" width={32} height={32} />}
            />
          )}
          {qrReader && (
            <Card
              id="card-home-page-qr-payments"
              title={t('QrPayments')}
              onClick={() => router.push(ROUTES.QR_PAYMENT)}
              icon={<IQr id="icon-home-page-qr-payments" width={32} height={32} />}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
