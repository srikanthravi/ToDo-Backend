const express = require('express');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors')
const taskRoutes = require('./routes/taskRoutes');
const { refreshAccessToken } = require('./middleware/refreshToken');
require('dotenv').config();


const whitelist = ['*','http://localhost:5173','http://localhost:5174', 'https://your-frontend-domain.com'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};


const app = express();
app.use(express.json());
app.use(cors(corsOptions))
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.post('/api/auth/refresh',refreshAccessToken)
const PORT = process.env.PORT || 5000;
sequelize.authenticate().then(() => {
  console.log('Database connected...');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.log('Error: ' + err));
