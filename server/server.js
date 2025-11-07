import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import practiceRoutes from './routes/practiceRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000',
    'https://lingobee.vercel.app',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/practice', practiceRoutes); 
app.use('/api/dashboard', dashboardRoutes); 

app.get('/', (req, res) => {
  res.json({ 
    message: 'LingoBee API is running! 🐝',
    endpoints: {
      auth: '/api/auth',
      todos: '/api/todos',
      assignments: '/api/assignments',
      practice: '/api/practice',
      dashboard: '/api/dashboard' 
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: `Route ${req.url} not found` 
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ 
    success: false,
    error: err.message || 'Internal server error' 
  });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}

export default app;
