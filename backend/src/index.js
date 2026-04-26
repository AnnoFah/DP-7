const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000',
    'https://shiny-clafoutis-d1eca6.netlify.app' 
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/admin', require('./routes/admin'));

// Health Check
app.get('/', (req, res) => res.json({ message: 'Focus Monitor API berjalan!' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server berjalan di port ${PORT}`));