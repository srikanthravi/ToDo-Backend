const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

exports.getUserById = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user information', error });
  }
};

exports.getUserByEmail = async (req, res) => {
  const userEmail = req.params.userEmail;
  try {
    const user = await User.findOne({ where: { email: userEmail } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword, role });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await User.findOne({ where: { email, role } }); // Ensure the role matches
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid email, password, or role' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.updateProfile = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
