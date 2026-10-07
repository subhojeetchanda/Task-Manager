import crypto from 'crypto';
import { AppError } from '../utils/AppError.js';

let tasks = [
  {
    id: crypto.randomUUID(),
    title: 'Migrate user database to PostgreSQL',
    description: 'Execute the planned migration of the users table from MySQL to PostgreSQL. Ensure backward compatibility for v1 API.',
    status: 'in_progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Update privacy policy for GDPR compliance',
    description: 'Review the current privacy policy and add sections regarding third-party cookie usage as requested by legal.',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day overdue
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Implement rate limiting on public endpoints',
    description: 'Use Redis to implement a rolling window rate limiter on the /api/public routes to prevent abuse.',
    status: 'pending',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Design new onboarding email sequence',
    description: 'Create wireframes and copy for the 3-part welcome email sequence for new signups.',
    status: 'completed',
    priority: 'low',
    dueDate: new Date(Date.now() - 86400000 * 10).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 11).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Fix Safari rendering bug on dashboard',
    description: 'Chart.js canvas element overflows its container on Safari 14+. Needs CSS grid fix.',
    status: 'in_progress',
    priority: 'medium',
    dueDate: null,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 0.5).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Conduct Q3 performance reviews',
    description: 'Schedule and conduct 1-on-1 performance reviews for the frontend engineering team.',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 14).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const priorityWeights = { low: 1, medium: 2, high: 3 };

export const getAllTasks = (query = {}) => {
  let result = [...tasks];

  if (query.search) {
    const term = query.search.toLowerCase();
    result = result.filter(
      (t) => t.title.toLowerCase().includes(term) || t.description?.toLowerCase().includes(term)
    );
  }

  if (query.status) {
    result = result.filter((t) => t.status === query.status);
  }

  if (query.priority) {
    result = result.filter((t) => t.priority === query.priority);
  }

  const sortBy = query.sortBy || 'createdAt';
  const order = query.order === 'desc' ? -1 : 1;

  result.sort((a, b) => {
    if (sortBy === 'priority') {
      const weightA = priorityWeights[a.priority] || 0;
      const weightB = priorityWeights[b.priority] || 0;
      return (weightA - weightB) * order;
    }

    if (sortBy === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * order;
    }

    const valA = a[sortBy] ? new Date(a[sortBy]).getTime() : 0;
    const valB = b[sortBy] ? new Date(b[sortBy]).getTime() : 0;
    return (valA - valB) * order;
  });

  const page = parseInt(query.page || '1', 10);
  const limit = parseInt(query.limit || '10', 10);
  const skip = (page - 1) * limit;
  const paginatedTasks = result.slice(skip, skip + limit);

  return {
    tasks: paginatedTasks,
    total: result.length,
    page,
    limit,
    totalPages: Math.ceil(result.length / limit),
  };
};

export const getTaskById = (id) => {
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    throw new AppError(404, 'Task not found');
  }
  return task;
};

export const createTask = (payload) => {
  const now = new Date().toISOString();
  
  const newTask = {
    id: crypto.randomUUID(),
    title: payload.title,
    description: payload.description || '',
    status: payload.status || 'pending',
    priority: payload.priority || 'medium',
    dueDate: payload.dueDate || null,
    createdAt: now,
    updatedAt: now,
  };

  tasks.push(newTask);
  return newTask;
};

export const updateTask = (id, payload) => {
  const taskIndex = tasks.findIndex((t) => t.id === id);
  
  if (taskIndex === -1) {
    throw new AppError(404, 'Task not found');
  }

  const existingTask = tasks[taskIndex];
  
  const updatedTask = {
    ...existingTask,
    ...payload,
    id: existingTask.id,
    createdAt: existingTask.createdAt,
    updatedAt: new Date().toISOString(),
  };

  tasks[taskIndex] = updatedTask;
  return updatedTask;
};

export const deleteTask = (id) => {
  const taskIndex = tasks.findIndex((t) => t.id === id);
  
  if (taskIndex === -1) {
    throw new AppError(404, 'Task not found');
  }

  const [deletedTask] = tasks.splice(taskIndex, 1);
  return deletedTask;
};
