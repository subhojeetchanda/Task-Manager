import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getTask, deleteTask } from '../api/taskApi';
import Header from '../components/Header/Header';
import Button from '../components/Button/Button';
import Spinner from '../components/Spinner/Spinner';
import ErrorState from '../components/ErrorState/ErrorState';
import EmptyState from '../components/EmptyState/EmptyState';
import StatusBadge from '../components/StatusBadge/StatusBadge';
import PriorityBadge from '../components/PriorityBadge/PriorityBadge';
import ConfirmDialog from '../components/ConfirmDialog/ConfirmDialog';
import { formatDate } from '../utils/formatDate';
import styles from './TaskDetailsPage.module.css';

export default function TaskDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [task, setTask] = useState(null);
  const [status, setStatus] = useState('loading'); // loading, success, error, not_found
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTask = async () => {
    setStatus('loading');
    try {
      const response = await getTask(id);
      setTask(response.data);
      setStatus('success');
    } catch (err) {
      if (err.status === 404) {
        setStatus('not_found');
      } else {
        setError(err.message || 'Failed to load task');
        setStatus('error');
      }
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(id);
      toast.success('Task deleted successfully');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Failed to delete task');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <Link to="/" className={styles.backLink}>← Back to Dashboard</Link>
          </div>

          {status === 'loading' && (
            <div className={styles.centered}><Spinner size="large" /></div>
          )}

          {status === 'error' && (
            <ErrorState message={error} onRetry={fetchTask} />
          )}

          {status === 'not_found' && (
            <EmptyState 
              message="The task you're looking for doesn't exist or has been deleted."
              action={
                <Link to="/" tabIndex="-1">
                  <Button tabIndex="-1">Return to Dashboard</Button>
                </Link>
              }
            />
          )}

          {status === 'success' && task && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h1 className={styles.title}>{task.title}</h1>
                <div className={styles.badges}>
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                </div>
              </div>
              
              <div className={styles.body}>
                <h3 className={styles.sectionTitle}>Description</h3>
                <p className={styles.description}>{task.description}</p>
              </div>
              
              <div className={styles.metadata}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Created:</span>
                  <span className={styles.metaValue}>{formatDate(task.createdAt)}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Last Updated:</span>
                  <span className={styles.metaValue}>{formatDate(task.updatedAt)}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Due Date:</span>
                  <span className={`${styles.metaValue} ${task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed' ? styles.overdue : ''}`}>
                    {formatDate(task.dueDate)}
                  </span>
                </div>
              </div>

              <div className={styles.actions}>
                <Link to={`/tasks/${task.id}/edit`} tabIndex="-1">
                  <Button variant="secondary" tabIndex="-1">Edit Task</Button>
                </Link>
                <Button variant="danger" onClick={() => setShowDeleteConfirm(true)} loading={isDeleting}>Delete Task</Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <ConfirmDialog 
        isOpen={showDeleteConfirm}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
