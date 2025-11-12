import SearchIcon from '@/core/assets/icons/icon-search.svg';

import { GetResultsMessageT } from '../CatalogueItemModal';
import styles from '../CatalogueItemModal.module.css';

import { FieldLabel, Input, Text } from '@/design-system';
interface SearchSectionProps {
  fullText: string;
  handleFullTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sortedCatalogItemsLength: number;
  favoriteItemsCount: number;
  t: GetResultsMessageT;
}

export const SearchSection = ({
  fullText,
  handleFullTextChange,
  sortedCatalogItemsLength,
  favoriteItemsCount,
  t,
}: SearchSectionProps) => (
  <div className={styles.searchContainer}>
    <div className={styles.searchInputContainer}>
      <FieldLabel text={t('searchLabel')} htmlFor="request-input-fullText" />
      <Input
        type="search"
        id="request-input-fullText"
        placeholder={t('searchPlaceholder')}
        value={fullText || ''}
        onChange={handleFullTextChange}
        maxLength={30}
        ariaLabel={t('searchPlaceholder')}
        secondaryIcon={
          <SearchIcon id="icon-search-insurance-search" width={18} height={18} role="button" />
        }
      />
    </div>
    {sortedCatalogItemsLength !== 0 && (
      <Text variant="subtitle" className={styles.favoritesText}>
        {t('myFavorites', { count: favoriteItemsCount })}
      </Text>
    )}
  </div>
);
