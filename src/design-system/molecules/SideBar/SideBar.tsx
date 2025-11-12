'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { parseAsBoolean, useQueryState } from 'nuqs';

import { IAudit } from '@/core/assets/icons';
import IBugReport from '@/core/assets/icons/bug_report.svg';
import IDataTable from '@/core/assets/icons/icon_datatable.svg';
import IGrid from '@/core/assets/icons/icon_gridview.svg';
import IAdministrativeProceedings from '@/core/assets/icons/icon-administrative_proceedings.svg';
import IApprove from '@/core/assets/icons/icon-order-approve.svg';
import IPictureAsPdf from '@/core/assets/icons/picture_as_pdf.svg';
import IQR from '@/core/assets/icons/qr_code_2.svg';
import IRequests from '@/core/assets/icons/shopping_bag.svg';
import { ROUTES } from '@/core/config';
import { useAppContext } from '@/core/providers/context';
import { useEnv } from '@/core/providers/EnvProvider';
import { useRoles } from '@/core/providers/RolesProvider';
import { Divider, NavLink, Text } from '@/design-system/atoms';
import { BugReportModal } from '@/design-system/organisms';
import { useFeesPageContext } from '@/domains/limits-copayments-center/providers/FeesPageContext';

import styles from './SideBar.module.css';
/**
 * SideBar component for main application navigation.
 *
 * Renders navigation links based on user roles and environment settings.
 * Handles sidebar open/close state, bug report modal, and accessibility.
 *
 * @returns React component
 */
export const SideBar = () => {
  const appContext = useAppContext();
  const { isSideMenuOpened } = appContext.state;
  const { setIsSideMenuOpened } = appContext.actions;
  const { actions: feesPageActions } = useFeesPageContext();
  const { triggerFeesPageReset } = feesPageActions;
  const t = useTranslations('navigaton');
  const pathname = usePathname();
  const {
    auditReader,
    cscReader,
    suklReader,
    adminProceedingsReferent,
    requestsReader,
    pdfComparisonReader,
    qrReader,
  } = useRoles();
  const [, setIsBugReportModalOpen] = useQueryState('bugReport', parseAsBoolean.withDefault(false));
  const env = useEnv();
  const enableFeedbackHub = env.ENABLE_FEEDBACK_HUB === 'true';

  const handleLinkClick = () => {
    setIsSideMenuOpened(false);
  };

  const handleFeesLinkClick = () => {
    triggerFeesPageReset();
    setIsSideMenuOpened(false);
  };

  const handleBugReportClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsBugReportModalOpen(true);
    setIsSideMenuOpened(false);
  };

  return (
    <>
      <aside
        className={[styles.sidebar, isSideMenuOpened ? styles.open : ''].join(' ')}
        role="complementary"
        aria-label="Sidebar"
      >
        <nav className={styles.navMenuTop} aria-label="Main Navigation">
          <NavLink
            href={ROUTES.HOME}
            data-active={pathname === ROUTES.HOME}
            onClick={handleLinkClick}
            role="link"
            ariaLabel={t('home')}
            id="link-sidebar-home"
          >
            <IGrid id="icon-sidebar-home" width={24} height={24} />
            <Text variant="subtitle" regular selectable={false} className={styles.navMenuText}>
              {t('home')}
            </Text>
          </NavLink>
          <Divider />
          {suklReader && (
            <NavLink
              href={ROUTES.FEES}
              data-active={pathname === ROUTES.FEES}
              onClick={handleFeesLinkClick}
              role="link"
              ariaLabel={t('fees')}
              id="link-sidebar-cld"
            >
              <IApprove id="icon-sidebar-cld" width={24} height={24} />
              <Text variant="subtitle" regular selectable={false} className={styles.navMenuText}>
                {t('fees')}
              </Text>
            </NavLink>
          )}
          {cscReader && (
            <NavLink
              href={ROUTES.CSC}
              data-active={pathname.includes(ROUTES.CSC)}
              onClick={handleLinkClick}
              role="link"
              ariaLabel={t('csc')}
              id="link-sidebar-csc"
            >
              <IDataTable id="icon-sidebar-csc" width={24} height={24} />
              <Text variant="subtitle" regular selectable={false} className={styles.navMenuText}>
                {t('csc')}
              </Text>
            </NavLink>
          )}
          {auditReader && (
            <NavLink
              href={ROUTES.AUDIT_LIST}
              data-active={pathname.includes(ROUTES.AUDIT_LIST)}
              onClick={handleLinkClick}
              role="link"
              ariaLabel={t('csc')}
              id="link-sidebar-audit"
            >
              <IAudit id="icon-sidebar-audit" width={24} height={24} />
              <Text selectable={false} className={styles.navMenuText} variant="subtitle" regular>
                {t('audit')}
              </Text>
            </NavLink>
          )}
          {adminProceedingsReferent && (
            <NavLink
              href={ROUTES.ADM_PROCEEDINGS}
              data-active={pathname.includes(ROUTES.ADM_PROCEEDINGS)}
              onClick={handleLinkClick}
              role="link"
              ariaLabel={t('administrativeProceedings')}
              id="link-sidebar-adm-proceedings"
            >
              <IAdministrativeProceedings
                id="icon-sidebar-administrative-proceedings"
                width={24}
                height={24}
              />
              <Text variant="subtitle" regular selectable={false} className={styles.navMenuText}>
                {t('administrativeProceedings')}
              </Text>
            </NavLink>
          )}
          {requestsReader && (
            <NavLink
              href={ROUTES.REQUESTS}
              data-active={pathname.includes(ROUTES.REQUESTS)}
              onClick={handleLinkClick}
              role="link"
              ariaLabel={t('eRequests')}
              id="link-sidebar-requests"
            >
              <IRequests id="icon-sidebar-requests" width={24} height={24} />
              <Text variant="subtitle" regular selectable={false} className={styles.navMenuText}>
                {t('eRequests')}
              </Text>
            </NavLink>
          )}
          {pdfComparisonReader && (
            <NavLink
              href={ROUTES.PDF_COMPARISON}
              data-active={pathname === ROUTES.PDF_COMPARISON}
              onClick={handleLinkClick}
              role="link"
              ariaLabel={t('pdfComparison')}
              id="link-sidebar-pdf-comparison"
            >
              <IPictureAsPdf id="icon-sidebar-pdf-comparison" width={24} height={24} />
              <Text selectable={false} variant="subtitle" regular className={styles.navMenuText}>
                {t('pdfComparison')}
              </Text>
            </NavLink>
          )}
          {qrReader && (
            <NavLink
              href={ROUTES.QR_PAYMENT}
              data-active={pathname === ROUTES.QR_PAYMENT}
              onClick={handleLinkClick}
              role="link"
              ariaLabel={t('qrcodes')}
              id="link-sidebar-qr-codes"
            >
              <IQR id="icon-sidebar-qr-codes" width={24} height={24} />
              <Text selectable={false} variant="subtitle" regular className={styles.navMenuText}>
                {t('qrcodes')}
              </Text>
            </NavLink>
          )}
        </nav>

        <nav className={styles.navMenuBottom} aria-label="Bug Report Navigation">
          {enableFeedbackHub && (
            <NavLink
              href="#"
              data-active={false}
              onClick={handleBugReportClick}
              role="button"
              aria-label={t('bugReport')}
              id="link-sidebar-bug-report"
            >
              <IBugReport id="icon-sidebar-bug-report" width={24} height={24} />
              <Text variant="subtitle" regular selectable={false} className={styles.navMenuText}>
                {t('bugReport')}
              </Text>
            </NavLink>
          )}
        </nav>
      </aside>

      <BugReportModal />
    </>
  );
};
