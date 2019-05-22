var login = require("connect-ensure-login");
module.exports = function (req, res, next) {
  console.log('ensure login -================================>', req.method, req.path, req.url)
  return login.ensureLoggedIn()(req, res, next);
};
