const express = require('express'); // Make Express framework available
// const pool = require('./dbConfig'); // Import LOCAL database connection pool config
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express(); // Initialize instance of Express app for HTTP requests
const PORT = process.env.PORT || 8080;
const path = require('path');
require('dotenv').config(); // to retrieve the cryptographic key
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey)

app.use(cors());

// HTTPS redirect middleware
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});

app.use(cookieParser());

/*
a) Middleware function w/ access to: (i) request obj, (ii) response obj, (iii) next middleware fcn
b) Can: (i) execute code, (ii) modify req/res objects, (iii) end req/res cycle, (iv) call next middleware fcn
c) Parses json requests for route handlers & other middleware to interact with
*/
app.use(express.json());
app.use(passport.initialize());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'task_planner_react', 'build')));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'task_planner_react', 'build', 'index.html'));
});

async function testSupabaseConnection() {
  try {
    let { data: tasks, error } = await supabase
      .from('tasks')
      .select('start_time');

    if (error) {
      console.error('Error fetching data from Supabase:', error);
      return;
    }

    console.log('Successfully fetched data:', tasks);
  } catch (error) {
    console.error('Supabase connection error:', error);
  }
}

// Call the function to test the connection
testSupabaseConnection();


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

app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Use Supabase client to create a new user with the plaintext password
        const signUpResponse = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        // Check if signUpResponse.data exists and has a user object
        if (!signUpResponse.data || !signUpResponse.data.user) {
            throw new Error('Failed to get user data from signUp response');
        }

        // Destructure the response to get the user and error
        const { user, error } = signUpResponse.data;

        // Check for error first before checking for user object
        if (error) throw error;

        // Ensure user ID is defined
        if (!user.id) throw new Error('User ID is undefined');

        // Hash the password for your custom users table
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert additional user details into your custom 'users' table
        const { data: userData, error: userInsertError } = await supabase
            .from('users')
            .insert([
                {
                    auth_id: user.id,
                    email: email,
                    hashed_password: hashedPassword, // Store the hashed password for your custom use
                    // Other fields...
                },
            ]);

        if (userInsertError) throw userInsertError;

        // Respond with success message
        res.status(201).json({ message: 'User created successfully', user: userData });
    } catch (error) {
        console.error('Error registering new user:', error);
        res.status(500).send(error.message);
    }
});
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Use Supabase client to authenticate the user
        const { user, error: authError } = await supabase.auth.signIn({
            email: email,
            password: password,
        });

        if (authError || !user) {
            // Handle authentication error (e.g., user not found or incorrect password)
            return res.status(401).json({ message: authError?.message || 'Invalid credentials' });
        }

        // Generate JWT manually
        const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Set JWT in HTTP-only cookies
        res.cookie('token', token, {
            httpOnly: true, // Make it HTTP-only
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.cookie('user_id', user.id, {
            httpOnly: true, // Make it HTTP-only
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            message: "Login successful",
            redirectTo: "/fetch-tasks"
        });
    } catch (error) {
        console.error("Error during login", error);
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

        // Use Supabase client to fetch tasks
        const { data: tasks, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', user_id);

        if (error) {
            throw error;
        }

        res.json({ tasks: tasks });
    } catch (taskError) {
        console.error("Error fetching tasks:", taskError);
        res.status(500).json({ message: "Error fetching tasks" });
    }
});

app.post('/tasks/new', verifyJWT, async (req, res) => {
    try {
        const { start_time, end_time, task_description, isComplete, display_none, visibility } = req.body;
        const user_id = req.user.sub; // Replace 'sub' with the appropriate field from your JWT payload

        // Use Supabase client to insert a new task
        const { data, error } = await supabase
            .from('tasks')
            .insert([
                {
                    start_time,
                    end_time,
                    task_description,
                    is_complete: isComplete,
                    display_none,
                    visibility,
                    user_id
                }
            ]);

        if (error) {
            throw error;
        }

        const taskId = data[0].id;
        res.status(200).json({ message: 'Add new task - server success.. app.js', id: taskId });
    } catch (error) {
        console.error('Add new task - server error.. app.js:', error);
        res.status(500).json({ message: error.message });
    }
});

app.delete('/tasks/delete/:id', verifyJWT, async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.sub; // Replace 'sub' with the appropriate field from your JWT payload

        // Use Supabase client to perform a delete operation
        const { data, error } = await supabase
            .from('tasks')
            .delete()
            .match({ id: taskId, user_id: userId });

        if (error) {
            throw error;
        }

        // Check if any row was actually deleted
        if (data.length === 0) {
            return res.status(404).json({ message: 'Task not found or not owned by user' });
        }

        res.status(200).json({ message: 'Delete task - server success.. app.js' });
    } catch (error) {
        console.error('Delete task - server error.. app.js:', error);
        res.status(500).json({ message: error.message });
    }
});

app.patch('/tasks/toggleComplete/:id', verifyJWT, async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.sub; // Replace 'sub' with the appropriate field from your JWT payload

        // Use Supabase client to update the task
        const { data, error } = await supabase
            .from('tasks')
            .update({ is_complete: supabase.raw('NOT is_complete') })
            .match({ id: taskId, user_id: userId })
            .single();

        if (error) {
            throw error;
        }

        // Check if any row was actually updated
        if (!data) {
            return res.status(404).json({ message: 'Task not found or not owned by user' });
        }

        res.status(200).json({
            message: 'Update is_complete - server success.. app.js',
            task: data // Return the updated task
        });
    } catch (error) {
        console.error('Update is_complete - server error.. app.js:', error);
        res.status(500).json({ message: error.message });
    }
});

