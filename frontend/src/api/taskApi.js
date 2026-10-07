import { httpClient } from './httpClient.js';

export const getTasks = ({ signal, ...params } = {}) => {
  const query = new URLSearchParams(params).toString();
  return httpClient(`/tasks${query ? `?${query}` : ''}`, { signal });
};

export const getTask = (id, options = {}) => httpClient(`/tasks/${id}`, options);

export const createTask = (data) => httpClient('/tasks', { method: 'POST', body: JSON.stringify(data) });

export const updateTask = (id, data) => httpClient(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteTask = (id) => httpClient(`/tasks/${id}`, { method: 'DELETE' });
