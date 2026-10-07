import React from 'react';
import styles from './PriorityBadge.module.css';
import { PRIORITIES } from '../../utils/constants';

export default function PriorityBadge({ priority, className = '' }) {
  const config = PRIORITIES.find(p => p.value === priority) || PRIORITIES[1];
  
  return (
    <span 
      className={`${styles.badge} ${styles[config.value]} ${className}`}
    >
      {config.label}
    </span>
  );
}
