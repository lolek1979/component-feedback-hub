import { DownloadPrintButtons } from '../DownloadPrintButtons';
import { FeesPagePDFProps } from '../FeesPagePDF';
import { SearchPrescriptionForm } from '../SearchPrescriptionForm';
import styles from './SearchPrescriptionContainer.module.css';

interface SearchPrescriptionContainerProps {
  feesPageProps: FeesPagePDFProps;
  isLoading: boolean;
  onDownload: () => void;
  onPrint: (orientation: 'portrait' | 'landscape') => void;
  selectedYear: string;
  selectedMonth: string;
  searchQuery: string;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
  onSearchChange: (query: string) => void;
  showDetails: boolean;
  onShowDetailsChange: (show: boolean) => void;
}

export const SearchPrescriptionContainer = ({
  feesPageProps,
  isLoading,
  onDownload,
  onPrint,
  selectedYear,
  selectedMonth,
  searchQuery,
  onYearChange,
  onMonthChange,
  onSearchChange,
  showDetails,
  onShowDetailsChange,
}: SearchPrescriptionContainerProps) => {
  return (
    <div
      className={`${styles.container} ${styles.buttonsContainer}`}
      role="region"
      aria-label="Search Prescription Container"
    >
      <SearchPrescriptionForm
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        searchQuery={searchQuery}
        onYearChange={onYearChange}
        onMonthChange={onMonthChange}
        onSearchChange={onSearchChange}
        isLoading={isLoading}
        className={styles.searchForm}
        showDetails={showDetails}
        onShowDetailsChange={onShowDetailsChange}
      />
      <DownloadPrintButtons
        onDownload={onDownload}
        onPrint={onPrint}
        isLoading={isLoading}
        feesPageProps={feesPageProps}
        className={styles.buttons}
        aria-label="Download and Print Buttons"
      />
    </div>
  );
};
export type { FeesPagePDFProps };
