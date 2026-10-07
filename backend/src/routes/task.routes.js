import { Router } from 'express';
import * as taskController from '../controllers/task.controller.js';
import { validateTask, validateQuery } from '../middleware/validateTask.js';

const router = Router();

router.get('/', validateQuery, taskController.getTasks);
router.post('/', validateTask, taskController.createTask);
router.get('/:id', taskController.getTask);
router.put('/:id', validateTask, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;
