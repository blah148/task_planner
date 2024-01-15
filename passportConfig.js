const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const pool = require('./dbConfig'); // Make sure this path is correct based on your project structure

module.exports = function(passport) {
    // Passport Local Strategy
    passport.use(new LocalStrategy(
        async (username, password, done) => {
            try {
                // Find user by username
                const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
                if (userResult.rows.length > 0) {
                    const user = userResult.rows[0];

                    // Compare hashed password
                    const isValid = await bcrypt.compare(password, user.hashed_password);
                    if (isValid) {
                        return done(null, user); // User authenticated
                    } else {
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                } else {
                    return done(null, false, { message: 'Incorrect username.' });
                }
            } catch (e) {
                return done(e);
            }
        }
    ));

    // Serialize user to store in session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Deserialize user from session
    passport.deserializeUser(async (id, done) => {
        try {
            const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
            if (userResult.rows.length > 0) {
                done(null, userResult.rows[0]);
            } else {
                done(new Error('User not found'));
            }
        } catch (e) {
            done(e);
        }
    });
};

