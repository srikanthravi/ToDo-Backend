const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
    defaultValue: 'pending',
  },
  assignedUserId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
});

User.hasMany(Task, { foreignKey: 'assignedUserId' });
Task.belongsTo(User, { foreignKey: 'assignedUserId' });

module.exports = Task;
