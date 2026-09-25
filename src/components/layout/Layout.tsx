import styles from './Layout.module.css';

import { Outlet } from 'react-router-dom';
import {Header} from "@/src/components/layout/Header";

export function Layout() {
  return (
      <div className={styles.layout}>
        <Header />

        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
  );
}
