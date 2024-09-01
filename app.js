const express = require('express');
const voteRoutes = require('./routes/voteRoutes');

// Initialize Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Use the vote routes with a prefix '/api'
app.use('/api', voteRoutes);

// Set the server to listen on a specific port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;


