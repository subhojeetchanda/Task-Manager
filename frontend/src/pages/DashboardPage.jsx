import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTasks } from '../hooks/useTasks';
import { useDebounce } from '../hooks/useDebounce';
import { deleteTask } from '../api/taskApi';
import Header from '../components/Header/Header';
import TaskList from '../components/TaskList/TaskList';
import SkeletonCard from '../components/SkeletonCard/SkeletonCard';
import EmptyState from '../components/EmptyState/EmptyState';
import ErrorState from '../components/ErrorState/ErrorState';
import ConfirmDialog from '../components/ConfirmDialog/ConfirmDialog';
import Button from '../components/Button/Button';
import Pagination from '../components/Pagination/Pagination';
import FormField from '../components/FormField/FormField';
import { STATUSES, PRIORITIES } from '../utils/constants';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Local search state for immediate typing feedback
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(searchValue, 300);

  // Sync debounced search to URL
  useEffect(() => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (debouncedSearch) next.set('search', debouncedSearch);
      else next.delete('search');
      
      // Reset to page 1 if search changed from what's in URL
      if (debouncedSearch !== (prev.get('search') || '')) {
        next.set('page', '1');
      }
      return next;
    }, { replace: true });
  }, [debouncedSearch, setSearchParams]);

  const filters = {
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    priority: searchParams.get('priority') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    order: searchParams.get('order') || 'desc',
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: 9
  };

  const { tasks, meta, status, error, reload, removeTask } = useTasks(filters);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const handleFilterChange = (key, value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      next.set('page', '1'); // Reset pagination on filter change
      return next;
    });
  };

  const clearFilters = () => {
    setSearchValue('');
    setSearchParams(new URLSearchParams());
  };

  const handleDelete = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTask(taskToDelete);
      removeTask(taskToDelete);
      toast.success('Task deleted successfully');
      // Optimistic pagination rollback
      if (tasks.length === 1 && filters.page > 1) {
        handleFilterChange('page', String(filters.page - 1));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete task');
    } finally {
      setTaskToDelete(null);
    }
  };

  const hasActiveFilters = !!(filters.search || filters.status || filters.priority);

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Your Tasks</h1>
          </div>
          
          <div className={styles.toolbar}>
            <FormField
              id="search"
              placeholder="Search tasks..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            
            <FormField
              id="filter-status"
              as="select"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              options={[{ value: '', label: 'All Statuses' }, ...STATUSES]}
            />

            <FormField
              id="filter-priority"
              as="select"
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              options={[{ value: '', label: 'All Priorities' }, ...PRIORITIES]}
            />
            
            <FormField
              id="sort-by"
              as="select"
              value={`${filters.sortBy}-${filters.order}`}
              onChange={(e) => {
                const [newSortBy, newOrder] = e.target.value.split('-');
                setSearchParams(prev => {
                  const next = new URLSearchParams(prev);
                  next.set('sortBy', newSortBy);
                  next.set('order', newOrder);
                  return next;
                });
              }}
              options={[
                { value: 'createdAt-desc', label: 'Newest First' },
                { value: 'createdAt-asc', label: 'Oldest First' },
                { value: 'priority-desc', label: 'Highest Priority' },
                { value: 'priority-asc', label: 'Lowest Priority' },
                { value: 'dueDate-asc', label: 'Due Date (Earliest)' },
                { value: 'dueDate-desc', label: 'Due Date (Latest)' }
              ]}
            />
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
            hasActiveFilters ? (
              <EmptyState 
                message="No tasks match your filters." 
                action={<Button onClick={clearFilters}>Clear filters</Button>}
              />
            ) : (
              <EmptyState 
                message="You have no tasks right now." 
                action={
                  <Link to="/tasks/new" tabIndex="-1">
                    <Button tabIndex="-1">Create your first task</Button>
                  </Link>
                }
              />
            )
          )}

          {status === 'success' && tasks.length > 0 && (
            <>
              <TaskList tasks={tasks} onDeleteTask={setTaskToDelete} />
              <Pagination 
                currentPage={meta.page} 
                totalPages={meta.totalPages} 
                onPageChange={(page) => handleFilterChange('page', String(page))} 
              />
            </>
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
