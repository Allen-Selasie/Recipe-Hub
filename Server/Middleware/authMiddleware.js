const requireLogin = (req, res, next) => {
    if (!req.session.user) {
      return res.redirect("/u/login");
    }
    next();
  };


  module.exports = requireLogin;