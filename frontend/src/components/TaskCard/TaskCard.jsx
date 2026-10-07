import React from 'react';
import { Link } from 'react-router-dom';
import styles from './TaskCard.module.css';
import StatusBadge from '../StatusBadge/StatusBadge';
import PriorityBadge from '../PriorityBadge/PriorityBadge';
import Button from '../Button/Button';
import { formatDate } from '../../utils/formatDate';

export default function TaskCard({ task, onDelete }) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h3 className={styles.title}>{task.title}</h3>
        <div className={styles.badges}>
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
        </div>
      </header>
      
      <p className={styles.description}>{task.description}</p>
      
      <footer className={styles.footer}>
        <div className={styles.dates}>
          <span className={styles.date}>Created: {formatDate(task.createdAt)}</span>
          {task.dueDate && (
            <span className={`${styles.date} ${isOverdue ? styles.overdue : ''}`}>
              Due: {formatDate(task.dueDate)}
            </span>
          )}
        </div>
        
        <div className={styles.actions}>
          <Link to={`/tasks/${task.id}`} className={styles.viewLink}>View</Link>
          <Link to={`/tasks/${task.id}/edit`} className={styles.editLink}>Edit</Link>
          <Button variant="danger" onClick={() => onDelete(task.id)}>Delete</Button>
        </div>
      </footer>
    </article>
  );
}
