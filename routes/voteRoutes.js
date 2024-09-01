const express = require('express');
const voteController = require('../controllers/voteController');
const router = express.Router();

// Route to create a new vote
router.post('/votes', voteController.create);

// Route to retrieve all votes
router.get('/votes', voteController.findAll);

// Route to retrieve votes by voting choice
router.get('/votes/by-choice', voteController.findByChoice);

// Route to update a vote by ID
router.put('/votes/:id', voteController.update);

// Route to delete a vote by ID
router.delete('/votes/:id', voteController.delete);

// Route to get counts for line chart
router.get('/votes/counts-by-choice', voteController.findCountsByChoice);

// Route to get overall results for bar graph
router.get('/votes/results', voteController.findResults);

module.exports = router;
