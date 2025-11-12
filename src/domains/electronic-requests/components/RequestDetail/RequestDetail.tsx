'use client';

import { useState } from 'react';

import { RequestTabsContainer } from './partials/RequestTabsContainer/RequestTabsContainer';
import styles from './RequestDetail.module.css';

const RequestDetail = () => {
  const [selectedTab, setSelectedTab] = useState<string>('tab-request-tabs-container-items');

  return (
    <div className={styles.container}>
      <RequestTabsContainer selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
    </div>
  );
};

export default RequestDetail;
