create database pollingsystem;

use pollingsystem;

CREATE TABLE IF NOT EXISTS votes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  voting_choice BOOLEAN NOT NULL,
  casted_at DATE NOT NULL
);

select * from votes;