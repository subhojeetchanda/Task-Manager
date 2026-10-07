import { useState, useEffect, useCallback } from 'react';
import { getTasks } from '../api/taskApi';

export const useTasks = (filters = {}) => {
  const [state, setState] = useState({
    tasks: [],
    meta: {},
    status: 'idle',
    error: null,
  });

  const fetchTasks = useCallback(async (abortController) => {
    setState(prev => ({ ...prev, status: 'loading', error: null }));
    try {
      const response = await getTasks({ ...filters, signal: abortController?.signal });
      if (abortController?.signal?.aborted) return;
      setState({ tasks: response.data, meta: response.meta, status: 'success', error: null });
    } catch (err) {
      if (err.name === 'AbortError' || abortController?.signal?.aborted) return;
      setState(prev => ({ ...prev, status: 'error', error: err.message }));
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    const controller = new AbortController();
    fetchTasks(controller);
    return () => controller.abort();
  }, [fetchTasks]);

  const reload = () => fetchTasks();

  const removeTask = (id) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id),
    }));
  };

  return { ...state, reload, removeTask };
};
