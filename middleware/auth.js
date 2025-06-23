module.exports = {
  // Middleware untuk memastikan user sudah login
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Silakan login untuk mengakses halaman ini');
    res.redirect('/login');
  },
  
  // Middleware untuk memastikan user adalah admin
  ensureAdmin: function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
      return next();
    }
    req.flash('error_msg', 'Anda tidak memiliki akses ke halaman ini');
    res.redirect('/');
  },
  
  // Middleware untuk memastikan user belum login (untuk halaman login/register)
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  }
};