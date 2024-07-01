const express = require('express');
const { createTask, getTasks, getTaskById, updateTask, deleteTask, completeTask } = require('../controllers/taskController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['admin', 'manager']), createTask);
router.get('/', authMiddleware, getTasks);
router.get('/:id', authMiddleware, getTaskById);
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'manager']), updateTask);
router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'manager']), deleteTask);
router.put('/:taskId/complete', authMiddleware, completeTask);
module.exports = router;
