passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findOne({
    id: id
  }, function (err, user) {
    done(err, user);
  });
});
module.exports = function (req, res, next) {
  return passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err); // will generate a 500 error
    }
    // console.log("buggg post/login");
    // console.log(err);
    // console.log('info,user', info, user);
    // Generate a JSON response reflecting authentication status
    if (!user) {
      return res.render("login", {
        success: false,
        message: info.message
      });
    }
    // ***********************************************************************
    // "Note that when using a custom callback, it becomes the application's
    // responsibility to establish a session (by calling req.login()) and send
    // a response."
    // Source: http://passportjs.org/docs
    // ***********************************************************************

    req.login(user, loginErr => {
      if (loginErr) {
        return next(loginErr);
      }
      var url = "/";
      console.log(req.session);
      req.session.user= user;
      if (req.session && req.session.returnTo) {
        url = req.session.returnTo;
        delete req.session.returnTo;
      }
      return res.redirect(url);
    });
  })(req, res, next);
};
