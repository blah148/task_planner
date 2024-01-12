// dbConfig.js
const { Pool } = require ('pg');
require('dotenv').config();

const pool = new Pool ({
  user: process.env.DB_USER,
  host: 'localhost',
  database: 'task_planner',
  password: process.env.DB_PASSWORD,
  port: 5432, // default POSTgreSQL port
});

module.exports = pool;
