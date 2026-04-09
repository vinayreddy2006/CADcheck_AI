const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/error.middleware');

const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const aiRoutes = require('./routes/ai.routes');

dotenv.config();

// Mongoose connection
connectDB();

const app = express();

// Global Middleware
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' })); // Safely allows frontend to load /uploads
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://cadcheck-ai-frontend.onrender.com'] 
    : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Static Files Route for CAD uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Core API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/ai', aiRoutes);

// Pulse Check
app.get('/', (req, res) => res.send('API is running...'));
app.get('/health', (req, res) => res.json({ status: 'ok', environment: process.env.NODE_ENV }));

// Exception Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
