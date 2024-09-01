const moment = require('moment');
const db = require('../config/db.config');

// Convert date string in DD-MM-YYYY to YYYY-MM-DD for MySQL
const formatDateForMySQL = (dateString) => {
  return moment(dateString, 'DD-MM-YYYY').format('YYYY-MM-DD');
};

// Convert date string from YYYY-MM-DD to DD-MM-YYYY for response
const formatDateForResponse = (dateString) => {
  return moment(dateString, 'YYYY-MM-DD').format('DD-MM-YYYY');
};

// Create a new vote
exports.create = async (req, res) => {
  const { name, voting_choice, casted_at } = req.body;
  const formattedDate = formatDateForMySQL(casted_at);
  try {
    await db.query('INSERT INTO votes (name, voting_choice, casted_at) VALUES (?, ?, ?)', [name, voting_choice, formattedDate]);
    res.status(201).send({ message: 'Vote created successfully' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Retrieve all votes
exports.findAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM votes');
    const formattedRows = rows.map(row => ({
      ...row,
      voting_choice: row.voting_choice === 1, 
      casted_at: formatDateForResponse(row.casted_at)
    }));
    res.status(200).send(formattedRows);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Retrieve votes by choice
exports.findByChoice = async (req, res) => {
    const voting_choice = req.query.voting_choice === 'true' ? 1 : 0;   
    try {
      const [rows] = await db.query(
        'SELECT * FROM votes WHERE voting_choice = ?',
        [voting_choice]
      );
      if (rows.length === 0) {
        return res.status(404).send({ message: 'No votes found for the specified choice' });
      }
      const formattedRows = rows.map(row => ({
        ...row,
        voting_choice: row.voting_choice === 1, 
        casted_at: formatDateForResponse(row.casted_at)
      }));
      res.status(200).send(formattedRows);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
  
// Update a vote by ID
exports.update = async (req, res) => {
    const { id } = req.params;
    const { name, voting_choice, casted_at } = req.body;
    const formattedDate = formatDateForMySQL(casted_at);
    const formattedChoice = voting_choice ? 1 : 0;
    try {
      const [result] = await db.query(
        'UPDATE votes SET name = ?, voting_choice = ?, casted_at = ? WHERE id = ?',
        [name, formattedChoice, formattedDate, id]
      );
      if (result.affectedRows > 0) {
        res.status(200).send({ message: 'Vote updated successfully' });
      } else {
        res.status(404).send({ message: 'Vote not found' });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
  

// Delete a vote by ID
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM votes WHERE id = ?', [id]);
    if (result.affectedRows > 0) {
      res.status(200).send({ message: 'Vote deleted successfully' });
    } else {
      res.status(404).send({ message: 'Vote not found' });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get counts for line chart
exports.findCountsByChoice = async (req, res) => {
    const voting_choice = req.query.voting_choice === 'true' ? 1 : 0; 
    try {
      const [rows] = await db.query(
        `SELECT COUNT(*) as count, DATE_FORMAT(casted_at, '%d-%m-%Y') as casted_at 
         FROM votes 
         WHERE voting_choice = ? 
         GROUP BY casted_at 
         ORDER BY casted_at`,
        [voting_choice]
      );
      if (rows.length === 0) {
        return res.status(404).send({ message: 'No data found for the specified choice' });
      }
      res.status(200).send({ data: rows });
    } catch (error) {
      console.error('Error fetching counts:', error);
      res.status(500).send({ message: error.message });
    }
  };
  
// Get overall results for bar graph
exports.findResults = async (req, res) => {
    try {
      const [rows] = await db.query(
        'SELECT COUNT(*) as count, voting_choice FROM votes GROUP BY voting_choice'
      );
      const formattedRows = rows.map(row => ({
        ...row,
        voting_choice: row.voting_choice === 1
      }));
      res.status(200).send({ data: formattedRows });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
  
