import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import Button from '../Button/Button';
import { useTheme } from '../../hooks/useTheme';

export default function Header() {
  const { toggleTheme } = useTheme();
  
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          Task Manager
        </Link>
        <div className={styles.actions}>
          {toggleTheme && (
            <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle theme">
              🌓
            </button>
          )}
          <Link to="/tasks/new" tabIndex="-1">
            <Button variant="primary" tabIndex="-1">New Task</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
