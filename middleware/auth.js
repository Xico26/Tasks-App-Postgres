module.exports.isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in to do that!");
    return res.redirect("/signin");
  }
  next();
}

