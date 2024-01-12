const express = require('express');
const pool = require('./dbConfig');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get('/', async (req, res) => {

  try {
    
    const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
    const query = 'SELECT * FROM tasks WHERE date = $1';
    const values = [today];
    const result = await pool.query(query, values);
    res.json(result.rows); 

  } catch(error) {
  
    res.status(500).send(error.message);

  }
  
});

app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);

});
