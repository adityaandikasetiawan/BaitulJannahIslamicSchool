const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const db = require('./database');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'username' }, async (username, password, done) => {
      try {
        console.log('Attempting to authenticate user:', username);
        // Match user
        const user = await User.findByUsername(username);
        
        if (!user) {
          console.log('User not found:', username);
          return done(null, false, { message: 'Username tidak terdaftar' });
        }

        console.log('User found, validating password');
        // Match password
        const isMatch = await User.validatePassword(password, user.password);
        
        if (isMatch) {
          console.log('Password match, authentication successful');
          return done(null, user);
        } else {
          console.log('Password mismatch');
          return done(null, false, { message: 'Password salah' });
        }
      } catch (err) {
        console.error('Error in passport strategy:', err);
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
      done(null, rows[0]);
    } catch (err) {
      done(err, null);
    }
  });
};