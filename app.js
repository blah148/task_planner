const express = require('express'); // Make Express framework available
const pool = require('./dbConfig'); // Import database connection pool config
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express(); // Initialize instance of Express app for HTTP requests
const PORT = process.env.PORT || 8080;


require('dotenv').config(); // to retrieve the cryptographic key

app.use(cors());
app.use(cookieParser());

/*
a) Middleware function w/ access to: (i) request obj, (ii) response obj, (iii) next middleware fcn
b) Can: (i) execute code, (ii) modify req/res objects, (iii) end req/res cycle, (iv) call next middleware fcn
c) Parses json requests for route handlers & other middleware to interact with
*/
app.use(express.json());
app.use(passport.initialize());

/* 
- App.listen(): On the 'app' instance of the Express application, method listens on specified host & port
- PORT: port number where Express server listens for incoming HTTP requests, typically set with env var
- () => {}: callback function which executes once the server starts successfully
*/
app.listen(PORT, () => {
  // String is displayed on server's console (CLI or terminal where the server was started using '>> node app.js')
  console.log(`Server is running on port ${PORT}`); // Uses template literals for embedded expressions ${}
});

app.post('/logout', (req, res) => {
    // Clear the cookies
    res.cookie('token', '', { expires: new Date(0) });
    res.cookie('user_id', '', { expires: new Date(0) });

    // Respond with OK status
    res.status(200).json({ message: 'Logged out successfully' });
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

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Invalid username" });
    }

    const user = userResult.rows[0];
    const isValid = await bcrypt.compare(password, user.hashed_password);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: false, // change to 'true' in production
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.cookie('user_id', user.id, {
      httpOnly: false, // change to 'true' in production
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: "Login successful",
      redirectTo: "/fetch-tasks" // Redirect to fetch tasks
    });
  } catch (error) {
    console.error("Error during login in app.js", error);
    res.status(500).json({ error: error.message });
  }
});

// Middleware to verify JWT
const verifyJWT = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    // Create a new Error object and pass it to next()
    return next(new Error('No token provided'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      // Pass the error to next()
      return next(new Error('Invalid token'));
    }
    // Attach decodedToken to the request so that it can be used in the route handler
    req.user = decodedToken;
    // Call next() with no arguments when middleware is successful
    next();
  });
};

// Route that uses the middleware
app.get('/verification', verifyJWT, (req, res) => {
  // If middleware is successful, this handler will be called
  res.json({ message: 'Access to verified route granted', user: req.user });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err) {
    res.status(401).json({ message: err.message });
  } else {
    next();
  }
});

app.get('/fetch-tasks', verifyJWT, async (req, res) => {
  try {
    const user_id = req.user.sub; // Assuming your JWT contains the user's ID in the 'sub' field
    const taskResults = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [user_id]);
    const tasks = taskResults.rows;
    res.json({ tasks: tasks });
  } catch (taskError) {
    console.error("Error fetching tasks:", taskError);
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

app.post('/tasks/new', verifyJWT, async (req, res) => {
  try {
    const task = req.body;

    // Assuming the JWT middleware adds the user's ID to req.user
    const user_id = req.user.sub; // Replace 'sub' with the appropriate field from your JWT payload

    // Destructure the task object directly, appending user_id from the verified JWT
    const { start_time, end_time, task_description, isComplete, display_none, visibility } = task;
    
    const insertedRow = await pool.query(
      'INSERT INTO tasks (start_time, end_time, task_description, is_complete, display_none, visibility, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;', 
      [start_time, end_time, task_description, isComplete, display_none, visibility, user_id]
    );

    const taskId = insertedRow.rows[0].id;
    res.status(200).json({ message: 'Add new task - server success.. app.js', id: taskId});
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: 'Add new task - server error.. app.js' });
  }
});

app.delete('/tasks/delete/:id', verifyJWT, async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.sub; // Replace 'sub' with the appropriate field from your JWT payload

    // Perform a delete operation only if the task belongs to the authenticated user
    const deleteResult = await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [taskId, userId]);

    // Check if any row was actually deleted
    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ message: 'Task not found or not owned by user' });
    }

    res.status(200).json({ message: 'Delete task - server success.. app.js' });
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: 'Delete task - server error.. app.js' });
  }
});


app.patch('/tasks/toggleComplete/:id', verifyJWT, async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.sub; // Replace 'sub' with the appropriate field from your JWT payload

    // Update the task only if it belongs to the authenticated user
    const updateResult = await pool.query(
      'UPDATE tasks SET is_complete = NOT is_complete WHERE id = $1 AND user_id = $2 RETURNING *', 
      [taskId, userId]
    );

    // Check if any row was actually updated
    if (updateResult.rowCount === 0) {
      return res.status(404).json({ message: 'Task not found or not owned by user' });
    }

    res.status(200).json({ 
      message: 'Update is_complete - server success.. app.js',
      task: updateResult.rows[0] // Return the updated task
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update is_complete - server error.. app.js" });
  }
});

