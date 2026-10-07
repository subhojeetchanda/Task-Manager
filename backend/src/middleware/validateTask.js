import { z } from 'zod';
import { AppError } from '../utils/AppError.js';

const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(500, 'Description cannot exceed 500 characters'),
  status: z.enum(['pending', 'in_progress', 'completed']).optional().default('pending'),
  priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format')
    .optional()
    .nullable(),
});

const querySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  sortBy: z.enum(['createdAt', 'dueDate', 'priority']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});

const formatZodError = (error) => {
  return error.issues.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
};

export const validateTask = (req, res, next) => {
  const result = taskSchema.safeParse(req.body);
  if (!result.success) {
    throw new AppError(400, 'Validation failed', formatZodError(result.error));
  }
  Object.defineProperty(req, 'body', { value: result.data, enumerable: true });
  next();
};

export const validateQuery = (req, res, next) => {
  const result = querySchema.safeParse(req.query);
  if (!result.success) {
    throw new AppError(400, 'Validation failed', formatZodError(result.error));
  }
  Object.defineProperty(req, 'query', { value: result.data, enumerable: true });
  next();
};
