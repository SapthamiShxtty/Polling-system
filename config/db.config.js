const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"admin12345",
    database:"pollingsystem"
});

module.exports = db;

