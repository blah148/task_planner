const express = require('express'); // Make Express framework available
// const pool = require('./dbConfig'); // Import LOCAL database connection pool config
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
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
const cryptoKey = process.env.CRYPTO_KEY;

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
// Function to encrypt data
function encrypt(text, secretKey) {
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Function to decrypt data
function decrypt(text, secretKey) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

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
            .insert(
                {
                    auth_id: user.id,
                    email: email,
                    hashed_password: hashedPassword, // Store the hashed password for your custom use
                    // Other fields...
                }
            );

        if (userInsertError) throw userInsertError;

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

        // Respond with success message and redirect
        res.status(201).json({
            message: 'User created successfully',
            user: userData,
            redirectTo: "/"
        });
    } catch (error) {
        console.error('Error registering new user:', error);
        res.status(500).send(error.message);
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Ensure email and password are provided
        if (!email || !password) {
            console.log("Email or password not provided");
            return res.status(400).json({ message: 'Email and password are required' });
        }

        console.log("Attempting to find user with email:", email);
        // Query the custom 'users' table to find the user
        const { data: userData, error: userQueryError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        // Detailed logging for debugging
        if (userQueryError) {
            console.error("Database query error:", userQueryError);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (!userData) {
            console.log("User not found for email:", email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log("Found user, verifying password...");
        // Verify the password
        const validPassword = await bcrypt.compare(password, userData.hashed_password);
        if (!validPassword) {
            console.log("Invalid password for user:", email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log("Password verified, generating JWT...");
        // Generate JWT manually
        const token = jwt.sign({ sub: userData.auth_id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        console.log("JWT generated, setting cookies...");
        // Set JWT and user_id in HTTP-only cookies
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.cookie('user_id', userData.auth_id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        console.log("Cookies set, sending response...");
        // Respond with success message
        res.json({
            message: "Login successful",
            redirectTo: "/fetch-tasks"
        });
    } catch (error) {
        console.error("Error during login:", error);
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

app.get('/fetch-tasks/:selectedDate', verifyJWT, async (req, res) => {
    try {
        const user_id = req.user.sub;
        const selectedDate = new Date(req.params.selectedDate);
        console.log(`this is the date-ified selectedDate: ${selectedDate}`);
         // Format selectedDate to YYYY-MM-DD to compare dates only
        const formattedDate = selectedDate.toISOString().split('T')[0];
        console.log(`this is the formattedDate: ${formattedDate}`);
        // Use Supabase client to fetch tasks
        const { data: tasks, error } = await supabase
            .from('tasks')
            .select()
            .eq('user_id', user_id)
            .gte('start_time', `${formattedDate}T00:00:00.000Z`) // Greater than or equal to the start of the day
            .lt('start_time', `${formattedDate}T23:59:59.999Z`); // Less than the end of the day


        if (error) {
            res.status(500).json({ message: "Error fetching tasks from Supabase" });
            return;
        }

        if (tasks) {
            // Decrypt the task_description for each task
            const decryptedTasks = tasks.map(task => {
                if (task.task_description) {
                    task.task_description = decrypt(task.task_description, process.env.CRYPTO_KEY);
                }
                return task;
            });

            res.status(200).json({ tasks: decryptedTasks });
        }

    } catch (taskError) {
        console.error("Error fetching tasks:", taskError);
        res.status(500).json({ message: "Error fetching tasks" });
    }
});

// Middleware for inserting a new task
app.post('/tasks/new', verifyJWT, insertTaskMiddleware, retrieveTaskId);

// Middleware function for inserting a task
async function insertTaskMiddleware(req, res, next) {
    try {
        const { start_time, end_time, task_description, isComplete, display_none, visibility } = req.body;
        const user_id = req.user.sub; // Replace 'sub' with the appropriate field from your JWT payload

        // Encrypt the task_description
        const encryptedTaskDescription = encrypt(task_description, cryptoKey);

        // Use Supabase client to insert a new task
        const { error } = await supabase
            .from('tasks')
            .insert({
                    start_time: start_time,
                    end_time: end_time,
                    task_description: encryptedTaskDescription,
                    is_complete: false,
                    display_none: display_none,
                    visibility: visibility,
                    user_id: user_id
              }
            );

        if (error) {
            console.error('Supabase Insert Error:', error);
            throw error;
        }

        // Successfully inserted task, pass control to the next middleware
        next();
    } catch (error) {
        console.error('Add new task - server error.. app.js:', error);
        res.status(500).json({ message: error.message });
    }
}

// Separate function for retrieving the task ID
async function retrieveTaskId(req, res) {
    try {
        const user_id = req.user.sub; // Extract user ID

        // Query to find the most recently added task for the user
        let { data: tasks, error } = await supabase
            .from('tasks')
            .select('id')
            .eq('user_id', user_id)
            .order('start_time', { ascending: false })
            .limit(1);

        if (error) {
            console.error('Error fetching data from Supabase:', error);
            res.status(500).json({ message: 'Error fetching task ID' });
            return;
        }

        if (tasks.length > 0) {
            const taskId = tasks[0].id;
            res.status(200).json({ message: 'Task created successfully', id: taskId });
        } else {
            res.status(404).json({ message: 'No task found' });
        }
    } catch (error) {
        console.error('Supabase connection error:', error);
        res.status(500).json({ message: error.message });
    }
}

app.delete('/tasks/delete/:id', verifyJWT, async (req, res) => {
    try {
        const taskId = req.params.id;
        const user_id = req.user.sub; // Replace 'sub' with the appropriate field from your JWT payload

        // Use Supabase client to perform a delete operation
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', taskId)
            .eq('user_id', user_id);

        if (error) {
            throw error;
        }

        // If the deletion was successful, you can send a 200 response
        res.status(200).json({ message: 'Task deleted successfully' });
        } catch (error) {
          console.error('Delete task - server error.. app.js:', error);
          res.status(500).json({ message: error.message });
        }
});

// Middleware to fetch and attach is_complete status to req
const fetchIsComplete = async (req, res, next) => {
    try {
    const taskId = req.params.id;
    const { data: tasks, error } = await supabase
    .from('tasks')
    .select('is_complete')
    .eq('id', taskId);

    if (error) {
        throw error;
    }

    if (tasks.length > 0) {
        const task = tasks[0]; // Corrected variable name
        req.isComplete = task.is_complete;
        next();
    } else {
        // Handle the case where no task was found
        throw new Error('Task not found');
      }
   
    } catch (error) {
        console.error('Fetch is_complete - server error:', error);
        res.status(500).json({ message: error.message });
    }
};

app.patch('/tasks/toggleComplete/:id', verifyJWT, fetchIsComplete, async (req, res) => {
    try {
        const taskId = req.params.id;
        const newIsCompleteValue = !req.isComplete; // Determine the new value

        // Toggle the is_complete status
        const { error } = await supabase
            .from('tasks')
            .update({ is_complete: newIsCompleteValue })
            .eq('id', taskId);

        if (error) {
            throw error;
        }

        // Return the new is_complete value in the response
        res.status(200).json({
            message: 'Toggled is_complete status successfully.',
            isComplete: newIsCompleteValue
        });
    } catch (error) {
        console.error('Error in toggling is_complete:', error);
        res.status(500).json({ message: error.message });
    }
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'task_planner_react', 'build', 'index.html'));
});

