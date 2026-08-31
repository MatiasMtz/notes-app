/*
* Main entry point for the backend server.
* It sets up the Express application, configures middleware, and registers routes.
*/

const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
const noteRoutes = require('./routes/noteRoutes');

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware for parsing JSON request bodies
app.use(express.json());

// Simple root response so hitting the server directly isn't a bare "Cannot GET /"
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Notes API. Endpoints are served under /api' });
});

// Register note routes under the '/api' path
app.use('/api', noteRoutes);

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
