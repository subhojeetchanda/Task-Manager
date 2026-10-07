import React from 'react';
import styles from './StatusBadge.module.css';
import { STATUSES } from '../../utils/constants';

export default function StatusBadge({ status, className = '' }) {
  const config = STATUSES.find(s => s.value === status) || STATUSES[0];
  
  return (
    <span 
      className={`${styles.badge} ${styles[config.value]} ${className}`}
    >
      {config.label}
    </span>
  );
}
