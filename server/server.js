import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import practiceRoutes from './routes/practiceRoutes.js'; // ✅ ADD THIS
import dashboardRoutes from './routes/dashboardRoutes.js'; // Tambahkan import di bagian atas

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/practice', practiceRoutes); 
app.use('/api/dashboard', dashboardRoutes); 

// Root endpoint
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: `Route ${req.url} not found` 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ 
    success: false,
    error: err.message || 'Internal server error' 
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});