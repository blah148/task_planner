// Load the necessary modules
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const pool = require('./dbConfig'); // Assuming you have a pool for your database
const passport = require('passport');

// At the top of your file where you are configuring passport
require('dotenv').config(); // Load environment variables

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET // Make sure to add this to your .env file
};

passport.use(new JwtStrategy(options, async (jwt_payload, done) => {
  try {
    // Find the user in the database based on their ID in the JWT
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [jwt_payload.sub]);
    if (user.rows.length > 0) {
      return done(null, user.rows[0]);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
}));

