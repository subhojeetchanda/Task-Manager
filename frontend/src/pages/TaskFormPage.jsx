import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getTask, createTask, updateTask } from '../api/taskApi';
import Header from '../components/Header/Header';
import FormField from '../components/FormField/FormField';
import Button from '../components/Button/Button';
import Spinner from '../components/Spinner/Spinner';
import ErrorState from '../components/ErrorState/ErrorState';
import { STATUSES, PRIORITIES } from '../utils/constants';
import styles from './TaskFormPage.module.css';

const INITIAL_STATE = { title: '', description: '', status: 'pending', priority: 'medium', dueDate: '' };

export default function TaskFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isLoadingTask, setIsLoadingTask] = useState(isEdit);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (!isEdit) return;

    const fetchTask = async () => {
      try {
        const response = await getTask(id);
        const task = response.data;
        setFormData({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate ? task.dueDate.split('T')[0] : '', // simple format
        });
      } catch (err) {
        setLoadError(err.message || 'Failed to load task');
      } finally {
        setIsLoadingTask(false);
      }
    };

    fetchTask();
  }, [id, isEdit]);

  const validate = (name, value) => {
    switch (name) {
      case 'title':
        if (!value.trim()) return 'Title is required';
        if (value.length < 3 || value.length > 100) return 'Title must be 3-100 characters';
        return '';
      case 'description':
        if (!value.trim()) return 'Description is required';
        if (value.length > 500) return 'Description must be < 500 characters';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validate(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const err = validate(key, formData[key]);
      if (err) newErrors[key] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = { ...formData, dueDate: formData.dueDate || null };
      if (isEdit) {
        await updateTask(id, payload);
        toast.success('Task updated successfully');
      } else {
        await createTask(payload);
        toast.success('Task created successfully');
      }
      navigate('/');
    } catch (err) {
      if (err.errors?.length > 0) {
        // Map backend errors
        const backendErrors = {};
        err.errors.forEach(e => {
          backendErrors[e.field] = e.message;
        });
        setErrors(backendErrors);
      }
      toast.error(err.message || 'Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingTask) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <div className={styles.centered}><Spinner size="large" /></div>
        </main>
      </>
    );
  }

  if (loadError) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <ErrorState message={loadError} onRetry={() => window.location.reload()} />
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>{isEdit ? 'Edit Task' : 'New Task'}</h1>
            <Link to="/" className={styles.backLink}>← Back to Dashboard</Link>
          </div>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <FormField
              id="title"
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.title}
              required
            />
            
            <FormField
              id="description"
              name="description"
              label="Description"
              as="textarea"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.description}
              required
            />
            
            <div className={styles.row}>
              <FormField
                id="status"
                name="status"
                label="Status"
                as="select"
                options={STATUSES}
                value={formData.status}
                onChange={handleChange}
              />
              
              <FormField
                id="priority"
                name="priority"
                label="Priority"
                as="select"
                options={PRIORITIES}
                value={formData.priority}
                onChange={handleChange}
              />
            </div>
            
            <FormField
              id="dueDate"
              name="dueDate"
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              error={errors.dueDate}
            />
            
            <div className={styles.actions}>
              <Link to="/" tabIndex="-1">
                <Button variant="ghost" type="button" tabIndex="-1">Cancel</Button>
              </Link>
              <Button type="submit" loading={isSubmitting}>
                {isEdit ? 'Save Changes' : 'Create Task'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
