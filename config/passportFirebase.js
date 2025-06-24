const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/UserFirebase');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        // Cari user berdasarkan email
        const user = await User.findOne({ email: email });
        
        if (!user) {
          return done(null, false, { message: 'Email tidak terdaftar' });
        }

        // Verifikasi password
        const isMatch = await User.comparePassword(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Password salah' });
        }

        // Periksa apakah akun aktif
        if (user.isActive === false) {
          return done(null, false, { message: 'Akun Anda tidak aktif' });
        }

        return done(null, user);
      } catch (err) {
        console.error('Error in passport authentication:', err);
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      console.error('Error in passport deserialization:', err);
      done(err);
    }
  });
};