login = require("connect-ensure-login"),
  module.exports = function (req, res, next) {
    console.log('ensure login')
    return login.ensureLoggedIn()(req, res, next);
  };
