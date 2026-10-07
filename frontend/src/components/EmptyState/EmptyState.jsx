import React from 'react';
import styles from './EmptyState.module.css';

export default function EmptyState({ message, action }) {
  return (
    <div className={styles.container}>
      <p className={styles.message}>{message}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
