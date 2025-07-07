/**
 * Authentication middleware
 */

module.exports = {
  // Ensure user is authenticated
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Silakan login untuk mengakses halaman ini');
    res.redirect('/login');
  },
  
  // Ensure user is not authenticated (for login page)
  forwardAuthenticated: (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    // Redirect to dashboard regardless of role
    res.redirect('/dashboard');
  },

  // Ensure user is admin
  isAdmin: (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    req.flash('error_msg', 'Anda tidak memiliki akses ke halaman ini');
    res.redirect('/');
  }
};