const express = require('express');
const cors = require('cors');
const voteRoutes = require('./routes/voteRoutes');

// Initialize Express app
const app = express();

app.use(cors({
  origin: 'http://localhost:3001', 
}));

app.use(express.json());

app.use('/api', voteRoutes);

// Set the server to listen on a specific port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
