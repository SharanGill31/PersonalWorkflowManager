import express from 'express';
import {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
} from '../controllers/taskController.js';
import authMiddleware from '../middleware/auth.js';

const taskRouter = express.Router();

// Tasks routes
taskRouter.get('/gp', authMiddleware, getTasks);
taskRouter.post('/gp', authMiddleware, createTask);

// Single task routes
taskRouter.get('/:id/gp', authMiddleware, getTaskById);
taskRouter.put('/:id/gp', authMiddleware, updateTask);
taskRouter.delete('/:id/gp', authMiddleware, deleteTask);

export default taskRouter;