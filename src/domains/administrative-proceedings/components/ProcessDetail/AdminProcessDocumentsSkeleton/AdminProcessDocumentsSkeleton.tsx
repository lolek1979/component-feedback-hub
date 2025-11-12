'use client';

import { Skeleton } from '@/design-system/atoms';

import styles from './AdminProcessDocumentsSkeleton.module.css';

const AdminProcessDocumentsSkeleton = () => {
  return (
    <div className={styles.documentsSkeletonWrapper}>
      <div className={styles.documentsGroup}>
        <Skeleton size="large" />
        <Skeleton size="large" />
      </div>
      <div className={styles.documentsGroup}>
        <Skeleton size="large" />
        <Skeleton size="large" />
      </div>
      <div className={styles.documentsGroup}>
        <Skeleton size="large" />
        <Skeleton size="large" />
      </div>
      <div className={styles.documentsGroup}>
        <Skeleton size="large" />
        <Skeleton size="large" />
      </div>
    </div>
  );
};

export default AdminProcessDocumentsSkeleton;
