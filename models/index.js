const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'manager', 'user'),
    defaultValue: 'user',
  },
});

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

sequelize.sync({ force: true }).then(() => {
  console.log('Database & tables created!');
});

module.exports = { User, Task };
