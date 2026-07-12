const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middlewares (with custom directives to allow serving React inline styles and fonts)
app.use(
  helmet({
    contentSecurityPolicy: false, // Turn off for local development so React can load fonts and styles seamlessly
  })
);

app.use(cors());

// Body parser
app.use(express.json());

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/sessions', sessionRoutes);

// Simple health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', database: 'local_json_files', timestamp: new Date() });
});

// Serve compiled static React build files
const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientBuildPath));

// Catch-all route to serve React's index.html (supports React Router refreshes!)
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`\n  =========================================`);
  console.log(`  🟢 CA RANKER AI PLATFORM (UNIFIED SINGLE PORT)`);
  console.log(`  📁 Mode: 100% Local JSON Storage`);
  console.log(`  🌎 Unified Portal: http://localhost:${PORT}`);
  console.log(`  =========================================\n`);
});
