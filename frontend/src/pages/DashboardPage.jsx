import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useTasks } from '../hooks/useTasks';
import { deleteTask } from '../api/taskApi';
import Header from '../components/Header/Header';
import TaskList from '../components/TaskList/TaskList';
import SkeletonCard from '../components/SkeletonCard/SkeletonCard';
import EmptyState from '../components/EmptyState/EmptyState';
import ErrorState from '../components/ErrorState/ErrorState';
import ConfirmDialog from '../components/ConfirmDialog/ConfirmDialog';
import { Link } from 'react-router-dom';
import Button from '../components/Button/Button';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const [filters, setFilters] = useState({});
  const { tasks, status, error, reload, removeTask } = useTasks(filters);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const handleDelete = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTask(taskToDelete);
      removeTask(taskToDelete);
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete task');
    } finally {
      setTaskToDelete(null);
    }
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Your Tasks</h1>
          </div>
          
          {status === 'loading' && (
            <div className={styles.grid}>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {status === 'error' && (
            <ErrorState message={error} onRetry={reload} />
          )}

          {status === 'success' && tasks.length === 0 && (
            <EmptyState 
              message="You have no tasks right now." 
              action={
                <Link to="/tasks/new" tabIndex="-1">
                  <Button tabIndex="-1">Create your first task</Button>
                </Link>
              }
            />
          )}

          {status === 'success' && tasks.length > 0 && (
            <TaskList tasks={tasks} onDeleteTask={setTaskToDelete} />
          )}
        </div>
      </main>

      <ConfirmDialog 
        isOpen={!!taskToDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setTaskToDelete(null)}
      />
    </>
  );
}
