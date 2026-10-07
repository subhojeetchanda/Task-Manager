import React from 'react';
import styles from './ErrorState.module.css';
import Button from '../Button/Button';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className={styles.container} role="alert">
      <p className={styles.message}>{message}</p>
      {onRetry && <Button variant="secondary" onClick={onRetry}>Retry</Button>}
    </div>
  );
}
