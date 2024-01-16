const express = require('express'); // Make Express framework available
const pool = require('./dbConfig'); // Import database connection pool config
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


require('dotenv').config(); // to retrieve the cryptographic key

const app = express(); // Initialize instance of Express app for HTTP requests

app.use(cors());
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

app.use(passport.initialize());
// Client is asking server to get the information for a specific path..
// ..retrieving web pages, images, data; any data from the server
// ..the callback function tells what to do once the information is retrieved
// ..it can also handle query strings (appearing after the ?)
app.get('/', async (req, res) => {
res.send('You successfully logged in.');

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

// Login route
app.post('/login', async (req, res) => {
    try {
        // Extract username and password from request body
        const { username, password } = req.body;

        // Query the database for the user by username
        const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        // If no user is found, return an error
        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        // User is found, now compare the provided password with the stored hash
        const user = userResult.rows[0];
        const isValid = await bcrypt.compare(password, user.hashed_password);

        // If the password is not valid, return an error
        if (!isValid) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        // Password is valid, create the JWT with the user's id
        // The keyname of the token in localStorage will appear as "token" per below line
        const token = jwt.sign(
            { sub: user.id }, // The 'sub' property represents the subject of the JWT, which is typically the user ID
            process.env.JWT_SECRET, // The secret key to sign the JWT, which should be in your .env file
            { expiresIn: '7d' } // Set the token to expire in 1 hour
        );
        
        // Send the token to the client along with the success message and redirect URL
        res.json({ message: "Login successful app.js", token: token, user_id: user.id, redirectTo: "/" }); // Change the redirectTo value to the desired URL


    } catch (error) {
        console.error("error here", error);
        res.status(500).json({ error: error.message });
    }
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Login success
app.get('/login-success', (req, res) => {
  res.send('You successfully logged in.');
});

// Login failure
app.get('/login-failure', (req, res) => {
  res.send('Failed to log in.');
});

// secure routes by checking if the user is authenticated:
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

app.get('/protected-route', checkAuthenticated, (req, res) => {
  res.send('This is a protected route.');
});

// route where users can register
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        // Insert the new user into the database
        await pool.query('INSERT INTO users (username, hashed_password) VALUES ($1, $2)', [username, hashedPassword]);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error registering new user:', error);
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
