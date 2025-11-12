import styles from './layout.module.css';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <div className={styles.wrapper}>{children}</div>;
}
