import * as taskService from '../services/task.service.js';

export const getTasks = (req, res) => {
  const result = taskService.getAllTasks(req.query);
  res.json({
    success: true,
    data: result.tasks,
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    },
  });
};

export const getTask = (req, res) => {
  const task = taskService.getTaskById(req.params.id);
  res.json({
    success: true,
    data: task,
  });
};

export const createTask = (req, res) => {
  const task = taskService.createTask(req.body);
  res.status(201).json({
    success: true,
    data: task,
  });
};

export const updateTask = (req, res) => {
  const task = taskService.updateTask(req.params.id, req.body);
  res.json({
    success: true,
    data: task,
  });
};

export const deleteTask = (req, res) => {
  const deletedTask = taskService.deleteTask(req.params.id);
  res.json({
    success: true,
    message: 'Task deleted',
    data: deletedTask,
  });
};
