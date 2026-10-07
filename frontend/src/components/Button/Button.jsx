import React from 'react';
import styles from './Button.module.css';
import Spinner from '../Spinner/Spinner';

export default function Button({ 
  children, 
  variant = 'primary', 
  loading = false, 
  className = '', 
  ...props 
}) {
  const rootClass = `${styles.button} ${styles[variant]} ${className}`.trim();
  
  return (
    <button className={rootClass} disabled={loading || props.disabled} {...props}>
      {loading ? <Spinner size="small" /> : children}
    </button>
  );
}
