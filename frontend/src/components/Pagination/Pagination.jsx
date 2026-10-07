import React from 'react';
import styles from './Pagination.module.css';
import Button from '../Button/Button';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className={styles.pagination}>
      <Button 
        variant="secondary" 
        disabled={currentPage <= 1} 
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </Button>
      <span className={styles.info}>
        Page {currentPage} of {totalPages}
      </span>
      <Button 
        variant="secondary" 
        disabled={currentPage >= totalPages} 
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
}
