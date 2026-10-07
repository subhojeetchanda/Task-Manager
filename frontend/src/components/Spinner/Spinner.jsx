import React from 'react';
import styles from './Spinner.module.css';

export default function Spinner({ size = 'medium', className = '' }) {
  return (
    <span 
      className={`${styles.spinner} ${styles[size]} ${className}`} 
      role="status" 
      aria-label="Loading"
    />
  );
}
