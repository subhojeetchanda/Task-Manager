import React from 'react';
import styles from './FormField.module.css';

export default function FormField({ 
  label, 
  error, 
  id, 
  type = 'text', 
  as: Component = 'input', 
  options = [],
  ...props 
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      
      {Component === 'select' ? (
        <select 
          id={id} 
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <Component
          id={id}
          type={Component === 'input' ? type : undefined}
          className={`${styles.input} ${error ? styles.inputError : ''} ${Component === 'textarea' ? styles.textarea : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      )}
      
      {error && (
        <span id={`${id}-error`} className={styles.errorText} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
