const express = require('express'); // Make Express framework available
const pool = require('./dbConfig'); // Import database connection pool config

const app = express(); // Initialize instance of Express app for HTTP requests

/* 
a) Process: global object provided by Node.js for info/control of current Node.js process
b) env: property of process, representing user environment (such as variables)
c) PORT: accesses PORT env variable from system environment
d) ||: logical OR operator, providing fallback value of 8080
*/
const PORT = process.env.PORT || 8080;

/*
a) Middleware function w/ access to: (i) request obj, (ii) response obj, (iii) next middleware fcn
b) Can: (i) execute code, (ii) modify req/res objects, (iii) end req/res cycle, (iv) call next middleware fcn
c) Parses json requests for route handlers & other middleware to interact with
*/
app.use(express.json());

// Client is asking server to get the information for a specific path..
// ..retrieving web pages, images, data; any data from the server
// ..the callback function tells what to do once the information is retrieved
// ..it can also handle query strings (appearing after the ?)
app.get('/', async (req, res) => {

  try {
   
    /*
    a) new Date(): Creates a new Date object of current date & time
    b) .toISOString(): Converts Date obj -> str in ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ
    c) .slice(0,10): Takes first 10 characters, starting from index 0 (inclusive) to 10 (exclusive)
    */ 
    const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
    // SQL query, where parameter (`$1`), will be replaced with specific value when query is executed
    const query = 'SELECT * FROM tasks WHERE date = $1';
    // Creating an 'parameters array' for entitled "values"
    const values = [today];
    /*
    SUMMARY: Executes SQL query against the database
    - 'pool' is a connection pool for database, managed by 'pg' library for PostgreSQL
    - await is used since pool.query() returns a promise
    COMPONENTS:
    i) Arg 1: SQL query string, with placeholder parameters such as $1, $2 in PostgreSQL
    ii) Arg 2: Parameters array for safe injection of vars, preventing SQL injection attacks
    */
    const result = await pool.query(query, values);
    // Res is the response object, ending the request/response cycle
    // .rows: specific property of PostgreSQL's "pg" library, returning an array of row-objects
    res.json(result.rows); 

  } catch(error) { // Executed if the "try" block throws an error
    
    /*
    i) res: response object provided by Express to end the request/response cycle
    ii) .status(): sets the HTTP status code to 500, indicating an internal server error
    iii) .send(): method to send a response to the client
    iv) error.message: a string describing what went wrong, sent as part of the response body
    v) error: either (a) auto-generated with JS's built-in error handler (syntax, type error, etc), or due to manually throwing error using 'throw' statement
    vi) .message: property of error object, usually present, represented by a string describing the error. Can be manually generated ie: throw new Error("Something went wrong"); 
    */
    res.status(500).send(error.message);

  }
  
});


/*
app.post: creates a route for a POST request to the /api/submit-task endpoint
async: asynchronous function, allowing for operations such as database queries
*/
app.post('/api/submit-task', async (req, res) => {
  try {
    // Destructuring to extract the data to serve to the database
    const { start_time, end_time, task_description } = req.body;
    
    // Logic to save data in PostgreSQL database in 3 steps
    // 1. Setup the query
    const query = 'INSERT INTO tasks (start_time, end_time, task_description) VALUES ($1, $2, $3)';
    // 2. Setup the parameterized data, protecting against SQL injection attacks
    const values = [start_time, end_time, task_description];
    // 3. Asynchronously apply the query, and await the resolution of the promise
    await pool.query(query, values);
    // Ending the request/response cycle: server response with JSON success object msg
    res.json({ message: 'Task added successfully' });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).send(error.message);
  }
});


/* 
- App.listen(): On the 'app' instance of the Express application, method listens on specified host & port
- PORT: port number where Express server listens for incoming HTTP requests, typically set with env var
- () => {}: callback function which executes once the server starts successfully
*/
app.listen(PORT, () => {
  // String is displayed on server's console (CLI or terminal where the server was started using '>> node app.js')
  console.log(`Server is running on port ${PORT}`); // Uses template literals for embedded expressions ${}

});
