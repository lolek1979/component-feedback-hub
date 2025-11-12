import React, { ReactNode } from 'react';

import { SideBar } from '@/design-system/molecules/SideBar';
import { Header } from '@/design-system/organisms/Header';

import './styles.css';

const FullLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <div className="layout-wrapper">
        <SideBar />
        <main className="page-content">{children}</main>
      </div>
    </>
  );
};

export default FullLayout;
