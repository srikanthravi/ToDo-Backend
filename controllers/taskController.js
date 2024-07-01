const { Task, User } = require('../models');

exports.createTask = async (req, res) => {
  const { title, description, assignedUserId } = req.body;
  try {
    const task = await Task.create({ title, description, assignedUserId });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({ include: User });
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findByPk(id, { include: User });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, assignedUserId } = req.body;
  try {
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.assignedUserId = assignedUserId || task.assignedUserId;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.completeTask = async (req, res) => {
  const taskId = req.params.taskId;
  try {
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    task.completed = true;
    await task.save();
    res.json(task);
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
