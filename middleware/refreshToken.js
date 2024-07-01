const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token provided' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

module.exports = { refreshAccessToken };
