import React from 'react';
import styles from './SkeletonCard.module.css';

export default function SkeletonCard() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.header}>
        <div className={`${styles.pulse} ${styles.title}`} />
        <div className={styles.badges}>
          <div className={`${styles.pulse} ${styles.badge}`} />
          <div className={`${styles.pulse} ${styles.badge}`} />
        </div>
      </div>
      <div className={styles.body}>
        <div className={`${styles.pulse} ${styles.textLine}`} />
        <div className={`${styles.pulse} ${styles.textLine}`} style={{ width: '80%' }} />
      </div>
      <div className={styles.footer}>
        <div className={`${styles.pulse} ${styles.dateBlock}`} />
        <div className={`${styles.pulse} ${styles.actionsBlock}`} />
      </div>
    </div>
  );
}
